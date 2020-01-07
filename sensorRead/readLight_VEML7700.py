import time
import numpy
import json
import os
import argparse
from pymongo import MongoClient
import datetime
import logging as log
import traceback

import board
import busio
import adafruit_veml7700

parser = argparse.ArgumentParser(description='Read temperature and humidity')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
parser.add_argument('-n', default=False, action='store_true', help='no write mode')
args = parser.parse_args()

READ_FREQ_SECS = 3
WRITE_FREQ_SECS = 9

LONG_TERM_SECS = 60 * 20
longTermCountdown = LONG_TERM_SECS

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOG_DIR = pi_config['log_dir']
LOCATION = pi_config['location']

LOG_NAME = 'readLight_VEML7700_log.txt'
if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')


i2c = busio.I2C(board.SCL, board.SDA)
veml7700 = adafruit_veml7700.VEML7700(i2c)

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
        #print 'location:{} db_host:{}'.format(LOCATION, db_config['host'])
        pass

    light_data = []
    while True:
        try: 
            light = veml7700.light

            if len(light_data) < (WRITE_FREQ_SECS / READ_FREQ_SECS):
                light_data.append(light)
                if args.v:
                    print ('lux: ', light)
            else:
                light_median = numpy.median(numpy.array(light_data))
                light_data = []
                if args.n:
                    print ('light median:{0}'.format(light_median))
                    continue

                client = MongoClient(db_config['host'])
                db = client.piData

                doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': light_median}
                db.lightNow.insert_one(doc)

                if shouldWriteLong():
                    db.light.insert_one(doc)

                client.close()

                if args.v:
                    print ('write to db:{0}'.format(light_median))

            time.sleep(READ_FREQ_SECS)
        except Exception as e:
            log.error('main() exception: {}'.format(traceback.format_exc()))

if __name__ == '__main__':
    main()
