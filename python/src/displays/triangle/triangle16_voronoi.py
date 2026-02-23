#!/usr/bin/env python

"""
Triangle16 Voronoi Diagram Animation for Fadecandy

Multiple seed points grow their Voronoi regions over time, creating a
tessellated landscape. Regions expand, contract, and shift colors as
seeds move around the grid.
"""

import opc
import time
import random
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
NUM_SEEDS = 4  # Number of Voronoi regions
SEED_SPEED = 0.3  # How fast seeds move around
COLOR_SATURATION = 95


def animate_triangle_voronoi(
    server_host="127.0.0.1", server_port=7890, duration=None, num_seeds=4
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
    log_file = open('/tmp/triangle_voronoi.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Seed positions and colors (continuous in 2D space, we'll sample them)
    seeds = [
        {
            "x": math.cos(2 * math.pi * i / num_seeds),
            "y": math.sin(2 * math.pi * i / num_seeds),
            "hue": i * (360 / num_seeds),
            "phase": i * (2 * math.pi / num_seeds),
        }
        for i in range(min(num_seeds, 6))
    ]

    # Map cells to angles for moving seeds around circle
    cell_angles = [2 * math.pi * i / num_cells for i in range(num_cells)]

    start_time = time.time()

    print(f"Starting Voronoi animation with {len(seeds)} regions")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            current_time = time.time() - start_time

            # Update seed positions (orbit around center)
            for seed in seeds:
                angle = seed["phase"] + current_time * SEED_SPEED
                seed["x"] = math.cos(angle) * (0.7 + 0.3 * math.sin(angle * 0.5))
                seed["y"] = math.sin(angle) * (0.7 + 0.3 * math.cos(angle * 0.5))

            # Render: each cell belongs to nearest seed
            frame = []
            for i in range(num_cells):
                # Cell position on circle
                angle = cell_angles[i]
                cell_x = 0.8 * math.cos(angle)
                cell_y = 0.8 * math.sin(angle)

                # Find nearest seed
                min_dist_sq = float("inf")
                nearest_seed = seeds[0]

                for seed in seeds:
                    dist_sq = (cell_x - seed["x"]) ** 2 + (cell_y - seed["y"]) ** 2
                    if dist_sq < min_dist_sq:
                        min_dist_sq = dist_sq
                        nearest_seed = seed

                # Brightness based on distance to nearest seed
                brightness = (1.0 - min(1.0, min_dist_sq)) * 100

                # Color from the seed
                hue = nearest_seed["hue"]
                hue_norm = (hue / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Voronoi Diagram")
    parser.add_argument(
        "--seeds", type=int, default=4, help="Number of Voronoi regions (1-6)"
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_voronoi(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        num_seeds=args.seeds,
    )
