#!/usr/bin/python
import time
import datetime
from Adafruit_LED_Backpack import SevenSegment

SPEED = 0.2
segment = SevenSegment.SevenSegment(address=0x70)
segment.begin()
segment.clear()

# top seg
#segment.set_digit_raw(0, 0b00000001)
# top right
#segment.set_digit_raw(0, 0b00000010)
# bottom right
#segment.set_digit_raw(0, 0b00000100)
# bottom
#segment.set_digit_raw(0, 0b00001000)
# bottom left
#segment.set_digit_raw(0, 0b00010000)
# top left
#segment.set_digit_raw(0, 0b00100000)
# middle
#segment.set_digit_raw(1, 0b01000000)

top = 1 << 0
topRight = 1 << 1
bottomRight = 1 << 2
bottom = 1 << 3
bottomLeft = 1 << 4
topLeft = 1 << 5
middle = 1 << 6

digits = {0: 0x3F,
    1: 0x06,
    2: 0x5B,
    3: 0x4F,
    4: 0x66,
    5: 0x6D,
    6: 0x7D,
    7: 0x07,
    8: 0x7F,
    9: 0x6F}


def oneTwo(pos):
    num = digits[1]
    show(pos, num)

    num = remove(pos, num, topRight)
    num = remove(pos, num, bottomRight)
    num = add(pos, num, bottom)
    num = add(pos, num, bottomLeft)
    num = add(pos, num, middle)
    num = add(pos, num, topRight)
    num = add(pos, num, top)

def twoThree(pos):
    num = digits[2]
    show(pos, num)

    num = remove(pos, num, bottomLeft)
    num = add(pos, num, bottomRight)

def threeFour(pos):
    num = digits[3]
    show(pos, num)

    num = remove(pos, num, top)
    num = add(pos, num, topLeft)
    num = remove(pos, num, bottom)

def fourFive(pos):
    num = digits[4]
    show(pos, num)

    num = remove(pos, num, topRight)
    num = add(pos, num, top)
    num = add(pos, num, bottom)

def fiveSix(pos):
    num = digits[5]
    show(pos, num)

    #num = add(pos, num, bottomLeft)
    num = remove(pos, num, bottom)
    num = remove(pos, num, bottomRight)
    num = remove(pos, num, middle)

    num = add(pos, num, bottomLeft)
    num = add(pos, num, bottom)
    num = add(pos, num, bottomRight)
    num = add(pos, num, middle)

def sixSeven(pos):
    num = digits[6]
    show(pos, num)

    num = remove(pos, num, middle)
    num = remove(pos, num, bottomRight)
    num = remove(pos, num, bottom)
    num = remove(pos, num, bottomLeft)
    num = remove(pos, num, topLeft)

    num = add(pos, num, topRight)
    num = add(pos, num, bottomRight)

def sevenEight(pos):
    num = digits[7]
    show(pos, num)

    num = add(pos, num, bottom)
    num = add(pos, num, bottomLeft)
    num = add(pos, num, middle)
    num = add(pos, num, topLeft)

def eightNine(pos):
    num = digits[8]
    show(pos, num)

    num = remove(pos, num, bottomRight)
    num = remove(pos, num, bottomLeft)
    num = add(pos, num, bottomRight)

def nineZero(pos):
    num = digits[9]
    show(pos, num)

    removeNine(pos)
    drawZero(pos)

def zeroOne(pos):
    num = digits[0]
    show(pos, num)

    num = remove(pos, num, top)
    num = remove(pos, num, topLeft)
    num = remove(pos, num, bottomLeft)
    num = remove(pos, num, bottom)

def fiveZero(pos):
    num = digits[5]
    show(pos, num)

    removeFive(pos)
    drawZero(pos)

def twoOne(pos):
    num = digits[2]
    show(pos, num)

    num = remove(pos, num, top)
    num = remove(pos, num, topRight)
    num = remove(pos, num, middle)
    num = remove(pos, num, bottomLeft)
    num = remove(pos, num, bottom)
    num = add(pos, num, bottomRight)
    num = add(pos, num, topRight)

