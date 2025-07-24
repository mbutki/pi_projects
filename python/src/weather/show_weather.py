import os
import time
import sys
import argparse
import datetime
from multiprocessing import Process
import threading
import traceback
import json
import logging as log
import mariadb
import conway
import clock_date
import line_graph
import utils

from PIL import Image, ImageDraw
from rgbmatrix import RGBMatrix, RGBMatrixOptions, graphics

from db_reads import *
from icon_utils import *

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'

db_config = json.load(open('{}/db.config'.format(PI_DIR)))
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
matrix_config = json.load(open('{}/python/src/weather/matrix.config'.format(PI_DIR)))

LOG_NAME = 'show_weather.log'
LOG_DIR = pi_config['log_dir']

PERFER_RAIN_POP = True if matrix_config['perfer_rain_pop'] == 'True' else False
EXTENDED_WEATHER = True if matrix_config['extended_weather'] == 'True' else False

MAX_LUX = matrix_config['max_lux']
MIN_LUX = matrix_config['min_lux']
MAX_BRIGHTNESS = matrix_config['max_brightness']
MIN_BRIGHTNESS = matrix_config['min_brightness']

TEMP_MODE = matrix_config['temp_mode']

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')

WEATHER_DIR = PI_DIR + '/python/src/weather'

###################### COLORS ######################
# Number Colors
DAY_TEMP_COLOR = graphics.Color(170, 170, 170)
WEEKEND_TEMP_COLOR = graphics.Color(204, 102, 0)
WEEKEND_LINE_COLOR = graphics.Color(170, 100, 40)
POP_COLOR = graphics.Color(40, 110, 206)
INDOOR_TEMP_COLOR = graphics.Color(30, 180, 30)
OUTDOOR_TEMP_COLOR = graphics.Color(40, 170, 170)

# AQI
AQI_GREEN_COLOR = graphics.Color(11, 164, 11)
AQI_YELLOW_COLOR = graphics.Color(210, 210, 0)
AQI_ORANGE_COLOR = graphics.Color(210, 143, 0)
AQI_RED_COLOR = graphics.Color(180, 0, 0)
AQI_PURPLE_COLOR = graphics.Color(210, 0, 210)
################## END COLORS ######################

CURRENT_BOTTOM = 28
CONWAY_X_OFFSET = 68

#TICK_DUR_MS is in utils.py
ICON_SPEED_MS = 200
READ_WEATHER_SECS = 5 * 60 # 5 mins
READ_LUX_SECS = 10 # 10 secs

MEDIUM_FONT = graphics.Font()
SMALL_FONT = graphics.Font()
MEDIUM_FONT.LoadFont(WEATHER_DIR + '/fonts/5x7_mike.bdf')
SMALL_FONT.LoadFont(WEATHER_DIR + '/fonts/4x6_mike_bigger.bdf')

#### GLOBALS ####
OFFSCREEN_CANVAS = MATRIX = None
weather = daily_icons = indoor_temp = outdoor_temp = lux = None
#################

def main():
    global OFFSCREEN_CANVAS
    global MATRIX

    MATRIX = createMatrix()
    OFFSCREEN_CANVAS = MATRIX.CreateFrameCanvas()

    world = conway.World((64,32), {3}, {2,3}, 0.3, CONWAY_X_OFFSET)
    world.reset()
    #world = World((64,32), {3,6}, {2,3}, 0.3) # highlife
    #world = World((5,5), {3}, {2,3}, 0.3) # debug blinker

    clock = clock_date.Clock(MEDIUM_FONT, (64 * 2) + 9)
    graph = line_graph.Graph()

    weatherSetup() # Blocking fetch of weather data

    tick = 0
    while True:
        OFFSCREEN_CANVAS.Clear()
        drawWeather(graph, tick)
        clock.draw(OFFSCREEN_CANVAS)
        draw_conway(OFFSCREEN_CANVAS, world, tick)

        OFFSCREEN_CANVAS = MATRIX.SwapOnVSync(OFFSCREEN_CANVAS)
        time.sleep(utils.get_tick_dur_ms() / 1000)
        tick += 1
        if tick == sys.maxsize:
            tick = 0

def draw_conway(canvas, world, tick):
    if utils.should_trigger_ms(tick, 100):
        world.advance()
    world.draw(canvas)
    
    if (world.gen_state() in world.history) or utils.should_trigger_secs(tick, 600):
        world.reset()

def aqiColor(aqi):
    color = None
    if aqi < 50:
        color = AQI_GREEN_COLOR
    elif aqi < 100:
        color = AQI_YELLOW_COLOR
    elif aqi < 150:
        color = AQI_ORANGE_COLOR
    elif aqi < 200:
        color = AQI_RED_COLOR
    else:
        color = AQI_PURPLE_COLOR
    return color

