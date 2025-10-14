import json

import mariadb

def fetch_weather(cur, args):
    if args.v:
        print('Fetching weather...')
    try:
        cur.execute("SELECT time, weather from weather")
        if args.v:
            print('SELECT Executed for weather')
    except mariadb.Error as e:
        print(f"Error: {e}")

    weather = {}
    for _, w in cur:
        weather = json.loads(w)
    return weather

def fetch_indoor_temp(cur, args):
    return fetch_local_temp(cur, args, 'living_room')

def fetch_outdoor_temp(cur, args):
    return fetch_local_temp(cur, args, 'backyard')

def fetch_local_temp(cur, args, location):
    value = float('-inf')

    if args.v:
        print(f'Fetching {location} temp...')
    try:
        cur.execute(f'SELECT timestamp, location, temp FROM sensor_latest WHERE location = "{location}"')
        if args.v:
            print(f'SELECT Executed for {location} temp')
    except mariadb.Error as e:
        print(f"Error: {e}")

    for _, _, v in cur:
        if v is not None:
            value = int(v)
    return value
