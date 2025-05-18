import time
import numpy
import json
import os
import argparse
import datetime
import adafruit_sht31d
import board
import logging as log
import traceback
import mariadb

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOG_DIR = pi_config['log_dir']
LOCATION = pi_config['location']

parser = argparse.ArgumentParser(description='Read temperature and humidity')
parser.add_argument('read_freq_sec', help='how often to read both sensors')
parser.add_argument('read_count', help='how many reads for one db write')
parser.add_argument('temp_db_name', help='database name to store temp')
parser.add_argument('humid_db_name', help='database name to store humidity')
parser.add_argument('--clear', default=False, action='store_true',
                    help='clear db before insert')
parser.add_argument('-v', default=False, action='store_true',
                    help='verbose mode')
args = parser.parse_args()

LOG_NAME = 'readTemperature_SHT31-D_log.txt'
if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')

i2c = board.I2C()
sensor = adafruit_sht31d.SHT31D(i2c)

def main():
    if args.v:
        print('location:{0} db_host:{1}'.format(LOCATION, db_config['host']))

    temp_data = []
    humid_data = []
    for i in range(int(args.read_count)):
        try: 
            temp = sensor.temperature
            humidity = int(sensor.relative_humidity)

            temp_F = int((temp * 9.0 / 5.0) + 32)
            if args.v:
                print(f'sensor temp: {temp_F}')
                print(f'sensor humidity: {humidity}')

            temp_data.append(temp_F)
            humid_data.append(humidity)
            if i < int(args.read_count) - 1:
                if args.v:
                    print('sleeping for {} seconds'.format(args.read_freq_sec))
            time.sleep(int(args.read_freq_sec))
        except Exception as e:
            log.error('read loop exception: {}'.format(traceback.format_exc()))

    temp_median = numpy.median(numpy.array(temp_data))
    humid_median = numpy.median(numpy.array(humid_data))
    
    if args.v:
        print('Starting db put')
    try:
        conn = mariadb.connect(
            user="mbutki",
            host="pi-desk",
            database="pidata"
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)
    cur = conn.cursor()

    try:
        if args.clear:
            cur.execute(
                f'DELETE FROM {args.temp_db_name}'
            )
        cur.execute(
            f'INSERT INTO {args.temp_db_name} (time, location, value) VALUES (?, ?, ?)', 
            (datetime.datetime.utcnow(), LOCATION, temp_median)
        )
        conn.commit()
    except mariadb.Error as e:
        print(f"Error: {e}")

    try:
        if args.clear:
            cur.execute(
                f'DELETE FROM {args.humid_db_name}'
            )
        cur.execute(
            f'INSERT INTO {args.humid_db_name} (time, location, value) VALUES (?, ?, ?)', 
            (datetime.datetime.utcnow(), LOCATION, humid_median)
        )
        conn.commit()
    except mariadb.Error as e:
        print(f"Error: {e}")

    conn.close()
    
    if args.v:
        print('wrote to db:{0} {1}'.format(temp_median, humid_median))

if __name__ == '__main__':
    main()
