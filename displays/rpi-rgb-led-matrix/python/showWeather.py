import Image
import ImageDraw
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
import traceback

#from pi_projects.security import readMotionSensors
#import  pi_projects

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'
LOG_NAME = 'show_weather.log'

db_config = json.load(open('{}/db.config'.format(PI_DIR)))
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
LOG_DIR = pi_config['log_dir']

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')

RAIN = None
SUN = None
CLOUD = None
MOSTLY_CLOUD = None
MOSTLY_SUN = None
UNKNOWN = None
TEXT_ICON_PAIRS = None

HIGH_TEMP_COLOR = graphics.Color(170, 170, 170)
POP_COLOR = graphics.Color(40, 110, 206)
CURRENT_TEMP_COLOR = graphics.Color(11, 164, 11)

DAYLIGHT_BAR_COLOR = graphics.Color(25, 25, 05)
NOON_BAR_COLOR = graphics.Color(80, 80, 80)
MIDNIGHT_BAR_COLOR = graphics.Color(50, 50, 50)

TEMP_LINE_COLOR = graphics.Color(130, 130, 130)
POP_LINE_COLOR = graphics.Color(0, 130, 255)
TEMP_INCREMENT_LINE_COLOR = graphics.Color(40, 40, 40)

HIGH_TEMP_LINE_COLOR = graphics.Color(130, 0, 0)
LOW_TEMP_LINE_COLOR = graphics.Color(0, 100, 200)

RUNNER_DOT_COLOR = graphics.Color(150, 0, 0)

BAR_CHART_BOTTOM = 31
BAR_MIN_TEMP = 30
CURRENT_BOTTOM = 28

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

def fetchIndoorTemps():
    client = MongoClient(db_config['host'])
    db = client.piData

    rows = db.temperatures.find({"location" : "shelf"}).sort('time', -1).limit(1)
    temp = rows[0]['value']

    client.close()
    return temp

def getDailyIcons(weather):
    global UNKNOWN
    global TEXT_ICON_PAIRS

    daily_icons = []
    for epoch in sorted(weather['days']):
        day = weather['days'][epoch]
        condition = day['condition']
        found = False
        for conditions, icon in TEXT_ICON_PAIRS:
            if condition in conditions:
                daily_icons.append(icon)
                found = True
                break
        if not found:
            daily_icons.append(UNKNOWN)

    return daily_icons

def drawWeekendLines(offscreen_canvas, weather, tick):
    for j, epoch in enumerate(sorted(weather['days'])[:5]):
        offset = 0
        if j > 0:
            offset = j * 13
        else:
            offset = 0

        dt =  datetime.datetime.fromtimestamp(float(epoch))
        if dt.weekday() == 5 or dt.weekday() == 0:
            #graphics.DrawLine(offscreen_canvas, offset-1, 0, offset-1 , 15, HIGH_TEMP_COLOR)
            for k in range(5):
                #offscreen_canvas.SetPixel(offset-1, i, random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
                offscreen_canvas.SetPixel(offset-1, (tick%7)+3+k, random.randint(0, 200), random.randint(0, 200), random.randint(0, 200))
                offscreen_canvas.SetPixel(offset-2, (tick%7)+3+k, random.randint(0, 200), random.randint(0, 200), random.randint(0, 200))

def dailyIcons(daily_icons, new_frame, tick):
    for j, day in enumerate(daily_icons):
        offset = 0
        if j > 0:
            offset = j * 13
        else:
            offset = 0
        this_day_frame_index = (tick + j*4) % len(day)
        new_frame.paste(day[this_day_frame_index], (offset,0))

def dailyText(weather, offscreen_canvas, medium_font, small_font):
    global HIGH_TEMP_COLOR
    global POP_COLOR

    for j, epoch in enumerate(sorted(weather['days'])):
        dt =  datetime.datetime.fromtimestamp(float(epoch))
        day = weather['days'][epoch]
        offset = 0
        if j > 0:
            offset = 1+(j*13)
        else:
            offset = 1

        display_num = 0
        display_color = None
        if day['pop'] == 100:
            display_color = POP_COLOR
            display_num = day['pop']
            font = small_font
        elif day['pop'] > 20:
            display_color = POP_COLOR
            display_num = day['pop']
            font = medium_font
        else:
            display_color = HIGH_TEMP_COLOR
            display_num = day['high']
            font = medium_font
        
        number_str = str(display_num)

        if len(number_str) == 1:
            offset += 0
        elif len(number_str) == 2:
            offset += 0
        elif len(number_str) == 3:
            offset -= 1
            
        y = 6+9+2
        graphics.DrawText(offscreen_canvas, font, offset, y, display_color, number_str)

        if dt.weekday() == 5 or dt.weekday() == 6:
            graphics.DrawLine(offscreen_canvas, offset-2, 12, offset-2 , 15, CURRENT_TEMP_COLOR)
        if dt.weekday() == 0:
            graphics.DrawLine(offscreen_canvas, offset-3, 12, offset-3 , 15, CURRENT_TEMP_COLOR)

