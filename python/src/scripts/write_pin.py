import RPi.GPIO as gpio
import time
import sys

PIN_OUT = int(sys.argv[1])

gpio.setmode(gpio.BCM)

gpio.setup(PIN_OUT, gpio.OUT)

try:
    while True:
        gpio.output(PIN_OUT, gpio.HIGH)
        time.sleep(5)
        gpio.output(PIN_OUT, gpio.LOW)
        time.sleep(5)
        #print 'wriing'
except KeyboardInterrupt:
    print '\nExiting'
finally:
    print 'cleaning up'
    gpio.cleanup()

