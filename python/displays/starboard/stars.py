from rgbmatrix import RGBMatrix, RGBMatrixOptions, graphics
from time import sleep
import random
import colorsys

# mode 0 = rainbow HSV hue
# mode 1 = random RGB
# mode 2 = random HSV
# mode 3 = b/w

mode = 0
modeTicks = 5000
maxDrops = 1000

speed = 2
strengthDecay = 0.99
sparkle = 0.005
minStrength = 40
speedDecay = 2.0
tickSpeed = 0.01

options = RGBMatrixOptions()
options.chain_length = 6
options.gpio_slowdown = 2
options.hardware_mapping="adafruit-hat"
#options.show_refresh_rate = True

rows = 32
length = 192

class Drop:
    def __init__(self):
        global mode
        global speed
        global minStrength
        global rows

        self.x = 0
        self.y = random.randint(0, rows - 1)
        self.r = self.b = self.g = 0
        
        self.generateColor()
        self.speed = 1 + (random.random() * speed)
        self.strength = random.randint(minStrength, 100) / 100.0
    
    def generateColor(self):
        global rows

        r = g = b = 0
        # Pure rainbow using HSV
        if (mode == 0):
            (r, g, b) = colorsys.hsv_to_rgb((float(self.y) / (rows - 1)), 1, 1)
            
            self.r = int(r * 255)
            self.g = int(g * 255)
            self.b = int(b * 255)

            self.altr = int(r * 255)
            self.altg = int(g * 255)
            self.altb = int(b * 255)

        # Pure random using RGB for main, HSV for sparkle
        elif (mode == 1):
            (r, g, b) = colorsys.hsv_to_rgb(random.random(), 1, 1)
            
            # Use real random RGB values
            self.r = random.randint(0, 255)
            self.g = random.randint(0, 255)
            self.b = random.randint(0, 255)

            self.altr = int(r * 255)
            self.altg = int(g * 255)
            self.altb = int(b * 255)

        # Pure random using HSV for main and sparkle
        elif (mode == 2):
            (r, g, b) = colorsys.hsv_to_rgb(random.random(), 1, 1)

            self.r = int(r * 255)
            self.g = int(g * 255)
            self.b = int(b * 255)
            
            self.altr = int(r * 255)
            self.altg = int(g * 255)
            self.altb = int(b * 255)

        # Pure random Black & White
        elif (mode == 3):
            (r, g, b) = colorsys.hsv_to_rgb(random.random(), 1, 1)
            
            if (random.random() > .01):
                # Black & White (rgb are all the same)
                self.r = self.g = self.b = random.randint(0, 255)
            else:
                self.r = int(r * 255)
                self.g = int(g * 255)
                self.b = int(b * 255)

            self.altr = int(r * 255)
            self.altg = int(g * 255)
            self.altb = int(b * 255)

    def tick(self):
        global strengthDecay
        global length
        global speedDecay

        self.erase()

        self.x += (self.speed / speedDecay)
        if self.x > length:
            self.x = length
            self.strength = 0

        self.strength = self.strength * strengthDecay
        if (self.strength < 0):
            self.strength = 0
        self.draw()

    def draw(self):
        global sparkle

        if (random.random() < sparkle):
            matrix.SetPixel(self.x, self.y, self.altb, self.altg, self.altr)
        else:
            matrix.SetPixel(self.x, self.y, self.b*(self.strength), self.g*(self.strength), self.r*(self.strength))

    def erase(self):
        matrix.SetPixel(self.x, self.y, 0, 0, 0)

def main():
    global matrix
    global tickSpeed
    global mode
    global modeTicks
    global maxDrops

    matrix = RGBMatrix(options = options)

    drops = []
    for k in range (0, maxDrops):
        drops.append(Drop())

    while (True):
        for j in range(0, len(drops)):
            drops[j].tick()
            if drops[j].strength == 0:
               drops[j].erase()
               drops[j] = Drop()

        sleep(tickSpeed)
        modeTicks -= 1
        if modeTicks < 0:
            modeTicks = 5000
            mode += 1
            mode = mode % 4

if __name__ == '__main__':
    main()
