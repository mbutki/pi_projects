import numpy

MIN_POP_FOR_RAIN = 40
MIN_CC_FOR_LIGHT_CLOUD = 20
MIN_CC_FOR_MEDIUM_CLOUD = 50
MIN_CC_FOR_HEAVY_CLOUD = 90


def adjusted(weather, epoch, condition) -> tuple[str, int]:
    HOUR_IN_MINS = 3600

    day = weather["days"][epoch]

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
        return (condition, 0)
    else:
        start_hour = cur_hour  # currently between target day's sunrise/sunset
        end_hour = set_time

    max_pop = 0
    ccs = []
    for hour_epoch in range(start_hour, end_hour + HOUR_IN_MINS, HOUR_IN_MINS):
        if str(hour_epoch) not in weather["hours"]:
            # If we exceed the 7 days of hourly data provided by Pirate Weather
            return (condition, max_pop)
        hour = weather["hours"][str(hour_epoch)]
        max_pop = max(max_pop, hour["pop"])
        ccs.append(hour["cloudCover"])
    median_cloud_cover = numpy.median(numpy.array(ccs))

    # We only care about "fixing" off-hour rain or low prob rain
    if max_pop > MIN_POP_FOR_RAIN:
        return (condition, max_pop)

    # Figure out what to change the rain too
    if median_cloud_cover > MIN_CC_FOR_HEAVY_CLOUD:
        return ("heavy_cloud", max_pop)
    elif median_cloud_cover > MIN_CC_FOR_MEDIUM_CLOUD:
        return ("medium_cloud", max_pop)
    elif median_cloud_cover > MIN_CC_FOR_LIGHT_CLOUD:
        return ("light_cloud", max_pop)
    else:
        return ("clear", max_pop)