def current(current, offscreen_canvas, medium_font):
    global CURRENT_TEMP_COLOR

    graphics.DrawText(offscreen_canvas, medium_font, 0, CURRENT_BOTTOM, CURRENT_TEMP_COLOR, str(int(round(current['temp']))))

def indoor(current, offscreen_canvas, medium_font):
    global CURRENT_TEMP_COLOR

    graphics.DrawText(offscreen_canvas, medium_font, 55, CURRENT_BOTTOM, CURRENT_TEMP_COLOR, str(int(round(current))))

def bars(weather, offscreen_canvas, tick):
    TEMP_DIV = 5.0
    POP_DIV = 7.0
    CHART_WIDTH = 44
    BAR_LEFT = 10

    horizontal_temps = [40, 60, 80, 100]

    epochs = sorted(weather['hours'].keys())[:CHART_WIDTH]
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]
        dt =  datetime.datetime.fromtimestamp(float(epoch))
        column = BAR_LEFT + i
        if dt.hour >= weather['rise'] and dt.hour <= weather['set']:
            graphics.DrawLine(offscreen_canvas, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, DAYLIGHT_BAR_COLOR)

    for h_temp in horizontal_temps:
        y = BAR_CHART_BOTTOM - ((h_temp - BAR_MIN_TEMP) / TEMP_DIV)
        y = int(y)
        graphics.DrawLine(offscreen_canvas, BAR_LEFT, y, BAR_LEFT + CHART_WIDTH - 1, y, TEMP_INCREMENT_LINE_COLOR)

    epochs = sorted(weather['hours'].keys())[:CHART_WIDTH]
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]

        prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
        dt =  datetime.datetime.fromtimestamp(float(epoch))

        temp = int(round( (hour['temp'] - BAR_MIN_TEMP) / TEMP_DIV ))

        pop = int(round(hour['pop'] / POP_DIV)) - 1

        prev_temp = None
        if prev_hour:
            prev_temp = int(round( (prev_hour['temp'] - BAR_MIN_TEMP) / TEMP_DIV ))

        prev_pop = int(round( prev_hour['pop'] / POP_DIV )) - 1 if prev_hour else None

        column = BAR_LEFT + i
        temp_y2 = BAR_CHART_BOTTOM - temp
        pop_y2 = BAR_CHART_BOTTOM - pop

        prev_temp_y2 = BAR_CHART_BOTTOM - prev_temp if prev_temp else None
        prev_pop_y2 = BAR_CHART_BOTTOM - prev_pop if prev_temp else None

        if dt.hour == 12:
            graphics.DrawLine(offscreen_canvas, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, NOON_BAR_COLOR)
        if dt.hour == 0:
            graphics.DrawLine(offscreen_canvas, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, MIDNIGHT_BAR_COLOR)
        
        # temp
        if i != tick % CHART_WIDTH:
            base_temp = 80
            low_temp = 50
            if hour['temp'] >= base_temp:
                offscreen_canvas.SetPixel(column, temp_y2, HIGH_TEMP_LINE_COLOR.red, HIGH_TEMP_LINE_COLOR.green, HIGH_TEMP_LINE_COLOR.blue)
            elif hour['temp'] <= low_temp:
                offscreen_canvas.SetPixel(column, temp_y2, LOW_TEMP_LINE_COLOR.red, LOW_TEMP_LINE_COLOR.green, LOW_TEMP_LINE_COLOR.blue)
            else:
                offscreen_canvas.SetPixel(column, temp_y2, TEMP_LINE_COLOR.red, TEMP_LINE_COLOR.green, TEMP_LINE_COLOR.blue)

            if prev_temp:
                drawConnectingLine(prev_temp, temp, prev_temp_y2, temp_y2, offscreen_canvas, column, TEMP_LINE_COLOR)
        
        # rain
        if True:
            offscreen_canvas.SetPixel(column, pop_y2, POP_LINE_COLOR.red, POP_LINE_COLOR.green, POP_LINE_COLOR.blue)
            if prev_pop:
                drawConnectingLine(prev_pop, pop, prev_pop_y2, pop_y2, offscreen_canvas, column, POP_LINE_COLOR)
            
        # animated dot
        if i == tick % CHART_WIDTH:
            offscreen_canvas.SetPixel(column, temp_y2, RUNNER_DOT_COLOR.red, RUNNER_DOT_COLOR.green, RUNNER_DOT_COLOR.blue)

