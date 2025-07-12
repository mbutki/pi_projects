import json
import time
import mariadb
import paho.mqtt.client as mqtt
from statistics import median
import argparse
import threading
from collections import defaultdict

# --- Configuration ---
DB_CONFIG = {
    "host": "localhost",
    "user": "mbutki",
    "password": "",
    "database": "pidata"
}

MQTT_BROKER = "localhost"
MQTT_TOPIC = "sensor/data"

# --- Data Buffer for Median Calculation ---
data_buffer = []
buffer_start = None
BUFFER_DURATION = 300  # 5 minutes in seconds

parser = argparse.ArgumentParser(description='Bridge mqtt and mysql')
parser.add_argument('-v', default=False, action='store_true', help='verbose mode')
args = parser.parse_args()

# --- Connect to MariaDB ---
def get_db_connection():
    return mariadb.connect(**DB_CONFIG)

# --- Create tables if not exist ---
def create_tables():
    create_latest_sql = """
    CREATE TABLE IF NOT EXISTS sensor_latest (
        location VARCHAR(255) PRIMARY KEY,
        timestamp INT UNSIGNED NOT NULL,
        temp FLOAT NULL,
        humidity FLOAT NULL,
        pressure FLOAT NULL,
        lux FLOAT NULL,
        aqi INT NULL
    );
    """
    create_median_sql = """
    CREATE TABLE IF NOT EXISTS sensor_5min_median (
        id INT AUTO_INCREMENT PRIMARY KEY,
        start_ts INT UNSIGNED NOT NULL,
        end_ts INT UNSIGNED NOT NULL,
        location VARCHAR(255) NOT NULL,
        temp FLOAT NULL,
        humidity FLOAT NULL,
        pressure FLOAT NULL,
        lux FLOAT NULL,
        aqi INT NULL,
        INDEX idx_location (location),
        INDEX idx_time (start_ts, end_ts)
    );
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(create_latest_sql)
    cursor.execute(create_median_sql)
    conn.commit()
    conn.close()
    if args.v:
        print("✅ Tables ensured.")

# --- Insert latest reading ---
def insert_latest(cursor, data):
    cursor.execute("""
        REPLACE INTO sensor_latest (location, timestamp, temp, humidity, pressure, lux, aqi)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("location"),
        data.get("timestamp"),
        data.get("temp"),
        data.get("humidity"),
        data.get("pressure"),
        data.get("lux"),
        data.get("aqi")
    ))

# --- Store 5-minute medians ---
def compute_and_store_median():
    global data_buffer
    if not data_buffer:
        return

    # Group data by location
    location_buffers = defaultdict(list)
    for entry in data_buffer:
        loc = entry.get("location")
        if loc:
            location_buffers[loc].append(entry)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        for location, entries in location_buffers.items():
            if not entries:
                continue

            fields = ["temp", "humidity", "pressure", "lux", "aqi"]
            median_values = {}
            for field in fields:
                values = [d[field] for d in entries if field in d and d[field] is not None]
                median_values[field] = median(values) if values else None

            start_ts = int(entries[0]["timestamp"])
            end_ts = int(entries[-1]["timestamp"])

            cursor.execute("""
                INSERT INTO sensor_5min_median (start_ts, end_ts, location, temp, humidity, pressure, lux, aqi)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                start_ts, end_ts, location,
                median_values["temp"], median_values["humidity"],
                median_values["pressure"], median_values["lux"], median_values["aqi"]
            ))

            if args.v:
                print(f"✅  Stored 5min median for {location} from {start_ts} to {end_ts}")

        conn.commit()
        conn.close()
    except mariadb.Error as e:
        print("DB Insert Error:", e)

    # Clear buffer after storing
    data_buffer.clear()

# --- MQTT Callbacks ---
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT with result code", rc)
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    global buffer_start, data_buffer
    #try:
    data = json.loads(msg.payload)
    if args.v:
        print("Received:", data)

    conn = get_db_connection()
    cursor = conn.cursor()
    insert_latest(cursor, data)
    conn.commit()
    conn.close()

    ts = int(data["timestamp"])
    if buffer_start is None:
        buffer_start = ts

    if ts - buffer_start < BUFFER_DURATION:
        data_buffer.append(data)
    else:
        compute_and_store_median()
        buffer_start = ts
        data_buffer = [data]

    #except Exception as e:
    #    print("Error processing message:", e)

def delete_old_sensor_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Note: 14 * 86400 is # of seconds in 14 days
        cursor.execute("""
            DELETE FROM sensor_5min_median
            WHERE end_ts < UNIX_TIMESTAMP(NOW()) - 14 * 86400;
        """)
        conn.commit()
        conn.close()
        print("Old sensor data deleted.")
    except mariadb.Error as e:
        print("Error deleting old sensor data:", e)

def periodic_cleanup():
    while True:
        time.sleep(3600)  # every hour
        delete_old_sensor_data()

# --- Main ---
def main():
    create_tables()
    threading.Thread(target=periodic_cleanup, daemon=True).start()

    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(MQTT_BROKER, 1883, 60)
    client.loop_forever()

if __name__ == "__main__":
    main()

