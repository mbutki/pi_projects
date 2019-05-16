import RPi.GPIO as gpio
import time
import sys
import subprocess
import json

pi_config = json.load(open('/home/mbutki/pi_projects/pi.config'))
PIN_IN = pi_config['weather_display_button_pin']

gpio.setmode(gpio.BCM)
gpio.setup(PIN_IN, gpio.IN, pull_up_down=gpio.PUD_DOWN)

restartService = 'sudo service weatherDisplay restart'
stopService = 'sudo service weatherDisplay stop'
displayOn = True

try:
    while True:
        gpio.wait_for_edge(PIN_IN, gpio.RISING, bouncetime=200)
        if displayOn:
            print 'turning off'
            subprocess.call(stopService, shell = True)
            print 'turned off'
        else:
            print 'turning on'
            subprocess.call(restartService, shell = True)
            print 'turned on'
        displayOn = not displayOn
except KeyboardInterrupt:
    print '\nExiting'
finally:
    print 'cleaning up'
    gpio.cleanup()

