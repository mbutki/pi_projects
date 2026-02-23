#!/usr/bin/env python

"""
Triangle16 Heat Diffusion Animation for Fadecandy

Simulates thermal diffusion where heat flows from hot cells to cold ones.
Random heat sources spark and cool down, creating a thermal landscape
that's both mesmerizing and physically plausible.
"""

import opc
import time
import random
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
HEAT_DIFFUSION = 0.2  # How fast heat spreads to neighbors
HEAT_DECAY = 0.98  # How fast heat cools (no external source)
SPARK_PROBABILITY = 0.1  # Chance of random heat injection per frame
SPARK_STRENGTH = 255.0  # Temperature added when spark occurs
COLOR_SATURATION = 100


def animate_triangle_heat(server_host="127.0.0.1", server_port=7890, duration=None):
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

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Temperature of each cell
    temperature = [0.0] * num_cells

    start_time = time.time()

    print(f"Starting heat diffusion animation with {num_cells} cells")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Random heat sparks
            for i in range(num_cells):
                if random.random() < SPARK_PROBABILITY:
                    temperature[i] += SPARK_STRENGTH

            # Heat decay (cooling)
            temperature = [t * HEAT_DECAY for t in temperature]

            # Heat diffusion to neighbors
            new_temp = temperature[:]
            for i in range(num_cells):
                for neighbor_idx in triangle.neighbors[i]:
                    if neighbor_idx >= 0:
                        transfer = temperature[i] * HEAT_DIFFUSION
                        new_temp[neighbor_idx] += transfer
                        new_temp[i] -= transfer

            temperature = [max(0, t) for t in new_temp]

            # Render: temperature maps to color (blue=cold, red=hot)
            frame = []
            for i in range(num_cells):
                # Map temperature to hue (0=red, 240=blue)
                normalized_temp = min(1.0, temperature[i] / 255.0)
                hue = (240 - normalized_temp * 240) % 360  # Red to blue
                brightness = normalized_temp * 100

                hue_norm = (hue / 360.0) * 100
                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Heat Diffusion")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_heat(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
    )
