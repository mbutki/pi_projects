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
import board
import adafruit_veml7700

import src.weather.conway as conway
import src.weather.clock_date as clock_date
import src.weather.line_graph as line_graph
import src.weather.utils as utils
import src.weather.icon_utils as icon_utils
import src.weather.db_reads as db_reads
import src.weather.led_color as led_color
from global_types import PiConfig, DbConfig
from weather.weather_types import MatrixConfig
from weather.icon_utils import IconSet

parser = argparse.ArgumentParser(description="Display Weather")
parser.add_argument("-v", default=False, action="store_true", help="verbose mode")
args = parser.parse_args()

PI_DIR = "/home/mbutki/pi_projects"

db_config: DbConfig = json.load(open(f"{PI_DIR}/db.config"))
pi_config: PiConfig = json.load(open(f"{PI_DIR}/pi.config"))
matrix_config: MatrixConfig = json.load(open(f"{PI_DIR}/python/src/weather/matrix.config"))

LOG_NAME = "show_weather.log"
LOG_DIR = pi_config["log_dir"]

MAX_LUX = matrix_config["max_lux"]
MIN_LUX = matrix_config["min_lux"]
MAX_BRIGHTNESS = matrix_config["max_brightness"]
MIN_BRIGHTNESS = matrix_config["min_brightness"]

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
LOG_LEVEL = log.DEBUG if args.v else log.INFO
log.basicConfig(
    level=LOG_LEVEL,
    filename=f"{LOG_DIR}/{LOG_NAME}",
    format="%(asctime)s %(levelname)s %(message)s",
    filemode="w",
)

WEATHER_DIR = PI_DIR + "/python/src/weather"

i2c = board.I2C()  # uses board.SCL and board.SDA
veml7700 = adafruit_veml7700.VEML7700(i2c)

###################### COLORS ######################
# Number Colors
DAY_TEMP_COLOR = led_color.Color(0, 0, 205)
WEEKEND_TEMP_COLOR = led_color.Color(0.08, 1, 235)
INDOOR_TEMP_COLOR = led_color.Color(0.3, 0.8, 210)
OUTDOOR_TEMP_COLOR = led_color.Color(0.5, 0.76, 200)

# AQI
AQI_GREEN_COLOR = graphics.Color(11, 164, 11)
AQI_YELLOW_COLOR = graphics.Color(210, 210, 0)
AQI_ORANGE_COLOR = graphics.Color(210, 143, 0)
AQI_RED_COLOR = graphics.Color(180, 0, 0)
AQI_PURPLE_COLOR = graphics.Color(210, 0, 210)
################## END COLORS ######################

CURRENT_BOTTOM = 28
CONWAY_X_OFFSET = 67
CLOCK_X_OFFSET = 209

# TICK_DUR_MS is in utils.py
ICON_SPEED_MS = 100
READ_WEATHER_SECS = 5 * 60  # 5 mins
READ_LUX_SECS = 10  # 10 secs

MEDIUM_FONT = graphics.Font()
SMALL_FONT = graphics.Font()
MEDIUM_FONT.LoadFont(WEATHER_DIR + "/fonts/5x7_mike.bdf")
SMALL_FONT.LoadFont(WEATHER_DIR + "/fonts/4x6_mike_bigger.bdf")

#### GLOBALS ####
global_weather = global_daily_icons = global_indoor_temp = global_outdoor_temp = None
#################


class BrightnessAdjust:
    def __init__(self, matrix) -> None:
        self.value = 0
        self.matrix = matrix
        self.conn = None

    def run(self) -> None:
        self.adjust_brightness_threaded()

    def adjust_brightness_threaded(self) -> None:
        if args.v:
            print("about to call threaded lux")
        x = threading.Thread(target=self.adjust_brightness, args=())
        x.start()

    def adjust_brightness(self) -> None:
        while True:
            try:
                lux = veml7700.light
                if args.v:
                    print(f"lux={lux}")

                self.set_brightness(lux)
            except Exception:
                log.error(f"fetch brightness exception: {traceback.format_exc()}")

            time.sleep(0.1)

    def set_brightness(self, lux: int) -> None:
        lux = min(MAX_LUX, max(lux, MIN_LUX))
        brightness = utils.translate(
            lux, MIN_LUX, MAX_LUX, MIN_BRIGHTNESS, MAX_BRIGHTNESS
        )
        if args.v:
            print(f"LUX After Min/Max:{lux}")
            print(f"brightness:{brightness}")
        self.matrix.brightness = brightness


