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
    today_condition = today['condition'].upper()
    match today_condition:
        case 'cloudy':
            today_condition = 'cloud'
        case 'partly-cloudy':
            today_condition = 'mixed'
    current = weather['current']['temp']

    epd = epd7in5bc.EPD()
    epd.init()
    epd.Clear()

    # Drawing on the image
    font = ImageFont.truetype('{}/python/src/displays/waveshare/7in5_red/fonts/Helvetica.ttc'.format(PI_DIR), 24)
    #font = ImageFont.truetype('{}/python/src/displays/waveshare/7in5_red/fonts/ys.ttf'.format(PI_DIR), 24)
    
    # Drawing on the Vertical image
    LBlackimage = Image.new('1', (epd.height, epd.width), 255)  # 640x384
    LRYimage = Image.new('1', (epd.height, epd.width), 255)
    drawblack = ImageDraw.Draw(LBlackimage)
    drawcolor = ImageDraw.Draw(LRYimage)
    img = Image.open('images/yotsuba_3.png')
    LBlackimage.paste(img, (0, 0))    

    #drawblack.rectangle((320, 50, 70, 100), outline = 0)
    pos1 = (329, 20)
    pos2 = (354, 20)
    text1 = f'{today_high}'
    text2 = f'{today_condition}'
    #text = f' {today_high}°\n{today_condition}'
    direction = 'ttb'

    bbox = drawcolor.textbbox(pos1, text1, font = font, direction=direction)
    bbox = (bbox[0]-3, bbox[1]-3, bbox[2]+3, bbox[3]+1)
    drawblack.rectangle(bbox, fill = 1)
    drawblack.rectangle(bbox)
    drawblack.text(pos1, text1, font = font, fill = 0, direction=direction)

    bbox = drawcolor.textbbox(pos2, text2, font = font, direction=direction)
    bbox = (bbox[0]-3, bbox[1]-3, bbox[2]+1, bbox[3]+1)
    drawblack.rectangle(bbox, fill = 1)
    drawblack.rectangle(bbox)
    drawblack.text(pos2, text2, font = font, fill = 0, direction=direction)
    #drawcolor.multiline_text(pos, text, font = font, fill = 0, align='center', anchor='ra')
    #bbox = drawcolor.multiline_textbbox(pos, text, font = font, align='center', anchor='ra')

    if today_pop > 20:
        drawcolor.text((320, 65), f'{today_pop}%', font = font, fill = 0)

    epd.display(epd.getbuffer(LBlackimage), epd.getbuffer(LRYimage))
        
    print("Goto Sleep...")
    epd.sleep()

if __name__ == '__main__':
    main()
