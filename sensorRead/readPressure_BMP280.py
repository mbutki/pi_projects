import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import numpy
import json
import os
import argparse
from pymongo import MongoClient
import datetime
from Adafruit_BME280 import *

READ_FREQ_SECS = 30
WRITE_FREQ_SECS = 60 * 5

LONG_TERM_SECS = 60 * 20
longTermCountdown = LONG_TERM_SECS

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))

LOCATION = pi_config['location']

parser = argparse.ArgumentParser(description='Read pressure')
parser.add_argument('-v', default=False, action='store_true',
                    help='verbose mode')
args = parser.parse_args()

sensor = BME280(mode=BME280_OSAMPLE_16)

def shouldWriteLong():
    global longTermCountdown
    longTermCountdown -= WRITE_FREQ_SECS
    if longTermCountdown <= 0:
        longTermCountdown = LONG_TERM_SECS
        return True
    else:
        return False

def main():
    if args.v:
        print 'location:{0} db_host:{1} db_name:{2} db_user:{3}'.format(LOCATION, db_config['host'], db_config['database'], db_config['user'])

    press_data = []
    while True:
        temp = sensor.read_temperature()
        pressure = sensor.read_pressure()
        hectopascals = pressure / 100
        inOfMerc = hectopascals * 0.02952998751


        if len(press_data) < WRITE_FREQ_SECS:
            press_data.append(inOfMerc)
            if args.v:
                #print 'Pressure  = {0:0.2f} in'.format(inOfMerc)
                print 'Pressure  = {0} in'.format(inOfMerc)
        else:
            press_median = numpy.median(numpy.array(press_data))
            press_data = []

            client = MongoClient(db_config['host'])
            db = client.piData

            doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': press_median}
            db.presNow.insert_one(doc)

            if shouldWriteLong():
                db.pres.insert_one(doc)

            client.close()
            if args.v:
                print 'write to db:{0} {1}'.format(press_median)

        time.sleep(READ_FREQ_SECS)

if __name__ == '__main__':
    main()
