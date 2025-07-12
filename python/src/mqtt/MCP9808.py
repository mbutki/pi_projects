import time
import board
import busio
import adafruit_mcp9808
import paho.mqtt.client as mqtt
from statistics import median
import json

# Constants
MQTT_CLIENT_ID_PREFIX = "sensors_"
MQTT_BROKER = "pi-desk"
MQTT_TOPIC = "sensor/data"

SAMPLE_FREQ_HZ = 5
PUBLISH_INTERVAL_SEC = 1
SAMPLE_INTERVAL_SEC = 1 / SAMPLE_FREQ_HZ

PI_DIR = '/home/mbutki/pi_projects'
pi_config = json.load(open('{}/pi.config'.format(PI_DIR)))
LOCATION = pi_config['location']

MQTT_CLIENT_ID = MQTT_CLIENT_ID_PREFIX + LOCATION

# Initialize I2C and sensor
i2c_bus = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_mcp9808.MCP9808(i2c_bus)

# Initialize MQTT
client = mqtt.Client(client_id=MQTT_CLIENT_ID)
client.connect(MQTT_BROKER)
client.loop_start()

def main():
    readings = []
    last_publish_time = time.monotonic()

    try:
        while True:
            loop_start = time.monotonic()

            temp_c = sensor.temperature
            readings.append(temp_c)

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
                    print(f"Published: {json.dumps(payload)}")
                    readings.clear()
                last_publish_time = now

            elapsed = time.monotonic() - loop_start
            sleep_time = SAMPLE_INTERVAL_SEC - elapsed
            if sleep_time > 0:
                time.sleep(sleep_time)
    except KeyboardInterrupt:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Exiting...")
        client.disconnect()

