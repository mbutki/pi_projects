import time
import board
import busio
import adafruit_mcp9808
import paho.mqtt.client as mqtt
from statistics import median
import json
import atexit

# Constants
MQTT_CLIENT_ID_PREFIX = "sensors_"
MQTT_BROKER = "pi-desk"
MQTT_TOPIC = "sensor/data"

SAMPLE_FREQ_HZ = 5
PUBLISH_INTERVAL_SEC = 1
SAMPLE_INTERVAL_SEC = 1 / SAMPLE_FREQ_HZ

PI_DIR = '/home/mbutki/pi_projects'
pi_config = json.load(open(f"{PI_DIR}/pi.config"))
LOCATION = pi_config['location']
ERROR_TOPIC = "sensor/error"

MQTT_CLIENT_ID = MQTT_CLIENT_ID_PREFIX + LOCATION

# Initialize I2C and sensor
i2c_bus = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_mcp9808.MCP9808(i2c_bus)

# Initialize MQTT
client = mqtt.Client(client_id=MQTT_CLIENT_ID)

def on_disconnect(client, userdata, rc):
    """Reconnect automatically if disconnected."""
    print("MQTT disconnected (rc=%s), attempting reconnect..." % rc)
    while True:
        try:
            client.reconnect()
            print("MQTT reconnected.")
            break
        except Exception as e:
            print(f"Reconnect failed: {e}")
            time.sleep(5)

client.on_disconnect = on_disconnect

client.connect(MQTT_BROKER)

# Ensure clean shutdown
atexit.register(lambda: client.disconnect())

def log_error(error):
    print(f'logged error: {error}')
    payload = {
        "timestamp": time.time(),
        "location": LOCATION,
        "error": error
    }

    try:
        msg = json.dumps(payload)
        client.publish(ERROR_TOPIC, msg)
    except Exception as e:
        print("MQTT publish failed:", e)

def main():
    readings = []
    last_publish_time = time.monotonic()

    while True:
        loop_start = time.monotonic()

        # Read sensor
        try:
            temp_c = sensor.temperature
            readings.append(temp_c)
        except Exception as e:
            log_error(f'Failed to read temp: {e}')

        # Publish every second
        now = time.monotonic()
        if now - last_publish_time >= PUBLISH_INTERVAL_SEC:
            if readings:
                median_temp_c = median(readings)
                temp_f = median_temp_c * 9 / 5 + 32
                payload = {
                    "timestamp": int(time.time()),
                    "location": LOCATION,
                    "temp": round(temp_f, 2)
                }
                client.publish(MQTT_TOPIC, json.dumps(payload))
                #print(f"Published: {json.dumps(payload)}")
                readings.clear()
            last_publish_time = now

        # Maintain sampling rate
        elapsed = time.monotonic() - loop_start
        sleep_time = SAMPLE_INTERVAL_SEC - elapsed
        if sleep_time > 0:
            time.sleep(sleep_time)

if __name__ == "__main__":
    try:
        client.loop_start()   # background MQTT network loop
        main()
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        client.loop_stop()
        client.disconnect()
