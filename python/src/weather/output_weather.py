import sys
import argparse
import traceback
import json
import logging as log
from pprint import pprint

import mariadb

from weather import icon_utils
from weather import db_reads
from weather.weather_types import MatrixConfig
from global_types import PiConfig, DbConfig

parser = argparse.ArgumentParser(description="Display Weather")
parser.add_argument("-v", default=False, action="store_true", help="verbose mode")
args = parser.parse_args()

PI_DIR = "/home/mbutki/pi_projects"

with open(f"{PI_DIR}/db.config", encoding="utf-8") as f:
    db_config: DbConfig = json.load(f)
with open(f"{PI_DIR}/pi.config", encoding="utf-8") as f:
    pi_config: PiConfig = json.load(f)
with open(f"{PI_DIR}/python/src/weather/matrix.config", encoding="utf-8") as f:
    matrix_config: MatrixConfig = json.load(f)

LOG_NAME = "show_weather.log"
LOG_DIR = pi_config["log_dir"]

WEATHER_DIR = PI_DIR + "/python/src/weather"

# TICK_DUR_MS is in utils.py
ICON_SPEED_MS = 100
READ_WEATHER_SECS = 5 * 60  # 5 mins
READ_LUX_SECS = 10  # 10 secs


class Display:
    def __init__(self) -> None:
        self.fetch_weather_sync()

    def fetch_weather_sync(self) -> None:
        try:
            self.fetch_data()
        except Exception:
            log.error(f"fetchWeather() exception: {traceback.format_exc()}")

    def fetch_data(self) -> None:
        conn = None
        try:
            conn = mariadb.connect(user="mbutki", host="pi-desk", database="pidata")
        except mariadb.Error as e:
            print(f"Error connecting to MariaDB Platform: {e}")
            sys.exit(1)

        conn.autocommit = True
        cur = conn.cursor()

        weather = db_reads.fetch_weather(cur, args)
        daily_icons = icon_utils.get_daily_icons(weather)
        indoor_temp = db_reads.fetch_indoor_temp(cur, args)
        outdoor_temp = db_reads.fetch_outdoor_temp(cur, args)

        pprint(f"weather:{weather}", indent=4)
        pprint(f"daily_icons:{daily_icons}")
        pprint(f"indoor_temp:{indoor_temp}")
        pprint(f"outdoor_temp:{outdoor_temp}")

        conn.commit()
        conn.close()


def main() -> None:
    Display()


if __name__ == "__main__":
    main()
