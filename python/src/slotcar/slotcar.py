import time
import pygame
from gpiozero import Button
from signal import pause
import os
import threading
from enum import Enum, auto
import random

import asyncio
import json
import logging
from bleak import BleakScanner, BleakClient
import signal
import sys
from termcolor import colored

import board
import busio
from adafruit_ht16k33.segments import Seg14x4

SOUND_DIR = '/home/mbutki/pi_projects/python/src/slotcar/sounds/'
SOUNDS = {}

CIRCLE_SEGMENTS = [
    (2, 0b00000000000001),
    (3, 0b00000000000001),
    (3, 0b00000000000010),
    (3, 0b00000000000100),
    (3, 0b00000000001000),
    (2, 0b00000000001000),
    (1, 0b00000000001000),
    (0, 0b00000000001000),
    (0, 0b00000000010000),
    (0, 0b00000000100000),
    (0, 0b00000000000001),
    (1, 0b00000000000001),
]

# UART-over-BLE UUIDs
UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e'
UART_TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'  # from Pico (notify)
UART_RX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'  # to Pico (write)

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global state
red_delta = 0
green_delta = 0
white_delta = 0
select = 0
button_delta = 0

client = None
running = True  # control flag for graceful shutdown

i2c = busio.I2C(board.SCL, board.SDA)
display_lap_count = None
display_red = None
display_green = None
red = None
green = None

race_types = None
cur_race_i = None
cur_race = None

state = None
class RaceState(Enum):
    BLE_SEARCH = auto()
    BLE_CONNECT = auto()
    MENU = auto()
    COUNTDOWN = auto()
    PRELAP = auto()
    RACE = auto()
    POSTRACE = auto()

BLE_STATES = {RaceState.BLE_SEARCH, RaceState.BLE_CONNECT}
RESETABLE_STATES = {RaceState.MENU, RaceState.RACE}

class Encoder(Enum):
    RED = auto()
    GREEN = auto()

class PlayerColor(Enum):
    RED = auto()
    GREEN = auto()

class LapRace():
    red_lap = 5
    green_lap = 5
    red_str = 'LAP '
    green_str = 'RACE'
    select_sound = None

    def __init__(self, select_sound):
        self.select_sound = select_sound

    def display(self):
        red_text = f'{self.red_lap}'.rjust(2)
        green_text = f'{self.green_lap}'.rjust(2)
        update_display(display_lap_count, f'{red_text}{green_text}')

        update_display(display_red, f'{self.red_str}')
        update_display(display_green, f'{self.green_str}')
    
    def update_setting(self, color, delta):
        match color:
            case Encoder.RED:
                existing = self.red_lap
                updated = max(1, self.red_lap + delta)
                if updated != existing:
                    self.red_lap = updated
                    SOUNDS['CURSER'].stop()
                    SOUNDS['CURSER'].play()
            case Encoder.GREEN:
                existing = self.green_lap
                updated = max(1, self.green_lap + delta)
                if updated != existing:
                    self.green_lap = updated
                    SOUNDS['CURSER'].stop()
                    SOUNDS['CURSER'].play()
        self.display()
    
    def update_lap(self, player):
        global state, red, green
        print(f'game.update_lap(): {player.color} {player.lap_count} {self.red_lap}')
        match player.color:
            case PlayerColor.RED:
                if player.lap_count == self.red_lap:
                    state = RaceState.POSTRACE
                    print(f'RED WINS')
                    update_display(player.display, 'WIN ')
                    update_display(green.display, '    ')
                    play_win_sound(player.name_sound)

            case PlayerColor.GREEN:
                if player.lap_count == self.green_lap:
                    state = RaceState.POSTRACE
                    print(f'GREEN WINS')
                    update_display(player.display, 'WIN ')
                    update_display(red.display, '    ')
                    play_win_sound(player.name_sound)

class TimeRace():
    minutes = 3
    seconds = 0
    red_str = 'TIME'
    green_str = 'RACE'
    select_sound = None

    def __init__(self, select_sound):
        self.select_sound = select_sound

    def display(self):
        red_text = f'{self.minutes}'.rjust(2)
        green_text = f'{self.seconds:02}'.rjust(2) if self.seconds != 0 else '  '
        update_display(display_lap_count, f'{red_text}.{green_text}')

        update_display(display_red, f'{self.red_str}')
        update_display(display_green, f'{self.green_str}')
    
    def update_setting(self, color, delta):
        match color:
            case Encoder.RED:
                self.minutes = max(1, self.minutes + delta)
            case Encoder.GREEN:
                self.seconds = max(0, self.seconds + delta)
        self.display()

