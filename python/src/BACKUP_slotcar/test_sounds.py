import time
import pygame
import os
import random

SOUND_DIR = "/home/mbutki/pi_projects/python/src/slotcar/sounds/"

pygame.mixer.init(frequency=22050, size=-16, channels=1, buffer=2048)

RED_LIGHT_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "SE_RC_321.wav"))
GREEN_LIGHT_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "SE_RC_GO.wav"))
SEARCHING_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "SE_UI_RANK_BTN_IN.wav"))
CONNECTING_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "SE_UI_BUSY_SYMBOL.wav"))
CONNECTED_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "SE_UI_RANK_BTN_OK.wav"))

COMPLETE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_complete.wav"))
GAME_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_gameset.wav"))
TIME_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_timeup.wav"))

CONGRATS_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_congratulation.wav"))
EXCELLENT_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_excellent.wav"))
NICE_WORK_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_great.wav"))
NAILED_IT_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_nailedit.wav"))
INCREDIBLE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_incledible.wav"))
VICTORY_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_result_victory.wav"))

THE_CHAMPION_IS_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_champion.wav"))

MARIO_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_characall_mario.wav"))
LUIGI_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_characall_luigi.wav"))
WINS_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_result_win_allbattle.wav"))

STOCK_BATTLE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_stockbattle.wav"))
TIME_BATTLE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_timedbattle.wav"))

READY_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_menu_narration_ready2.wav"))
FIVE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_five.wav"))
FOUR_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_four.wav"))
THREE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_three.wav"))
TWO_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_two.wav"))
ONE_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_one.wav"))
GO_SOUND = pygame.mixer.Sound(os.path.join(SOUND_DIR, "vc_narration_go.wav"))

FINISH_SOUNDS = [COMPLETE_SOUND, GAME_SOUND, TIME_SOUND]
INTROS_NEEDS_WIN = {CONGRATS_SOUND, EXCELLENT_SOUND, NICE_WORK_SOUND, NAILED_IT_SOUND, INCREDIBLE_SOUND, VICTORY_SOUND}
INTROS_NO_NEED_WIN = {THE_CHAMPION_IS_SOUND}

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

        sounds.append(WINS_SOUND)
        delays.append(None)
        
        sounds.append(intro)
        delays.append(None)
    
    play_sounds(sounds, delays)

while True:
    play_win_sound(random.choice([MARIO_SOUND, LUIGI_SOUND]))
    time.sleep(0.5)


#play_sounds([EXCELLENT_SOUND, MARIO_SOUND, WINS_SOUND])
#play_sounds([THE_CHAMPION_IS_SOUND, LUIGI_SOUND])
#time.sleep(1)
#play_sounds([COMPLETE_SOUND, CONGRATS_SOUND, LUIGI_SOUND, WINS_SOUND])
#time.sleep(1)
#play_sounds([READY_SOUND, FIVE_SOUND, FOUR_SOUND, THREE_SOUND, TWO_SOUND, ONE_SOUND, GO_SOUND], [None, 1,1,1,1,1,None])

