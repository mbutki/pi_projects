import RPi.GPIO as gpio
import time
import sys

PIN_IN = int(sys.argv[1])

gpio.setmode(gpio.BCM)

gpio.setup(PIN_IN, gpio.IN, pull_up_down=gpio.PUD_DOWN)

try:
    while True:
        print gpio.input(PIN_IN)
        time.sleep(0.5)
except KeyboardInterrupt:
    print '\nExiting'
finally:
    print 'cleaning up'
    gpio.cleanup()

