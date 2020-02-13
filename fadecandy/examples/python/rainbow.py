#!/usr/bin/env python

# Open Pixel Control client: All lights to solid white

import opc, time

numLEDs = 16
client = opc.Client('localhost:7890')

black = [ (0,0,0) ] * numLEDs
pixels = [ (50,50,50) ] * numLEDs

# Fade to white
client.put_pixels(black)
client.put_pixels(black)
time.sleep(0.5)

def main():
    while True:
        rainbow_cycle(0.1)    # rainbow cycle with 1ms delay per step

def wheel(pos):
    # Input a value 0 to 255 to get a color value.
    # The colours are a transition r - g - b - back to r.
    if pos < 0 or pos > 255:
        r = g = b = 0
    elif pos < 85:
        r = int(pos * 3)
        g = int(255 - pos*3)
        b = 0
    elif pos < 170:
        pos -= 85
        r = int(255 - pos*3)
        g = 0
        b = int(pos*3)
    else:
        pos -= 170
        r = 0
        g = int(pos*3)
        b = int(255 - pos*3)
    return (r, g, b)


def rainbow_cycle(wait):
    for j in range(255):
        for i in range(numLEDs):
            pixel_index = (i * 256 // numLEDs) + j
            pixels[i] = wheel(pixel_index & 255)
        client.put_pixels(pixels)
        time.sleep(wait)

if __name__ == '__main__':
    main()
