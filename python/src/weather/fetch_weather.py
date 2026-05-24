import time
import sys
import argparse
import json
from datetime import datetime, date, timedelta, timezone
from zoneinfo import ZoneInfo
import logging as log
import os
import re

import requests
import mariadb
from weather.weather_types import MatrixConfig
from global_types import PiConfig
from astral import LocationInfo
from astral.sun import sun
from astral.moon import phase

parser = argparse.ArgumentParser(description="Fetch weather from NWS")
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

HEADERS = {"User-Agent": "pi_projects_weather/1.0"}


def icon_to_condition(icon_url) -> str:
    if not icon_url:
        return "unknown"
    match = re.search(r"/icons/.*?/(?:day|night)/([^/?,]+)", icon_url)
    if not match:
        return "unknown"
    icon = match.group(1).lower()

    conditions = [
        [{"skc", "few", "hot", "clear"}, "clear"],
        [{"sct", "bkn"}, "light_cloud"],
        [{"ovc", "cloudy"}, "heavy_cloud"],
        [
            {"rain", "rain_showers", "showers", "shra", "drizzle", "rain_sleet"},
            "light_rain",
        ],
        [
            {"tsra", "thunderstorm", "hur_warn", "hur_watch", "ts_warn", "ts_watch"},
            "thunder",
        ],
        [{"fog", "haze", "smoke", "dust", "wind"}, "atmo"],
        [
            {
                "snow",
                "snow_showers",
                "sleet",
                "fzra",
                "snow_sleet",
                "rain_snow",
                "blizzard",
                "cold",
            },
            "snow",
        ],
    ]
    for item in conditions:
        if icon in item[0]:
            return item[1]
    return "unknown"


def fetch_nws_urls():
    url = f"https://api.weather.gov/points/{LAT},{LON}"
    if args.v:
        print("fetching: ", url)
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    data = response.json()
    return data["properties"]["forecast"], data["properties"]["forecastHourly"]


def fetch_weather():
    forecast_url, hourly_url = fetch_nws_urls()

    if args.v:
        print("fetching: ", forecast_url)
    f_res = requests.get(forecast_url, headers=HEADERS)
    f_res.raise_for_status()
    forecast = f_res.json()

    if args.v:
        print("fetching: ", hourly_url)
    h_res = requests.get(hourly_url, headers=HEADERS)
    h_res.raise_for_status()
    hourly = h_res.json()

    pirate_url = (
        f"https://api.pirateweather.net/forecast/{API_KEY}/{LAT},{LON}?units=us"
    )
    if args.v:
        print("fetching: ", pirate_url)

    pirate = None
    try:
        p_res = requests.get(pirate_url)
        p_res.raise_for_status()
        pirate = p_res.json()
    except Exception as e:
        if args.v:
            print(f"Error fetching pirate weather: {e}")

    return forecast, hourly, pirate


