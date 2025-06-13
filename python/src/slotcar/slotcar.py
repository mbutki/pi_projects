import time
import pygame
from gpiozero import Button
from signal import pause
import os
import threading
from enum import Enum, auto

import board
import busio
from adafruit_ht16k33.segments import Seg14x4

SOUND_DIR = "/home/mbutki/pi_projects/python/src/slotcar/"

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

class RaceState(Enum):
    PREGAME = auto()
    COUNTDOWN = auto()
    PRELAP = auto()
    RACE = auto()

def create_display(i2c, address, brightness=None):
    try:
        disp = Seg14x4(i2c, address=address)
        disp.fill(0)
        disp.print("    ")
        if brightness:
            disp.brightness = brightness
        return disp
    except Exception as e:
        print(f"Could not initialize display at 0x{address:02X}: {e}")
        return None

class Player:
    def __init__(self, name, beam_pin, display, lap_sound_file):
        self.name = name
        self.beam = Button(beam_pin, pull_up=True)
        self.display = display
        self.lap_count = 0
        self.started = False
        self.lap_start = 0
        self.lap_sound = pygame.mixer.Sound(os.path.join(SOUND_DIR, lap_sound_file))

    def reset(self):
        self.lap_count = 0
        self.started = False
        self.lap_start = 0
        update_display(self.display, "    ")

    def update_timer_display(self, now):
        if self.started:
            elapsed = min(now - self.lap_start, 99.99)
            secs = int(elapsed)
            ms = int((elapsed - secs) * 100)
            formatted = f"{secs:2}.{ms:02d}".rjust(5).replace("  ", " ")
            update_display(self.display, formatted)

    def beam_broke(self, now):
        if not self.started:
            self.started = True
            self.lap_start = now
            print(f"{self.name} player started!")
            return False

        if now - self.lap_start >= 0.5:
            self.lap_count += 1
            duration = now - self.lap_start
            self.lap_start = now
            print(f"{self.name} lap {self.lap_count} in {duration:.2f}s")
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

def main():
    i2c = busio.I2C(board.SCL, board.SDA)
    pygame.mixer.init(frequency=22050, size=-16, channels=1, buffer=2048)

    display_lap_count = create_display(i2c, 0x70)
    display_red = create_display(i2c, 0x71)
    display_green = create_display(i2c, 0x72, 0.4)

    red = Player("Red", 4, display_red, "coin-2.mp3")
    green = Player("Green", 17, display_green, "coin-3.mp3")
    reset_button = Button(22, pull_up=True)

    state = RaceState.PREGAME

    RED_LIGHT_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "powerup-1.mp3"))
    GREEN_LIGHT_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "powerup-2.mp3"))

    def animate_lap_display(display):
        while state == RaceState.PREGAME:
            for digit, seg in CIRCLE_SEGMENTS:
                if state != RaceState.PREGAME:
                    break
                display.set_digit_raw(digit, seg)
                time.sleep(0.1)
                display.set_digit_raw(digit, 0)
        for i in range(4):
            display.set_digit_raw(i, 0)

    def update_lap_display():
        red_text = f"{red.lap_count}".rjust(2) if red.started else "  "
        green_text = f"{green.lap_count}".rjust(2) if green.started else "  "
        update_display(display_lap_count, f"{red_text}{green_text}")

    def do_countdown():
        nonlocal state
        clear_display(display_lap_count)

        for step in range(4):
            clear_display(red.display)
            for i in range(step + 1):
                set_digit_all_segments(red.display, i)
            RED_LIGHT_SOUND.play()
            time.sleep(1)

        clear_display(red.display)
        for i in range(4):
            set_digit_all_segments(green.display, i)
        GREEN_LIGHT_SOUND.play()
        state = RaceState.PRELAP
        time.sleep(1)
        clear_display(green.display)
        
    def reset_race():
        nonlocal state
        print("Resetting...")
        state = RaceState.COUNTDOWN
        red.reset()
        green.reset()
        do_countdown()
        print("Ready for first lap.")

    def handle_beam(player):
        nonlocal state
        now = time.time()
        match state:
            case RaceState.PRELAP:
                player.beam_broke(now)
                state = RaceState.RACE
            case RaceState.RACE:
                if player.beam_broke(now):
                    update_lap_display()

    red.beam.when_pressed = lambda: handle_beam(red)
    green.beam.when_pressed = lambda: handle_beam(green)
    reset_button.when_pressed = reset_race

    print("System ready. Press reset to begin.")
    update_display(display_lap_count, "    ")
    update_display(red.display, "Push")
    update_display(green.display, " Go ")

    threading.Thread(target=animate_lap_display, args=[display_lap_count], daemon=True).start()

    try:
        while True:
            now = time.time()
            if state != RaceState.RACE:
                time.sleep(0.05)
                continue

            red.update_timer_display(now)
            green.update_timer_display(now)

            time.sleep(0.05)
    except KeyboardInterrupt:
        print("Exiting, clearing displays.")
        if display_lap_count:
            display_lap_count.fill(0)
        if display_red:
            display_red.fill(0)
        if display_green:
            display_green.fill(0)

if __name__ == "__main__":
    main()
