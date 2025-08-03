from rgbmatrix import graphics
import colorsys

class Color():
    def __init__(self, h, s, v):
        self.h = h
        self.s = s
        self.v = v

    def hsv(self):
        return [self.h, self.s, self.v]

    def rgb(self):
        return colorsys.hsv_to_rgb(*self.hsv())

    def led(self):
        return graphics.Color(*self.rgb())