def parse_weather(forecast, hourly, pirate):
    weather = {}

    pirate_cc = {}
    pirate_pi = {}
    if pirate and "hourly" in pirate and "data" in pirate["hourly"]:
        for item in pirate["hourly"]["data"]:
            pts = str(item["time"])
            cc = item.get("cloudCover")
            pirate_cc[pts] = int((cc if cc is not None else 0) * 100)
            pirate_pi[pts] = item.get("precipIntensity", 0)

    pirate_daily_pi = {}
    pirate_daily_high = {}
    pirate_daily_low = {}
    if pirate and "daily" in pirate and "data" in pirate["daily"]:
        for item in pirate["daily"]["data"]:
            pts = str(item["time"])
            pirate_daily_pi[pts] = item.get("precipIntensity", 0)
            pirate_daily_high[pts] = item.get("temperatureHigh")
            pirate_daily_low[pts] = item.get("temperatureLow")

    # parse days
    days_dict = {}
    for p in forecast["properties"]["periods"]:
        try:
            dt = datetime.fromisoformat(p["startTime"])
            day_dt = dt.replace(hour=0, minute=0, second=0)
            day_ts = str(int(day_dt.timestamp()))

            pop = 0
            if (
                p.get("probabilityOfPrecipitation")
                and p["probabilityOfPrecipitation"].get("value") is not None
            ):
                pop = p["probabilityOfPrecipitation"]["value"]

            if day_ts not in days_dict:
                days_dict[day_ts] = {
                    "high": p["temperature"] if p["isDaytime"] else -999,
                    "low": p["temperature"] if not p["isDaytime"] else 999,
                    "condition": p["icon"],
                    "pop": pop,
                    "pretty": p["shortForecast"],
                }
            else:
                if p["isDaytime"]:
                    days_dict[day_ts]["high"] = p["temperature"]
                    days_dict[day_ts]["condition"] = p["icon"]
                    days_dict[day_ts]["pretty"] = p["shortForecast"]
                else:
                    days_dict[day_ts]["low"] = p["temperature"]
                days_dict[day_ts]["pop"] = max(days_dict[day_ts]["pop"], pop)
        except Exception as e:
            if args.v:
                print(f"Error parsing day period: {e}")

    loc = LocationInfo("Local", "Region", "America/Los_Angeles", float(LAT), float(LON))

    for ts, d in days_dict.items():
        dt = datetime.fromtimestamp(int(ts), tz=ZoneInfo("America/Los_Angeles"))

        # calculate rise/set
        try:
            s = sun(loc.observer, date=dt.date(), tzinfo=loc.timezone)
            rise_ts = int(s["sunrise"].timestamp())
            set_ts = int(s["sunset"].timestamp())
            if set_ts < rise_ts:
                s_next = sun(
                    loc.observer,
                    date=dt.date() + timedelta(days=1),
                    tzinfo=loc.timezone,
                )
                set_ts = int(s_next["sunset"].timestamp())
            d["rise"] = rise_ts
            d["set"] = set_ts
        except Exception:
            d["rise"] = 0
            d["set"] = 0

        # calculate moon phase
        m_phase = phase(dt.date()) / 28.0
        d["moonPhase"] = round(m_phase, 2)

        d["precipIntensity"] = pirate_daily_pi.get(ts, 0)
        pop = d["pop"]

        p_high = pirate_daily_high.get(ts)
        if d["high"] == -999 and p_high is not None:
            d["high"] = int(p_high)

        p_low = pirate_daily_low.get(ts)
        if d["low"] == 999 and p_low is not None:
            d["low"] = int(p_low)
        d["condition"] = "light_rain" if pop > 20 else icon_to_condition(d["condition"])

    weather["days"] = days_dict

    # parse hours
    hours_dict = {}
    for p in hourly["properties"]["periods"]:
        try:
            dt = datetime.fromisoformat(p["startTime"])
            ts = str(int(dt.timestamp()))

            pop = 0
            if (
                p.get("probabilityOfPrecipitation")
                and p["probabilityOfPrecipitation"].get("value") is not None
            ):
                pop = p["probabilityOfPrecipitation"]["value"]

            hours_dict[ts] = {
                "temp": p["temperature"],
                "condition": icon_to_condition(p["icon"]),
                "pop": pop,
                "precipIntensity": pirate_pi.get(ts, 0),
                "cloudCover": pirate_cc.get(ts, 0),
            }
        except Exception as e:
            if args.v:
                print(f"Error parsing hourly period: {e}")

    weather["hours"] = hours_dict

    # parse current
    c_p = hourly["properties"]["periods"][0]
    rh = 0
    if c_p.get("relativeHumidity") and c_p["relativeHumidity"].get("value") is not None:
        rh = c_p["relativeHumidity"]["value"]

    weather["current"] = {
        "weather": icon_to_condition(c_p["icon"]),
        "temp": c_p["temperature"],
        "relative_humidity": rh,
    }

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
            (datetime.now(timezone.utc), json.dumps(weather)),
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
        forecast, hourly, pirate = fetch_weather()
        weather = parse_weather(forecast, hourly, pirate)
        if args.v:
            print("CURRENT:")
            print(weather["current"], "\n")
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

    except Exception as err:
        print(f"main error: {err}")
        log.error(f"main error: {err}")


if __name__ == "__main__":
    main()
