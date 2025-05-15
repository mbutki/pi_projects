#!/usr/bin/env python

import datetime
import time

from microdotphat import *


print("""Clock

Displays the time in hours, minutes and seconds

Press Ctrl+C to exit.
""")

set_brightness(0.05)
set_rotate180(True)

while True:
    clear()
    t = datetime.datetime.now()

    if t.strftime('%p') == 'AM':
        set_decimal(0, 0)
    else:
        set_decimal(0, 1)

    hour = t.strftime('%-I')
    if len(hour) == 1:
        hour = ' ' + hour

    timeStr = hour + t.strftime(':%M')

    write_string(timeStr, kerning=False)
    show()
    time.sleep(0.05)
