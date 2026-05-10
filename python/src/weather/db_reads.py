import json

import mariadb
from mariadb import Cursor


def fetch_weather(cur: Cursor, args):
    if args.v:
        print("Fetching weather...")
    try:
        cur.execute("SELECT time, weather from weather")
        if args.v:
            print("SELECT Executed for weather")
    except mariadb.Error as e:
        print(f"Error: {e}")

    weather = {}
    for _, w in cur:
        weather = json.loads(w)
    return weather


def fetch_indoor_temp(cur: Cursor, args) -> int | None:
    return fetch_local_temp(cur, args, "living_room")


def fetch_outdoor_temp(cur: Cursor, args) -> int | None:
    return fetch_local_temp(cur, args, "backyard")


def fetch_local_temp(cur: Cursor, args, location: str) -> int | None:
    value = None

    if args.v:
        print(f"Fetching {location} temp...")
    try:
        query = "SELECT timestamp, location, temp FROM sensor_latest WHERE location = ?"
        cur.execute(query, (location,))
        if args.v:
            print(f"SELECT Executed for {location} temp")
    except mariadb.Error as e:
        print(f"Error: {e}")

    for _, _, v in cur:
        if v is not None:
            value = int(v)
    return value
