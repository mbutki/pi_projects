TICK_DUR_MS = 50


def translate(value: int, left_min: int, left_max: int, right_min: int, right_max: int):
    # Figure out how 'wide' each range is
    left_span = left_max - left_min
    right_span = right_max - right_min

    # Convert the left range into a 0-1 range (float)
    value_scaled = float(value - left_min) / float(left_span)

    # Convert the 0-1 range into a value in the right range.
    return right_min + (value_scaled * right_span)


def get_tick_dur_ms() -> int:
    return TICK_DUR_MS


def should_trigger_secs(tick: int, secs: int) -> bool:
    ticks_per_sec = 1000 / TICK_DUR_MS
    interval = max(1, int(round(ticks_per_sec * secs)))
    return tick % interval == 0


def should_trigger_ms(tick: int, ms: int) -> bool:
    interval = max(1, int(round(ms / TICK_DUR_MS)))
    return tick % interval == 0
