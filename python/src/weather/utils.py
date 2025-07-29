TICK_DUR_MS = 50

def translate(value, left_min, left_max, right_min, right_max):
    # Figure out how 'wide' each range is
    left_span = left_max - left_min
    right_span = right_max - right_min

    # Convert the left range into a 0-1 range (float)
    value_scaled = float(value - left_min) / float(left_span)

    # Convert the 0-1 range into a value in the right range.
    return right_min + (value_scaled * right_span)

def get_tick_dur_ms():
    return TICK_DUR_MS

def should_trigger_secs(tick, secs):
    ticks_per_ms = 1 / TICK_DUR_MS
    ticks_per_sec = ticks_per_ms * 1000
    return tick % (int(ticks_per_sec * secs)) == 0

def should_trigger_ms(tick, ms):
    ticks_per_ms = 1 / TICK_DUR_MS
    return tick % (int(ticks_per_ms * ms)) == 0
