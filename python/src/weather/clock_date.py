import datetime
import math
import weather.led_color as led_color

from rgbmatrix import graphics

class Clock:
    color = led_color.Color(0, 0, 190)
    y_offset = 10
    y_spacer = 3

    char_height = 6

    char_width = 4
    char_x_spacer = 1

    def __init__(self, font, x_offset):
        self.font = font
        self.x_offset = x_offset

    def draw(self, canvas):
        self.draw_dow(canvas)
        self.draw_date(canvas)
        self.draw_clock(canvas)

    def draw_dow(self, canvas):
        now = datetime.datetime.now()
        time_str = now.strftime("%A")

        char_diff = math.ceil((8 - len(time_str)) / 2)
        correction = 0 if char_diff <= 0 else (char_diff * Clock.char_width) + (char_diff * Clock.char_x_spacer)
        x_offset = self.x_offset + correction

        y_offset = Clock.y_offset

        graphics.DrawText(canvas, self.font, x_offset, y_offset, self.color.led(), time_str)

    def draw_date(self, canvas):
        now = datetime.datetime.now()
        time_str = now.strftime("%-m/%-d/%y")
        
        x_offset = self.x_offset
        x_offset += 0 if now.month > 9 else (Clock.char_width + Clock.char_x_spacer)
        y_offset = Clock.y_offset + Clock.char_height + Clock.y_spacer

        graphics.DrawText(canvas, self.font, x_offset, y_offset, self.color.led(), time_str)

    def draw_clock(self, canvas):
        now = datetime.datetime.now()
        time_str = now.strftime("%-I:%M:%S")

        x_offset = self.x_offset
        x_offset += 0 if now.hour in {10, 11, 12, 22, 23, 24} else (Clock.char_width + Clock.char_x_spacer)
        y_offset = Clock.y_offset + Clock.char_height*2 + Clock.y_spacer*2

        graphics.DrawText(canvas, self.font, x_offset, y_offset, self.color.led(), time_str)
