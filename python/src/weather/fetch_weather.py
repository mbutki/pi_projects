import time
import sys
import argparse
import json
import datetime
import logging as log
import os

import requests
import mariadb
from weather.weather_types import MatrixConfig
from global_types import PiConfig

parser = argparse.ArgumentParser(description="Read motion sensors and trigger alert")
parser.add_argument("-v", default=False, action="store_true", help="verbose mode")
parser.add_argument("-n", default=False, action="store_true", help="no DB write")
args = parser.parse_args()

PI_DIR = "/home/mbutki/pi_projects"
LOG_NAME = "fetch_weather.log"

pi_config: PiConfig = json.load(open(f"{PI_DIR}/pi.config"))
matrix_config: MatrixConfig = json.load(
    open(f"{PI_DIR}/python/src/weather/matrix.config")
)
LOCATION = pi_config["location"]
LOG_DIR = pi_config["log_dir"]

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
LOG_LEVEL = log.DEBUG if args.v else log.INFO
log.basicConfig(
    level=LOG_LEVEL,
    filename=f"{LOG_DIR}/{LOG_NAME}",
    format="%(asctime)s %(levelname)s %(message)s",
    filemode="a",
)
log.getLogger("requests").setLevel(log.WARNING)
log.getLogger("urllib3").setLevel(log.WARNING)

API_KEY = matrix_config["weather_API_key"]
LAT = matrix_config["weather_lat"]
LON = matrix_config["weather_lon"]


def fetch_weather():
    url = f"https://api.openweathermap.org/data/3.0/onecall?lat={LAT}&lon={LON}&appid={API_KEY}"
    if args.v:
        print("fetching: ", url)
    data = requests.get(url).json()
    return data


def ktof(k: float) -> float:
    return (k - 273.15) * 9 / 5 + 32


def icon_to_condition(icon) -> str:
    conditions = [
        [{"01d", "01n"}, "clear"],
        [{"02d", "02n"}, "light_cloud"],
        [{"03d", "03n"}, "medium_cloud"],
        [{"04d", "04n"}, "heavy_cloud"],
        [{"09d", "09n"}, "light_rain"],
        [{"10d", "10n"}, "heavy_rain"],
        [{"11d", "11n"}, "thunder"],
        [{"50n", "50d"}, "atmo"],
        [{"13d", "13n"}, "snow"],
    ]
    for item in conditions:
        if icon in item[0]:
            return item[1]
    return "unknown"


def parse_hours(raw_weather):
    hours = {}
    for item in raw_weather["hourly"]:
        epoch = str(item["dt"])
        hours[epoch] = {
            "temp": int(ktof(item["temp"])),
            "condition": icon_to_condition(item["weather"][0]["icon"]),
            "pop": int(item["pop"] * 100),
            "precipIntensity": max(
                item.get("rain", {"1h": 0})["1h"], item.get("snow", {"1h": 0})["1h"]
            ),
            "cloudCover": item["clouds"],
        }
    return hours


def parse_current(raw_weather):
    current = {
        "weather": icon_to_condition(raw_weather["current"]["weather"][0]["icon"]),
        "temp": int(ktof(raw_weather["current"]["temp"])),
        "relative_humidity": raw_weather["current"]["humidity"],
    }
    return current


def parse_days(raw_weather):
    days = {}
    for item in raw_weather["daily"]:
        epoch = str(item["dt"])
        pop = int(round(item["pop"] * 10) * 10)
        days[epoch] = {
            "high": int(ktof(item["temp"]["max"])),
            "low": int(ktof(item["temp"]["min"])),
            "condition": (
                "light_rain"
                if pop > 20
                else icon_to_condition(item["weather"][0]["icon"])
            ),
            "pop": pop,
            "pretty": item["weather"][0]["description"],
            "precipIntensity": max(item.get("rain", 0), item.get("snow", 0)),
            "moonPhase": item["moon_phase"],
            "rise": item["sunrise"],
            "set": item["sunset"],
        }
    return days


def parse_weather(raw_weather):
    weather = {}

    weather["hours"] = parse_hours(raw_weather)
    weather["current"] = parse_current(raw_weather)
    weather["days"] = parse_days(raw_weather)

    return weather


def store_weather(weather) -> None:
    if args.v:
        print("Starting db put")

    try:
        conn = mariadb.connect(user="mbutki", host="pi-desk", database="pidata")
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    if args.v:
        print("Get Cursor")
    cur = conn.cursor()
    try:
        cur.execute("DELETE FROM weather")
        if args.v:
            print("Delete Executed")
    except mariadb.Error as e:
        print(f"Error: {e}")
    conn.commit()
    try:
        cur.execute(
            "INSERT INTO weather (time, weather) VALUES (?, ?)",
            (datetime.datetime.utcnow(), json.dumps(weather)),
        )
        if args.v:
            print("Insert Executed")
    except mariadb.Error as e:
        print(f"Error: {e}")
    conn.commit()
    conn.close()

    if args.v:
        print("DB client closed")


def main():
    try:
        raw_weather = fetch_weather()
        weather = parse_weather(raw_weather)
        if args.v:
            print("DAYS:")
            for t, day in sorted(weather["days"].items()):
                print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(t))))
                print(t, day, "\n")
            print("\nHOURS:")
            for t, hour in sorted(weather["hours"].items()):
                print(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(t))))
                print(t, hour, "\n")
        if not args.n:
            store_weather(weather)

        # storeAqi(fetchAqi())

    except Exception as err:
        print(f"main error: {err}")
        log.error("main error: {err}")


if __name__ == "__main__":
    main()
