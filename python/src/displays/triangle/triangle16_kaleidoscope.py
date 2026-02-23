#!/usr/bin/env python

"""
Triangle16 Kaleidoscope Animation for Fadecandy

Creates perfect symmetry patterns that mirror/rotate through the triangle.
A changing pattern is reflected and rotated to create harmonious, mandala-like
designs with 3-fold or 6-fold rotational symmetry.
"""

import opc
import time
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
ROTATION_SPEED = 0.5  # How fast the pattern rotates
COLOR_WAVE_SPEED = 1.0  # How fast colors change
SYMMETRY = 3  # 3 or 6 fold symmetry
COLOR_SATURATION = 100


def animate_triangle_kaleidoscope(
    server_host="127.0.0.1", server_port=7890, duration=None, symmetry=3
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
    log_file = open('/tmp/triangle_kaleidoscope.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Pre-compute cell angles and distances from center
    cell_angles = [
        math.atan2(i, num_cells) * 360 / (2 * math.pi) for i in range(num_cells)
    ]
    cell_distances = [i / num_cells for i in range(num_cells)]

    start_time = time.time()

    print(f"Starting kaleidoscope animation with {symmetry}-fold symmetry")
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
                # Get angle and distance
                angle = cell_angles[i]
                distance = cell_distances[i]

                # Rotate the pattern
                rotated_angle = (angle + current_time * ROTATION_SPEED * 60) % 360

                # Apply symmetry: reduce to fundamental domain
                sym_angle = rotated_angle % (360 / symmetry)

                # Create a pattern within the fundamental domain
                # Brightness follows a pulsing wave
                pattern_wave = math.sin(
                    sym_angle * math.pi / 180.0
                    + current_time * COLOR_WAVE_SPEED * math.pi
                )
                brightness = ((pattern_wave + 1.0) / 2.0) * 100

                # Hue varies with distance and rotation
                hue = (distance * 360 + rotated_angle) % 360
                hue_norm = (hue / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Kaleidoscope")
    parser.add_argument(
        "--symmetry", type=int, choices=[3, 6], default=3, help="Fold symmetry"
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_kaleidoscope(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        symmetry=args.symmetry,
    )