def notification_handler(sender, data):
    global button_delta, select, red_delta, green_delta, white_delta
    global race_types, cur_race_i, cur_race, state

    try:
        decoded = data.decode('utf-8')
        message = json.loads(decoded)
        #logger.info(f'Received: {message}')

        red_delta = message.get('red_delta', red_delta)
        green_delta = message.get('green_delta', green_delta)
        white_delta = message.get('white_delta', white_delta)
        select = message.get('select', select)
        button_delta = message.get('button_delta', button_delta)

        if running:
            if button_delta:
                logger.info(colored('▶ Button Pushed','yellow'))
                if state in RESETABLE_STATES:
                    button_delta = 0
                    reset_race(red, green)
                elif state == RaceState.POSTRACE:
                    button_delta = 0
                    state = RaceState.MENU
                    cur_race.display()
    
            if red_delta != 0:
                logger.info(colored(f'▶ Red Turned {red_delta}', 'red'))
                if state == RaceState.MENU:
                    cur_race.update_setting(Encoder.RED, red_delta)
                red_delta = 0

            if green_delta != 0:
                logger.info(colored(f'▶ Green Turned {green_delta}', 'green'))
                if state == RaceState.MENU:
                    cur_race.update_setting(Encoder.GREEN, green_delta)
                green_delta = 0

            if white_delta != 0:
                logger.info(colored(f'▶ White Turned {white_delta}', 'white'))
                if state == RaceState.MENU:
                    if white_delta > 0:
                        cur_race_i += 1
                        if cur_race_i == len(race_types):
                            cur_race_i = 0
                    if white_delta < 0:
                        cur_race_i -= 1
                        if cur_race_i == -1:
                            cur_race_i = len(race_types) - 1
                    cur_race.select_sound.stop()
                    cur_race = race_types[cur_race_i]
                    cur_race.select_sound.play()
                    cur_race.display()
                white_delta = 0
                
            if select != 0:
                logger.info(colored(f'▶ Select {select}', 'blue'))
                select = 0

    except Exception as e:
        logger.error(f'Error processing message: {e}')

def create_display(i2c, address, brightness=None):
    try:
        disp = Seg14x4(i2c, address=address)
        disp.fill(0)
        disp.print('    ')
        if brightness:
            disp.brightness = brightness
        return disp
    except Exception as e:
        print(f'Could not initialize display at 0x{address:02X}: {e}')
        return None

class Player:
    def __init__(self, color: PlayerColor, beam_pin, display, lap_sound, name_sound):
        self.color = color
        self.beam = Button(beam_pin, pull_up=True)
        self.display = display
        self.lap_count = 0
        self.started = False
        self.lap_start = 0
        self.lap_sound = lap_sound
        self.name_sound = name_sound

    def reset(self):
        self.lap_count = 0
        self.started = False
        self.lap_start = 0
        update_display(self.display, '    ')

    def update_timer_display(self, now):
        if self.started:
            elapsed = min(now - self.lap_start, 99.99)
            secs = int(elapsed)
            ms = int((elapsed - secs) * 100)
            formatted = f'{secs:2}.{ms:02d}'.rjust(5).replace('  ', ' ')
            update_display(self.display, formatted)

    def beam_broke(self, now):
        if not self.started:
            self.started = True
            self.lap_start = now
            print(f'{self.color} player started!')
            return False

        if now - self.lap_start >= 0.5:
            self.lap_count += 1
            duration = now - self.lap_start
            self.lap_start = now
            print(f'{self.color} lap {self.lap_count} in {duration:.2f}s')
            self.lap_sound.play()
            return True
        return False

def update_display(disp, text=None):
    if disp:
        if text:
            disp.print(text.rjust(4))
        else:
            disp.fill(0)

def set_digit_all_segments(display, index):
    if display and 0 <= index < 4:
        display.set_digit_raw(index, 0x3FFF)

def clear_display(display):
    if display:
        display.fill(0)

def signal_handler(sig, frame):
    global running
    logger.info('🛑 Received exit signal, shutting down...')
    running = False

def animate_ble(display):
    global running, BLE_STATES

    while running and state in BLE_STATES:
        for digit, seg in CIRCLE_SEGMENTS:
            if not running or not state in BLE_STATES:
                break
            display.set_digit_raw(digit, seg)
            if state == RaceState.BLE_SEARCH:
                time.sleep(0.1)
            elif state == RaceState.BLE_CONNECT:
                time.sleep(0.05)
            display.set_digit_raw(digit, 0)
    for i in range(4):
        display.set_digit_raw(i, 0)

def update_lap_display():
    red_text = f'{red.lap_count}'.rjust(2) if red.started else '  '
    green_text = f'{green.lap_count}'.rjust(2) if green.started else '  '
    update_display(display_lap_count, f'{red_text}{green_text}')

