import time
import sys
from pymongo import MongoClient
import argparse
import json
import datetime
import logging as log
import pickle 
import requests

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level)

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOCATION = pi_config['location']

API_KEY = '867b5828c1e4ef22'
STATE = 'CA'
CITY = 'Palo_Alto'

def fetchWeather():
    data = requests.get('http://api.wunderground.com/api/{0}/forecast10day/hourly10day/conditions/q/{1}/{2}.json'.format(API_KEY, STATE, CITY)).json()
    #pickle.dump(data, open('weather.pkl', 'w'))
    #data = pickle.load(open('weather.pkl', 'r'))
    return data

def parseWeather(raw_weather):    
    weather = {}

    hours = {}
    for item in raw_weather['hourly_forecast']:
        epoch = item['FCTTIME']['epoch']
        #w_time = datetime.datetime.fromtimestamp(int(epoc))
        #hours[w_time] = {
        hours[epoch] = {
            'temp': int(item['temp']['english']),
            'condition': str(item['condition']),
            'pop': int(item['pop'])
        }
    weather['hours'] = hours

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
    raw_weather = fetchWeather()
    weather = parseWeather(raw_weather)
    for time, day in sorted(weather['days'].iteritems()):
        print time, day
    storeWeather(weather)

if __name__ == '__main__':
    main()
