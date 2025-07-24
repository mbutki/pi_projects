import random
import datetime
from collections import defaultdict

import numpy
from PIL import Image

def process_image(path):
    im = Image.open(path)
    frames = []

    try:
        while True:
            new_frame = Image.new('RGBA', im.size)
            new_frame.paste(im, (0,0), im.convert('RGBA'))
            frames.append(new_frame)
            im.seek(im.tell() + 1)
    except EOFError:
        pass

    return frames

def get_moon_phase_icon(phase):
    if phase < 0.125:
        return NEW_MOON
    if phase < 0.25:
        return CRESCENT_MOON
    if phase < 0.375:
        return QUARTER_MOON
    if phase < 0.5:
        return GIBBOUS_MOON
    if phase < 0.625:
        return FULL_MOON
    if phase < 0.75:
        return GIBBOUS_MOON
    if phase < 0.875:
        return QUARTER_MOON
    if phase <= 1:
        return CRESCENT_MOON

class Icon():
    def __init__(self, icon):
        self.icon = icon
        self.frame_num = random.randint(0, len(icon)-1)

    def advance(self):
        self.frame_num = (self.frame_num + 1) % len(self.icon)

    def get_frame(self):
        return self.icon[self.frame_num]

class IconSet():
    def __init__(self, icon_imgs):
        self.icons = [Icon(icon) for icon in icon_imgs]

    def get_frames(self):
        return [icon.get_frame() for icon in self.icons]

    def advance(self):
        for icon in self.icons:
            icon.advance()

# For each day, returns which icons to render (i.e. party_cloudy = [sun, clouds])
def get_daily_icons(weather):
    daily_icons = []
    for i, epoch in enumerate(sorted(weather['days'])):
        day = weather['days'][epoch]
        condition = day['condition']
        icon_set = None

        now = datetime.datetime.now()
        sun_set = datetime.datetime.fromtimestamp(day['set'])
        if i == 0 and (now > sun_set):
            # night time
            moon_img = get_moon_phase_icon(day['moonPhase'])
            icon_set = IconSet([moon_img])
        else:
            # daytime
            condition = rain_icon_logic(weather, epoch)
            icon_set = TEXT_TO_ICON_DAY[condition] # default dict handles unknown conditions
        daily_icons.append(icon_set)
    return daily_icons

def rain_icon_logic(weather, epoch):
    day = weather['days'][epoch]
    condition = day['condition']

    rise_time = day['rise'] - (day['rise'] % 3600)
    set_time = day['set'] - (day['set'] % 3600) + 3600

    start_hour = 0
    end_hour = 0
    hours = sorted(weather['hours'].keys())
    if int(hours[0]) < rise_time:
        start_hour = rise_time
        end_hour = set_time
    elif int(hours[0]) > set_time:
        return condition
    else:
        start_hour = int(hours[0])
        end_hour = set_time

    max_pop = 0
    ccs = []
    for hour_epoch in range(start_hour, end_hour + 3600, 3600):
        if str(hour_epoch) not in weather['hours']:
            break
        hour = weather['hours'][str(hour_epoch)]
        max_pop = max(max_pop, hour['pop'])
        ccs.append(hour['cloudCover'])
    cc = numpy.median(numpy.array(ccs))

    if max_pop < MIN_POP_FOR_RAIN:
        if cc > MIN_CC_FOR_CLOUDY:
            return 'cloudy'
        if cc > MIN_CC_FOR_PARTLY_CLOUDY:
            return 'partly-cloudy'
        return 'clear'
    return condition

PI_DIR = '/home/mbutki/pi_projects'

WEATHER_DIR = PI_DIR + '/python/src/weather'
RAIN = process_image(WEATHER_DIR + '/imgs/rain.gif')
SUN = process_image(WEATHER_DIR + '/imgs/sun.gif')
CLOUD = process_image(WEATHER_DIR + '/imgs/cloud.gif')
MOSTLY_CLOUD = process_image(WEATHER_DIR + '/imgs/mostly_cloud.gif')
MOSTLY_SUN = process_image(WEATHER_DIR + '/imgs/mostly_sun.gif')
UNKNOWN = process_image(WEATHER_DIR + '/imgs/unknown.gif')

NEW_MOON = process_image(WEATHER_DIR + '/imgs/new_moon.gif')
CRESCENT_MOON = process_image(WEATHER_DIR + '/imgs/crescent_moon.gif')
QUARTER_MOON = process_image(WEATHER_DIR + '/imgs/quarter_moon.gif')
GIBBOUS_MOON = process_image(WEATHER_DIR + '/imgs/gibbous_moon.gif')
FULL_MOON = process_image(WEATHER_DIR + '/imgs/full_moon.gif')

JUST_CLOUDS = process_image(WEATHER_DIR + '/imgs/just_clouds.gif')
JUST_CLOUDS_NIGHT = process_image(WEATHER_DIR + '/imgs/just_clouds_night.gif')

unknown_icon_set = IconSet([UNKNOWN])
TEXT_TO_ICON_DAY = defaultdict(lambda: unknown_icon_set, {
    'clear': IconSet([SUN]),
    'cloudy': IconSet([CLOUD]),
    'partly-cloudy': IconSet([SUN, JUST_CLOUDS]),
    'rain': IconSet([RAIN]),
    'snow': IconSet([RAIN])
})

PERCIPITATION = set(['rain', 'snow'])

MIN_POP_FOR_RAIN = 40
MIN_CC_FOR_PARTLY_CLOUDY = 30
MIN_CC_FOR_CLOUDY = 70