def oneOff(pos):
    num = digits[1]
    show(pos, num)

    num = remove(pos, num, topRight)
    num = remove(pos, num, bottomRight)

def offOne(pos):
    num = digits[1]
    show(pos, num)

    num = add(pos, num, bottomRight)
    num = add(pos, num, topRight)

def removeFive(pos):
    num = digits[5]
    num = remove(pos, num, top)
    num = remove(pos, num, topLeft)
    num = remove(pos, num, middle)
    num = remove(pos, num, bottomRight)
    num = remove(pos, num, bottom)


def removeNine(pos):
    num = digits[9]
    num = remove(pos, num, middle)
    num = remove(pos, num, topLeft)
    num = remove(pos, num, top)
    num = remove(pos, num, topRight)
    num = remove(pos, num, bottomRight)
    num = remove(pos, num, bottom)

def drawZero(pos):
    num = 0
    num = add(pos, num, bottomLeft)
    num = add(pos, num, topLeft)
    num = add(pos, num, top)
    num = add(pos, num, topRight)
    num = add(pos, num, bottomRight)
    num = add(pos, num, bottom)

def blink():
    now = datetime.datetime.now()
    hour = now.hour
    minute = now.minute
    second = now.second
    segment.set_colon(second % 2)

def show(pos, num):
    segment.set_digit_raw(pos, num)
    blink()

    try:
        segment.write_display()
    except:
        print 'Display write error'
    time.sleep(SPEED)

def add(pos, num, offset, shouldShow = True):
    num =  num | offset
    if shouldShow:
        show(pos, num)
    return num

def remove(pos, num, offset, shouldShow = True):
    num =  num & ~offset
    if shouldShow:
        show(pos, num)
    return num

def main():
    minMapOnes = {0: nineZero,
        1: zeroOne,
        2: oneTwo,
        3: twoThree,
        4: threeFour,
        5: fourFive,
        6: fiveSix,
        7: sixSeven,
        8: sevenEight,
        9: eightNine}

    minMapTens = {0: fiveZero,
        1: zeroOne,
        2: oneTwo,
        3: twoThree,
        4: threeFour,
        5: fourFive}

    hourMapOnes = {1: twoOne,
        2: oneTwo,
        3: twoThree,
        4: threeFour,
        5: fourFive,
        6: fiveSix,
        7: sixSeven,
        8: sevenEight,
        9: eightNine,
        10: nineZero,
        11: zeroOne,
        12: oneTwo}

    hourMapTens = { 0: oneOff,
        1: offOne}

    #while True:
    #    for key, value in minMapOnes.iteritems():
    #        value(0)

    shouldAnimate = True
    while True:
        now = datetime.datetime.now()
        hour = now.hour
        minute = now.minute
        second = now.second


        if hour == 0:
            hour = 12
        elif hour > 12:
            hour -= 12

        hourTens = int(hour / 10)
        hourOnes = hour % 10
        minTens = int(minute / 10)
        minOnes = minute % 10

        # Set hours
        
        if second == 0 and shouldAnimate: # new minute
            shouldAnimate = False
            minMapOnes[minOnes](3)
            if minOnes == 0: # new tens minute
                minMapTens[minTens](2)
                if minTens == 0: # new hour
                    hourMapOnes[hour](1)
                    if hour == 1 or hour == 10:
                        hourMapTens[hourTens]
        else:
            segment.clear()
            if hourTens != 0:
                segment.set_digit(0, hourTens)
            segment.set_digit(1, hourOnes)

            # Set minutes
            segment.set_digit(2, minTens)
            segment.set_digit(3, minOnes)
          
            # Toggle colon
            segment.set_colon(second % 2)

        if second == 59 and not shouldAnimate:
            shouldAnimate = True

        try:
            segment.write_display()
        except:
            print 'Display write error'

        time.sleep(0.1)

if __name__ == '__main__':
    main()
