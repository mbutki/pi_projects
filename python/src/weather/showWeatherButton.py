import RPi.GPIO as gpio
import time
import sys
import subprocess
import json
import argparse

parser = argparse.ArgumentParser(description='Display Weather')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

PI_DIR = '/home/mbutki/pi_projects'

matrix_config = json.load(open('{}/weather/matrix.config'.format(PI_DIR)))
PIN_IN = matrix_config['weather_display_button_pin']

gpio.setmode(gpio.BCM)
gpio.setup(PIN_IN, gpio.IN, pull_up_down=gpio.PUD_UP)
'''
restartService = 'sudo service showWeather restart'
stopService = 'sudo service showWeather stop'
displayOn = True

try:
    while True:
        gpio.wait_for_edge(PIN_IN, gpio.FALLING, bouncetime=200)
        if displayOn:
            if args.v:
                print 'turning off'
            subprocess.call(stopService, shell = True)
            if args.v:
                print 'turned off'
        else:
            if args.v:
                print 'turning on'
            subprocess.call(restartService, shell = True)
            if args.v:
                print 'turned on'
        displayOn = not displayOn
'''
clearLock = 'sudo rm /var/lib/mongodb/mongod.lock'
reboot = 'sudo reboot -h now'
try:
    while True:
        gpio.wait_for_edge(PIN_IN, gpio.FALLING, bouncetime=200)
        if args.v:
            print 'clearing lock'
        subprocess.call(clearLock, shell = True)
        if args.v:
            print 'rebooting'
        subprocess.call(reboot, shell = True)

except KeyboardInterrupt:
    print '\nExiting'
finally:
    print 'cleaning up'
    gpio.cleanup()
