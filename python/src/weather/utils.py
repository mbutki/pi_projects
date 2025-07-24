TICK_DUR_MS = 100

def translate(value, leftMin, leftMax, rightMin, rightMax):
    # Figure out how 'wide' each range is
    '''
    if args.v:
        print value
        print leftMin
        print leftMax
        print rightMin
        print rightMax
    '''
    leftSpan = leftMax - leftMin
    rightSpan = rightMax - rightMin

    '''
    if args.v:
        print float(value - leftMin)
        print float(leftSpan)
    '''
    # Convert the left range into a 0-1 range (float)
    valueScaled = float(value - leftMin) / float(leftSpan)

    # Convert the 0-1 range into a value in the right range.
    return rightMin + (valueScaled * rightSpan)

def get_tick_dur_ms():
    return TICK_DUR_MS

def should_trigger_secs(tick, secs):
    ticks_per_ms = 1 / TICK_DUR_MS
    ticks_per_sec = ticks_per_ms * 1000
    return tick % (int(ticks_per_sec * secs)) == 0

def should_trigger_ms(tick, ms):
    ticks_per_ms = 1 / TICK_DUR_MS
    return tick % (int(ticks_per_ms * ms)) == 0
