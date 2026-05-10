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

with open(f"{PI_DIR}/pi.config", encoding="utf-8") as f:
    pi_config: PiConfig = json.load(f)

with open(f"{PI_DIR}/python/src/weather/matrix.config", encoding="utf-8") as f:
    matrix_config: MatrixConfig = json.load(f)

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
    # Using the Pirate Weather Forecast API (Dark Sky compatible)
    url = f"https://api.pirateweather.net/forecast/{API_KEY}/{LAT},{LON}?units=us"
    if args.v:
        print("fetching: ", url)
    response = requests.get(url)
    response.raise_for_status()
    return response.json()


def icon_to_condition(icon) -> str:
    conditions = [
        [{"clear-day", "clear-night"}, "clear"],
        [{"partly-cloudy-day", "partly-cloudy-night"}, "light_cloud"],
        [{"cloudy"}, "heavy_cloud"],
        [{"rain"}, "light_rain"],
        [{"thunderstorm"}, "thunder"],
        [{"fog", "wind"}, "atmo"],
        [{"snow", "sleet"}, "snow"],
    ]
    for item in conditions:
        if icon is None:
            break
        if icon in item[0]:
            return item[1]
    return "unknown"


def parse_hours(raw_weather):
    hours = {}
    for item in raw_weather["hourly"]["data"]:
        epoch = str(item["time"])
        hours[epoch] = {
            "temp": int(item["temperature"]),
            "condition": icon_to_condition(item.get("icon")),
            "pop": int(item.get("precipProbability", 0) * 100),
            "precipIntensity": item.get("precipIntensity", 0),
            "cloudCover": int(item.get("cloudCover", 0) * 100),
        }
    return hours


def parse_current(raw_weather):
    current = {
        "weather": icon_to_condition(raw_weather["currently"].get("icon")),
        "temp": int(raw_weather["currently"]["temperature"]),
        "relative_humidity": int(raw_weather["currently"].get("humidity", 0) * 100),
    }
    return current


def parse_days(raw_weather):
    days = {}
    for item in raw_weather["daily"]["data"]:
        epoch = str(item["time"])
        pop = int(round(item.get("precipProbability", 0) * 10) * 10)
        days[epoch] = {
            "high": int(item["temperatureHigh"]),
            "low": int(item["temperatureLow"]),
            "condition": (
                "light_rain" if pop > 20 else icon_to_condition(item.get("icon"))
            ),
            "pop": pop,
            "pretty": item.get("summary", ""),
            "precipIntensity": item.get("precipIntensity", 0),
            "moonPhase": item.get("moonPhase", 0),
            "rise": item["sunriseTime"],
            "set": item["sunsetTime"],
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
            (datetime.datetime.now(datetime.timezone.utc), json.dumps(weather)),
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
