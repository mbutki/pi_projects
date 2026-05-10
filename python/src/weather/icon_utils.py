import random
import datetime
from collections import defaultdict
from zoneinfo import ZoneInfo
from pprint import pprint

import numpy
from PIL import Image


def process_image(path: str) -> list[Image.Image]:
    im = Image.open(path)
    frames: list[Image.Image] = []

    try:
        while True:
            new_frame = Image.new("RGBA", im.size)
            new_frame.paste(im, (0, 0), im.convert("RGBA"))
            frames.append(new_frame)
            im.seek(im.tell() + 1)
    except EOFError:
        pass

    return frames


def get_moon_phase_icon(phase: float) -> list[Image.Image]:
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
    return []


class Icon:
    def __init__(self, icon: list[Image.Image]) -> None:
        self.icon = icon
        self.frame_num = random.randint(0, len(icon) - 1)

    def advance(self) -> None:
        self.frame_num = (self.frame_num + 1) % len(self.icon)

    def get_frame(self) -> Image.Image:
        return self.icon[self.frame_num]


class IconSet:
    def __init__(self, icon_imgs: list[list[Image.Image]]) -> None:
        self.icons = [Icon(icon) for icon in icon_imgs]

    def get_frames(self) -> list[Image.Image]:
        return [icon.get_frame() for icon in self.icons]

    def advance(self) -> None:
        for icon in self.icons:
            icon.advance()


def epoch2str(epoch: str | int) -> str:
    dt_utc = datetime.datetime.fromtimestamp(float(epoch), tz=ZoneInfo("UTC"))
    dt_pst = dt_utc.astimezone(ZoneInfo("America/Los_Angeles"))

    # Pretty Print
    return dt_pst.strftime("%Y-%m-%d %I:%M:%S %p %Z")


# For each day, returns which icons to render (i.e. party_cloudy = [sun, clouds])
def get_daily_icons(weather) -> list[IconSet]:
    daily_icons: list[IconSet] = []
    for i, epoch in enumerate(sorted(weather["days"])):
        day = weather["days"][epoch]
        condition = day["condition"]
        icon_set = None

        now = datetime.datetime.now()
        sun_set = datetime.datetime.fromtimestamp(day["set"])
        if i == 0 and (now > sun_set):
            # night time
            moon_img = get_moon_phase_icon(day["moonPhase"])
            icon_set = IconSet([moon_img])
        else:
            # daytime
            condition = rain_icon_logic(weather, epoch)
            icon_set = IconSet(
                TEXT_TO_ICON_DAY[condition]
            )  # default dict handles unknown conditions
        daily_icons.append(icon_set)
    return daily_icons


def rain_icon_logic(weather, epoch) -> str:
    HOUR_IN_MINS = 3600

    day = weather["days"][epoch]
    condition = day["condition"]

    # We only want to possibly change rain --> not rain
    if condition not in PERCIPITATION:
        return condition

    rise_time = day["rise"] - (day["rise"] % HOUR_IN_MINS)
    set_time = day["set"] - (day["set"] % HOUR_IN_MINS) + HOUR_IN_MINS

    # Only look at remianing time between sunset & sunrise for today
    # abort if already after sunset
    start_hour = 0
    end_hour = 0
    hours = sorted(weather["hours"].keys())
    cur_hour = int(hours[0])
    if cur_hour < rise_time:  # currently before target day's sunrise
        start_hour = rise_time
        end_hour = set_time
    elif cur_hour > set_time:  # currently after target day's sunset
        return condition
    else:
        start_hour = cur_hour  # currently between target day's sunrise/sunset
        end_hour = set_time

    max_pop = 0
    ccs = []
    for hour_epoch in range(start_hour, end_hour + HOUR_IN_MINS, HOUR_IN_MINS):
        if str(hour_epoch) not in weather["hours"]:
            # If we exceed the 7 days of hourly data provided by Pirate Weather
            return condition
        hour = weather["hours"][str(hour_epoch)]
        max_pop = max(max_pop, hour["pop"])
        ccs.append(hour["cloudCover"])
    median_cloud_cover = numpy.median(numpy.array(ccs))

    # We only care about "fixing" off-hour rain or low prob rain
    if max_pop > MIN_POP_FOR_RAIN:
        return condition

    # Figure out what to change the rain too
    if median_cloud_cover > MIN_CC_FOR_HEAVY_CLOUD:
        return "heavy_cloud"
    elif median_cloud_cover > MIN_CC_FOR_MEDIUM_CLOUD:
        return "medium_cloud"
    elif median_cloud_cover > MIN_CC_FOR_LIGHT_CLOUD:
        return "light_cloud"
    else:
        return "clear"


PERCIPITATION = set(["light_rain", "heavy_rain", "snow", "thunder"])

MIN_POP_FOR_RAIN = 40
MIN_CC_FOR_LIGHT_CLOUD = 20
MIN_CC_FOR_MEDIUM_CLOUD = 50
MIN_CC_FOR_HEAVY_CLOUD = 90

PI_DIR = "/home/mbutki/pi_projects"

WEATHER_DIR = PI_DIR + "/python/src/weather"

SUN = process_image(WEATHER_DIR + "/imgs/sun.gif")

LIGHT_RAIN = process_image(WEATHER_DIR + "/imgs/light_rain.gif")
HEAVY_RAIN = process_image(WEATHER_DIR + "/imgs/heavy_rain.gif")
SNOW = process_image(WEATHER_DIR + "/imgs/snow.gif")
THUNDER = process_image(WEATHER_DIR + "/imgs/thunder.gif")

LIGHT_CLOUD = process_image(WEATHER_DIR + "/imgs/light_cloud.gif")
MEDIUM_CLOUD = process_image(WEATHER_DIR + "/imgs/medium_cloud.gif")
HEAVY_CLOUD = process_image(WEATHER_DIR + "/imgs/heavy_cloud.gif")

ATMO = process_image(WEATHER_DIR + "/imgs/atmo.gif")
UNKNOWN = process_image(WEATHER_DIR + "/imgs/unknown.gif")

NEW_MOON = process_image(WEATHER_DIR + "/imgs/new_moon.gif")
CRESCENT_MOON = process_image(WEATHER_DIR + "/imgs/crescent_moon.gif")
QUARTER_MOON = process_image(WEATHER_DIR + "/imgs/quarter_moon.gif")
GIBBOUS_MOON = process_image(WEATHER_DIR + "/imgs/gibbous_moon.gif")
FULL_MOON = process_image(WEATHER_DIR + "/imgs/full_moon.gif")

JUST_CLOUDS_NIGHT = process_image(WEATHER_DIR + "/imgs/just_clouds_night.gif")

unknown_icon_set = [UNKNOWN]
TEXT_TO_ICON_DAY = defaultdict(
    lambda: unknown_icon_set,
    {
        "clear": [SUN],
        "light_cloud": [SUN, LIGHT_CLOUD],
        "medium_cloud": [SUN, MEDIUM_CLOUD],
        "heavy_cloud": [HEAVY_CLOUD],
        "light_rain": [LIGHT_RAIN],
        "heavy_rain": [HEAVY_RAIN],
        "thunder": [THUNDER],
        "atmo": [ATMO],
        "snow": [SNOW],
    },
)
