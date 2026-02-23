#!/usr/bin/env python

"""
Triangle16 Perlin Noise Animation for Fadecandy

Uses OpenSimplex (Perlin-like) noise to create flowing, organic patterns
that evolve smoothly over time. Each cell's brightness and color are
determined by its position in a continuous noise space.
"""

import opc
import time
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
NOISE_SCALE = 0.5  # How much spatial variation (lower=smoother)
TIME_SCALE = 0.3  # How fast the noise evolves
COLOR_SATURATION = 90


def simple_noise(x, y, z):
    """Simple 3D noise approximation using sine waves"""
    # Use multiple sine waves at different frequencies to approximate Perlin noise
    n = 0.0
    n += 0.5 * math.sin(x * 2.0 + y * 3.0 + z * 5.0)
    n += 0.25 * math.sin(x * 4.0 + y * 7.0 + z * 11.0)
    n += 0.125 * math.sin(x * 8.0 + y * 13.0 + z * 17.0)
    n += 0.0625 * math.sin(x * 16.0 + y * 23.0 + z * 29.0)
    return (n + 1.0) / 2.0  # Normalize to 0-1


def animate_triangle_perlin(server_host="127.0.0.1", server_port=7890, duration=None):
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
    log_file = open('/tmp/triangle_perlin.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Map cells to 2D positions on circle
    cell_positions = [
        (
            math.cos(2 * math.pi * i / num_cells) * 2,
            math.sin(2 * math.pi * i / num_cells) * 2,
        )
        for i in range(num_cells)
    ]

    start_time = time.time()

    print(f"Starting Perlin noise animation with {num_cells} cells")
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
                x, y = cell_positions[i]

                # Sample noise at this cell's position and time
                noise_val = simple_noise(
                    x * NOISE_SCALE, y * NOISE_SCALE, current_time * TIME_SCALE
                )

                # Additional noise layer for color variation
                noise_hue = simple_noise(
                    x * NOISE_SCALE * 0.5,
                    y * NOISE_SCALE * 0.5,
                    current_time * TIME_SCALE * 0.7,
                )

                brightness = noise_val * 100
                hue = noise_hue * 360
                hue_norm = (hue / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            # Send to OPC server with error handling
            try:
                client.put_pixels(frame)
            except Exception as e:
                log_file.write(f"Error sending pixels at {time.time()}: {e}\n")
                log_file.flush()
                print(f"Error sending pixels: {e}")

            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        try:
            client.put_pixels([(0, 0, 0)] * num_cells)
        except:
            pass
    except Exception as e:
        log_file.write(f"Unexpected error at {time.time()}: {e}\n")
        log_file.flush()
        print(f"Unexpected error: {e}")
    finally:
        log_file.write(f"=== Exiting at {time.time()} ===\n")
        log_file.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Perlin Noise")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_perlin(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
    )
