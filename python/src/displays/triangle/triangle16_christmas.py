#!/usr/bin/env python

"""
Triangle16 Christmas Lights Animation for Fadecandy

A festive animation depicting Christmas lights on a tree. The triangle glows
green like a tree, with random colored lights that twinkle and fade in and out.
"""

import opc
import time
import random
import argparse
import math
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
BASE_HUE = 120  # Green for the tree
BASE_BRIGHTNESS = 20  # Dim green baseline
TREE_PULSE_SPEED = 0.3  # How fast the tree breathes
LIGHT_COLORS = [0, 30, 200, 300, 60]  # Red, Yellow, Blue, Magenta, Cyan
NUM_LIGHTS = 5  # Number of colored lights twinkling
LIGHT_TWINKLE_SPEED = 0.5  # How fast lights fade in/out
COLOR_SATURATION = 100


def animate_triangle_christmas(
    server_host="127.0.0.1", server_port=7890, duration=None, num_lights=5
):
    """Main animation loop"""
    try:
        client = opc.Client(f"{server_host}:{server_port}")
        if not client.can_connect():
            print(f"Error: Cannot connect to OPC server at {server_host}:{server_port}")
            return
        print(f"Connected to OPC server at {server_host}:{server_port}")
    except Exception as e:
        print(f"Error connecting to OPC server: {e}")
        return

    # Setup logging
    log_file = open('/tmp/triangle_christmas.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Assign light positions and colors
    lights = [
        {
            "cell": random.randint(0, num_cells - 1),
            "hue": random.choice(LIGHT_COLORS),
            "phase": random.uniform(0, 2 * math.pi),
            "intensity": 0.0,  # Current brightness of this light
        }
        for _ in range(min(num_lights, num_cells))
    ]

    start_time = time.time()

    print(f"Starting Christmas lights animation with {len(lights)} twinkling lights")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            current_time = time.time() - start_time

            # Update light intensities (twinkle effect)
            for light in lights:
                # Sinusoidal fade in/out with random phase
                light["intensity"] = (
                    math.sin(
                        current_time * LIGHT_TWINKLE_SPEED * math.pi + light["phase"]
                    )
                    + 1.0
                ) / 2.0

            # Generate frame
            frame = []
            for i in range(num_cells):
                # Start with green tree base with slight pulsing
                tree_pulse = 0.5 + 0.3 * math.sin(
                    current_time * TREE_PULSE_SPEED * math.pi
                )
                brightness = BASE_BRIGHTNESS + tree_pulse * 10

                # Check if there's a light at this cell
                light_here = next((l for l in lights if l["cell"] == i), None)

                if light_here and light_here["intensity"] > 0.1:
                    # Light is on - show the colored light instead
                    brightness = light_here["intensity"] * 100
                    hue = light_here["hue"]
                else:
                    # Just the green tree
                    hue = BASE_HUE

                hue_norm = (hue / 360.0) * 100
                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Christmas Lights")
    parser.add_argument(
        "--lights", type=int, default=5, help="Number of twinkling lights (1-16)"
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_christmas(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        num_lights=args.lights,
    )
