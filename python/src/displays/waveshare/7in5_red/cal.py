#!/usr/bin/python
import sys
import epd7in5bc
import epdconfig
import time
from PIL import Image,ImageDraw,ImageFont
import traceback
from datetime import datetime

BIRTHDAY = datetime(2019,7,20,1,19)
PI_DIR = '/home/mbutki/pi_projects'

def main():
    try:
        run()   
    except IOError as e:
        print(e)
    except KeyboardInterrupt:    
        print("ctrl + c:")
        epdconfig.module_exit()
        exit()

def getBirthDiff():
    now = datetime.now()
    days = None
    months = None
    print(f'now.day {now.day} now.month {now.month}')
    print(f'B.day {BIRTHDAY.day} B.month {BIRTHDAY.month}')
    if now.day >= BIRTHDAY.day:
        days = now.day - BIRTHDAY.day
        months = now.month - BIRTHDAY.month
    else:
        days = (now - BIRTHDAY).days
        months = now.month - BIRTHDAY.month - 1
    return days, months

def currentDateStr():
    now = datetime.now()
    return now.strftime('%b %-d, %a')

def run():
    days, months = getBirthDiff()
    
    epd = epd7in5bc.EPD()
    epd.init()
    epd.Clear()
    #time.sleep(1)

    getBirthDiff()
    # Drawing on the image
    mainFont = ImageFont.truetype('{}/displays/waveshare/python3/fonts/Helvetica.ttc'.format(PI_DIR), 85)
    dateFont = ImageFont.truetype('{}/displays/waveshare/python3/fonts/Helvetica.ttc'.format(PI_DIR), 65)
    
    # Drawing on the Vertical image
    LBlackimage = Image.new('1', (epd.height, epd.width), 255)  # 126*298
    LRYimage = Image.new('1', (epd.height, epd.width), 255)  # 126*298
    drawblack = ImageDraw.Draw(LBlackimage)
    drawcolor = ImageDraw.Draw(LRYimage)
    
    singular = set([0,1])

    drawcolor.text((110, 50), 'Kate', font = mainFont, fill = 0)
    monthLabel = 'months'
    drawblack.text((5, 150), '{} {}'.format(months, monthLabel), font = mainFont, fill = 0)
    weekLabel = 'week' if days/7 in singular else 'weeks'
    drawblack.text((5, 250), '{} {}'.format(days/7, weekLabel), font = mainFont, fill = 0)
    dayLabel = 'day' if days%7 in singular else 'days'
    drawblack.text((5, 350), '{} {} '.format(days%7, dayLabel), font = mainFont, fill = 0)
    #drawblack.rectangle((10, 90, 60, 140), outline = 0)
    drawblack.text((35, 500), currentDateStr(), font = dateFont, fill = 0)

    epd.display(epd.getbuffer(LBlackimage), epd.getbuffer(LRYimage))
    #time.sleep(2)
        
    print("Goto Sleep...")
    epd.sleep()

if __name__ == '__main__':
    main()
