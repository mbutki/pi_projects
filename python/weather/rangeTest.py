import argparse
import sys
import json

PI_DIR = '/home/mbutki/pi_projects'
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
matrix_config = json.load(open('{}/weather/matrix.config'.format(PI_DIR)))

MAX_LUX = matrix_config['max_lux']
MIN_LUX = matrix_config['min_lux']
MAX_BRIGHTNESS = matrix_config['max_brightness']
MIN_BRIGHTNESS = matrix_config['min_brightness']


def translate(value, leftMin, leftMax, rightMin, rightMax):
    # Figure out how 'wide' each range is
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin

    # Convert the left range into a 0-1 range (float)
    valueScaled = float(value - leftMin) / float(leftSpan)

    # Convert the 0-1 range into a value in the right range.
    return rightMin + (valueScaled * rightSpan)

lux = int(sys.argv[1])
lux = max(lux, MIN_LUX)
lux = min(lux, MAX_LUX)
print 'lux after min/max: {}'.format(lux)

brightness = translate(lux, MIN_LUX, MAX_LUX, MIN_BRIGHTNESS, MAX_BRIGHTNESS)
print 'brightness used: {}'.format(brightness)