def drawWeather(graph, tick):
    try:
        updateData(tick)

        frame = Image.new('RGBA', (64,32))
        drawDailyIcons(frame, tick, weather)
        OFFSCREEN_CANVAS.SetImage(frame.convert('RGB'), 0, 0)
        
        drawCurrent(weather['current'], outdoor_temp)
        drawIndoor(indoor_temp)
        graph.draw(OFFSCREEN_CANVAS, weather, tick)
        drawDailyText(weather)
    except Exception as e:
        if args.v:
            print(('main() exception: {}'.format(traceback.format_exc())))
        log.error('main() exception: {}'.format(traceback.format_exc()))

def updateData(tick):
    if utils.should_trigger_secs(tick, READ_WEATHER_SECS):
        try:
            fetchDataThreaded()
        except Exception as e:
            log.error('fetchWeather() threaded exception: {}'.format(traceback.format_exc()))

    '''
    if utils.should_trigger_secs(tick, READ_LUX_SECS):
        try:
            adjustBrightnessThreaded()
            pass
        except Exception as e:
            log.error('fetchLux() threaded exception: {}'.format(traceback.format_exc()))
    '''

def drawDailyIcons(frame, tick, weather):
    # draw using current icon frame
    for day_index, icon_set in enumerate(daily_icons):
        for icon_frame in icon_set.get_frames():
            x_offset = day_index * 13
            frame.paste(icon_frame, (x_offset,0), icon_frame)

        # advance icon frame if needed
        if utils.should_trigger_ms(tick, ICON_SPEED_MS):
            icon_set.advance()

def drawDailyText(weather):
    for j, epoch in enumerate(sorted(weather['days'])[:5]):
        dt =  datetime.datetime.fromtimestamp(float(epoch))
        day = weather['days'][epoch]
        offset = 0
        if j > 0:
            offset = 1+(j*13)
        else:
            offset = 1

        number_str = str(day['high'])
        if len(number_str) == 1:
            offset += 0
        elif len(number_str) == 2:
            offset += 0
        elif len(number_str) == 3:
            offset -= 1
        
        font = SMALL_FONT if day['high'] >= 100 else MEDIUM_FONT
        display_color = DAY_TEMP_COLOR if not dt.weekday() in {5, 6} else WEEKEND_TEMP_COLOR
        y = 6+9+1
        graphics.DrawText(OFFSCREEN_CANVAS, font, offset, y, display_color, number_str)

def drawCurrent(api_current, outdoor):
    if outdoor < 100:
        font = MEDIUM_FONT
    else:
        font = SMALL_FONT
    temp = str(int(round(outdoor))) if outdoor != -999 else str(int(round(api_current['temp'])))
    graphics.DrawText(OFFSCREEN_CANVAS, font, 55, CURRENT_BOTTOM, OUTDOOR_TEMP_COLOR, temp)

def drawIndoor(current):
    if current < 100:
        font = MEDIUM_FONT
    else:
        font = SMALL_FONT
    graphics.DrawText(OFFSCREEN_CANVAS, font, 0, CURRENT_BOTTOM, INDOOR_TEMP_COLOR, str(int(round(current))))

def createMatrix():
    options = RGBMatrixOptions()
    options.chain_length = 6 if EXTENDED_WEATHER else 2
    options.gpio_slowdown = 2
    options.brightness = MAX_BRIGHTNESS
    options.hardware_mapping = 'adafruit-hat-pwm'

    return RGBMatrix(options = options)

def weatherSetup():
    try:
        fetchData()
        #adjustBrightness()
    except Exception as e:
        log.error('fetchWeather() exception: {}'.format(traceback.format_exc()))

def fetchDataThreaded():
    x = threading.Thread(target=fetchData, args=())
    x.start()

def fetchData():
    global weather, daily_icons, indoor_temp, outdoor_temp
    if args.v:
        print('Opening DB...')
    
    conn = None
    if args.v:
        print('Starting db put')
    try:
        conn = mariadb.connect(
            user="mbutki",
            host="pi-desk",
            database="pidata"
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    conn.autocommit = True
    if args.v:
        print('Get Cursor')
    cur = conn.cursor()
    
    weather = fetchWeather(cur, args)
    daily_icons = getDailyIcons(weather)
    indoor_temp = fetchIndoorTemps(cur, args)
    outdoor_temp = fetchOutdoorTemps(cur, args)

    conn.commit()
    conn.close()

    if args.v:
        print('DB client closed')

'''
def adjustBrightnessThreaded():
    print('about to call threaded lux')
    x = threading.Thread(target=adjustBrightness, args=())
    x.start()


def adjustBrightness():
    #if args.v:
    print('Opening DB...')
    client = MongoClient(db_config['host'])
    db = client.piData

    lux = fetchLux(db, MAX_BRIGHTNESS)

    client.close()
    #if args.v:
    print('lux={}'.format(lux))
    print('Closing DB...')

    setBrightness(lux)


def setBrightness(lux):
    lux = max(lux, MIN_LUX)
    lux = min(lux, MAX_LUX)
    brightness = utils.translate(lux, MIN_LUX, MAX_LUX, MIN_BRIGHTNESS, MAX_BRIGHTNESS)
    #if args.v:
    print('LUX After Min/Max:{}'.format(lux))
    print('brightness:{}'.format(brightness))
    MATRIX.brightness = brightness
'''
if __name__ == "__main__":
    main()
