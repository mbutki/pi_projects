import time
import board
import busio
import adafruit_sht4x
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

PI_DIR = "/home/mbutki/pi_projects"
pi_config = json.load(open(f"{PI_DIR}/pi.config"))
LOCATION = pi_config["location"]
ERROR_TOPIC = "sensor/error"

MQTT_CLIENT_ID = MQTT_CLIENT_ID_PREFIX + LOCATION

# Initialize I2C and SHT41 sensor
i2c_bus = busio.I2C(board.SCL, board.SDA)
sensor = adafruit_sht4x.SHT4x(i2c_bus)
sensor.mode = adafruit_sht4x.Mode.NOHEAT_HIGHPRECISION

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
atexit.register(lambda: client.disconnect())


def get_wifi_rssi():
    """Read the RSSI (signal level) from /proc/net/wireless."""
    try:
        with open("/proc/net/wireless", "r") as f:
            lines = f.readlines()
            for line in lines:
                if "wlan0:" in line:
                    parts = line.split()
                    return int(float(parts[3]))
    except Exception:
        return None
    return None


def log_error(error):
    print(f"logged error: {error}")
    payload = {"timestamp": time.time(), "location": LOCATION, "error": error}
    try:
        client.publish(ERROR_TOPIC, json.dumps(payload))
    except Exception as e:
        print("MQTT publish failed:", e)


def main():
    temp_readings = []
    humidity_readings = []
    wifi_readings = []
    last_publish_time = time.monotonic()

    while True:
        loop_start = time.monotonic()

        # Sample temperature and humidity in one conversion
        try:
            temp_c, humidity = sensor.measurements
            temp_readings.append(temp_c)
            humidity_readings.append(humidity)
        except Exception as e:
            log_error(f"Failed to read temp/humidity: {e}")

        # Sample WiFi RSSI
        rssi = get_wifi_rssi()
        if rssi is not None:
            wifi_readings.append(rssi)
        else:
            log_error("Failed to read WiFi RSSI")

        # Publish combined payload every second
        now = time.monotonic()
        if now - last_publish_time >= PUBLISH_INTERVAL_SEC:
            payload = {"timestamp": int(time.time()), "location": LOCATION}

            if temp_readings:
                median_temp_f = median(temp_readings) * 9 / 5 + 32
                payload["temp"] = round(median_temp_f, 2)
                temp_readings.clear()

            if humidity_readings:
                payload["humidity"] = round(median(humidity_readings), 2)
                humidity_readings.clear()

            if wifi_readings:
                payload["wifi"] = int(median(wifi_readings))
                wifi_readings.clear()

            if "temp" in payload or "humidity" in payload or "wifi" in payload:
                client.publish(MQTT_TOPIC, json.dumps(payload))

            last_publish_time = now

        # Maintain 5Hz sampling rate
        sleep_time = SAMPLE_INTERVAL_SEC - (time.monotonic() - loop_start)
        if sleep_time > 0:
            time.sleep(sleep_time)


if __name__ == "__main__":
    try:
        client.loop_start()
        main()
    except KeyboardInterrupt:
        print("Exiting...")
    finally:
        client.loop_stop()
        client.disconnect()
