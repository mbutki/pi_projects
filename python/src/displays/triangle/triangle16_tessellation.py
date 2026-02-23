#!/usr/bin/env python

"""
Triangle16 Tessellation Animation for Fadecandy

Creates a morphing tessellation pattern where geometric shapes expand,
contract, and transform. Like watching tiles rearrange themselves into
constantly changing mosaics.
"""

import opc
import time
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
MORPH_SPEED = 0.5  # How fast shapes transform
NUM_ZONES = 3  # Number of morphing zones
COLOR_SATURATION = 95


def animate_triangle_tessellation(
    server_host="127.0.0.1", server_port=7890, duration=None
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
    log_file = open('/tmp/triangle_tessellation.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Pre-compute cell angles and distances
    cell_angles = [2 * math.pi * i / num_cells for i in range(num_cells)]
    cell_distances = [i / float(num_cells) for i in range(num_cells)]

    start_time = time.time()

    print(f"Starting tessellation animation with {NUM_ZONES} zones")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            current_time = time.time() - start_time

            frame = []
            for i in range(num_cells):
                angle = cell_angles[i]
                distance = cell_distances[i]

                # Create morphing pattern based on angle sectors
                # Divide into NUM_ZONES sectors and morph between them
                sector_angle = (angle / (2 * math.pi)) * NUM_ZONES
                sector_idx = int(sector_angle) % NUM_ZONES

                # Morphing within sector
                morph_phase = (
                    sector_angle - sector_idx + current_time * MORPH_SPEED
                ) % 2.0
                if morph_phase > 1.0:
                    morph_phase = 2.0 - morph_phase

                # Pattern 1: Concentric rings
                pattern1 = math.sin(distance * NUM_ZONES * math.pi)

                # Pattern 2: Spiral
                pattern2 = math.sin(
                    (distance + angle / (2 * math.pi)) * NUM_ZONES * math.pi
                )

                # Morph between patterns
                combined = pattern1 * (1.0 - morph_phase) + pattern2 * morph_phase

                brightness = ((combined + 1.0) / 2.0) * 100

                # Hue follows the sector
                hue = (sector_idx * 360 / NUM_ZONES + current_time * 30) % 360
                hue_norm = (hue / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Tessellation")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_tessellation(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
    )
