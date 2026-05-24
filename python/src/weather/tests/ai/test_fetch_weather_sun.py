import sys
from datetime import datetime
from zoneinfo import ZoneInfo
from astral import LocationInfo
from astral.sun import sun

ts = "1778482800"
dt = datetime.fromtimestamp(int(ts), tz=ZoneInfo("America/Los_Angeles"))
print(f"ts: {ts}, dt: {dt}, dt.date(): {dt.date()}")

LAT = 37.441607
LON = -122.125530
loc = LocationInfo("Local", "Region", "America/Los_Angeles", float(LAT), float(LON))
s = sun(loc.observer, date=dt.date(), tzinfo=loc.timezone)
print(f"rise: {int(s['sunrise'].timestamp())}")
print(f"set: {int(s['sunset'].timestamp())}")
