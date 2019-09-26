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

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

#READ_FREQ_SECS = 1
#WRITE_FREQ_SECS = 10

READ_FREQ_SECS = 3
WRITE_FREQ_SECS = 9

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOG_DIR = pi_config['log_dir']
LOCATION = pi_config['location']

LOG_NAME = 'readTemperature_VEML7700_log.txt'
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

i2c = busio.I2C(board.SCL, board.SDA)
veml7700 = adafruit_veml7700.VEML7700(i2c)

def main():
    if args.v:
        #print 'location:{} db_host:{}'.format(LOCATION, db_config['host'])
        pass

    temp_data = []
    while True:
        try: 
            temp = veml7700.light

            if len(temp_data) < (WRITE_FREQ_SECS / READ_FREQ_SECS):
                temp_data.append(temp)
                if args.v:
                    print ('lux: ', temp)
            else:
                temp_median = numpy.median(numpy.array(temp_data))
                temp_data = []

                client = MongoClient(db_config['host'])
                db = client.piData

                db.light.drop()
                if args.v:
                    print('Deleted previous light data')

                doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': temp_median}
                db.light.insert_one(doc)

                client.close()

                if args.v:
                    print ('write to db:{0}'.format(temp_median))

            time.sleep(READ_FREQ_SECS)
        except Exception as e:
            log.error('main() exception: {}'.format(traceback.format_exc()))

if __name__ == '__main__':
    main()
