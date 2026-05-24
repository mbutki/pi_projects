from astral import LocationInfo
from astral.sun import sun
from zoneinfo import ZoneInfo
from datetime import datetime, date

LAT = "37.441607"
LON = "-122.125530"
loc = LocationInfo("Local", "Region", "America/Los_Angeles", float(LAT), float(LON))
s = sun(loc.observer, date=date(2026, 5, 11), tzinfo=loc.timezone)
print("sunrise:", s['sunrise'], "ts:", int(s['sunrise'].timestamp()))
print("sunset:", s['sunset'], "ts:", int(s['sunset'].timestamp()))
