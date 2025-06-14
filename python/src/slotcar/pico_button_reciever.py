import asyncio
import json
import logging
from bleak import BleakScanner, BleakClient
import RPi.GPIO as GPIO

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

        # Update LEDs immediately if not blinking
        if led_on:
            pwm_red.ChangeDutyCycle(brightness_red)
            pwm_green.ChangeDutyCycle(brightness_green)
        else:
            pwm_red.ChangeDutyCycle(0)
            pwm_green.ChangeDutyCycle(0)

    except Exception as e:
        logger.error(f"Error processing message: {e}")

async def run():
    logger.info("Scanning for device...")
    devices = await BleakScanner.discover()
    pico = next((d for d in devices if d.name == "PicoPot"), None)

    if not pico:
        logger.error("PicoPot not found.")
        return

    logger.info(f"Found device: {pico.name}")
    async with BleakClient(pico) as client:
        try:
            logger.info("Connected to Pico.")
            logger.info("Discovering services...")
            svcs = await client.get_services()

            logger.info("Services and Characteristics:")
            for service in svcs:
                logger.info(f"Service {service.uuid}")
                for char in service.characteristics:
                    logger.info(f"  Char {char.uuid} Properties: {char.properties}")

            # Confirm UART_TX_UUID exists
            found = False
            for service in svcs:
                for char in service.characteristics:
                    if char.uuid.lower() == UART_TX_UUID.lower():
                        found = True
                        break
            if not found:
                logger.error(f"Characteristic {UART_TX_UUID} not found!")
                return

            await client.start_notify(UART_TX_UUID, notification_handler)
            logger.info("Notifications started.")

            # Run blink loop
            while True:
                if led_on:
                    pwm_red.ChangeDutyCycle(brightness_red)
                    pwm_green.ChangeDutyCycle(brightness_green)
                    await asyncio.sleep(blink_rate)
                    pwm_red.ChangeDutyCycle(0)
                    pwm_green.ChangeDutyCycle(0)
                    await asyncio.sleep(blink_rate)
                else:
                    pwm_red.ChangeDutyCycle(0)
                    pwm_green.ChangeDutyCycle(0)
                    await asyncio.sleep(0.1)

        except Exception as e:
            logger.error(f"Disconnected or error: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(run())
    except KeyboardInterrupt:
        pass
    finally:
        pwm_red.stop()
        pwm_green.stop()
        GPIO.cleanup()

