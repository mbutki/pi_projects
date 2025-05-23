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
import aqi

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
parser.add_argument('-n', default=False, action='store_true', help='no DB write')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'
LOG_NAME = 'fetch_weather.log'

db_config = json.load(open('{}/db.config'.format(PI_DIR)))
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
matrix_config = json.load(open('{}/weather/matrix.config'.format(PI_DIR)))
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

API_KEY = matrix_config['weather_API_key']
LAT = matrix_config['weather_lat']
LON = matrix_config['weather_lon']

def fetchWeather():
    url = 'https://api.openweathermap.org/data/3.0/onecall?lat={0}&lon={1}&appid={2}'.format(LAT, LON, API_KEY)
    if args.v:
        print 'fetching: ', url
    data = requests.get(url).json()
    return data

def fetchAqi():
    url = 'https://www.purpleair.com/json?key=DA9PGOKPSWDB5I5J&show=15049'
    if args.v:
        print 'fetching: ', url
    data = requests.get(url).json()['results'][0]
    stats = json.loads(data['Stats'])
    print stats
    myAqi = aqi.to_aqi([
        (aqi.POLLUTANT_PM25, stats['v1'])
    ])

    return int(myAqi)

def KToF(k):
    return (k - 273.15) * 9/5 + 32

def iconToCondition(icon):
    conditions = [
        [{'01d', '01n'}, 'clear'],
        [{'02d', '02n', '04d', '04n'}, 'partly-cloudy'],
        [{'03d', '03n'}, 'cloudy'],
        [{'09d', '09n', '10d', '10n', '11d', '11n', '13d', '13n', '50n', '50d'}, 'rain']
    ]
    for item in conditions:
        if icon in item[0]:
            return item[1]
    return 'unknown'

def parseHours(raw_weather):
    hours = {}
    for item in raw_weather['hourly']:
        epoch = str(item['dt'])
        hours[epoch] = {
            'temp': int(KToF(item['temp'])),
            'condition': iconToCondition(item['weather'][0]['icon']),
            'pop': int(item['pop'] * 100),
            'precipIntensity': max(item.get('rain', {'1h': 0})['1h'], item.get('snow', {'1h': 0})['1h']), 
            'cloudCover': item['clouds']
        }
    return hours

def parseCurrent(raw_weather):
    current = {
        'weather': iconToCondition(raw_weather['current']['weather'][0]['icon']),
        'temp': int(KToF(raw_weather['current']['temp'])),
        'relative_humidity': raw_weather['current']['humidity']
    }
    return current

def parseDays(raw_weather):
    days = {}
    for item in raw_weather['daily']:
        epoch = str(item['dt'])
        pop = int(round(item['pop'] * 10) * 10)
        days[epoch] = {
            'high': int(KToF(item['temp']['max'])),
            'low': int(KToF(item['temp']['min'])),
            'condition': 'rain' if pop > 20 else iconToCondition(item['weather'][0]['icon']),
            'pop': pop,
            'pretty': item['weather'][0]['description'],
            'precipIntensity': max(item.get('rain', 0), item.get('snow', 0)), 
            'moonPhase': item['moon_phase'],
            'rise': item['sunrise'],
            'set': item['sunset']
        }
    return days

def parseWeather(raw_weather):
    weather = {}

    weather['hours'] = parseHours(raw_weather)
    weather['current'] = parseCurrent(raw_weather)
    weather['days'] = parseDays(raw_weather)

    return weather

def storeWeather(weather):
    if args.v:
        print 'Starting db put'
    client = MongoClient(db_config['host'])
    db = client.piData

    doc = {'time': datetime.datetime.utcnow(), 'weather': weather}

    db.weather.drop()
    if args.v:
        print 'Deleted previous weather data'
    log.debug('deleting previous weather data')
    db.weather.insert_one(doc)
    if args.v:
        print 'Stored new  weather data'
    log.debug('storing new weather data')
    client.close()
    if args.v:
        print 'DB client closed'

def storeAqi(data):
    if args.v:
        print 'Starting db put'
    client = MongoClient(db_config['host'])
    db = client.piData

    doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': data}
    db.aqiNow.insert_one(doc)

    if args.v:
        print 'Stored new aqi data: {}'.format(data)
    client.close()
    if args.v:
        print 'DB client closed'

def main():
    while True:
        try:
            raw_weather = fetchWeather()
            weather = parseWeather(raw_weather)
            if args.v:
                print 'DAYS:'
                for t, day in sorted(weather['days'].iteritems()):
                    print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(t)))
                    print t, day, '\n'
                print '\nHOURS:'
                for t, hour in sorted(weather['hours'].iteritems()):
                    print time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(float(t)))
                    print t, hour, '\n'
            if not args.n:
                storeWeather(weather)

            #storeAqi(fetchAqi())
            
        except Exception as err:
            print "main error: {0}".format(err)
            log.error("main error: {0}".format(err))
        time.sleep(600)

if __name__ == '__main__':
    main()
