# Simple test for NeoPixels on Raspberry Pi
import time
import board
import neopixel
from time import sleep
from random import randrange as rr

# Choose an open pin connected to the Data In of the NeoPixel strip, i.e. board.D18
# NeoPixels must be connected to D10, D12, D18 or D21 to work.
pixel_pin = board.D18

# The number of NeoPixels
num_pixels = 60

# The order of the pixel colors - RGB or GRB. Some NeoPixels have red and green reversed!
# For RGBW NeoPixels, simply change the ORDER to RGBW or GRBW.
ORDER = neopixel.GRB

pixels = neopixel.NeoPixel(pixel_pin, num_pixels, brightness=0.2, auto_write=False,
                           pixel_order=ORDER)
num = 5


try:
    colors = []
    pos = []
    for i in range(num):
        colors.append((rr(0,255), rr(0,255), rr(0,255)))
    for i in range(num):
        pos.append(i*5)

    while True:
        pixels.fill((0,0,0))
        for i in range(num):
            pixels[pos[i]] = (rr(0,255), rr(0,255), rr(0,255))
            #pixels[pos[i]] = colors[i]
        pixels.show()
        for i in range(num):
            pos[i] += 1
            pos[i] %= num_pixels
        sleep(0.1)
except:
    pixels.fill((0, 0, 0))
    pixels.show()
