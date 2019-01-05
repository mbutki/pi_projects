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

API_KEY = '867b5828c1e4ef22'
STATE = 'CA'
CITY = 'Palo_Alto'

def fetchWeather():
    url = 'http://api.wunderground.com/api/{0}/pws:0/forecast10day/hourly10day/conditions/astronomy/q/{1}/{2}.json'.format(API_KEY, STATE, CITY)
    print url
    data = requests.get(url).json()
    #pickle.dump(data, open('weather.pkl', 'w'))
    #data = pickle.load(open('weather.pkl', 'r'))
    #print data
    return data

def parseWeather(raw_weather):    
    weather = {}

    hours = {}
    for item in raw_weather['hourly_forecast']:
        epoch = item['FCTTIME']['epoch']
        #w_time = datetime.datetime.fromtimestamp(int(epoc))
        #hours[w_time] = {
        hours[epoch] = {
            'temp': int(float(item['temp']['english'])),
            'condition': str(item['condition']),
            'pop': int(item['pop'])
        }
    weather['hours'] = hours
    if not weather['hours']:
        log.error("hours was empty: {0}".format(raw_weather))

    rise_hour = int(raw_weather['sun_phase']['sunrise']['hour'])
    if (int(raw_weather['sun_phase']['sunrise']['minute']) >=30):
        rise_hour += 1

    set_hour = int(raw_weather['sun_phase']['sunset']['hour'])
    if (int(raw_weather['sun_phase']['sunset']['minute']) >=30):
        set_hour += 1

    weather['rise'] = rise_hour
    weather['set'] = set_hour

    current = {
        'weather': str(raw_weather['current_observation']['weather']),
        'temp': raw_weather['current_observation']['temp_f'],
        'relative_humidity': int(raw_weather['current_observation']['relative_humidity'][:-1])
    }
    weather['current'] = current

    days = {}
    for item in raw_weather['forecast']['simpleforecast']['forecastday']:
        epoch = item['date']['epoch']
        #w_time = datetime.datetime.fromtimestamp(int(epoch))
        #days[w_time] = {
        days[epoch] = {
            'high': int(item['high']['fahrenheit']),
            'low': int(item['low']['fahrenheit']),
            'condition': str(item['conditions']),
            'pop': int(item['pop']),
            'pretty': item['date']['pretty']
        }
    weather['days'] = days

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
    try:
        raw_weather = fetchWeather()
        weather = parseWeather(raw_weather)
        for time, day in sorted(weather['days'].iteritems()):
            print time, day
        storeWeather(weather)
    except Error as err:
        log.error("main error: {0}".format(err))

if __name__ == '__main__':
    main()
