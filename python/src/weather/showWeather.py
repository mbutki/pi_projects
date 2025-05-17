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

from PIL import Image, ImageDraw
from rgbmatrix import RGBMatrix, RGBMatrixOptions, graphics

from dbReads import *
from iconUtils import *

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
POP_COLOR = graphics.Color(40, 110, 206)
CURRENT_TEMP_COLOR = graphics.Color(11, 164, 11)

# Plot Bar Lines
DAYLIGHT_BAR_COLOR = graphics.Color(30, 30, 30)
NOON_BAR_COLOR = graphics.Color(100, 100, 100)
MIDNIGHT_BAR_COLOR = graphics.Color(50, 50, 50)
TEMP_INCREMENT_LINE_COLOR = graphics.Color(40, 40, 40)

# Plot Data Points
TEMP_LINE_COLOR = graphics.Color(140, 140, 140)
POP_LINE_COLOR = graphics.Color(0, 130, 255)
CLOUD_COVER_LINE_COLOR = graphics.Color(140, 0, 0)
PERCIP_INTENSITY_LINE_COLOR = graphics.Color(134, 36, 214)

# Plot Dot Animation
RUNNER_DOT_COLOR = graphics.Color(255, 255, 255)

# AQI
AQI_GREEN_COLOR = graphics.Color(11, 164, 11)
AQI_YELLOW_COLOR = graphics.Color(210, 210, 0)
AQI_ORANGE_COLOR = graphics.Color(210, 143, 0)
AQI_RED_COLOR = graphics.Color(180, 0, 0)
AQI_PURPLE_COLOR = graphics.Color(210, 0, 210)
################## END COLORS ######################

BAR_CHART_BOTTOM = 31

BAR_MIN_TEMP = 30
if TEMP_MODE == "low":
    BAR_MIN_TEMP = 10

CURRENT_BOTTOM = 28

TICK_DUR = 0.25
READ_WEATHER_SECS = 60 * 5
READ_LUX_SECS = 10

CLOCK_COLOR = graphics.Color(170, 170, 170)

MEDIUM_FONT = graphics.Font()
SMALL_FONT = graphics.Font()
MEDIUM_FONT.LoadFont(WEATHER_DIR + '/fonts/5x7_mike.bdf')
SMALL_FONT.LoadFont(WEATHER_DIR + '/fonts/4x6_mike_bigger.bdf')

#### GLOBALS ####
OFFSCREEN_CANVAS = MATRIX = None
weather = daily_icons = indoor_temp = outdoor_temp = lux = None
outdoorAqi = indoorAqi = None
#################

def main():
    global OFFSCREEN_CANVAS
    global MATRIX

    MATRIX = createMatrix()
    OFFSCREEN_CANVAS = MATRIX.CreateFrameCanvas()

    weatherSetup() # Blocking fetch of weather data

    tick = 0
    while True:
        OFFSCREEN_CANVAS.Clear()
        drawWeather(tick)
        drawClock(tick)
        drawDate(tick)
        #drawAqi(tick)

        OFFSCREEN_CANVAS = MATRIX.SwapOnVSync(OFFSCREEN_CANVAS)
        time.sleep(TICK_DUR)
        tick += 1
        if tick == sys.maxsize:
            tick = 0
'''
def drawAqi(tick):
    global indoorAqi
    global outdoorAqi
    if tick == 0 or (tick % (READ_WEATHER_SECS * ( 1 / TICK_DUR))) == 0:
        client = MongoClient(db_config['host'])
        db = client.piData
        outdoorAqi = fetchOutdoorAqi(db)
        indoorAqi = fetchIndoorAqi(db)
        client.close()

    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, 64+8, 13, aqiColor(outdoorAqi), 'O AQI:' + str(outdoorAqi))
    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, 64+8, 25, aqiColor(indoorAqi), 'I AQI:' + str(indoorAqi))
'''
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

def drawClock(tick):
    now = datetime.datetime.now()
    timeStr = now.strftime("%-I:%M:%S")
    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, (64*2)+9, 13+11, CLOCK_COLOR, timeStr)

def drawDate(tick):
    now = datetime.datetime.now()
    timeStr = now.strftime("%-m/%-d/%y")
    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, (64*2)+13, 13, CLOCK_COLOR, timeStr)

