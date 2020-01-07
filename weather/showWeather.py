#import Image
#import ImageDraw
from PIL import Image, ImageDraw
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
import threading

#from pi_projects.security import readMotionSensors
#import  pi_projects

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'
LOG_NAME = 'show_weather.log'

db_config = json.load(open('{}/db.config'.format(PI_DIR)))
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
matrix_config = json.load(open('{}/weather/matrix.config'.format(PI_DIR)))

LOG_DIR = pi_config['log_dir']

PERFER_RAIN_POP = True if matrix_config['perfer_rain_pop'] == 'True' else False
EXTENDED_WEATHER = True if matrix_config['extended_weather'] == 'True' else False

MAX_LUX = matrix_config['max_lux']
MIN_LUX = matrix_config['min_lux']
MAX_BRIGHTNESS = matrix_config['max_brightness']
MIN_BRIGHTNESS = matrix_config['min_brightness']

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')

LIB_DIR = PI_DIR + '/displays/rpi-rgb-led-matrix/bindings/python'

HIGH_TEMP_COLOR = graphics.Color(170, 170, 170)
POP_COLOR = graphics.Color(40, 110, 206)
CURRENT_TEMP_COLOR = graphics.Color(11, 164, 11)

DAYLIGHT_BAR_COLOR = graphics.Color(15, 15, 15)
NOON_BAR_COLOR = graphics.Color(80, 80, 80)
MIDNIGHT_BAR_COLOR = graphics.Color(50, 50, 50)

TEMP_LINE_COLOR = graphics.Color(130, 130, 130)
POP_LINE_COLOR = graphics.Color(0, 130, 255)
PERCIP_INTENSITY_LINE_COLOR = graphics.Color(134, 36, 214)
TEMP_INCREMENT_LINE_COLOR = graphics.Color(40, 40, 40)

HIGH_TEMP_LINE_COLOR = graphics.Color(130, 0, 0)
LOW_TEMP_LINE_COLOR = graphics.Color(130, 130, 130)

RUNNER_DOT_COLOR = graphics.Color(255, 255, 255)

BAR_CHART_BOTTOM = 31
BAR_MIN_TEMP = 30
CURRENT_BOTTOM = 28

MATRIX = None
OFFSCREEN_CANVAS = None
TICK_DUR = 0.25

CLOCK_COLOR = graphics.Color(170, 170, 170)

MEDIUM_FONT = graphics.Font()
SMALL_FONT = graphics.Font()
MEDIUM_FONT.LoadFont(LIB_DIR + '/fonts/5x7_mike.bdf')
SMALL_FONT.LoadFont(LIB_DIR + '/fonts/4x6_mike_bigger.bdf')

def processImage(path):
    im = Image.open(path)

    frames = []
    p = im.getpalette()
    
    try:
        while True:            
            if not im.getpalette():
                im.putpalette(p)
            
            new_frame = Image.new('RGBA', im.size)
            new_frame.paste(im, (0,0), im.convert('RGBA'))
            frames.append(new_frame)
            im.seek(im.tell() + 1)
    except EOFError:
        pass

    return frames

def fetchLux(db):
    if args.v:
        print 'Fetching lux...'
    rows = db.lightNow.find({"location" : "familyRoom"}).sort('time', -1).limit(1)

    try:
        lux =  rows[0]['value']
    except:
        lux = MAX_BRIGHTNESS
    if args.v:
        print 'Fetched lux'

    return lux

def fetchWeather(db):
    if args.v:
        print 'Fetching weather...'
    rows = db.weather.find({}).sort('time', -1).limit(1)

    weather =  rows[0]['weather']
    if args.v:
        print 'Fetched weather'

    return weather

def fetchIndoorTemps(db):
    temp = 0
    rows = db.temp.find({"location" : "familyRoom"}).sort('time', -1).limit(1)
    try:
        temp = rows[0]['value']
    except:
        pass

    return temp

def fetchOutdoorTemps(db):
    temp = 0
    rows = db.temp.find({"location" : "frontDoor"}).sort('time', -1).limit(1)
    try:
        temp = rows[0]['value']
    except:
        temp = -999

    return temp

