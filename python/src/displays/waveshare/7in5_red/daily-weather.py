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
import mariadb

from weather import dbReads

PI_DIR = '/home/mbutki/pi_projects'
SLEEP_SECS = 15*60

db_config = json.load(open('{}/db.config'.format(PI_DIR)))

parser = argparse.ArgumentParser(description='Read motion sensors and trigger alert')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

def main():
    try:
        run()
    except IOError as e:
        print(e)
    except KeyboardInterrupt:    
        print("ctrl + c:")
        epdconfig.module_exit()
        exit()

def fetchData():
    if args.v:
        print('Opening DB...')
    
    conn = None
    if args.v:
        print('Starting db put')
    try:
        conn = mariadb.connect(
            user="mbutki",
            host="pi-desk",
            database="pidata"
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    conn.autocommit = True
    if args.v:
        print('Get Cursor')
    cur = conn.cursor()
    
    weather = dbReads.fetchWeather(cur, args)
    indoor_temp = dbReads.fetchIndoorTemps(cur, args)
    outdoor_temp = dbReads.fetchOutdoorTemps(cur, args)

    conn.commit()
    conn.close()

    if args.v:
        print('DB client closed')
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
    large_font = ImageFont.truetype('{}/python/src/displays/waveshare/7in5_red/fonts/Helvetica.ttc'.format(PI_DIR), 48)
    med_font = ImageFont.truetype('{}/python/src/displays/waveshare/7in5_red/fonts/Helvetica.ttc'.format(PI_DIR), 32)
    
    # Drawing on the Vertical image
    LBlackimage = Image.new('1', (epd.height, epd.width), 255)  # 126*298
    LRYimage = Image.new('1', (epd.height, epd.width), 255)  # 126*298
    drawblack = ImageDraw.Draw(LBlackimage)
    drawcolor = ImageDraw.Draw(LRYimage)


    img = Image.open('images/ccs_kero_pudding.jpg')
    img.thumbnail((300, 300), Image.Resampling.LANCZOS)
    LRYimage.paste(img, (170, 350))    

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
