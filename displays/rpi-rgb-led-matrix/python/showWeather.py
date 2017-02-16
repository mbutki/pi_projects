import Image
import os
import time
from rgbmatrix import RGBMatrix, RGBMatrixOptions, graphics
import sys
from pymongo import MongoClient
import argparse
from multiprocessing import Process
import json
import datetime
import logging as log

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level)

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))

RAIN = None
SUN = None
CLOUD = None

HIGH_TEMP_COLOR = graphics.Color(170, 170, 170)
POP_COLOR = graphics.Color(40, 110, 206)
#CURRENT_TEMP_COLOR = graphics.Color(249, 207, 0)
CURRENT_TEMP_COLOR = graphics.Color(164, 213, 85)

def processImage(path):
    im = Image.open(path)

    frames = []
    p = im.getpalette()
    last_frame = im.convert('RGBA')
    
    try:
        while True:            
            if not im.getpalette():
                im.putpalette(p)
            
            new_frame = Image.new('RGBA', im.size)
            
            new_frame.paste(im, (0,0), im.convert('RGBA'))
            #frames.append(new_frame.point(lambda p: p * 0.6))
            frames.append(new_frame)
            last_frame = new_frame
            im.seek(im.tell() + 1)
    except EOFError:
        pass

    return frames

def fetchWeather():
    client = MongoClient(db_config['host'])
    db = client.piData

    rows = db.weather.find({}).sort('time', -1).limit(1)
    weather =  rows[0]['weather']

    client.close()
    return weather

def parseWeather(weather):
    days = []
    numbers = []
    for epoch in sorted(weather['days']):
        day = weather['days'][epoch]
        condition = day['condition']
        print day['pretty'], condition
        if 'Rain' in condition or 'Showers' in condition:
            days.append(RAIN)
        elif 'Clear' in condition or 'Sunny' in condition:
            days.append(SUN)
        elif 'Cloudy' in condition or 'Overcast' in condition or 'Clouds' in condition:
            days.append(CLOUD)
        else:
            days.append(SUN)

        numbers.append({
            'pop': day['pop'],
            'high': day['high'],
            'low': day['low']
        })
    return days, numbers

def dailyIcons(days, new_frame, day_index):
    for j, day in enumerate(days):
        offset = 0
        if j > 0:
            offset = 1+(j*13)
        else:
            offset = 1
        new_frame.paste(day[day_index], (offset,0))

def dailyText(numbers, offscreen_canvas, medium_font, small_font):
    global HIGH_TEMP_COLOR
    global POP_COLOR

    for j, number in enumerate(numbers):
        offset = 0
        if j > 0:
            offset = 1+(j*13)
        else:
            offset = 1

        display_num = 0
        display_color = None
        if number['pop'] == 100:
            display_color = POP_COLOR
            display_num = number['pop']
            font = small_font
        elif number['pop'] > 20:
            display_color = POP_COLOR
            display_num = number['pop']
            font = medium_font
        else:
            display_color = HIGH_TEMP_COLOR
            display_num = number['high']
            font = medium_font
        
        number_str = str(display_num)

        if len(number_str) == 1:
            offset += 0
        elif len(number_str) == 2:
            offset += 0
        elif len(number_str) == 3:
            offset -= 1

        graphics.DrawText(offscreen_canvas, font, offset, 6+9+2, display_color, number_str)

def current(current, offscreen_canvas, medium_font):
    global CURRENT_TEMP_COLOR

    graphics.DrawText(offscreen_canvas, medium_font, 0, 30, CURRENT_TEMP_COLOR, str(int(current['temp'])))

def main():
    global RAIN
    global SUN
    global CLOUD
    global Adafruit_RGBmatrix
    global graphics

    RAIN = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/rain.gif')
    SUN = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/sun.gif')
    CLOUD = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/cloud.gif')
    
    weather = fetchWeather()
    days, numbers = parseWeather(weather)

    # Configuration for the matrix
    options = RGBMatrixOptions()
    options.rows = 32
    options.chain_length = 2
    options.gpio_slowdown = 2
    options.pwm_lsb_nanoseconds = 100
    options.brightness = 65
    #options.show_refresh_rate = 1
    options.hardware_mapping = 'adafruit-hat'  # If you have an Adafruit HAT: 'adafruit-hat'

    matrix = RGBMatrix(options = options)
    offscreen_canvas = matrix.CreateFrameCanvas()

    medium_font = graphics.Font()
    small_font = graphics.Font()
    medium_font.LoadFont('fonts/5x7_mike.bdf')
    #medium_font.LoadFont('fonts/5x7_mike_square.bdf')
    small_font.LoadFont('fonts/4x6_mike_bigger.bdf')

    i = 0
    while True:
        if i == 60 * 5:
            i = 0
            weather = fetchWeather()
            days, numbers = parseWeather(weather)
            
        for day_index, frame in enumerate(days[0]):
            new_frame = Image.new('RGBA', (64,32))

            dailyIcons(days, new_frame, day_index)

            new_frame = new_frame.convert('RGB')
            offscreen_canvas.SetImage(new_frame, 0, 0)

            dailyText(numbers, offscreen_canvas, medium_font, small_font)
            current(weather['current'], offscreen_canvas, medium_font)

            offscreen_canvas = matrix.SwapOnVSync(offscreen_canvas)
            time.sleep(1)
        i += 1

if __name__ == "__main__":
    main()
