#!/usr/bin/env python

"""
Triangle16 Fibonacci Spiral Animation for Fadecandy

Traces a Fibonacci spiral pattern across the grid, creating a golden ratio
spiral that grows and shrinks, with colors and brightness that follow the
spiral path.
"""

import opc
import time
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
SPIRAL_SPEED = 0.5  # How fast the spiral expands/contracts
COLOR_SATURATION = 100
SPIRAL_ARMS = 2  # Number of spiral arms (1 or 2)


def animate_triangle_fibonacci(
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
    log_file = open('/tmp/triangle_fibonacci.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Pre-compute angles and normalize distance
    cell_angles = [i * (360.0 / num_cells) for i in range(num_cells)]
    golden_angle = 137.508  # Golden angle in degrees

    start_time = time.time()

    print(f"Starting Fibonacci spiral animation")
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

                # Create spiral by following golden angle
                spiral_distance = (angle / golden_angle) % 16.0

                # Add time-based pulsing to the spiral
                pulsed_distance = spiral_distance + current_time * SPIRAL_SPEED * 4

                # Distance from spiral center (wrap around)
                distance_from_spiral = abs((pulsed_distance % 16.0) - 8.0)
                falloff = 1.0 - (distance_from_spiral / 8.0)
                falloff = max(0, min(1, falloff))

                brightness = falloff * 100

                # Color follows the spiral pattern
                hue = (spiral_distance * 22.5 + current_time * 60) % 360
                hue_norm = (hue / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Fibonacci Spiral")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_fibonacci(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
    )
