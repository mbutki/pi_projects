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
            print('Insert Executed')
    except mariadb.Error as e:
        print(f"Error: {e}")

    weather = {}
    for time, w in cur: 
        weather = json.loads(w)
    return weather

def fetchIndoorTemps(cur):
    temp = 0
    '''
    rows = db.tempNow.find({"location" : "family room"}).sort('time', -1).limit(1)
    try:
        temp = rows[0]['value']
    except:
        pass
    '''
    return temp

def fetchOutdoorTemps(cur):
    temp = 0
    '''
    rows = db.tempNow.find({"location" : "outside"}).sort('time', -1).limit(1)
    try:
        temp = rows[0]['value']
    except:
        temp = -999
    '''
    return temp

def fetchIndoorAqi(db):
    temp = 0
    rows = db.aqiNow.find({"location" : "family room"}).sort('time', -1).limit(1)
    try:
        temp = int(rows[0]['value'])
    except:
        temp = -999

    return temp

def fetchOutdoorAqi(db):
    temp = 0
    rows = db.aqiNow.find({"location" : "outside"}).sort('time', -1).limit(1)
    try:
        temp = int(rows[0]['value'])
    except:
        temp = -999

    return temp
