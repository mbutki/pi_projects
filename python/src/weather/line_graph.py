import datetime
from rgbmatrix import graphics
import utils

class Graph:
    BAR_CHART_BOTTOM = 31
    BAR_MIN_TEMP = 30
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

    def __init__(self):
        self.dot_loc = 0

    def draw(self, canvas, weather, tick):
        TEMP_DIV = 5.0
        POP_DIV = 7.0
        PERCIP_INTENSITY_DIV = 0.02
        MAX_PERCIP_INTENSITY = 0.3
        CHART_WIDTH = 44
        BAR_LEFT = 10

        horizontal_temps = [40, 60, 80, 100]
        epochs = sorted(weather['hours'].keys())[:CHART_WIDTH]

        Graph.drawDaylight(canvas, epochs, weather, BAR_LEFT, TEMP_DIV)
        Graph.drawHorBars(canvas, horizontal_temps, TEMP_DIV, BAR_LEFT, CHART_WIDTH)
        Graph.drawVertBars(canvas, epochs, weather, BAR_LEFT)
        Graph.drawCloudCoverLine(canvas, epochs, weather, POP_DIV, BAR_LEFT)
        self.drawTempLine(canvas, epochs, weather, TEMP_DIV, BAR_LEFT, CHART_WIDTH, tick)
        Graph.drawPercipIntensityLine(canvas, epochs, weather, PERCIP_INTENSITY_DIV, BAR_LEFT, MAX_PERCIP_INTENSITY)
        Graph.drawPopLine(canvas, epochs, weather, POP_DIV, BAR_LEFT)
    
    def drawDaylight(canvas, epochs, weather, BAR_LEFT, TEMP_DIV):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]
            riseTime = weather['days'][sorted(weather['days'])[0]]['rise']
            setTime = weather['days'][sorted(weather['days'])[0]]['set']
            sun_rise = datetime.datetime.fromtimestamp(riseTime).hour
            sun_set = datetime.datetime.fromtimestamp(setTime).hour
            dt =  datetime.datetime.fromtimestamp(float(epoch))
            column = BAR_LEFT + i

            # Only Area under the curve
            temp = int(round( (hour['temp'] - Graph.BAR_MIN_TEMP) / TEMP_DIV ))
            temp_y2 = Graph.BAR_CHART_BOTTOM - temp

            if dt.hour >= sun_rise and dt.hour <= sun_set:
                graphics.DrawLine(canvas, column, Graph.BAR_CHART_BOTTOM, column, Graph.BAR_CHART_BOTTOM - 14, Graph.DAYLIGHT_BAR_COLOR)

    def drawHorBars(canvas, horizontal_temps, TEMP_DIV, BAR_LEFT, CHART_WIDTH):
        for h_temp in horizontal_temps:
            y = Graph.BAR_CHART_BOTTOM - ((h_temp - Graph.BAR_MIN_TEMP) / TEMP_DIV)
            y = int(y)
            graphics.DrawLine(canvas, BAR_LEFT, y, BAR_LEFT + CHART_WIDTH - 1, y, Graph.TEMP_INCREMENT_LINE_COLOR)

    def drawVertBars(canvas, epochs, weather, BAR_LEFT):
        for i, epoch in enumerate(epochs):
            column = BAR_LEFT + i
            dt =  datetime.datetime.fromtimestamp(float(epoch))

            if dt.hour == 12:
                graphics.DrawLine(canvas, column, Graph.BAR_CHART_BOTTOM, column, Graph.BAR_CHART_BOTTOM - 14, Graph.NOON_BAR_COLOR)
            if dt.hour == 0:
                graphics.DrawLine(canvas, column, Graph.BAR_CHART_BOTTOM, column, Graph.BAR_CHART_BOTTOM - 14, Graph.MIDNIGHT_BAR_COLOR)

    def drawTempLine(self, canvas, epochs, weather, TEMP_DIV, BAR_LEFT, CHART_WIDTH, tick):
        if utils.should_trigger_ms(tick, 100):
            self.dot_loc = (self.dot_loc + 1) % CHART_WIDTH
        
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
            dt =  datetime.datetime.fromtimestamp(float(epoch))

            temp = int(round( (hour['temp'] - Graph.BAR_MIN_TEMP) / TEMP_DIV ))

            prev_temp = None
            if prev_hour:
                prev_temp = int(round( (prev_hour['temp'] - Graph.BAR_MIN_TEMP) / TEMP_DIV ))

            column = BAR_LEFT + i
            temp_y2 = Graph.BAR_CHART_BOTTOM - temp
            prev_temp_y2 = Graph.BAR_CHART_BOTTOM - prev_temp if prev_temp else None

            # Temperature Line
            base_temp = 80
            low_temp = 50
            color = Graph.TEMP_LINE_COLOR
            canvas.SetPixel(column, temp_y2, color.red, color.green, color.blue)

            if prev_temp:
                Graph.drawConnectingLine(canvas, prev_temp, temp, prev_temp_y2, temp_y2, column, color)

            # Animated Dot
            if i == self.dot_loc:
                color = Graph.RUNNER_DOT_COLOR
                canvas.SetPixel(column, temp_y2, color.red, color.green, color.blue)

    def drawCloudCoverLine(canvas, epochs, weather, POP_DIV, BAR_LEFT):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
            dt =  datetime.datetime.fromtimestamp(float(epoch))

            pop = int(round(hour['cloudCover'] / POP_DIV)) - 1
            prev_pop = int(round( prev_hour['cloudCover'] / POP_DIV )) - 1 if prev_hour else None

            column = BAR_LEFT + i
            pop_y2 = Graph.BAR_CHART_BOTTOM - pop
            prev_pop_y2 = Graph.BAR_CHART_BOTTOM - prev_pop if prev_pop else None

            if True:
                color = Graph.CLOUD_COVER_LINE_COLOR
                canvas.SetPixel(column, pop_y2, color.red, color.green, color.blue)
                if prev_pop:
                    Graph.drawConnectingLine(canvas, prev_pop, pop, prev_pop_y2, pop_y2, column, color)

    def drawPopLine(canvas, epochs, weather, POP_DIV, BAR_LEFT):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
            dt =  datetime.datetime.fromtimestamp(float(epoch))

            pop = int(round(hour['pop'] / POP_DIV)) - 1
            prev_pop = int(round( prev_hour['pop'] / POP_DIV )) - 1 if prev_hour else None

            column = BAR_LEFT + i
            pop_y2 = Graph.BAR_CHART_BOTTOM - pop
            prev_pop_y2 = Graph.BAR_CHART_BOTTOM - prev_pop if prev_pop else None

            if True:
                color = Graph.POP_LINE_COLOR
                canvas.SetPixel(column, pop_y2, color.red, color.green, color.blue)
                if prev_pop:
                    Graph.drawConnectingLine(canvas, prev_pop, pop, prev_pop_y2, pop_y2, column, color)

    def drawPercipIntensityLine(canvas, epochs, weather, PERCIP_INTENSITY_DIV, BAR_LEFT, MAX_PERCIP_INTENSITY):
        for i, epoch in enumerate(epochs):
            hour = weather['hours'][epoch]

            prev_hour = weather['hours'][epochs[i-1]] if i > 0 else None
            dt =  datetime.datetime.fromtimestamp(float(epoch))

            # cap intensity to MAX_PERCIP_INTENSITY
            hour['precipIntensity'] = MAX_PERCIP_INTENSITY if hour['precipIntensity'] > MAX_PERCIP_INTENSITY else hour['precipIntensity'] 

            pop = int(round(hour['precipIntensity'] / PERCIP_INTENSITY_DIV)) - 1
            prev_pop = int(round( prev_hour['precipIntensity'] / PERCIP_INTENSITY_DIV )) - 1 if prev_hour else None

            column = BAR_LEFT + i
            pop_y2 = Graph.BAR_CHART_BOTTOM - pop
            prev_pop_y2 = Graph.BAR_CHART_BOTTOM - prev_pop if prev_pop else None

            if True:
                color = Graph.PERCIP_INTENSITY_LINE_COLOR
                canvas.SetPixel(column, pop_y2, color.red, color.green, color.blue)
                if prev_pop:
                    Graph.drawConnectingLine(canvas, prev_pop, pop, prev_pop_y2, pop_y2, column, color)

    def drawConnectingLine(canvas, prev, cur, prev_y2, y2, column, color):
        if prev > cur + 1:
            graphics.DrawLine(canvas, column - 1, prev_y2 , column - 1, y2 - 1, color)
        elif prev < cur - 1:
            graphics.DrawLine(canvas, column,     y2,     column,     prev_y2 - 1, color)