def drawWeather(tick):
    try:
        updateData(tick)

        new_frame = Image.new('RGBA', (64,32))
        drawDailyIcons(daily_icons, new_frame, tick, weather)
        new_frame = new_frame.convert('RGB')
        OFFSCREEN_CANVAS.SetImage(new_frame, 0, 0)

        drawDailyText(weather)
        drawCurrent(weather['current'], outdoor_temp)
        drawIndoor(indoor_temp)
        drawGraph(weather, tick)
    except Exception as e:
        if args.v:
            print(('main() exception: {}'.format(traceback.format_exc())))
        log.error('main() exception: {}'.format(traceback.format_exc()))

def updateData(tick):
    if (tick % (READ_WEATHER_SECS * ( 1 / TICK_DUR))) == 0:
        try:
            fetchDataThreaded()
        except Exception as e:
            log.error('fetchWeather() threaded exception: {}'.format(traceback.format_exc()))

    if (tick % (READ_LUX_SECS * ( 1 / TICK_DUR))) == 0:
        try:
            #adjustBrightnessThreaded()
            pass
        except Exception as e:
            log.error('fetchLux() threaded exception: {}'.format(traceback.format_exc()))

def drawGraph(weather, tick):
    TEMP_DIV = 5.0
    POP_DIV = 7.0
    PERCIP_INTENSITY_DIV = 0.02
    MAX_PERCIP_INTENSITY = 0.3
    CHART_WIDTH = 44
    BAR_LEFT = 10

    horizontal_temps = [40, 60, 80, 100]
    if TEMP_MODE == "low":
        horizontal_temps = [20, 40, 60, 80]
    epochs = sorted(weather['hours'].keys())[:CHART_WIDTH]

    drawDaylight(epochs, weather, BAR_LEFT, TEMP_DIV)

    drawHorBars(horizontal_temps, TEMP_DIV, BAR_LEFT, CHART_WIDTH)
    drawVertBars(epochs, weather, BAR_LEFT)
    drawCloudCoverLine(epochs, weather, POP_DIV, BAR_LEFT)
    drawTempLine(epochs, weather, TEMP_DIV, BAR_LEFT, CHART_WIDTH, tick)
    drawPercipIntensityLine(epochs, weather, PERCIP_INTENSITY_DIV, BAR_LEFT, MAX_PERCIP_INTENSITY)
    drawPopLine(epochs, weather, POP_DIV, BAR_LEFT)

def drawDailyIcons(daily_icons, new_frame, tick, weather):
    for j, icons in enumerate(daily_icons):
        for icon in icons:
            offset = 0
            if j > 0:
                offset = j * 13
            else:
                offset = 0
            this_day_frame_index = (tick + j*4) % len(icon)
            new_frame.paste(icon[this_day_frame_index], (offset,0), icon[this_day_frame_index])

def drawDailyText(weather):
    for j, epoch in enumerate(sorted(weather['days'])[:5]):
        dt =  datetime.datetime.fromtimestamp(float(epoch))
        day = weather['days'][epoch]
        offset = 0
        if j > 0:
            offset = 1+(j*13)
        else:
            offset = 1

        display_num = 0
        display_color = None
        if day['pop'] == 100 and PERFER_RAIN_POP:
            display_color = POP_COLOR
            display_num = day['pop']
            font = SMALL_FONT
        elif day['pop'] > 20 and PERFER_RAIN_POP:
            display_color = POP_COLOR
            display_num = day['pop']
            font = MEDIUM_FONT
        else:
            display_color = DAY_TEMP_COLOR
            display_num = day['high']
            font = MEDIUM_FONT
        
        number_str = str(display_num)

        if len(number_str) == 1:
            offset += 0
        elif len(number_str) == 2:
            offset += 0
        elif len(number_str) == 3:
            offset -= 1
            
        y = 6+9+2
        if display_num >= 100:
            font = SMALL_FONT
        graphics.DrawText(OFFSCREEN_CANVAS, font, offset, y, display_color, number_str)

        if dt.weekday() == 5 or dt.weekday() == 6:
            graphics.DrawLine(OFFSCREEN_CANVAS, offset-2, 12, offset-2 , 15, CURRENT_TEMP_COLOR)
        if dt.weekday() == 0:
            graphics.DrawLine(OFFSCREEN_CANVAS, offset-3, 12, offset-3 , 15, CURRENT_TEMP_COLOR)

def drawCurrent(current, outdoor):
    if outdoor < 100:
        font = MEDIUM_FONT
    else:
        font = SMALL_FONT
    temp = str(int(round(outdoor))) if outdoor != -999 else str(int(round(current['temp'])))
    graphics.DrawText(OFFSCREEN_CANVAS, font, 0, CURRENT_BOTTOM, CURRENT_TEMP_COLOR, temp)

