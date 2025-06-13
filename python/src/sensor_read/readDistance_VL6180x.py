import time
import board
import busio
import sys
#import pygame
import threading

import adafruit_vl6180x

# Create I2C bus.
i2c = busio.I2C(board.SCL, board.SDA)

# Create sensor instance.
sensor = adafruit_vl6180x.VL6180X(i2c)

print("Starting continuous mode")
sensor.start_range_continuous(20)

def play_sound(path):
    pygame.mixer.init()
    pygame.mixer.music.load(path)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy():
        time.sleep(0.1)  # Wait while it plays, without hogging CPU

def play_sound_async(path):
    threading.Thread(target=play_sound, args=(path,), daemon=True).start()


TRIGGER = 1
RESET = 5
TRIGGER_MM = 15
cnt = 0

min_d = sys.maxsize
try:
    t_cnt = TRIGGER
    r_cnt = RESET
    was_triggered = False
    while True:
        # Read the range in millimeters and print it.
        range_mm = sensor.range
        if was_triggered:
            if range_mm > TRIGGER_MM:
                r_cnt -= 1
            if r_cnt == 0:
                was_triggered = False
                r_cnt = RESET
        else:
            if range_mm <= TRIGGER_MM:
                t_cnt -= 1
            if t_cnt == 0:
                was_triggered = True
                t_cnt = TRIGGER
                cnt += 1
                print(f'car seen: {cnt}')
                print(f"Current: {range_mm}mm")
                #play_sound_async('coin.wav')

        #normally 27mm, 14mm on pass
        
        min_d = min(range_mm, min_d)
        print(f"Min: {min_d}mm, Current: {range_mm}mm")
        time.sleep(0.01)
        #print(f"Current: {range_mm}mm")
        # delay for 10ms
except KeyboardInterrupt:
    sensor.stop_range_continuous()
