import datetime
day_set = 1778555234
now = datetime.datetime.now()
sun_set = datetime.datetime.fromtimestamp(day_set)
print(f"now: {now}")
print(f"sun_set: {sun_set}")
print(f"now > sun_set: {now > sun_set}")
