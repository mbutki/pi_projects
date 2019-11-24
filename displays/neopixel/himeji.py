# Simple test for NeoPixels on Raspberry Pi
import time
import board
import neopixel
from time import sleep
from random import randrange as rr
import colorsys

# NeoPixels must be connected to D10, D12, D18 or D21 to work.
pixelPin = board.D21

numPixels = 30
num = 1
stepMax = 5

pixels = neopixel.NeoPixel(pixelPin, numPixels, brightness=0.05, auto_write=False)

def translate(value, leftMin, leftMax, rightMin, rightMax):
    # Figure out how 'wide' each range is
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin

    # Convert the left range into a 0-1 range (float)
    valueScaled = float(value - leftMin) / float(leftSpan)

    # Convert the 0-1 range into a value in the right range.
    return rightMin + (valueScaled * rightSpan)

class Torch():
    hRange = [30, 40, 360]
    sRange = [99, 100, 100]
    vRange = [50, 100, 100]

    steps = 0
    nextColor = (0, 0, 0)
    prevColor = (0, 0, 0)
    curColor = (0, 0, 0)
    colorSteps = ()

    def __init__(self, pos):
        self.pos = pos
    
    def draw(self):
        if self.steps == 0:
            self.steps = stepMax
            #self.prevColor = self.nextColor
            self.prevColor = self.curColor
            self.nextColor = self.genColor()
            self.colorSteps = [int((x - self.prevColor[i]) / stepMax) for i, x in enumerate(self.nextColor)]
        
        self.steps -= 1
        self.curColor = [x + self.curColor[i] for i, x in enumerate(self.colorSteps)]
        self.curColor = [max(x, 0) for x in self.curColor]
        self.curColor = [min(x, 255) for x in self.curColor]

        '''        
        print('\n')
        print('self.pos:{}'.format(self.pos))
        print('self.steps:{}'.format(self.steps))
        print('self.prevColor:{}'.format(self.prevColor))
        print('self.nextColor:{}'.format(self.nextColor))
        print('self.curColor:{}'.format(self.curColor))
        print('self.colorSteps:{}'.format(self.colorSteps))
        #pixels[self.pos] = self.genColor()
        '''

        pixels[self.pos] = self.curColor

    def genColor(self):
        (r, g, b) = colorsys.hsv_to_rgb(self.genVal(self.hRange),
                                        self.genVal(self.sRange),
                                        self.genVal(self.vRange))
        return (int(r * 255), int(g * 255), int(b * 255))

    def genVal(self, valRange):
        val = rr(valRange[0], valRange[1])
        rgb = translate(val, 0, valRange[2], 0, 1)
        return rgb

    def walk(self):
        self.pos = (self.pos + 1) % numPixels
        for i in range(50):
            self.draw()
            pixels.show()
            sleep(0.01)

    def static(self):
        self.draw()
        pixels.show()

def main():
    #try:
    torches = []
    #for i in range(num):
    #torches.append(Torch(0))
    torches.append(Torch(15))
    torches.append(Torch(20))
    torches.append(Torch(26))
    torches.append(Torch(27))

    pixels.fill((0, 0, 0))
    pixels.show()
    while True:
        #torches[0].walk()
        torches[0].static()
        torches[1].static()
        torches[2].static()
        torches[3].static()
        #torches[4].static()
        sleep(0.03)
    '''
    except Exception as e:
        print(e)
        pixels.fill((0, 0, 0))
        pixels.show()
    '''
if __name__ == '__main__':
    main()
