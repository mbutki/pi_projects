import datetime

from rgbmatrix import graphics

import utils

class Graph:
    # Plot Bar Lines
    DAYLIGHT_BAR_COLOR = graphics.Color(30, 30, 30)
    NOON_BAR_COLOR = graphics.Color(100, 100, 100)
    MIDNIGHT_BAR_COLOR = graphics.Color(50, 50, 50)
    TEMP_INCREMENT_LINE_COLOR = graphics.Color(40, 40, 40)

    # Plot Data Points
    TEMP_LINE_COLOR = graphics.Color(140, 140, 140)
    POP_LINE_COLOR = graphics.Color(0, 130, 255)
    CLOUD_COVER_LINE_COLOR = graphics.Color(140, 0, 0)
    PERCIP_INTENSITY_LINE_COLOR = graphics.Color(134, 36, 214)

    # Plot Dot Animation
    RUNNER_DOT_COLOR = graphics.Color(255, 255, 255)

    # Coordinates
    BAR_CHART_BOTTOM = 31
    CHART_WIDTH = 44
    BAR_LEFT = 10

    # Moth Stuff
    TEMP_DIV = 5.0
    POP_DIV = 7.0
    PERCIP_INTENSITY_DIV = 0.02
    MAX_PERCIP_INTENSITY = 0.3
    BAR_MIN_TEMP = 30

    def __init__(self):
        self.dot_loc = 0

    def draw(self, canvas, weather, tick):
        horizontal_temps = [40, 60, 80, 100]
        epochs = sorted(weather['hours'].keys())[:Graph.CHART_WIDTH]

        Graph.draw_daylight(canvas, epochs, weather)
        Graph.draw_hor_bars(canvas, horizontal_temps)
        Graph.draw_vert_bars(canvas, epochs)
        Graph.draw_cloud_cover_line(canvas, epochs, weather)
        self.draw_temp_line(canvas, epochs, weather, tick)
        Graph.draw_percip_intensity_line(canvas, epochs, weather)
        Graph.draw_pop_line(canvas, epochs, weather)

    @staticmethod
    def draw_daylight(canvas, epochs, weather):
        for i, epoch in enumerate(epochs):
            rise_time = weather['days'][sorted(weather['days'])[0]]['rise']
            set_time = weather['days'][sorted(weather['days'])[0]]['set']
            sun_rise = datetime.datetime.fromtimestamp(rise_time).hour
            sun_set = datetime.datetime.fromtimestamp(set_time).hour
            dt =  datetime.datetime.fromtimestamp(float(epoch))
            column = Graph.BAR_LEFT + i

            if dt.hour >= sun_rise and dt.hour <= sun_set:
                graphics.DrawLine(canvas, column, Graph.BAR_CHART_BOTTOM, column, Graph.BAR_CHART_BOTTOM - 14, Graph.DAYLIGHT_BAR_COLOR)

    @staticmethod
    def draw_hor_bars(canvas, horizontal_temps):
        for h_temp in horizontal_temps:
            y = Graph.BAR_CHART_BOTTOM - ((h_temp - Graph.BAR_MIN_TEMP) / Graph.TEMP_DIV)
            y = int(y)
            graphics.DrawLine(canvas, Graph.BAR_LEFT, y, Graph.BAR_LEFT + Graph.CHART_WIDTH - 1, y, Graph.TEMP_INCREMENT_LINE_COLOR)

    @staticmethod
    def draw_vert_bars(canvas, epochs):
        for i, epoch in enumerate(epochs):
            column = Graph.BAR_LEFT + i
            dt =  datetime.datetime.fromtimestamp(float(epoch))

            if dt.hour == 12:
                graphics.DrawLine(canvas, column, Graph.BAR_CHART_BOTTOM, column, Graph.BAR_CHART_BOTTOM - 14, Graph.NOON_BAR_COLOR)
            if dt.hour == 0:
                graphics.DrawLine(canvas, column, Graph.BAR_CHART_BOTTOM, column, Graph.BAR_CHART_BOTTOM - 14, Graph.MIDNIGHT_BAR_COLOR)

    def draw_temp_line(self, canvas, epochs, weather, tick):
        if utils.should_trigger_ms(tick, 100):
            self.dot_loc = (self.dot_loc + 1) % Graph.CHART_WIDTH

        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None

            temp = int(round( (hour['temp'] - Graph.BAR_MIN_TEMP) / Graph.TEMP_DIV ))

            prev_temp = None
            if prev_hour:
                prev_temp = int(round( (prev_hour['temp'] - Graph.BAR_MIN_TEMP) / Graph.TEMP_DIV ))

            column = Graph.BAR_LEFT + i
            temp_y2 = Graph.BAR_CHART_BOTTOM - temp
            prev_temp_y2 = Graph.BAR_CHART_BOTTOM - prev_temp if prev_temp else None

            # Temperature Line
            color = Graph.TEMP_LINE_COLOR
            canvas.SetPixel(column, temp_y2, color.red, color.green, color.blue)

            if prev_temp:
                Graph.draw_connecting_line(canvas, prev_temp, temp, prev_temp_y2, temp_y2, column, color)

            # Animated Dot
            if i == self.dot_loc:
                color = Graph.RUNNER_DOT_COLOR
                canvas.SetPixel(column, temp_y2, color.red, color.green, color.blue)

    @staticmethod
    def draw_cloud_cover_line(canvas, epochs, weather):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None

            pop = int(round(hour['cloudCover'] / Graph.POP_DIV)) - 1
            prev_pop = int(round( prev_hour['cloudCover'] / Graph.POP_DIV )) - 1 if prev_hour else None

            column = Graph.BAR_LEFT + i
            pop_y2 = Graph.BAR_CHART_BOTTOM - pop
            prev_pop_y2 = Graph.BAR_CHART_BOTTOM - prev_pop if prev_pop else None

            color = Graph.CLOUD_COVER_LINE_COLOR
            canvas.SetPixel(column, pop_y2, color.red, color.green, color.blue)
            if prev_pop:
                Graph.draw_connecting_line(canvas, prev_pop, pop, prev_pop_y2, pop_y2, column, color)

    @staticmethod
    def draw_pop_line(canvas, epochs, weather):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None

            pop = int(round(hour['pop'] / Graph.POP_DIV)) - 1
            prev_pop = int(round( prev_hour['pop'] / Graph.POP_DIV )) - 1 if prev_hour else None

            column = Graph.BAR_LEFT + i
            pop_y2 = Graph.BAR_CHART_BOTTOM - pop
            prev_pop_y2 = Graph.BAR_CHART_BOTTOM - prev_pop if prev_pop else None

            color = Graph.POP_LINE_COLOR
            canvas.SetPixel(column, pop_y2, color.red, color.green, color.blue)
            if prev_pop:
                Graph.draw_connecting_line(canvas, prev_pop, pop, prev_pop_y2, pop_y2, column, color)

    @staticmethod
    def draw_percip_intensity_line(canvas, epochs, weather):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None

            # cap intensity to MAX_PERCIP_INTENSITY
            hour['precipIntensity'] = Graph.MAX_PERCIP_INTENSITY if hour['precipIntensity'] > Graph.MAX_PERCIP_INTENSITY else hour['precipIntensity']

            pop = int(round(hour['precipIntensity'] / Graph.PERCIP_INTENSITY_DIV)) - 1
            prev_pop = int(round( prev_hour['precipIntensity'] / Graph.PERCIP_INTENSITY_DIV )) - 1 if prev_hour else None

            column = Graph.BAR_LEFT + i
            pop_y2 = Graph.BAR_CHART_BOTTOM - pop
            prev_pop_y2 = Graph.BAR_CHART_BOTTOM - prev_pop if prev_pop else None

            color = Graph.PERCIP_INTENSITY_LINE_COLOR
            canvas.SetPixel(column, pop_y2, color.red, color.green, color.blue)
            if prev_pop:
                Graph.draw_connecting_line(canvas, prev_pop, pop, prev_pop_y2, pop_y2, column, color)

    @staticmethod
    def draw_connecting_line(canvas, prev, cur, prev_y2, y2, column, color):
        if prev > cur + 1:
            graphics.DrawLine(canvas, column - 1, prev_y2 , column - 1, y2 - 1, color)
        elif prev < cur - 1:
            graphics.DrawLine(canvas, column,     y2,     column,     prev_y2 - 1, color)
