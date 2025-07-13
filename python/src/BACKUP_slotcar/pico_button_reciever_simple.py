import asyncio
import json
import logging
from bleak import BleakScanner, BleakClient
import RPi.GPIO as GPIO
import signal
import sys
from termcolor import colored

# GPIO Setup
GPIO.setmode(GPIO.BCM)

# UART-over-BLE UUIDs
UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
UART_TX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e"  # from Pico (notify)
UART_RX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"  # to Pico (write)

# Logger setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global state
red_delta = 0
green_delta = 0
select = 0
button_delta = 0

client = None
running = True  # control flag for graceful shutdown

def notification_handler(sender, data):
    global button_delta, select, red_delta, green_delta

    try:
        decoded = data.decode('utf-8')
        message = json.loads(decoded)
        #logger.info(f"Received: {message}")

        red_delta = message.get("red_delta", red_delta)
        green_delta = message.get("green_delta", green_delta)
        select = message.get("select", select)
        button_delta = message.get("button_delta", button_delta)

    except Exception as e:
        logger.error(f"Error processing message: {e}")

async def run():
    global client, running, button_delta, select, red_delta, green_delta
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
                if button_delta:
                    logger.info(colored("▶ Button Pushed",'yellow'))
                    button_delta = 0
                if red_delta != 0:
                    logger.info(colored(f"▶ Red Turned {red_delta}", 'red'))
                    red_delta = 0
                if green_delta != 0:
                    logger.info(colored(f"▶ Green Turned Up {green_delta}", 'green'))
                    green_delta = 0
                if select != 0:
                    logger.info(colored(f"▶ Select {select}", 'blue'))
                    select = 0
                
                await asyncio.sleep(0.1)
                # Do ongoing logic here.
                # Check on global state variable from BLE messages and update

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
        GPIO.cleanup()
        logger.info("Cleanup done, exiting.")
        sys.exit(0)

