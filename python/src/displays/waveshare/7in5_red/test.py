#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
sys.path.append(r'../lib')

import epd7in5bc
import epdconfig
import time
from PIL import Image,ImageDraw,ImageFont
import traceback

try:
    print("epd7in5bc Demo")
    
    epd = epd7in5bc.EPD()
    print("init and Clear")
    epd.init()
    epd.Clear()
    time.sleep(1)
    
    # Drawing on the image
    print("Drawing")    
    font24 = ImageFont.truetype('../lib/Font.ttc', 24)
    font18 = ImageFont.truetype('../lib/Font.ttc', 18)
    
    # Drawing on the Horizontal image
    print("1.Drawing on the Horizontal image...") 
    HBlackimage = Image.new('1', (epd.width, epd.height), 255)  # 298*126
    HRYimage = Image.new('1', (epd.width, epd.height), 255)  # 298*126  ryimage: red or yellow image  
    drawblack = ImageDraw.Draw(HBlackimage)
    drawry = ImageDraw.Draw(HRYimage)
    drawblack.text((10, 0), 'hello world', font = font24, fill = 0)
    drawblack.text((10, 20), '7.5inch e-Paper bc', font = font24, fill = 0)
    drawblack.text((150, 0), u'微雪电子', font = font24, fill = 0)    
    drawblack.line((20, 50, 70, 100), fill = 0)
    drawblack.line((70, 50, 20, 100), fill = 0)
    drawblack.rectangle((20, 50, 70, 100), outline = 0)    
    drawry.line((165, 50, 165, 100), fill = 0)
    drawry.line((140, 75, 190, 75), fill = 0)
    drawry.arc((140, 50, 190, 100), 0, 360, fill = 0)
    drawry.rectangle((80, 50, 130, 100), fill = 0)
    drawry.chord((200, 50, 250, 100), 0, 360, fill = 0)
    epd.display(epd.getbuffer(HBlackimage), epd.getbuffer(HRYimage))
    time.sleep(2)
    
    
    print("Clear...")
    epd.init()
    epd.Clear()
    
    print("Goto Sleep...")
    epd.sleep()
        
except IOError as e:
    print(e)
    
except KeyboardInterrupt:    
    print("ctrl + c:")
    epdconfig.module_exit()
    exit()
