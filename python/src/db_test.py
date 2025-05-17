import time
import sys
import argparse
import json
import datetime
import logging as log
import pickle 
import requests
import os
import mariadb


def storeWeather():
    weather = {'mike': 'b'}

    print('Starting db put')
    try:
        conn = mariadb.connect(
            user="mbutki",
            host="pi-desk",
            database="pidata"
        )
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    print('Get Cursor')
    cur = conn.cursor()
    try:
        cur.execute(
            #"INSERT INTO test (id) VALUES (?)", 
            #[(5)]
            "INSERT INTO weather (time, weather) VALUES (?, ?)", 
            (datetime.datetime.utcnow(), json.dumps(weather))
        )
        print('Insert Executed')
    except mariadb.Error as e:
        print(f"Error: {e}")
    conn.commit()
    conn.close()

    print('DB client closed')

def main():
    storeWeather()

if __name__ == '__main__':
    main()
