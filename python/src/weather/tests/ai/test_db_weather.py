import sys
sys.path.append('python/src')
from weather import db_reads
import mariadb
from collections import namedtuple
import datetime

Args = namedtuple('Args', ['v'])
args = Args(v=True)

try:
    conn = mariadb.connect(user="mbutki", host="pi-desk", database="pidata")
    cur = conn.cursor()
    weather = db_reads.fetch_weather(cur, args)
    
    for i, epoch in enumerate(sorted(weather["days"])):
        day = weather["days"][epoch]
        now = datetime.datetime.now()
        sun_set = datetime.datetime.fromtimestamp(day["set"])
        print(f"i={i}, epoch={epoch}, day['set']={day['set']}, sun_set={sun_set}, now={now}, now > sun_set={now > sun_set}")
except Exception as e:
    print("Error:", e)
