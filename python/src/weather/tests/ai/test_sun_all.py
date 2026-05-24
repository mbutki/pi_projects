from astral import LocationInfo
from astral.sun import sun
from zoneinfo import ZoneInfo
from datetime import datetime

LAT = "37.441607"
LON = "-122.125530"
loc = LocationInfo("Local", "Region", "America/Los_Angeles", float(LAT), float(LON))
for d in range(10, 14):
    dt_date = datetime(2026, 5, d).date()
    s = sun(loc.observer, date=dt_date, tzinfo=loc.timezone)
    print(f"Date: {dt_date}")
    print(f"  sunrise: {s['sunrise']}")
    print(f"  sunset: {s['sunset']}")