def drawConnectingLine(prev, cur, prev_y2, y2, offscreen_canvas, column, color):
    if prev > cur + 1:
        graphics.DrawLine(offscreen_canvas, column - 1, prev_y2 , column - 1, y2 - 1, color)
    elif prev < cur - 1:
        graphics.DrawLine(offscreen_canvas, column,     y2,     column,     prev_y2 - 1, color)

def main():
    global Adafruit_RGBmatrix
    global graphics
    global RAIN
    global SUN 
    global CLOUD
    global MOSTLY_CLOUD
    global MOSTLY_SUN 
    global UNKNOWN
    global TEXT_ICON_PAIRS

    RAIN = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/rain.gif')
    SUN = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/sun.gif')
    CLOUD = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/cloud.gif')
    MOSTLY_CLOUD = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/mostly_cloud.gif')
    MOSTLY_SUN = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/mostly_sun.gif')
    UNKNOWN = processImage('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/unknown.gif')

    TEXT_ICON_PAIRS = (
        (set(['Clear', 'Sunny']), SUN),
        (set(['Cloudy', 'Overcast']), CLOUD),
        #(set(['Scattered Clouds', 'Partly Cloudy', 'Mostly Sunny']), MOSTLY_CLOUD),
        (set(['Scattered Clouds', 'Partly Cloudy', 'Mostly Sunny']), MOSTLY_SUN),
        (set(['Mostly Cloudy', 'Partly Sunny']), MOSTLY_CLOUD),
        (set(['Chance of Rain', 'Rain']), RAIN),
    )
    
    try:
        weather = fetchWeather()
        daily_icons= getDailyIcons(weather)

        indoor_temp = fetchIndoorTemps()

        # Configuration for the matrix
        options = RGBMatrixOptions()
        options.rows = 32
        options.chain_length = 2
        options.gpio_slowdown = 2
        options.pwm_lsb_nanoseconds = 100
        options.brightness = 65
        #options.show_refresh_rate = 1
        options.hardware_mapping = 'adafruit-hat-pwm'  # If you have an Adafruit HAT: 'adafruit-hat'

        matrix = RGBMatrix(options = options)
        offscreen_canvas = matrix.CreateFrameCanvas()

        medium_font = graphics.Font()
        small_font = graphics.Font()
        medium_font.LoadFont('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/fonts/5x7_mike.bdf')
        #medium_font.LoadFont('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/fonts/5x7_mike_square.bdf')
        small_font.LoadFont('/home/mbutki/pi_projects/displays/rpi-rgb-led-matrix/python/fonts/4x6_mike_bigger.bdf')

        tick = 1
        while True:
            if (tick % 60 * 5 * 2) == 0:
                try:
                    weather = fetchWeather()
                    indoor_temp = fetchIndoorTemps()
                except Exception as e:
                    print e
                    log.error('fetchWeather() exception: {}'.format(traceback.format_exc()))
                daily_icons = getDailyIcons(weather)

                
            new_frame = Image.new('RGBA', (64,32))

            dailyIcons(daily_icons, new_frame, tick)

            new_frame = new_frame.convert('RGB')
            offscreen_canvas.SetImage(new_frame, 0, 0)

            #drawWeekendLines(offscreen_canvas, weather, tick)

            dailyText(weather, offscreen_canvas, medium_font, small_font)
            current(weather['current'], offscreen_canvas, medium_font)

            indoor(indoor_temp, offscreen_canvas, medium_font)

            bars(weather, offscreen_canvas, tick)

            offscreen_canvas = matrix.SwapOnVSync(offscreen_canvas)
            time.sleep(0.5)
            tick += 1
            if tick == sys.maxint:
                tick = 0
            
    except Exception as e:
        log.error('main() exception: {}'.format(traceback.format_exc()))

if __name__ == "__main__":
    main()
