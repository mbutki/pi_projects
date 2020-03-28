from utils import *

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

def fetchWeather(db, args):
    if args.v:
        print 'Fetching weather...'
    rows = db.weather.find({}).sort('time', -1).limit(1)

    weather =  rows[0]['weather']
    if args.v:
        print 'Fetched weather'

    return weather

def fetchIndoorTemps(db):
    temp = 0
    rows = db.tempNow.find({"location" : "family room"}).sort('time', -1).limit(1)
    try:
        temp = rows[0]['value']
    except:
        pass

    return temp

def fetchOutdoorTemps(db):
    temp = 0
    rows = db.tempNow.find({"location" : "outside"}).sort('time', -1).limit(1)
    try:
        temp = rows[0]['value']
    except:
        temp = -999

    return temp