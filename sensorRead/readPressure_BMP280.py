import time
import numpy
import json
import os
import argparse
from pymongo import MongoClient
import datetime
from Adafruit_BME280 import *

READ_FREQ_SECS = 30
WRITE_FREQ_SECS =  60 * 5

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
    press_data = []
    while True:
        temp = sensor.read_temperature()
        pressure = sensor.read_pressure()
        hectopascals = pressure / 100
        #inOfMerc = hectopascals * 0.02952998751

        if len(press_data) < (WRITE_FREQ_SECS / READ_FREQ_SECS):
            press_data.append(hectopascals)
            if args.v:
                print 'Pressure  = {0} in'.format(hectopascals)
        else:
            press_median = numpy.median(numpy.array(press_data))
            press_data = []

            client = MongoClient(db_config['host'])
            db = client.piData

            doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': press_median}
            db.presNow.insert_one(doc)
            if args.v:
                print 'write to db:{0}'.format(doc)

            if shouldWriteLong():
                db.pres.insert_one(doc)
                if args.v:
                    print 'write long to db:{0}'.format(press_median)

            client.close()

        time.sleep(READ_FREQ_SECS)

if __name__ == '__main__':
    main()
