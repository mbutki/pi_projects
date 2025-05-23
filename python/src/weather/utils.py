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
