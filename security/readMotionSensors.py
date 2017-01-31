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
MOTION_SENSORS = pi_config.get_default('motion_sensors', {})
#    "motion_sensors" : [
#        "family_room_left_pin" : 4,

def fetchSecurityStatus():
    client = MongoClient(db_config['host'])
    db = client.piData

    rows = db.security_enable_status.find({}).sort('time', -1).limit(1)
    enabled =  rows[0]['enabled']
    triggered =  rows[0]['triggered']
    
    client.close()
    return enabled, triggered

def checkMotionSensors():
    for location, pin in MOTION_SENSORS.iteritems():
        value = gpio.input(pin)
        if value == 1:
            return location
    return None

def updateDB():
    client = MongoClient(db_config['host'])
    db = client.piData

    doc = {'time': datetime.datetime.utcnow(), 'location': LOCATION, 'enabled': True, 'triggered': True}
    log.debug('writing to db:{0}'.format(doc))

    db.security_enable_status.insert_one(doc)
    client.close()

def sendAlert(location):
    pass

def triggerAlert(location):
    updateDB()
    sendAlert(location)

def main():
    gpio.setmode(gpio.BCM)

    for location, pin in MOTION_SENSORS.iteritems():
        gpio.setup(pin, gpio.IN, pull_up_down=gpio.PUD_DOWN)

    try:
        while True:
            enabled, triggered = fetchSecurityStatus()
            if enabled and not triggered:
                location = checkMotionSensors()
                if location != None:
                    triggerAlert(location)
            time.sleep(1)
    except KeyboardInterrupt:
        log.info('\nExiting')
    finally:
        log.info('cleaning up')
        gpio.cleanup()

if __name__ == '__main__':
    main()
