import asyncio
import json
import logging
from bleak import BleakScanner, BleakClient
import RPi.GPIO as GPIO
import time

# GPIO Setup
RED_LED = 18
GREEN_LED = 19
GPIO.setmode(GPIO.BCM)
GPIO.setup(RED_LED, GPIO.OUT)
GPIO.setup(GREEN_LED, GPIO.OUT)
pwm_red = GPIO.PWM(RED_LED, 1000)
pwm_green = GPIO.PWM(GREEN_LED, 1000)
pwm_red.start(0)
pwm_green.start(0)

# UART-over-BLE UUIDs
UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
UART_TX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"  # from Pico (notify)
UART_RX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"  # to Pico (write)

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global state
led_on = True
blink_rate = 1.0
brightness_red = 0
brightness_green = 0

def notification_handler(sender, data):
    global led_on, blink_rate, brightness_red, brightness_green

    try:
        decoded = data.decode('utf-8')
        message = json.loads(decoded)
        logger.info(f"Received: {message}")

        brightness_red = message.get("red", brightness_red)
        brightness_green = message.get("green", brightness_green)
        blink_rate = message.get("blink", blink_rate)
        led_on = message.get("enabled", led_on)

        if led_on:
            pwm_red.ChangeDutyCycle(brightness_red * 100)
            pwm_green.ChangeDutyCycle(brightness_green * 100)
        else:
            pwm_red.ChangeDutyCycle(0)
            pwm_green.ChangeDutyCycle(0)

    except Exception as e:
        logger.error(f"Error processing message: {e}")

async def connect_and_run():
    while True:
        try:
            logger.info("🔍 Scanning for PicoPot...")
            devices = await BleakScanner.discover()
            pico = next((d for d in devices if d.name == "PicoPot"), None)

            if not pico:
                logger.info("❌ PicoPot not found. Retrying in 0.5s...")
                await asyncio.sleep(0.5)
                continue

            logger.info(f"✅ Found device: {pico.name}. Connecting...")
            async with BleakClient(pico) as client:
                logger.info("🔗 Connected to PicoPot.")
                #await client.start_notify(UART_TX_UUID, notification_handler)
                logger.info("🔍 Discovering services...")
                services = await client.get_services()

                # Confirm the TX characteristic is present
                if UART_TX_UUID.lower() not in [char.uuid.lower() for s in services for char in s.characteristics]:
                    logger.error(f"Characteristic {UART_TX_UUID} was not found!")
                    continue

                await client.start_notify(UART_TX_UUID, notification_handler)
                logger.info("📩 Notifications started.")
                #logger.info("📩 Notifications started.")

                while True:
                    if client.is_connected:
                        if led_on:
                            pwm_red.ChangeDutyCycle(brightness_red * 100)
                            pwm_green.ChangeDutyCycle(brightness_green * 100)
                            await asyncio.sleep(blink_rate)
                            pwm_red.ChangeDutyCycle(0)
                            pwm_green.ChangeDutyCycle(0)
                            await asyncio.sleep(blink_rate)
                        else:
                            pwm_red.ChangeDutyCycle(0)
                            pwm_green.ChangeDutyCycle(0)
                            await asyncio.sleep(0.1)
                    else:
                        logger.warning("⚠️ Lost connection to PicoPot.")
                        break

        except Exception as e:
            logger.error(f"🔌 BLE error or disconnect: {e}")

        # Cleanup before retrying
        pwm_red.ChangeDutyCycle(0)
        pwm_green.ChangeDutyCycle(0)
        await asyncio.sleep(0.5)

if __name__ == "__main__":
    try:
        asyncio.run(connect_and_run())
    except KeyboardInterrupt:
        pass
    finally:
        pwm_red.stop()
        pwm_green.stop()
        GPIO.cleanup()
        logger.info("🛑 Program exited.")

