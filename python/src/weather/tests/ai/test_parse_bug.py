from datetime import datetime
import zoneinfo

ts = "1778482800"
dt = datetime.fromtimestamp(int(ts), tz=zoneinfo.ZoneInfo("America/Los_Angeles"))
print(f"dt from db: {dt}")

ts_1778468782 = "1778468782"
dt_1778468782 = datetime.fromtimestamp(int(ts_1778468782), tz=zoneinfo.ZoneInfo("America/Los_Angeles"))
print(f"sunset from db: {dt_1778468782}")

