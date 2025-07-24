import os
import time
import sys
import argparse
import datetime
import threading
import traceback
import json
import logging as log

import mariadb
from PIL import Image, ImageDraw
from rgbmatrix import RGBMatrix, RGBMatrixOptions, graphics

import conway
import clock_date
import line_graph
import utils
import icon_utils
import db_reads


parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'

db_config = json.load(open(f'{PI_DIR}/db.config'))
pi_config = json.load(open(f'{PI_DIR}/pi.config'))
matrix_config = json.load(open(f'{PI_DIR}/python/src/weather/matrix.config'))

LOG_NAME = 'show_weather.log'
LOG_DIR = pi_config['log_dir']

PERFER_RAIN_POP = matrix_config['perfer_rain_pop'] == 'True'
EXTENDED_WEATHER = matrix_config['extended_weather'] == 'True'

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
global_weather = global_daily_icons = global_indoor_temp = global_outdoor_temp = None
#################

class Display():
    def __init__(self):
        self.matrix = self.create_matrix()
        self.canvas = self.matrix.CreateFrameCanvas()

        self.world = conway.World((64,32), {3}, {2,3}, 0.3, CONWAY_X_OFFSET)
        self.world.reset()
        #world = World((64,32), {3,6}, {2,3}, 0.3) # highlife
        #world = World((5,5), {3}, {2,3}, 0.3) # debug blinker

        self.clock = clock_date.Clock(MEDIUM_FONT, (64 * 2) + 9)
        self.graph = line_graph.Graph()

        self.fetch_weather_sync()
        self.tick = 0

    def run(self):
        while True:
            if self.tick != 0:
                self.fetch_weather_async()

            self.canvas.Clear()
            self.draw_weather()
            self.clock.draw(self.canvas)
            self.draw_conway()

            self.canvas = self.matrix.SwapOnVSync(self.canvas)
            time.sleep(utils.get_tick_dur_ms() / 1000)
            self.tick += 1
            if self.tick == sys.maxsize - 1000:
                self.tick = 0
    
    def fetch_weather_sync(self):
        try:
            self.fetch_data()
            #adjustBrightness()
        except Exception as e:
            log.error('fetchWeather() exception: {}'.format(traceback.format_exc()))

    def fetch_data_threaded(self):
        x = threading.Thread(target=self.fetch_data, args=())
        x.start()

    def fetch_data(self):
        global global_weather, global_daily_icons, global_indoor_temp, global_outdoor_temp
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
        
        global_weather = db_reads.fetchWeather(cur, args)
        global_daily_icons = icon_utils.getDailyIcons(global_weather)
        global_indoor_temp = db_reads.fetchIndoorTemps(cur, args)
        global_outdoor_temp = db_reads.fetchOutdoorTemps(cur, args)

        conn.commit()
        conn.close()

        if args.v:
            print('DB client closed')

    def draw_conway(self):
        if utils.should_trigger_ms(self.tick, 100):
            self.world.advance()
        self.world.draw(self.canvas)
        
        if (self.world.gen_state() in self.world.history) or utils.should_trigger_secs(self.tick, 600):
            self.world.reset()

    def aqi_color(self, aqi):
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

    def draw_weather(self):
        try:
            frame = Image.new('RGBA', (64,32))
            self.draw_daily_icons(frame, global_daily_icons)
            self.canvas.SetImage(frame.convert('RGB'), 0, 0)
            
            self.draw_current(global_weather['current'], global_outdoor_temp)
            self.draw_indoor(global_indoor_temp)
            self.graph.draw(self.canvas, global_weather, self.tick)
            self.draw_daily_text(global_weather)
        except Exception:
            if args.v:
                print(f'main() exception: {traceback.format_exc()}')
            log.error(f'main() exception: {traceback.format_exc()}')

    def fetch_weather_async(self):
        if utils.should_trigger_secs(self.tick, READ_WEATHER_SECS):
            try:
                self.fetch_data_threaded()
            except Exception:
                log.error(f'fetchWeather() threaded exception: {traceback.format_exc()}')

    def draw_daily_icons(self, frame, daily_icons):
        # draw using current icon frame
        for day_index, icon_set in enumerate(daily_icons):
            for icon_frame in icon_set.get_frames():
                x_offset = day_index * 13
                frame.paste(icon_frame, (x_offset,0), icon_frame)

            # advance icon frame if needed
            if utils.should_trigger_ms(self.tick, ICON_SPEED_MS):
                icon_set.advance()

    def draw_daily_text(self, weather):
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
            graphics.DrawText(self.canvas, font, offset, y, display_color, number_str)

    def draw_current(self, api_outdoor_temp, local_outdoor_temp):
        if local_outdoor_temp < 100:
            font = MEDIUM_FONT
        else:
            font = SMALL_FONT
        temp = str(int(round(local_outdoor_temp))) if local_outdoor_temp != -999 else str(int(round(api_outdoor_temp['temp'])))
        graphics.DrawText(self.canvas, font, 55, CURRENT_BOTTOM, OUTDOOR_TEMP_COLOR, temp)

    def draw_indoor(self, indoor_temp):
        if indoor_temp < 100:
            font = MEDIUM_FONT
        else:
            font = SMALL_FONT
        graphics.DrawText(self.canvas, font, 0, CURRENT_BOTTOM, INDOOR_TEMP_COLOR, str(int(round(indoor_temp))))

    def create_matrix(self):
        options = RGBMatrixOptions()
        options.chain_length = 6 if EXTENDED_WEATHER else 2
        options.gpio_slowdown = 2
        options.brightness = MAX_BRIGHTNESS
        options.hardware_mapping = 'adafruit-hat-pwm'

        return RGBMatrix(options = options)

def main():
    display = Display()
    display.run()

if __name__ == "__main__":
    main()

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
    self.matrix.brightness = brightness
'''