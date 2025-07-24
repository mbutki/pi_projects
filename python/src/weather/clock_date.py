import datetime
from rgbmatrix import graphics

class Clock:
    color = graphics.Color(170, 170, 170)
    y_offset = 13

    def __init__(self, font, x_offset):
        self.font = font
        self.x_offset = x_offset

    def draw(self, canvas):
        self.draw_date(canvas)
        self.draw_clock(canvas)

    def draw_date(self, canvas):
        now = datetime.datetime.now()
        time_str = now.strftime("%-m/%-d/%y")
        x_offset = self.x_offset + 4
        y_offset = Clock.y_offset
        graphics.DrawText(canvas, self.font, x_offset, y_offset, self.color, time_str)

    def draw_clock(self, canvas):
        now = datetime.datetime.now()
        time_str = now.strftime("%-I:%M:%S")
        x_offset = self.x_offset
        y_offset = Clock.y_offset + 11
        graphics.DrawText(canvas, self.font, x_offset, y_offset, self.color, time_str)