def drawIndoor(current):
    if current < 100:
        font = MEDIUM_FONT
    else:
        font = SMALL_FONT
    graphics.DrawText(OFFSCREEN_CANVAS, font, 55, CURRENT_BOTTOM, CURRENT_TEMP_COLOR, str(int(round(current))))

def drawDaylight(epochs, weather, BAR_LEFT, TEMP_DIV):
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]
        riseTime = weather['days'][sorted(weather['days'])[0]]['rise']
        setTime = weather['days'][sorted(weather['days'])[0]]['set']
        sun_rise = datetime.datetime.fromtimestamp(riseTime).hour
        sun_set = datetime.datetime.fromtimestamp(setTime).hour
        dt =  datetime.datetime.fromtimestamp(float(epoch))
        column = BAR_LEFT + i

        # Only Area under the curve
        temp = int(round( (hour['temp'] - BAR_MIN_TEMP) / TEMP_DIV ))
        temp_y2 = BAR_CHART_BOTTOM - temp

        if dt.hour >= sun_rise and dt.hour <= sun_set:
            #graphics.DrawLine(OFFSCREEN_CANVAS, column, BAR_CHART_BOTTOM, column, temp_y2 + 1, DAYLIGHT_BAR_COLOR)
            graphics.DrawLine(OFFSCREEN_CANVAS, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, DAYLIGHT_BAR_COLOR)

def drawHorBars(horizontal_temps, TEMP_DIV, BAR_LEFT, CHART_WIDTH):
    for h_temp in horizontal_temps:
        y = BAR_CHART_BOTTOM - ((h_temp - BAR_MIN_TEMP) / TEMP_DIV)
        y = int(y)
        graphics.DrawLine(OFFSCREEN_CANVAS, BAR_LEFT, y, BAR_LEFT + CHART_WIDTH - 1, y, TEMP_INCREMENT_LINE_COLOR)

def drawVertBars(epochs, weather, BAR_LEFT):
    for i, epoch in enumerate(epochs):
        column = BAR_LEFT + i
        dt =  datetime.datetime.fromtimestamp(float(epoch))

        if dt.hour == 12:
            graphics.DrawLine(OFFSCREEN_CANVAS, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, NOON_BAR_COLOR)
        if dt.hour == 0:
            graphics.DrawLine(OFFSCREEN_CANVAS, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, MIDNIGHT_BAR_COLOR)

def drawTempLine(epochs, weather, TEMP_DIV, BAR_LEFT, CHART_WIDTH, tick):
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]

        prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
        dt =  datetime.datetime.fromtimestamp(float(epoch))

        temp = int(round( (hour['temp'] - BAR_MIN_TEMP) / TEMP_DIV ))

        prev_temp = None
        if prev_hour:
            prev_temp = int(round( (prev_hour['temp'] - BAR_MIN_TEMP) / TEMP_DIV ))

        column = BAR_LEFT + i
        temp_y2 = BAR_CHART_BOTTOM - temp
        prev_temp_y2 = BAR_CHART_BOTTOM - prev_temp if prev_temp else None

        # Temperature Line
        if i != tick % CHART_WIDTH:
            base_temp = 80
            low_temp = 50
            OFFSCREEN_CANVAS.SetPixel(column, temp_y2, TEMP_LINE_COLOR.red, TEMP_LINE_COLOR.green, TEMP_LINE_COLOR.blue)

            if prev_temp:
                drawConnectingLine(prev_temp, temp, prev_temp_y2, temp_y2, column, TEMP_LINE_COLOR)

        # Animated Dot
        if i == tick % CHART_WIDTH:
            OFFSCREEN_CANVAS.SetPixel(column, temp_y2, RUNNER_DOT_COLOR.red, RUNNER_DOT_COLOR.green, RUNNER_DOT_COLOR.blue)

def drawCloudCoverLine(epochs, weather, POP_DIV, BAR_LEFT):
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]

        prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
        dt =  datetime.datetime.fromtimestamp(float(epoch))

        pop = int(round(hour['cloudCover'] / POP_DIV)) - 1
        prev_pop = int(round( prev_hour['cloudCover'] / POP_DIV )) - 1 if prev_hour else None

        column = BAR_LEFT + i
        pop_y2 = BAR_CHART_BOTTOM - pop
        prev_pop_y2 = BAR_CHART_BOTTOM - prev_pop if prev_pop else None

        if True:
            OFFSCREEN_CANVAS.SetPixel(column, pop_y2, CLOUD_COVER_LINE_COLOR.red, CLOUD_COVER_LINE_COLOR.green, CLOUD_COVER_LINE_COLOR.blue)
            if prev_pop:
                drawConnectingLine(prev_pop, pop, prev_pop_y2, pop_y2, column, CLOUD_COVER_LINE_COLOR)