def do_countdown(red, green):
    global state
    clear_display(display_lap_count)
    
    for step in range(4):
        SOUNDS['RED_LIGHT'].play()
        time.sleep(0.1)
        set_digit_all_segments(red.display, step)
        time.sleep(0.9)

    clear_display(red.display)
    for i in range(4):
        set_digit_all_segments(green.display, i)
    SOUNDS['GREEN_LIGHT'].play()
    
    state = RaceState.PRELAP
    time.sleep(1)
    clear_display(green.display)
    
def reset_race(red, green):
    global state
    print('Resetting...')
    state = RaceState.COUNTDOWN
    red.reset()
    green.reset()
    do_countdown(red, green)
    print('Ready for first lap.')

def handle_beam(player):
    global state, cur_race
    now = time.time()
    match state:
        case RaceState.PRELAP:
            player.beam_broke(now)
            state = RaceState.RACE
            cur_race.update_lap(player)
        case RaceState.RACE:
            if player.beam_broke(now):
                update_lap_display()
                cur_race.update_lap(player)

def play_sound(sound, delay=None):
    sound.play()
    t = delay if not delay == None else sound.get_length()
    print(f'delay:{t}')
    time.sleep(t)

def play_sounds(sounds, delays = None):
    if delays == None:
        delays = [None] * len(sounds)
    for sound, delay in zip(sounds, delays):
        play_sound(sound, delay)

def play_win_sound(player):
    sounds = []
    delays = []

    FINISH_SOUNDS = SOUNDS['FINISH_SOUNDS']
    INTROS_NEEDS_WIN = SOUNDS['INTROS_NEEDS_WIN']
    INTROS_NO_NEED_WIN = SOUNDS['INTROS_NO_NEED_WIN']
    WINS = SOUNDS['WINS']

    finish = random.choice(FINISH_SOUNDS)
    sounds.append(finish)
    delays.append(None)

    intro = random.choice(list(INTROS_NEEDS_WIN.union(INTROS_NO_NEED_WIN)))
    if intro in INTROS_NO_NEED_WIN:
        sounds.append(intro)
        delays.append(None)

        sounds.append(player)
        delays.append(None)
    else:
        sounds.append(player)
        delays.append(0.8)

        sounds.append(WINS)
        delays.append(None)
        
        sounds.append(intro)
        delays.append(None)
    
    play_sounds(sounds, delays)

async def run():
    global client, running, state
    global button_delta, select, red_delta, green_delta, white_delta
    global red, green
    global cur_race

    SOUNDS['SEARCHING'].play(loops=-1)
    while running:
        logger.info('🔍 Scanning for PicoPot...')
        devices = await BleakScanner.discover()
        pico = next((d for d in devices if d.name == 'PicoPot'), None)

        if not pico:
            logger.error('❌ PicoPot not found, retrying in 0.5s...')
            await asyncio.sleep(0.5)
            continue

        logger.info(f'✅ Found device: {pico.name}. Connecting...')
        state = RaceState.BLE_CONNECT
        SOUNDS['SEARCHING'].stop()
        SOUNDS['CONNECTING'].play(loops=-1)
        client = BleakClient(pico)

        try:
            await client.connect()
            logger.info('🔗 Connected to PicoPot.')
            state = RaceState.MENU
            SOUNDS['CONNECTING'].stop()
            SOUNDS['CONNECTED'].play()
            svcs = await client.get_services()

            # Verify characteristic exists
            tx_char = None
            for service in svcs:
                for char in service.characteristics:
                    if char.uuid.lower() == UART_TX_UUID.lower():
                        tx_char = char
                        break
                if tx_char:
                    break

            if not tx_char:
                logger.error(f'❌ Characteristic {UART_TX_UUID} not found! Disconnecting...')
                await client.disconnect()
                await asyncio.sleep(0.5)
                continue

            await client.start_notify(UART_TX_UUID, notification_handler)
            logger.info('▶ Notifications started.')
            cur_race.display()

            while running and client.is_connected:
                now = time.time()
                if state != RaceState.RACE:
                    #time.sleep(0.05)
                    await asyncio.sleep(0.05)
                    continue

                red.update_timer_display(now)
                green.update_timer_display(now)

                #time.sleep(0.05)
                await asyncio.sleep(0.05)
                # Do ongoing logic here.
                # Check on global state variable from BLE messages and update

        except Exception as e:
            logger.error(f'🔌 BLE error or disconnect: {e}')

        finally:
            if client and client.is_connected:
                logger.info('Disconnecting from PicoPot...')
                await client.disconnect()
            client = None

        if running:
            logger.info('🔄 Reconnecting in 0.5s...')
            await asyncio.sleep(0.5)

