#!/usr/bin/python
import time
import datetime
from Adafruit_LED_Backpack import SevenSegment

segment = SevenSegment.SevenSegment(address=0x70)
segment.begin()

segment.set_brightness(15)

while(True):
  now = datetime.datetime.now()
  hour = now.hour
  minute = now.minute
  second = now.second

  if hour == 0:
    hour = 12
  elif hour > 12:
    hour -= 12

  segment.clear()
  # Set hours
  if int(hour / 10) == 1:
    segment.set_digit(0, int(hour / 10))     # Tens
  segment.set_digit(1, hour % 10)          # Ones
  # Set minutes
  segment.set_digit(2, int(minute / 10))   # Tens
  segment.set_digit(3, minute % 10)        # Ones
  # Toggle colon
  segment.set_colon(second % 2)              # Toggle colon at 1Hz

  # Write the display buffer to the hardware.  This must be called to
  # update the actual display LEDs.
  try:
    segment.write_display()
  except:
    print 'Display write error'
  # Wait a quarter second (less than 1 second to prevent colon blinking getting$
  time.sleep(0.25)
