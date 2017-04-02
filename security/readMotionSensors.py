import RPi.GPIO as gpio
import time
import sys
from pymongo import MongoClient
import argparse
from multiprocessing import Process
import json
import datetime
import logging as log
import gmail_utils
import traceback

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()


db_config = json.load(open('/home/mbutki/pi_projects/db.config'))
pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))

LOG_NAME = 'readMotionSensors.log'
LOG_DIR = pi_config['log_dir']

if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
log_level = log.DEBUG if args.v else log.INFO
log.basicConfig(level=log_level,
                filename='{}/{}'.format(LOG_DIR, LOG_NAME),
                format='%(asctime)s %(levelname)s %(message)s',
                filemode='w')

LOCATION = pi_config['location']
EMAIL_LIST = pi_config['email_list']
MOTION_SENSORS = pi_config.get('motion_sensors', {})
#    "motion_sensors" : [
#        "family_room_left_pin" : 4,

ALERT_WRITE_DELAY = 30 # seconds
READ_DELAY = 1 # seconds
TRIGGER_THRESHOLD = 1 # number of motion reads needed to send alert

def fetchSecurityStatus():
    client = MongoClient(db_config['host'])
    db = client.piData

    rows = db.security_enable_status.find({}).sort('time', -1).limit(1)
    enabled =  rows[0]['enabled']
    triggered =  rows[0]['triggered']

    client.close()
    return enabled, triggered

def checkMotionSensors():
    locations = []
    for location, pin in MOTION_SENSORS.iteritems():
        value = gpio.input(pin)
        if value == 1:
            locations.append(location)
    return locations

def updateDB(locations):
    client = MongoClient(db_config['host'])
    db = client.piData

    doc = {'time': datetime.datetime.utcnow(), 'location': locations, 'enabled': True, 'triggered': True}
    log.debug('writing to db:{0}'.format(doc))

    db.security_enable_status.insert_one(doc)
    client.close()

def sendAlert(locations):
    log.debug('sending email')
    gmail_utils.send_message(EMAIL_LIST[0], EMAIL_LIST, 'security alert', 'motion sensor triggered:{0}'.format(locations))

def triggerAlert(locations):
    updateDB(locations)
    sendAlert(locations)
    log.debug('triggered:{0}'.format(locations))

def alertAfterWait(locations):
    log.debug('waiting for valid deactivation before sending alert')
    time.sleep(ALERT_WRITE_DELAY)
    enabled, triggered = fetchSecurityStatus()
    #enabled = True
    if enabled:
        log.debug('still activated, sending alert')
        triggerAlert(locations)
    else:
        log.debug('deactivated, aborting alert')

def main():
    gpio.setmode(gpio.BCM)
    trigger_count = 0
    crashed = False

    for location, pin in MOTION_SENSORS.iteritems():
        gpio.setup(pin, gpio.IN, pull_up_down=gpio.PUD_DOWN)

    try:
        while True:
            try:
                enabled, triggered = fetchSecurityStatus()
                log.debug('DB READ: enabled:{0} triggered:{1}'.format(enabled, triggered))
                if enabled and not triggered:
                #if enabled:
                    locations = checkMotionSensors()
                    log.debug('sensor location value:{0}'.format(locations))
                    if len(locations) > 0:
                        trigger_count += 1
                        log.debug('trigger at:{0} of {1}'.format(trigger_count, TRIGGER_THRESHOLD))
                        if trigger_count >= TRIGGER_THRESHOLD:
                            alertAfterWait(locations)
                    else:
                        trigger_count = 0
            except Exception as e:
                log.error('main loop exception: {}'.format(traceback.format_exc()))
                if not crashed:
                    crashed = True
                    gmail_utils.send_message(EMAIL_LIST[0], EMAIL_LIST, 
                                             'security crashed', 
                                             'Main loop of motion sensor read crashed\n{}'.format(traceback.format_exc()))

           time.sleep(READ_DELAY)
    except KeyboardInterrupt:
        log.info('\nExiting')
    finally:
        log.info('cleaning up')
        gpio.cleanup()

if __name__ == '__main__':
    main()