def getMoonPhaseIcon(phase):
    if phase < 0.125:
        return NEW_MOON
    elif phase < 0.25:
        return CRESCENT_MOON
    elif phase < 0.375:
        return QUARTER_MOON
    elif phase < 0.5:
        return GIBBOUS_MOON
    elif phase < 0.625:
        return FULL_MOON
    elif phase < 0.75:
        return GIBBOUS_MOON
    elif phase < 0.875:
        return QUARTER_MOON
    elif phase < 1:
        return CRESCENT_MOON
    

def getDailyIcons(weather):
    global UNKNOWN
    global RAIN
    global TEXT_TO_ICON_DAY
    global TEXT_TO_ICON_NIGHT

    daily_icons = []
    for i, epoch in enumerate(sorted(weather['days'])):
        day = weather['days'][epoch]
        condition = day['condition']
        icons = []

        now = datetime.datetime.now()
        sun_rise = datetime.datetime.fromtimestamp(day['rise'])
        sun_set = datetime.datetime.fromtimestamp(day['set'])
        if i == 0 and (now > sun_set):
            # night time
            icons = [getMoonPhaseIcon(day['moonPhase'])]
        else:
            # daytime
            icons = TEXT_TO_ICON_DAY[condition] if condition in TEXT_TO_ICON_DAY else [UNKNOWN]
        daily_icons.append(icons)
    return daily_icons

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
    global HIGH_TEMP_COLOR
    global POP_COLOR

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
            display_color = HIGH_TEMP_COLOR
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
        graphics.DrawText(OFFSCREEN_CANVAS, font, offset, y, display_color, number_str)

        if dt.weekday() == 5 or dt.weekday() == 6:
            graphics.DrawLine(OFFSCREEN_CANVAS, offset-2, 12, offset-2 , 15, CURRENT_TEMP_COLOR)
        if dt.weekday() == 0:
            graphics.DrawLine(OFFSCREEN_CANVAS, offset-3, 12, offset-3 , 15, CURRENT_TEMP_COLOR)

def drawCurrent(current, outdoor):
    temp = str(int(round(outdoor))) if outdoor != -999 else str(int(round(current['temp'])))
    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, 0, CURRENT_BOTTOM, CURRENT_TEMP_COLOR, temp)

def drawIndoor(current):
    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, 55, CURRENT_BOTTOM, CURRENT_TEMP_COLOR, str(int(round(current))))


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
            graphics.DrawLine(OFFSCREEN_CANVAS, column, BAR_CHART_BOTTOM, column, temp_y2 + 1, DAYLIGHT_BAR_COLOR)
            #graphics.DrawLine(offscreen_canvas, column, BAR_CHART_BOTTOM, column, BAR_CHART_BOTTOM - 14, DAYLIGHT_BAR_COLOR)

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
            if hour['temp'] >= base_temp:
                OFFSCREEN_CANVAS.SetPixel(column, temp_y2, HIGH_TEMP_LINE_COLOR.red, HIGH_TEMP_LINE_COLOR.green, HIGH_TEMP_LINE_COLOR.blue)
            elif hour['temp'] <= low_temp:
                OFFSCREEN_CANVAS.SetPixel(column, temp_y2, LOW_TEMP_LINE_COLOR.red, LOW_TEMP_LINE_COLOR.green, LOW_TEMP_LINE_COLOR.blue)
            else:
                OFFSCREEN_CANVAS.SetPixel(column, temp_y2, TEMP_LINE_COLOR.red, TEMP_LINE_COLOR.green, TEMP_LINE_COLOR.blue)

            if prev_temp:
                drawConnectingLine(prev_temp, temp, prev_temp_y2, temp_y2, column, TEMP_LINE_COLOR)

        # Animated Dot
        if i == tick % CHART_WIDTH:
            OFFSCREEN_CANVAS.SetPixel(column, temp_y2, RUNNER_DOT_COLOR.red, RUNNER_DOT_COLOR.green, RUNNER_DOT_COLOR.blue)

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

