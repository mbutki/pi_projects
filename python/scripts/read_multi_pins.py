import RPi.GPIO as gpio
import time
import sys

pins = sys.argv[1:]
pins = [int(pin) for pin in pins]

gpio.setmode(gpio.BCM)

for pin in pins:
    gpio.setup(pin, gpio.IN, pull_up_down=gpio.PUD_DOWN)

try:
    while True:
        values = [gpio.input(pin) for pin in pins]
        print ' '.join([str(value) for value in values])
        time.sleep(0.5)
except KeyboardInterrupt:
    print '\nExiting'
finally:
    print 'cleaning up'
    gpio.cleanup()

