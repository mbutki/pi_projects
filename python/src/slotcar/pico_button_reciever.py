import asyncio
import json
import logging
from bleak import BleakScanner, BleakClient
import RPi.GPIO as GPIO
import signal
import sys

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

client = None
running = True  # control flag for graceful shutdown

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

        # Update LEDs immediately if not blinking
        if led_on:
            pwm_red.ChangeDutyCycle(brightness_red * 100)
            pwm_green.ChangeDutyCycle(brightness_green * 100)
        else:
            pwm_red.ChangeDutyCycle(0)
            pwm_green.ChangeDutyCycle(0)

    except Exception as e:
        logger.error(f"Error processing message: {e}")

async def run():
    global client, running
    while running:
        logger.info("🔍 Scanning for PicoPot...")
        devices = await BleakScanner.discover()
        pico = next((d for d in devices if d.name == "PicoPot"), None)

        if not pico:
            logger.error("❌ PicoPot not found, retrying in 0.5s...")
            await asyncio.sleep(0.5)
            continue

        logger.info(f"✅ Found device: {pico.name}. Connecting...")
        client = BleakClient(pico)

        try:
            await client.connect()
            logger.info("🔗 Connected to PicoPot.")
            svcs = await client.get_services()

            # Verify characteristic exists
            tx_char = None
            for service in svcs:
                for char in service.characteristics:
                    if char.uuid.lower() == UART_TX_UUID.lower():
                        tx_char = char
                        break
                if tx_char:
                    break

            if not tx_char:
                logger.error(f"❌ Characteristic {UART_TX_UUID} not found! Disconnecting...")
                await client.disconnect()
                await asyncio.sleep(0.5)
                continue

            await client.start_notify(UART_TX_UUID, notification_handler)
            logger.info("▶ Notifications started.")

            while running and client.is_connected:
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

        except Exception as e:
            logger.error(f"🔌 BLE error or disconnect: {e}")

        finally:
            if client and client.is_connected:
                logger.info("Disconnecting from PicoPot...")
                await client.disconnect()
            client = None

        if running:
            logger.info("🔄 Reconnecting in 0.5s...")
            await asyncio.sleep(0.5)

def signal_handler(sig, frame):
    global running
    logger.info("🛑 Received exit signal, shutting down...")
    running = False

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    try:
        asyncio.run(run())
    except Exception as e:
        logger.error(f"Fatal error: {e}")
    finally:
        try:
            if pwm_red:
                pwm_red.stop()
        except Exception:
            pass
        try:
            if pwm_green:
                pwm_green.stop()
        except Exception:
            pass
        GPIO.cleanup()
        logger.info("Cleanup done, exiting.")
        sys.exit(0)