def init_sound(name, vol = 0.6):
    sound = pygame.mixer.Sound(os.path.join(SOUND_DIR, name))
    sound.set_volume(vol)
    return sound

def init_sounds():
    global SOUNDS
    
    pygame.mixer.init(frequency=22050, size=-16, channels=1, buffer=2048)

    SOUNDS = {
        'RED_LIGHT': init_sound('SE_RC_321.wav'),
        'GREEN_LIGHT': init_sound('SE_RC_GO.wav'),
        'SEARCHING': init_sound('SE_UI_RANK_BTN_IN.wav'),
        'CONNECTING': init_sound('SE_UI_BUSY_SYMBOL.wav'),
        'CONNECTED': init_sound('se_menu_vcvolume_sample_1.wav'),
        'CURSER': init_sound('curser.wav'),
        'LAP': init_sound('lap.wav', 1),

        'COMPLETE': init_sound('vc_narration_complete.wav'),
        'GAME': init_sound('vc_narration_gameset.wav'),
        'TIME': init_sound('vc_narration_timeup.wav'),

        'CONGRATS': init_sound('vc_narration_congratulation.wav'),
        'EXCELLENT': init_sound('vc_menu_narration_excellent.wav'),
        'NICE_WORK': init_sound('vc_menu_narration_great.wav'),
        'NAILED_IT': init_sound('vc_menu_narration_nailedit.wav'),
        'INCREDIBLE': init_sound('vc_narration_incledible.wav'),
        'VICTORY': init_sound('vc_narration_result_victory.wav'),

        'THE_CHAMPION_IS': init_sound('vc_menu_narration_champion.wav'),

        'MARIO': init_sound('vc_narration_characall_mario.wav'),
        'LUIGI': init_sound('vc_narration_characall_luigi.wav'),
        'WINS': init_sound('vc_narration_result_win_allbattle.wav'),

        'STOCK_BATTLE': init_sound('vc_menu_narration_stockbattle.wav'),
        'TIME_BATTLE': init_sound('vc_menu_narration_timedbattle.wav'),

        'READY': init_sound('vc_menu_narration_ready2.wav'),
        'FIVE': init_sound('vc_narration_five.wav'),
        'FOUR': init_sound('vc_narration_four.wav'),
        'THREE': init_sound('vc_narration_three.wav'),
        'TWO': init_sound('vc_narration_two.wav'),
        'ONE': init_sound('vc_narration_one.wav'),
        'GO': init_sound('vc_narration_go.wav')
    }

    SOUNDS['FINISH_SOUNDS'] = [SOUNDS['COMPLETE'], SOUNDS['GAME'], SOUNDS['TIME']]
    SOUNDS['INTROS_NEEDS_WIN'] = {SOUNDS['CONGRATS'], SOUNDS['EXCELLENT'], SOUNDS['NICE_WORK'],
                                    SOUNDS['NAILED_IT'], SOUNDS['INCREDIBLE'], SOUNDS['VICTORY']}
    SOUNDS['INTROS_NO_NEED_WIN'] = {SOUNDS['THE_CHAMPION_IS']}

def main():
    global display_lap_count, display_red, display_green, state
    global red, green
    global race_types, cur_race_i, cur_race

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    init_sounds()

    display_lap_count = create_display(i2c, 0x70)
    display_red = create_display(i2c, 0x71)
    display_green = create_display(i2c, 0x72, 0.4)

    red = Player(PlayerColor.RED, 4, display_red, SOUNDS['LAP'], SOUNDS['MARIO'])
    green = Player(PlayerColor.GREEN, 17, display_green, SOUNDS['LAP'], SOUNDS['LUIGI'])

    red.beam.when_pressed = lambda: handle_beam(red)
    green.beam.when_pressed = lambda: handle_beam(green)

    state = RaceState.BLE_SEARCH

    race_types = [
        LapRace(SOUNDS['STOCK_BATTLE']),
        TimeRace(SOUNDS['TIME_BATTLE'])
    ]
    cur_race_i = 0
    cur_race = race_types[cur_race_i]

    print('System ready. Press reset to begin.')
    update_display(display_lap_count, '    ')
    update_display(red.display, '    ')
    update_display(green.display, '    ')

    threading.Thread(target=animate_ble, args=[display_lap_count], daemon=True).start()

    try:
        asyncio.run(run())
        
    except Exception as e:
        logger.exception('Main() Exception:')
    finally:
        print('Exiting, clearing displays.')
        if display_lap_count:
            display_lap_count.fill(0)
        if display_red:
            display_red.fill(0)
        if display_green:
            display_green.fill(0)
        #GPIO.cleanup()
        logger.info('Cleanup done, exiting.')
        sys.exit(0)

if __name__ == '__main__':
    main()
