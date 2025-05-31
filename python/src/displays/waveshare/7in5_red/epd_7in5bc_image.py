#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
#sys.path.append(r'../lib')

import epd7in5bc
import epdconfig
import time
from PIL import Image,ImageDraw,ImageFont
import traceback

try:
    print("epd7in5bc Demo")
    
    epd = epd7in5bc.EPD()
    print("init")
    epd.init()
    print("clear")
    epd.Clear()
    print("sleep")
    time.sleep(3)

    print("load images")
    #HBlackimage = Image.open('images/yotsuba_small.png')
    #HRYimage = Image.new('1', (epd.width, epd.height), 255)
    print("display")
    #epd.display(epd.getbuffer(HBlackimage), epd.getbuffer(HRYimage))
    print("done")
    print("Goto Sleep...")
    #epd.sleep()
     
    # Drawing on the Vertical image
    print(f'height {epd.height}')
    print(f'width {epd.width}')
    LBlackimage = Image.new('1', (epd.height, epd.width), 255)
    LRYimage = Image.new('1', (epd.height, epd.width), 255)
    drawblack = ImageDraw.Draw(LBlackimage)
    drawcolor = ImageDraw.Draw(LRYimage)


    img = Image.open('images/yotsuba_3.png')
    #img.thumbnail((480, 800))
    LBlackimage.paste(img, (0, 0))    

    epd.display(epd.getbuffer(LBlackimage), epd.getbuffer(LRYimage))

except IOError as e:
    print(e)
    
except KeyboardInterrupt:    
    print("ctrl + c:")
    epdconfig.module_exit()
    exit()
