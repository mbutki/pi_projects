import time
import sys
from pymongo import MongoClient
import argparse
import json
import datetime
import logging as log
import pickle 
import requests
import os

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'
LOG_NAME = 'fetch_weather.log'

db_config = json.load(open('{}/db.config'.format(PI_DIR)))
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
LOCATION = pi_config['location']
LOG_DIR = pi_config['log_dir']

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='a')
log.getLogger("requests").setLevel(log.WARNING)
log.getLogger("urllib3").setLevel(log.WARNING)

API_KEY = pi_config['weather_API_key']
LAT = pi_config['weather_lat']
LON = pi_config['weather_lon']

def fetchWeather():
    url = 'https://api.darksky.net/forecast/{0}/{1},{2}'.format(API_KEY, LAT, LON)
    data = requests.get(url).json()
    return data

def parseHours(raw_weather):
    hours = {}
    for item in raw_weather['hourly']['data']:
        epoch = str(item['time'])
        hours[epoch] = {
            'temp': int(item['temperature']),
            'condition': item['icon'],
            'pop': int(item['precipProbability'] * 100),
            'precipIntensity': float(item['precipIntensity']),
        }
    return hours

def parseCurrent(raw_weather):
    current = {
        'weather': raw_weather['currently']['icon'],
        'temp': raw_weather['currently']['temperature'],
        'relative_humidity': raw_weather['currently']['humidity']
    }
    return current

def parseDays(raw_weather):
    days = {}
    for item in raw_weather['daily']['data']:
        epoch = str(item['time'])
        pop = int(round(item['precipProbability'] * 10) * 10)
        days[epoch] = {
            'high': int(item['temperatureHigh']),
            'low': int(item['temperatureLow']),
            'condition': 'rain' if pop > 20 else item['icon'],
            'pop': pop,
            'pretty': item['summary'],
            'precipIntensity': float(item['precipIntensity']),
            'moonPhase': float(item['moonPhase']),
            'rise': int(item['sunriseTime']),
            'set': int(item['sunsetTime'])
        }
        # print item['moonPhase'], float(item['moonPhase']), datetime.datetime.fromtimestamp(item['time'])
    return days

def parseWeather(raw_weather):
    weather = {}

    weather['hours'] = parseHours(raw_weather)
    weather['current'] = parseCurrent(raw_weather)
    weather['days'] = parseDays(raw_weather)

    return weather

def storeWeather(weather):
    client = MongoClient(db_config['host'])
    db = client.piData

    doc = {'time': datetime.datetime.utcnow(), 'weather': weather}

    db.weather.delete_many({})
    log.debug('deleting previous weather data')
    db.weather.insert_one(doc)
    log.debug('storing new weather data')
    client.close()

def main():
    while True:
        try:
            raw_weather = fetchWeather()
            weather = parseWeather(raw_weather)
            if args.v:
                for t, day in sorted(weather['days'].iteritems()):
                    print t, day
            storeWeather(weather)
        except Exception as err:
            log.error("main error: {0}".format(err))
        time.sleep(300)

if __name__ == '__main__':
    main()
