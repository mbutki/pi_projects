import time
import Adafruit_GPIO.SPI as SPI
import Adafruit_MCP3008
import numpy
import MySQLdb
import json
import os

SPI_PORT   = 0
SPI_DEVICE = 0
mcp = Adafruit_MCP3008.MCP3008(spi=SPI.SpiDev(SPI_PORT, SPI_DEVICE))
READ_FREQ_SECS = 1
WRITE_FREQ_SECS = 1 * 60 * 10
LOCATION = '"desk"'

db_config = json.load(open('/home/mbutki/pi_projects/db.config'))

data = []
while True:
    value = mcp.read_adc(7)

    millivolts = value * (3300.0 / 1024.0)
    temp_C = (millivolts - 500.0) / 10.0
    temp_F = ((temp_C + 1.3) * 9.0 / 5.0) + 32
    if len(data) < WRITE_FREQ_SECS:
        data.append(temp_F)
        print temp_F
    else:
        median = numpy.median(numpy.array(data))
        temp = int(round(median))
        data = []

        db = MySQLdb.connect(db_config)
        cur = db.cursor()
        try:
            cmd = 'insert into temperature values(NOW(), {0}, {1});'.format(LOCATION, temp)
            print cmd
            cur.execute(cmd)
            db.commit()
        except Exception as e:
            print 'had error:{0}'.format(e)
            db.rollback()
        db.close()
    time.sleep(READ_FREQ_SECS)
