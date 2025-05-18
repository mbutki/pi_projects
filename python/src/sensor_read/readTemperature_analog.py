import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import numpy
import json
import os
import argparse
from pymongo import MongoClient
import datetime

SPI_PORT   = 0
SPI_DEVICE = 0
mcp = Adafruit_MCP3008.MCP3008(spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))
READ_FREQ_SECS = 1
WRITE_FREQ_SECS = 1 * 60 * 10

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))

LOCATION = pi_config['location']
INPUT_PIN = pi_config['temperature_MCP3008_pin']
TEMP_CORRECTION = pi_config['temperature_correction']

parser = argparse.ArgumentParser(description='Read temperature')
parser.add_argument('-v', default=False, action='store_true',
                    help='verbose mode')
args = parser.parse_args()

def main():
    if args.v:
        print 'location:{0} db_host:{1} db_name:{2} db_user:{3}'.format(LOCATION, db_config['host'], db_config['database'], db_config['user'])

    data = []
    while True:
        value = mcp.read_adc(INPUT_PIN)

        millivolts = (value + TEMP_CORRECTION) * (3300.0 / 1024.0)
        temp_C = (millivolts - 500.0) / 10.0
        temp_F = ((temp_C + TEMP_CORRECTION) * 9.0 / 5.0) + 32
        if len(data) < WRITE_FREQ_SECS:
            data.append(temp_F)
            if args.v:
                print temp_F
        else:
            median = numpy.median(numpy.array(data))
            data = []

            client = MongoClient(db_config['host'])
            db = client.piData

            doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': median}
            db.temperatures.insert_one(doc)
            client.close()

        time.sleep(READ_FREQ_SECS)

if __name__ == '__main__':
    main()