def drawPopLine(epochs, weather, POP_DIV, BAR_LEFT):
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]

        prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
        dt =  datetime.datetime.fromtimestamp(float(epoch))

        pop = int(round(hour['pop'] / POP_DIV)) - 1
        prev_pop = int(round( prev_hour['pop'] / POP_DIV )) - 1 if prev_hour else None

        column = BAR_LEFT + i
        pop_y2 = BAR_CHART_BOTTOM - pop
        prev_pop_y2 = BAR_CHART_BOTTOM - prev_pop if prev_pop else None

        if True:
            OFFSCREEN_CANVAS.SetPixel(column, pop_y2, POP_LINE_COLOR.red, POP_LINE_COLOR.green, POP_LINE_COLOR.blue)
            if prev_pop:
                drawConnectingLine(prev_pop, pop, prev_pop_y2, pop_y2, column, POP_LINE_COLOR)

def drawPercipIntensityLine(epochs, weather, PERCIP_INTENSITY_DIV, BAR_LEFT, MAX_PERCIP_INTENSITY):
    for i, epoch in enumerate(epochs):
        hour = weather['hours'][epoch]

        prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
        dt =  datetime.datetime.fromtimestamp(float(epoch))

        # cap intensity to MAX_PERCIP_INTENSITY
        hour['precipIntensity'] = MAX_PERCIP_INTENSITY if hour['precipIntensity'] > MAX_PERCIP_INTENSITY else hour['precipIntensity'] 

        pop = int(round(hour['precipIntensity'] / PERCIP_INTENSITY_DIV)) - 1
        prev_pop = int(round( prev_hour['precipIntensity'] / PERCIP_INTENSITY_DIV )) - 1 if prev_hour else None

        column = BAR_LEFT + i
        pop_y2 = BAR_CHART_BOTTOM - pop
        prev_pop_y2 = BAR_CHART_BOTTOM - prev_pop if prev_pop else None

        if True:
            OFFSCREEN_CANVAS.SetPixel(column, pop_y2, PERCIP_INTENSITY_LINE_COLOR.red, PERCIP_INTENSITY_LINE_COLOR.green, PERCIP_INTENSITY_LINE_COLOR.blue)
            if prev_pop:
                drawConnectingLine(prev_pop, pop, prev_pop_y2, pop_y2, column, PERCIP_INTENSITY_LINE_COLOR)

def drawConnectingLine(prev, cur, prev_y2, y2, column, color):
    if prev > cur + 1:
        graphics.DrawLine(OFFSCREEN_CANVAS, column - 1, prev_y2 , column - 1, y2 - 1, color)
    elif prev < cur - 1:
        graphics.DrawLine(OFFSCREEN_CANVAS, column,     y2,     column,     prev_y2 - 1, color)

def createMatrix():
    options = RGBMatrixOptions()
    options.chain_length = 6 if EXTENDED_WEATHER else 2
    options.gpio_slowdown = 2
    options.brightness = MAX_BRIGHTNESS
    options.hardware_mapping = 'adafruit-hat'
    #options.hardware_mapping = 'adafruit-hat-pwm'

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
    #client = MongoClient(db_config['host'])
    #db = client.piData
    
    conn = None
    if args.v:
        print('Starting db put')
    #doc = {'time': datetime.datetime.utcnow(), 'weather': weather}
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
    indoor_temp = fetchIndoorTemps(cur)
    outdoor_temp = fetchOutdoorTemps(cur)

    conn.commit()
    conn.close()

    if args.v:
        print('DB client closed')

def adjustBrightnessThreaded():
    print('about to call threaded lux')
    x = threading.Thread(target=adjustBrightness, args=())
    x.start()

'''
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
'''

def setBrightness(lux):
    lux = max(lux, MIN_LUX)
    lux = min(lux, MAX_LUX)
    brightness = translate(lux, MIN_LUX, MAX_LUX, MIN_BRIGHTNESS, MAX_BRIGHTNESS)
    #if args.v:
    print('LUX After Min/Max:{}'.format(lux))
    print('brightness:{}'.format(brightness))
    MATRIX.brightness = brightness

if __name__ == "__main__":
    main()
