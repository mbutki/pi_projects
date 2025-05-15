#!/usr/bin/python
import sys
import epd2in13_V2
import epdconfig
import time
from PIL import Image,ImageDraw,ImageFont
import traceback
from datetime import datetime

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

def fullRefresh():
    return False

def run():
    print("epd7in5bc Demo")

    mainFont = ImageFont.truetype('{}/displays/waveshare/python2/Roboto-Bold.ttf'.format(PI_DIR), 95)

    epd = epd2in13_V2.EPD()

    image = Image.new('1', (epd.width, epd.height), 255)  # 126*298
    draw = ImageDraw.Draw(image)
    epd.init(epd.FULL_UPDATE)
    epd.displayPartBaseImage(epd.getbuffer(image))

    while True:
        now = datetime.now()
        hour = now.strftime('%I')
        minute = now.strftime('%M')
        image = Image.new('1', (epd.width, epd.height), 255)  # 126*298
        draw = ImageDraw.Draw(image)
        draw.text((5, 25), hour, font = mainFont, fill = 0)
        draw.text((5, 110), minute, font = mainFont, fill = 0)
        image = image.transpose(Image.ROTATE_180)

        if minute == '00' || minute == '15' || minute == '30' || minute == '45' ||:
            epd.init(epd.FULL_UPDATE)
            epd.displayPartBaseImage(epd.getbuffer(image))
        else:
            epd.init(epd.PART_UPDATE)
            epd.displayPartial(epd.getbuffer(image))
        
        #epd.sleep()
        now = datetime.now()
        sec = int(now.strftime('%-S'))
        time.sleep(60-sec)

if __name__ == '__main__':
    main()