class Display:
    def __init__(self) -> None:
        self.matrix = self.create_matrix()
        self.canvas = self.matrix.CreateFrameCanvas()

        self.world = conway.World((139, 32), {3}, {2, 3}, 0.3, CONWAY_X_OFFSET)
        # self.world = conway.World((145,32), {3}, {2,3}, 0.3, CONWAY_X_OFFSET)
        # self.world = conway.World((81,32), {3}, {2,3}, 0.3, CONWAY_X_OFFSET)
        # self.world = conway.World((64,32), {3,6}, {2,3}, 0.3, CONWAY_X_OFFSET) # highlife
        # self.world = conway.World((5,5), {3}, {2,3}, 0.3, CONWAY_X_OFFSET) # debug blinker
        self.world.reset()

        self.clock = clock_date.Clock(MEDIUM_FONT, CLOCK_X_OFFSET)
        self.graph = line_graph.Graph()

        self.fetch_weather_sync()
        self.tick = 0

    def run(self) -> None:
        brightness = BrightnessAdjust(self.matrix)
        brightness.run()
        while True:
            start_time = time.perf_counter()

            if self.tick != 0:
                self.fetch_weather_async()
            self.canvas.Clear()
            self.draw_weather()
            self.clock.draw(self.canvas)
            self.draw_conway()
            self.canvas = self.matrix.SwapOnVSync(self.canvas)

            end_time = time.perf_counter()
            elapsed_ms = (end_time - start_time) / 1000
            sleep_ms = utils.get_tick_dur_ms() - elapsed_ms
            sleep_sec = sleep_ms / 1000
            time.sleep(sleep_sec)

            self.tick += 1
            if self.tick == sys.maxsize - 1000:
                self.tick = 0

    def fetch_weather_sync(self) -> None:
        try:
            self.fetch_data()
        except Exception:
            log.error(f"fetchWeather() exception: {traceback.format_exc()}")

    def fetch_data_threaded(self) -> None:
        x = threading.Thread(target=self.fetch_data, args=())
        x.start()

    def fetch_data(self) -> None:
        global global_weather, global_daily_icons, global_indoor_temp, global_outdoor_temp
        if args.v:
            print("Opening DB...")

        conn = None
        if args.v:
            print("Starting db put")
        try:
            conn = mariadb.connect(user="mbutki", host="pi-desk", database="pidata")
        except mariadb.Error as e:
            print(f"Error connecting to MariaDB Platform: {e}")
            sys.exit(1)

        conn.autocommit = True
        if args.v:
            print("Get Cursor")
        cur = conn.cursor()

        global_weather = db_reads.fetch_weather(cur, args)
        global_daily_icons = icon_utils.get_daily_icons(global_weather)
        global_indoor_temp = db_reads.fetch_indoor_temp(cur, args)
        global_outdoor_temp = db_reads.fetch_outdoor_temp(cur, args)

        conn.commit()
        conn.close()

        if args.v:
            print("DB client closed")

    def draw_conway(self) -> None:
        if utils.should_trigger_ms(self.tick, 100):
            self.world.advance()
            if (
                self.world.gen_state() in self.world.history
            ) or utils.should_trigger_secs(self.tick, 600):
                self.world.reset()
        self.world.draw(self.canvas)

    def aqi_color(self, aqi: int):
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

    def draw_weather(self) -> None:
        try:
            frame = Image.new("RGBA", (64, 32))
            if not global_daily_icons is None:
                self.draw_daily_icons(frame, global_daily_icons)
            self.canvas.SetImage(frame.convert("RGB"), 0, 0)

            if not global_outdoor_temp is None:
                self.draw_outdoor_temp(global_outdoor_temp)
            if not global_indoor_temp is None:
                self.draw_indoor_temp(global_indoor_temp)
            if not global_weather is None:
                self.graph.draw(self.canvas, global_weather, self.tick)
                self.draw_daily_text(global_weather)
        except Exception:
            if args.v:
                print(f"main() exception: {traceback.format_exc()}")
            log.error(f"main() exception: {traceback.format_exc()}")

    def fetch_weather_async(self) -> None:
        if utils.should_trigger_secs(self.tick, READ_WEATHER_SECS):
            try:
                self.fetch_data_threaded()
            except Exception:
                log.error(
                    f"fetchWeather() threaded exception: {traceback.format_exc()}"
                )

    def draw_daily_icons(self, frame: Image.Image, daily_icons: list[IconSet]) -> None:
        # draw using current icon frame
        for day_index, icon_set in enumerate(daily_icons):
            for icon_frame in icon_set.get_frames():
                x_offset = day_index * 13
                frame.paste(icon_frame, (x_offset, 0), icon_frame)

            # advance icon frame if needed
            if utils.should_trigger_ms(self.tick, ICON_SPEED_MS):
                icon_set.advance()

    def draw_daily_text(self, weather) -> None:
        for j, epoch in enumerate(sorted(weather["days"])[:5]):
            dt = datetime.datetime.fromtimestamp(float(epoch))
            day = weather["days"][epoch]
            offset = 0
            if j > 0:
                offset = 1 + (j * 13)
            else:
                offset = 1

            number_str = str(day["high"])
            if len(number_str) == 1:
                offset += 0
            elif len(number_str) == 2:
                offset += 0
            elif len(number_str) == 3:
                offset -= 1

            font = SMALL_FONT if day["high"] >= 100 else MEDIUM_FONT
            display_color = (
                DAY_TEMP_COLOR if not dt.weekday() in {5, 6} else WEEKEND_TEMP_COLOR
            )
            y = 6 + 9 + 1
            graphics.DrawText(
                self.canvas, font, offset, y, display_color.led(), number_str
            )

    def draw_outdoor_temp(self, outdoor_temp: float) -> None:
        font = MEDIUM_FONT if outdoor_temp < 100 else SMALL_FONT
        temp_str = (
            str(int(round(outdoor_temp))) if outdoor_temp != float("-inf") else "--"
        )
        graphics.DrawText(
            self.canvas, font, 55, CURRENT_BOTTOM, OUTDOOR_TEMP_COLOR.led(), temp_str
        )

    def draw_indoor_temp(self, indoor_temp: float) -> None:
        font = MEDIUM_FONT if indoor_temp < 100 else SMALL_FONT
        temp_str = (
            str(int(round(indoor_temp))) if indoor_temp != float("-inf") else "--"
        )
        graphics.DrawText(
            self.canvas, font, 0, CURRENT_BOTTOM, INDOOR_TEMP_COLOR.led(), temp_str
        )

    def create_matrix(self):
        options = RGBMatrixOptions()
        options.chain_length = 8
        options.gpio_slowdown = 5
        options.brightness = MAX_BRIGHTNESS
        options.hardware_mapping = "adafruit-hat-pwm"

        return RGBMatrix(options=options)


def main() -> None:
    display = Display()
    display.run()


if __name__ == "__main__":
    main()