def drawBars(weather, tick):
    TEMP_DIV = 5.0
    POP_DIV = 7.0
    PERCIP_INTENSITY_DIV = 0.02
    MAX_PERCIP_INTENSITY = 0.3
    CHART_WIDTH = 44
    BAR_LEFT = 10

    horizontal_temps = [40, 60, 80, 100]
    epochs = sorted(weather['hours'].keys())[:CHART_WIDTH]

    drawDaylight(epochs, weather, BAR_LEFT, TEMP_DIV)

    drawHorBars(horizontal_temps, TEMP_DIV, BAR_LEFT, CHART_WIDTH)
    drawVertBars(epochs, weather, BAR_LEFT)
    drawTempLine(epochs, weather, TEMP_DIV, BAR_LEFT, CHART_WIDTH, tick)
    drawPopLine(epochs, weather, POP_DIV, BAR_LEFT)
    drawPercipIntensityLine(epochs, weather, PERCIP_INTENSITY_DIV, BAR_LEFT, MAX_PERCIP_INTENSITY)

def drawConnectingLine(prev, cur, prev_y2, y2, column, color):
    if prev > cur + 1:
        graphics.DrawLine(OFFSCREEN_CANVAS, column - 1, prev_y2 , column - 1, y2 - 1, color)
    elif prev < cur - 1:
        graphics.DrawLine(OFFSCREEN_CANVAS, column,     y2,     column,     prev_y2 - 1, color)

def fetchDataThreaded():
    x = threading.Thread(target=fetchData, args=())
    x.start()

def fetchData():
    global weather, daily_icons, indoor_temp, outdoor_temp
    if args.v:
        print 'Opening DB...'
    client = MongoClient(db_config['host'])
    db = client.piData

    weather = fetchWeather(db)
    daily_icons = getDailyIcons(weather)
    indoor_temp = fetchIndoorTemps(db)
    outdoor_temp = fetchOutdoorTemps(db)

    client.close()
    if args.v:
        print 'Closing DB...'

    return weather, daily_icons, indoor_temp, outdoor_temp

def fetchLuxDataThreaded():
    x = threading.Thread(target=fetchLuxData, args=())
    x.start()

def fetchLuxData():
    if args.v:
        print 'Opening DB...'
    client = MongoClient(db_config['host'])
    db = client.piData

    lux = fetchLux(db)

    client.close()
    if args.v:
        print 'lux={}'.format(lux)
        print 'Closing DB...'

    setBrightness(lux)

def translate(value, leftMin, leftMax, rightMin, rightMax):
    # Figure out how 'wide' each range is
    print value
    print leftMin
    print leftMax
    print rightMin
    print rightMax
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin

    print float(value - leftMin)
    print float(leftSpan)
    # Convert the left range into a 0-1 range (float)
    valueScaled = float(value - leftMin) / float(leftSpan)

    # Convert the 0-1 range into a value in the right range.
    return rightMin + (valueScaled * rightSpan)

def setBrightness(lux):
    global MATRIX
    lux = max(lux, MIN_LUX)
    lux = min(lux, MAX_LUX)
    brightness = translate(lux, MIN_LUX, MAX_LUX, MIN_BRIGHTNESS, MAX_BRIGHTNESS)
    if args.v:
        print 'LUX:{}'.format(lux)
        print 'brightness:{}'.format(brightness)
    MATRIX.brightness = brightness

def createMatrix():
    global MATRIX

    options = RGBMatrixOptions()
    options.chain_length = 6 if EXTENDED_WEATHER else 2
    options.gpio_slowdown = 2
    options.brightness = MAX_BRIGHTNESS
    options.hardware_mapping = 'adafruit-hat-pwm'

    MATRIX = RGBMatrix(options = options)

def main():
    global OFFSCREEN_CANVAS

    createMatrix()
    OFFSCREEN_CANVAS = MATRIX.CreateFrameCanvas()

    weatherSetup()

    tick = 0
    while True:
        OFFSCREEN_CANVAS.Clear()
        drawWeather(tick)
        drawClock(tick)

        OFFSCREEN_CANVAS = MATRIX.SwapOnVSync(OFFSCREEN_CANVAS)
        time.sleep(TICK_DUR)
        tick += 1
        if tick == sys.maxint:
            tick = 0
def drawClock(tick):
    now = datetime.datetime.now()
    timeStr = now.strftime("%-I:%M:%S")
    graphics.DrawText(OFFSCREEN_CANVAS, MEDIUM_FONT, 64+13, 32/2, CLOCK_COLOR, timeStr)

