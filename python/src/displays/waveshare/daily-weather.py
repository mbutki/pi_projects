#!/usr/bin/python
import sys
import time
import traceback
from datetime import datetime
import json
import argparse

import epd7in5bc
import epdconfig
from PIL import Image,ImageDraw,ImageFont

from pymongo import MongoClient
from weather import dbReads

BIRTHDAY = datetime(2019,7,20,1,19)
PI_DIR = '/home/mbutki/pi_projects'
SLEEP_SECS = 15*60

db_config = json.load(open('{}/db.config'.format(PI_DIR)))

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

def main():
    print("Starting run")
    while True:
        try:
            run()
            print(f'Sleeping {SLEEP_SECS}')
            time.sleep(SLEEP_SECS)
        except IOError as e:
            print(e)
        except KeyboardInterrupt:    
            print("ctrl + c:")
            epdconfig.module_exit()
            exit()

def fetchData():
    client = MongoClient(db_config['host'])
    db = client.piData

    weather = dbReads.fetchWeather(db, args)
    #daily_icons = getDailyIcons(weather)
    indoor_temp = dbReads.fetchIndoorTemps(db)
    outdoor_temp = dbReads.fetchOutdoorTemps(db)

    client.close()
    if args.v:
        print('Closing DB...')
    return (weather, indoor_temp, outdoor_temp)

def currentDateStr():
    now = datetime.now()
    return now.strftime('%b %-d, %a')

def run():
    weather, indoor_temp, outdoor_temp = fetchData()

    today = weather['days'][sorted(weather['days'])[0]]
    print(today)

    today_high = today['high']
    today_pop = today['pop']
    today_condition = today['condition']
    current = weather['current']['temp']

    epd = epd7in5bc.EPD()
    epd.init()
    epd.Clear()

    # Drawing on the image
    #large_font = ImageFont.truetype('{}/displays/waveshare/python3/fonts/ChrustyRock-ORLA.ttf'.format(PI_DIR), 48)
    large_font = ImageFont.truetype('{}/displays/waveshare/python3/fonts/Helvetica.ttc'.format(PI_DIR), 48)
    med_font = ImageFont.truetype('{}/displays/waveshare/python3/fonts/Font.ttc'.format(PI_DIR), 32)
    
    # Drawing on the Vertical image
    LBlackimage = Image.new('1', (epd.height, epd.width), 255)  # 126*298
    LRYimage = Image.new('1', (epd.height, epd.width), 255)  # 126*298
    drawblack = ImageDraw.Draw(LBlackimage)
    drawcolor = ImageDraw.Draw(LRYimage)
    
    drawcolor.text((35, 50), currentDateStr(), font = large_font, fill = 0)

    drawblack.text((5, 150), f'Today', font = large_font, fill = 0)
    drawblack.text((50, 200), f'High: {today_high} f', font = large_font, fill = 0)
    drawblack.text((50, 250), f'{today_condition}', font = large_font, fill = 0)
    drawblack.text((50, 300), f'PoP: {today_pop}%', font = large_font, fill = 0)
    drawblack.text((5, 400), f'Current', font = large_font, fill = 0)
    drawblack.text((50, 450), f'{current} f', font = large_font, fill = 0)

    epd.display(epd.getbuffer(LBlackimage), epd.getbuffer(LRYimage))
        
    print("Goto Sleep...")
    epd.sleep()

if __name__ == '__main__':
    main()
