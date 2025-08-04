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

def fetch_brightness(cur):
    v = True
    if v:
        print('Fetching brightness...')
    try:
        cur.execute("SELECT timestamp, lux FROM sensor_latest WHERE location = 'living_room'")
        if v:
            print('SELECT Executed for brightness')
    except mariadb.Error as e:
        print(f"Error: {e}")

    lux = 0
    for _, l in cur:
        lux = int(l)
    return lux

def fetch_indoor_temps(cur, args):
    value = 0

    if args.v:
        print('Fetching indoor temp...')
    try:
        cur.execute("SELECT timestamp, location, temp FROM sensor_latest WHERE location = 'living_room'")
        if args.v:
            print('SELECT Executed for indoor temp')
    except mariadb.Error as e:
        print(f"Error: {e}")

    for _, _, v in cur:
        value = int(v)
    return value

def fetch_outdoor_temps(cur, args):
    value = -999

    if args.v:
        print('Fetching outdoor temp...')
    try:
        cur.execute("SELECT timestamp, location, temp FROM sensor_latest WHERE location = 'backyard'")
        if args.v:
            print('SELECT Executed for outdoor temp')
    except mariadb.Error as e:
        print(f"Error: {e}")

    for _, _, v in cur:
        if v != None:
            value = int(v)
    return value
