import datetime
ts = 1715486822 # example
print("now:", datetime.datetime.now())
print("sunset:", datetime.datetime.fromtimestamp(ts))
print("now tz:", datetime.datetime.now().astimezone().tzinfo)
