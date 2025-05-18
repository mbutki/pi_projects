import json

def fetchLux(db, MAX_BRIGHTNESS):
    #if args.v:
    #    print 'Fetching lux...'
    rows = db.lightNow.find({"location" : "family room"}).sort('time', -1).limit(1)

    try:
        lux =  rows[0]['value']
        #if args.v:
        #    print 'Fetched lux: {}'.format(lux)
    except:
        lux = MAX_BRIGHTNESS
    #if args.v:
    #    print 'Used lux: {}'.format(lux)

    return lux

def fetchWeather(cur, args):
    if args.v:
        print('Fetching weather...')
    try:
        res = cur.execute("SELECT time, weather from weather")
        if args.v:
            print('SELECT Executed for weather')
    except mariadb.Error as e:
        print(f"Error: {e}")

    weather = {}
    for time, w in cur: 
        weather = json.loads(w)
    return weather

def fetchIndoorTemps(cur, args):
    value = 0
    
    if args.v:
        print('Fetching indoor temp...')
    try:
        res = cur.execute("SELECT time, location, value FROM temp_now WHERE location = 'kitchen'")
        if args.v:
            print('SELECT Executed for indoor temp')
    except mariadb.Error as e:
        print(f"Error: {e}")

    for time, loc, v in cur: 
        value = int(v)
    return value

def fetchOutdoorTemps(cur, args):
    value = -999
    
    if args.v:
        print('Fetching indoor temp...')
    try:
        res = cur.execute("SELECT time, location, value FROM temp_now WHERE location = 'outdoor'")
        if args.v:
            print('SELECT Executed for outdoor temp')
    except mariadb.Error as e:
        print(f"Error: {e}")

    for time, loc, v in cur: 
        value = int(v)
    return value

def fetchIndoorAqi(db, args):
    temp = 0
    rows = db.aqiNow.find({"location" : "family room"}).sort('time', -1).limit(1)
    try:
        temp = int(rows[0]['value'])
    except:
        temp = -999

    return temp

def fetchOutdoorAqi(db, args):
    temp = 0
    rows = db.aqiNow.find({"location" : "outside"}).sort('time', -1).limit(1)
    try:
        temp = int(rows[0]['value'])
    except:
        temp = -999

    return temp
