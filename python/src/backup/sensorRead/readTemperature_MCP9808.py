import time
import numpy
import json
import os
import argparse
from pymongo import MongoClient
import datetime
import Adafruit_MCP9808.MCP9808 as MCP9808
import logging as log
import traceback

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

READ_FREQ_SECS = 30
WRITE_FREQ_SECS = 60 * 5

LONG_TERM_SECS = 60 * 20
longTermCountdown = LONG_TERM_SECS

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOG_DIR = pi_config['log_dir']
LOCATION = pi_config['location']

LOG_NAME = 'readTemperature_MCP9808_log.txt'
if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')


parser = argparse.ArgumentParser(description='Read temperature and humidity')
parser.add_argument('-v', default=False, action='store_true',
                    help='verbose mode')
args = parser.parse_args()

sensor = MCP9808.MCP9808()
sensor.begin()

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
        print 'location:{0} db_host:{1}'.format(LOCATION, db_config['host'])

    temp_data = []
    while True:
        try: 
            temp = sensor.readTempC()

            temp_F = (temp * 9.0 / 5.0) + 32
            if len(temp_data) < (WRITE_FREQ_SECS / READ_FREQ_SECS):
                temp_data.append(temp_F)
                if args.v:
                    print 'temp: ', temp_F
            else:
                temp_median = numpy.median(numpy.array(temp_data))
                temp_data = []

                client = MongoClient(db_config['host'])
                db = client.piData

                doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': temp_median}
                db.tempNow.insert_one(doc)

                if shouldWriteLong():
                    db.temp.insert_one(doc)

                client.close()

                if args.v:
                    print 'write to db:{0}'.format(temp_median)

            time.sleep(READ_FREQ_SECS)
        except Exception as e:
            log.error('main() exception: {}'.format(traceback.format_exc()))

if __name__ == '__main__':
    main()
