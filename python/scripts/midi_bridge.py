import RPi.GPIO as gpio
import time

gpio.setmode(gpio.BCM)

BUTTON_IN = 17
GREEN_OUT = 27
RED_OUT = 22

# Input button
gpio.setup(BUTTON_IN, gpio.IN, pull_up_down=gpio.PUD_DOWN)

# Green LED
gpio.setup(GREEN_OUT, gpio.OUT)
gpio.output(GREEN_OUT,0)

# RED LED
gpio.setup(RED_OUT, gpio.OUT)
gpio.output(RED_OUT,0)

try:
    while True:
        gpio.output(GREEN_OUT, gpio.input(BUTTON_IN))
except KeyboardInterrupt:
    print '\n'
    print 'Exiting'
finally:
    print 'cleaning up'
    gpio.cleanup()
