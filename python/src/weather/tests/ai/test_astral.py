from astral import LocationInfo
from astral.sun import sun
from zoneinfo import ZoneInfo
from datetime import datetime
import json

LAT = "37.441607"
LON = "-122.125530"
loc = LocationInfo("Local", "Region", "America/Los_Angeles", float(LAT), float(LON))
ts = "1778482800"
dt = datetime.fromtimestamp(int(ts), tz=ZoneInfo("America/Los_Angeles"))

print(f"dt: {dt}, dt.date(): {dt.date()}")
s = sun(loc.observer, date=dt.date(), tzinfo=loc.timezone)
print(f"sunrise: {s['sunrise']}")
print(f"sunset: {s['sunset']}")
print(f"sunset ts: {int(s['sunset'].timestamp())}")
