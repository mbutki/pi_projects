import RPi.GPIO as gpio
import time
import sys
from pymongo import MongoClient
import argparse
from multiprocessing import Process
import json
import datetime
import logging as log

parser = argparse.ArgumentParser(description='Read temperature')
parser.add_argument('-v', default=False, action='store_true',
                    help='verbose mode')
args = parser.parse_args()

log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level)

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
LOCATION = pi_config['location']

BUTTON_PIN = 13
GREEN_LED_PIN = 5
RED_LED_PIN = 6

flash_time_sec = 30
flash_per_sec = 4


# GLOBALS
enabled = False
blink_process = None

def writeEnabled(enabled):
    client = MongoClient(db_config['host'])
    db = client.piData

    doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'value': enabled}
    log.debug('writing to db:{0}'.format(doc))

    db.security_enable_status.insert_one(doc)
    client.close()

def blink():
    log.debug('Waiting period for Activation')
    for i in range(flash_time_sec * flash_per_sec):
        # Wax on (o.o)
        gpio.output(RED_LED_PIN, 1)
        time.sleep(float(1) / flash_per_sec / 2)

        # Wax off (^.^)
        gpio.output(RED_LED_PIN, 0)
        time.sleep(float(1) / flash_per_sec / 2)
    writeEnabled(True)
    gpio.output(RED_LED_PIN, 1)

def toggleButton(pin):
    global enabled
    global blink_process

    enabled = not enabled
    log.debug('Enabled:{0}'.format(enabled))

    if not enabled:
        if blink_process != None and blink_process.is_alive():
            log.debug('Activation Aborted from main thread')
            blink_process.terminate()
        else:
            writeEnabled(enabled)
        gpio.output(RED_LED_PIN, 0)
        gpio.output(GREEN_LED_PIN, 1)
    else:
        gpio.output(GREEN_LED_PIN, 0)
        blink_process = Process(target = blink, args=())
        blink_process.start()


def main():
    gpio.setmode(gpio.BCM)

    gpio.setup(BUTTON_PIN, gpio.IN, pull_up_down=gpio.PUD_UP)

    gpio.setup(GREEN_LED_PIN, gpio.OUT)
    gpio.setup(RED_LED_PIN, gpio.OUT)
    
    gpio.add_event_detect(BUTTON_PIN, gpio.FALLING, callback=toggleButton)

    log.debug('Enabled:{0}'.format(enabled))
    gpio.output(GREEN_LED_PIN, not enabled)
    gpio.output(RED_LED_PIN, enabled)
    writeEnabled(enabled)

    try:
        while True:
            time.sleep(0.5)
    except KeyboardInterrupt:
        log.info('\nExiting')
    finally:
        log.info('cleaning up')
        gpio.cleanup()

if __name__ == '__main__':
    main()
