import asyncio
from bleak import BleakScanner, BleakClient, BleakError
import RPi.GPIO as GPIO

# GPIO Setup
LED_PIN = 18
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED_PIN, GPIO.OUT)
pwm = GPIO.PWM(LED_PIN, 200)  # 200 Hz for brightness
pwm.start(0)

# BLE UUIDs (match with Pico)
SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0"
CHAR_UUID = "12345678-1234-5678-1234-56789abcdef1"

def map_value(val, in_min, in_max, out_min, out_max):
    return int((val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min)

def handle_notification(_, data):
    pot_value = int.from_bytes(data, byteorder='little')
    print(f"📈 Potentiometer: {pot_value}")
    brightness = map_value(pot_value, 0, 65535, 0, 100)
    pwm.ChangeDutyCycle(brightness)

async def find_pico():
    print("🔍 Scanning for Pico...")
    while True:
        try:
            devices = await BleakScanner.discover(timeout=5)
            for d in devices:
                if d.name and "PicoPot" in d.name:
                    print(f"✅ Found Pico: {d.name} ({d.address})")
                    return d
            print("❌ Pico not found. Retrying in 1 seconds...")
            await asyncio.sleep(1)
        except Exception as e:
            print(f"⚠️ BLE scan error: {e}")
            await asyncio.sleep(1)

async def connect_and_listen(device):
    try:
        async with BleakClient(device.address) as client:
            print("🔗 Connected. Subscribing to notifications...")
            await client.start_notify(CHAR_UUID, handle_notification)

            while True:
                if not client.is_connected:
                    print("❌ Pico disconnected!")
                    break
                await asyncio.sleep(1)
    except BleakError as e:
        print(f"⚠️ Connection failed or lost: {e}")

async def main():
    while True:
        device = await find_pico()
        await connect_and_listen(device)
        print("🔁 Restarting scan...")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("🛑 Interrupted by user.")
    finally:
        pwm.stop()
        GPIO.cleanup()