def weatherSetup():
    global RAIN
    global SUN 
    global CLOUD
    global MOSTLY_CLOUD
    global MOSTLY_SUN 
    global UNKNOWN

    global NEW_MOON
    global CRESCENT_MOON
    global QUARTER_MOON
    global GIBBOUS_MOON
    global FULL_MOON

    global TEXT_TO_ICON_DAY
    global TEXT_TO_ICON_NIGHT

    RAIN = processImage(LIB_DIR + '/imgs/rain.gif')
    SUN = processImage(LIB_DIR + '/imgs/sun.gif')
    CLOUD = processImage(LIB_DIR + '/imgs/cloud.gif')
    MOSTLY_CLOUD = processImage(LIB_DIR + '/imgs/mostly_cloud.gif')
    MOSTLY_SUN = processImage(LIB_DIR + '/imgs/mostly_sun.gif')
    UNKNOWN = processImage(LIB_DIR + '/imgs/unknown.gif')

    NEW_MOON = processImage(LIB_DIR + '/imgs/new_moon.gif')
    CRESCENT_MOON = processImage(LIB_DIR + '/imgs/crescent_moon.gif')
    QUARTER_MOON = processImage(LIB_DIR + '/imgs/quarter_moon.gif')
    GIBBOUS_MOON = processImage(LIB_DIR + '/imgs/gibbous_moon.gif')
    FULL_MOON = processImage(LIB_DIR + '/imgs/full_moon.gif')

    JUST_CLOUDS = processImage(LIB_DIR + '/imgs/just_clouds.gif')
    JUST_CLOUDS_NIGHT = processImage(LIB_DIR + '/imgs/just_clouds_night.gif')

    TEXT_TO_ICON_DAY = {
        'clear-day': [SUN],
        'clear-night': [SUN],
        'wind': [SUN],
        'fog': [CLOUD],
        'cloudy': [CLOUD],
        'partly-cloudy-day': [SUN, JUST_CLOUDS],
        'partly-cloudy-night': [SUN, JUST_CLOUDS],
        'rain': [RAIN],
        'snow': [RAIN],
        'sleet': [RAIN]
    }

    TEXT_TO_ICON_NIGHT = {
        'clear-day': [],
        'clear-night': [],
        'wind': [],
        'fog': [CLOUD],
        'cloudy': [CLOUD],
        'partly-cloudy-day': [],
        'partly-cloudy-night': [],
        #'partly-cloudy-day': [JUST_CLOUDS_NIGHT],
        #'partly-cloudy-night': [JUST_CLOUDS_NIGHT],
        'rain': [RAIN],
        'snow': [RAIN],
        'sleet': [RAIN]
    }

    global weather, daily_icons, indoor_temp, outdoor_temp
    try:
        weather, daily_icons, indoor_temp, outdoor_temp = fetchData()
        fetchLuxData()
    except Exception as e:
        log.error('fetchWeather() exception: {}'.format(traceback.format_exc()))

weather = daily_icons = indoor_temp = outdoor_temp = lux = None
def drawWeather(tick):
    global weather, daily_icons, indoor_temp, outdoor_temp
    try:
        if (tick % (60 * 5 * ( 1 / TICK_DUR))) == 0:
            try:
                weather, daily_icons, indoor_temp, outdoor_temp = fetchDataThreaded()
            except Exception as e:
                log.error('fetchWeather() exception: {}'.format(traceback.format_exc()))

        if (tick % (10 * ( 1 / TICK_DUR))) == 0:
            try:
                fetchLuxDataThreaded()
                pass
            except Exception as e:
                log.error('fetchWeather() exception: {}'.format(traceback.format_exc()))

        new_frame = Image.new('RGBA', (64,32))
        #daily_icons = [[NEW_MOON], [CRESCENT_MOON ], [QUARTER_MOON ], [GIBBOUS_MOON], [FULL_MOON]]
        drawDailyIcons(daily_icons, new_frame, tick, weather)
        new_frame = new_frame.convert('RGB')
        OFFSCREEN_CANVAS.SetImage(new_frame, 0, 0)

        drawDailyText(weather)
        drawCurrent(weather['current'], outdoor_temp)
        drawIndoor(indoor_temp)
        drawBars(weather, tick)
    except Exception as e:
        if args.v:
            print('main() exception: {}'.format(traceback.format_exc()))
        log.error('main() exception: {}'.format(traceback.format_exc()))

if __name__ == "__main__":
    main()
