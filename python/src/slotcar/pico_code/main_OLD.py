import ujson
import time
import machine
import ubluetooth
import uasyncio as asyncio
from encoder import Encoder

_IRQ_CENTRAL_CONNECT = 1
_IRQ_CENTRAL_DISCONNECT = 2
_IRQ_GATTS_WRITE = 3

class BLEUART:
    def __init__(self, name="PicoPot"):
        self._ble = ubluetooth.BLE()
        self._ble.active(True)
        self._ble.irq(self._irq)

        UART_UUID = ubluetooth.UUID("6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
        TX_UUID = ubluetooth.UUID("6E400003-B5A3-F393-E0A9-E50E24DCCA9E")
        RX_UUID = ubluetooth.UUID("6E400002-B5A3-F393-E0A9-E50E24DCCA9E")

        UART_SERVICE = (UART_UUID, ((TX_UUID, ubluetooth.FLAG_NOTIFY),
                                    (RX_UUID, ubluetooth.FLAG_WRITE),))
        SERVICES = (UART_SERVICE,)

        ((self._tx_handle, self._rx_handle),) = self._ble.gatts_register_services(SERVICES)
        self._connections = set()
        self._name = name
        self._advertise_debounce = 0
        self._advertise_interval_us = 500000
        self._advertise_timeout_s = 30

        self._advertise()

    def _irq(self, event, data):
        if event == _IRQ_CENTRAL_CONNECT:
            conn_handle = data[0]
            print("✅ Central connected:", conn_handle)
            self._connections.add(conn_handle)
            self._advertise_debounce = 0

        elif event == _IRQ_CENTRAL_DISCONNECT:
            conn_handle = data[0]
            print("❌ Central disconnected:", conn_handle)
            self._connections.discard(conn_handle)
            self._advertise()
            self._advertise_debounce = time.ticks_ms()

        elif event == _IRQ_GATTS_WRITE:
            conn_handle, attr_handle = data
            if attr_handle == self._rx_handle:
                msg = self._ble.gatts_read(self._rx_handle)
                print("📩 Received from central:", msg)

    def _advertise(self, interval_us=None):
        now = time.ticks_ms()
        if interval_us is None:
            interval_us = self._advertise_interval_us
        if self._advertise_debounce != 0 and time.ticks_diff(now, self._advertise_debounce) < 500:
            return
        self._advertise_debounce = now

        name_bytes = self._name.encode('utf-8')
        payload = bytearray([
            0x02, 0x01, 0x06,
            len(name_bytes) + 1, 0x09
        ]) + name_bytes

        try:
            self._ble.gap_advertise(interval_us, adv_data=payload)
            print("📡 Advertising as:", self._name)
        except Exception as e:
            print("⚠️ Advertising error:", e)

    def is_connected(self):
        return bool(self._connections)

    def send(self, data):
        for conn_handle in self._connections:
            try:
                self._ble.gatts_notify(conn_handle, self._tx_handle, data)
            except Exception as e:
                print("⚠️ Error sending to central:", e)


# === Setup Pins ===
# Encoders
encoder_red_pin_a = machine.Pin(2, machine.Pin.IN, machine.Pin.PULL_UP)
encoder_red_pin_b = machine.Pin(3, machine.Pin.IN, machine.Pin.PULL_UP)
encoder_green_pin_a = machine.Pin(4, machine.Pin.IN, machine.Pin.PULL_UP)
encoder_green_pin_b = machine.Pin(5, machine.Pin.IN, machine.Pin.PULL_UP)

# Button and Potentiometer
button = machine.Pin(6, machine.Pin.IN, machine.Pin.PULL_UP)
pot = machine.ADC(26)

# === Shared State ===
led_enabled = True
last_button_state = button.value()
red_value = 0
green_value = 0
ble_uart = BLEUART()

# === Encoder Callbacks ===
def red_callback(val, delta):
    global red_value
    red_value = val
    print("🔴 Red encoder changed:", val, "delta:", delta)

def green_callback(val, delta):
    global green_value
    green_value = val
    print("🟢 Green encoder changed:", val, "delta:", delta)

# === Setup Encoders with limits ===
Encoder(encoder_red_pin_a, encoder_red_pin_b, callback=red_callback, vmin=0, vmax=100, div=1)
Encoder(encoder_green_pin_a, encoder_green_pin_b, callback=green_callback, vmin=0, vmax=100, div=1)

def read_blink_rate():
    return pot.read_u16() / 65535

async def main_loop():
    global last_button_state, led_enabled

    last_no_connection_check = time.ticks_ms()

    while True:
        # Button toggle
        current_button = button.value()
        if last_button_state == 1 and current_button == 0:
            led_enabled = not led_enabled
            print("🔘 Button pressed, led_enabled =", led_enabled)
        last_button_state = current_button

        # Prepare data
        data = {
            "red": red_value,       # Send 0 to 10 directly
            "green": green_value,
            "blink": read_blink_rate(),
            "enabled": led_enabled
        }

        json_data = ujson.dumps(data) + "\n"

        if ble_uart.is_connected():
            ble_uart.send(json_data)
            #print("📤 Sent:", json_data.strip())
            last_no_connection_check = time.ticks_ms()
        else:
            #print("⏳ Not connected, waiting for central...")
            if time.ticks_diff(time.ticks_ms(), last_no_connection_check) > ble_uart._advertise_timeout_s * 1000:
                print("🔄 No connection for a while, restarting advertising...")
                ble_uart._advertise()
                last_no_connection_check = time.ticks_ms()

        await asyncio.sleep(0.1)

try:
    asyncio.run(main_loop())
finally:
    asyncio.new_event_loop()
