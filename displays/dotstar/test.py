import time
import random
import board
import adafruit_dotstar as dotstar
 
# On-board DotStar for boards including Gemma, Trinket, and ItsyBitsy
#dots = dotstar.DotStar(board.APA102_SCK, board.APA102_MOSI, 1, brightness=0.2)
 
# Using a DotStar Digital LED Strip with 30 LEDs connected to hardware SPI
dots = dotstar.DotStar(board.SCK, board.MOSI, 120, brightness=0.5)

# Using a DotStar Digital LED Strip with 30 LEDs connected to digital pins
#dots = dotstar.DotStar(board.D24, board.D23, 120, brightness=1)
 
#dots.deinit()

dots.fill((255, 255, 255))
