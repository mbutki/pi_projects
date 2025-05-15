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
import adafruit_pm25
import aqi
import serial

parser = argparse.ArgumentParser(description='Read air quality')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
parser.add_argument('-n', default=False, action='store_true', help='no write mode')
args = parser.parse_args()

READ_FREQ_SECS = 5
WRITE_FREQ_SECS = 30

LONG_TERM_SECS = 60 * 20
longTermCountdown = LONG_TERM_SECS

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOG_DIR = pi_config['log_dir']
LOCATION = pi_config['location']

LOG_NAME = 'readAirQuality_PMS5003.txt'
if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='a')

def shouldWriteLong():
    global longTermCountdown
    longTermCountdown -= WRITE_FREQ_SECS
    if longTermCountdown <= 0:
        longTermCountdown = LONG_TERM_SECS
        return True
    else:
        return False

def AQandU(val):
    if val > 12:
        return (0.778*val)+2.65
    return val

def main():
    if args.v:
        #print 'location:{} db_host:{}'.format(LOCATION, db_config['host'])
        pass

    data = []
    while True:
        try: 
            # Connect to a PM2.5 sensor over UART
            uart = serial.Serial("/dev/ttyS0", baudrate=9600, timeout=0.25)
            pm25 = adafruit_pm25.PM25_UART(uart, None)
            time.sleep(1)

            aqdata = pm25.read()
            val = AQandU(aqdata['pm25 env'])
            myAqi = aqi.to_iaqi(aqi.POLLUTANT_PM25, val, algo=aqi.ALGO_EPA)
            if args.v:
                print ('Raw: {}, Adjusted: {}, AQI: {}'.format(aqdata, val, myAqi))
            
            myAqi = int(myAqi)

            if len(data) < (WRITE_FREQ_SECS / READ_FREQ_SECS):
                data.append(myAqi)
                if args.v:
                    print ('AQI: ', myAqi)
            else:
                aqi_median = numpy.median(numpy.array(data))
                data = []
                if args.v:
                    print ('AQI median:{0}'.format(aqi_median))
                if args.n:
                    continue

                client = MongoClient(db_config['host'])
                db = client.piData

                doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': aqi_median}
                db.aqiNow.insert_one(doc)

                if shouldWriteLong():
                    db.aqi.insert_one(doc)

                client.close()

                if args.v:
                    print ('write to db:{0}'.format(aqi_median))

            time.sleep(READ_FREQ_SECS)
        except Exception as e:
            log.error('main() exception: {}'.format(traceback.format_exc()))

if __name__ == '__main__':
    main()
