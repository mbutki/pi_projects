import RPi.GPIO as gpio
import time
import sys

PIN_IN = int(sys.argv[1])
PIN_OUT = int(sys.argv[2])

gpio.setmode(gpio.BCM)

gpio.setup(PIN_IN, gpio.IN, pull_up_down=gpio.PUD_DOWN)
gpio.setup(PIN_OUT, gpio.OUT, initial=gpio.LOW)

try:
    while True:
        print gpio.input(PIN_IN)
        gpio.output(PIN_OUT, gpio.input(PIN_IN))
        time.sleep(0.5)
except KeyboardInterrupt:
    print '\nExiting'
finally:
    print 'cleaning up'
    gpio.cleanup()

