import json
from PIL import Image, ImageDraw
import datetime
import numpy

def processImage(path):
    im = Image.open(path)

    frames = []
    p = im.getpalette()
    
    try:
        while True:            
            #if not im.getpalette():
            #    im.putpalette(p)
            
            new_frame = Image.new('RGBA', im.size)
            new_frame.paste(im, (0,0), im.convert('RGBA'))
            frames.append(new_frame)
            im.seek(im.tell() + 1)
    except EOFError:
        pass

    return frames

def getMoonPhaseIcon(phase):
    if phase < 0.125:
        return NEW_MOON
    elif phase < 0.25:
        return CRESCENT_MOON
    elif phase < 0.375:
        return QUARTER_MOON
    elif phase < 0.5:
        return GIBBOUS_MOON
    elif phase < 0.625:
        return FULL_MOON
    elif phase < 0.75:
        return GIBBOUS_MOON
    elif phase < 0.875:
        return QUARTER_MOON
    elif phase <= 1:
        return CRESCENT_MOON
    

def getDailyIcons(weather):
    daily_icons = []
    for i, epoch in enumerate(sorted(weather['days'])):
        day = weather['days'][epoch]
        condition = day['condition']
        icons = []

        now = datetime.datetime.now()
        sun_rise = datetime.datetime.fromtimestamp(day['rise'])
        sun_set = datetime.datetime.fromtimestamp(day['set'])
        if i == 0 and (now > sun_set):
            # night time
            icons = [getMoonPhaseIcon(day['moonPhase'])]
        else:
            # daytime
            condition = rainIconLogic(weather, epoch)
            icons = TEXT_TO_ICON_DAY[condition] if condition in TEXT_TO_ICON_DAY else [UNKNOWN]
        daily_icons.append(icons)
    return daily_icons

def rainIconLogic(weather, epoch):
    day = weather['days'][epoch]
    condition = day['condition']
    ## Only reconsider rain icons
    #if condition in PERCIPITATION:

    ## Reconsider ALL icons
    if True:
        riseTime = day['rise'] - (day['rise'] % 3600)
        setTime = day['set'] - (day['set'] % 3600) + 3600
        
        startHour = 0
        endHour = 0
        hours = sorted(weather['hours'].keys())
        if int(hours[0]) < riseTime:
            startHour = riseTime
            endHour = setTime
        elif int(hours[0]) > setTime:
            return condition
        else:
            startHour = int(hours[0])
            endHour = setTime

        maxPop = 0
        CCs = []
        for hourEpoch in range(startHour, endHour + 3600, 3600):
            if str(hourEpoch) not in weather['hours']:
                break
            hour = weather['hours'][str(hourEpoch)]
            maxPop = max(maxPop, hour['pop'])
            CCs.append(hour['cloudCover'])
        CC = numpy.median(numpy.array(CCs))

        if maxPop < MIN_POP_FOR_RAIN:
            if CC > MIN_CC_FOR_CLOUDY:
                #if args.v:
                #    print 'Changed to cloudy. Max pop:{}, Max CC:{}, daily icon: {}'.format(maxPop, maxCC, condition)
                return 'cloudy'
            elif CC > MIN_CC_FOR_PARTLY_CLOUDY:
                #if args.v:
                #    print 'Changed to partly cloudy. Max pop:{}, Max CC:{}, daily icon: {}'.format(maxPop, maxCC, condition)
                return 'partly-cloudy'
            else:
                #if args.v:
                #    print 'Changed to clear. Max pop:{}, Max CC:{}, daily icon: {}'.format(maxPop, maxCC, condition)
                return 'clear'
    #if args.v:
    #    print 'keeping at {}'.format(condition)
    return condition

PI_DIR = '/home/mbutki/pi_projects'
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
WEATHER_DIR = PI_DIR + '/python/src/weather'
print((WEATHER_DIR + '/imgs/rain.gif'))
RAIN = processImage(WEATHER_DIR + '/imgs/rain.gif')
SUN = processImage(WEATHER_DIR + '/imgs/sun.gif')
CLOUD = processImage(WEATHER_DIR + '/imgs/cloud.gif')
MOSTLY_CLOUD = processImage(WEATHER_DIR + '/imgs/mostly_cloud.gif')
MOSTLY_SUN = processImage(WEATHER_DIR + '/imgs/mostly_sun.gif')
UNKNOWN = processImage(WEATHER_DIR + '/imgs/unknown.gif')

NEW_MOON = processImage(WEATHER_DIR + '/imgs/new_moon.gif')
CRESCENT_MOON = processImage(WEATHER_DIR + '/imgs/crescent_moon.gif')
QUARTER_MOON = processImage(WEATHER_DIR + '/imgs/quarter_moon.gif')
GIBBOUS_MOON = processImage(WEATHER_DIR + '/imgs/gibbous_moon.gif')
FULL_MOON = processImage(WEATHER_DIR + '/imgs/full_moon.gif')

JUST_CLOUDS = processImage(WEATHER_DIR + '/imgs/just_clouds.gif')
JUST_CLOUDS_NIGHT = processImage(WEATHER_DIR + '/imgs/just_clouds_night.gif')

TEXT_TO_ICON_DAY = {
    'clear': [SUN],
    'cloudy': [CLOUD],
    'partly-cloudy': [SUN, JUST_CLOUDS],
    'rain': [RAIN],
    'snow': [RAIN]
}

PERCIPITATION = set(['rain', 'snow'])

MIN_POP_FOR_RAIN = 40
MIN_CC_FOR_PARTLY_CLOUDY = 30
MIN_CC_FOR_CLOUDY = 70
