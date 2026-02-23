#!/usr/bin/env python

"""
Triangle16 Flocking Animation for Fadecandy

Boid-like swarm simulation where agents follow three simple rules:
- Separation: avoid crowding neighbors
- Alignment: steer towards average heading
- Cohesion: steer towards average position

Creates emergent flocking behavior with beautiful organic motion.
"""

import opc
import time
import random
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters (Boid weights)
SEPARATION_WEIGHT = 2.0  # How much to avoid neighbors
ALIGNMENT_WEIGHT = 1.0  # How much to match neighbors' direction
COHESION_WEIGHT = 1.0  # How much to move toward neighbors
PERCEPTION_RANGE = 3  # How many neighbors to consider (hops)
NUM_BOIDS = 5
COLOR_SATURATION = 90
TRAIL_FADE = 0.92


def animate_triangle_flocking(
    server_host="127.0.0.1", server_port=7890, duration=None, num_boids=5
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
    log_file = open('/tmp/triangle_flocking.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Boid state: position (cell index), direction (as float for smooth motion)
    boids = [
        {
            "cell": random.randint(0, num_cells - 1),
            "direction": random.uniform(0, num_cells),
            "velocity": random.uniform(-1, 1),
            "hue": random.uniform(0, 360),
        }
        for _ in range(min(num_boids, 8))
    ]

    # Trail for visual effect
    trail = [0.0] * num_cells

    start_time = time.time()

    print(f"Starting flocking with {len(boids)} boids")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Fade trails
            trail = [t * TRAIL_FADE for t in trail]

            # Flocking rules for each boid
            for i, boid in enumerate(boids):
                current_cell = boid["cell"]

                # Find neighbors within perception range
                neighbors = set()
                frontier = {current_cell}
                visited = set()

                for _ in range(PERCEPTION_RANGE):
                    new_frontier = set()
                    for cell in frontier:
                        visited.add(cell)
                        for neighbor in triangle.neighbors[cell]:
                            if neighbor >= 0 and neighbor not in visited:
                                new_frontier.add(neighbor)
                                neighbors.add(neighbor)
                    frontier = new_frontier

                # Get nearby boids (excluding self)
                nearby_boids = [
                    b for j, b in enumerate(boids) if j != i and b["cell"] in neighbors
                ]

                if nearby_boids:
                    # Separation: avoid crowding
                    separation = 0.0
                    for other in nearby_boids:
                        if other["cell"] == current_cell:
                            separation -= 2.0

                    # Alignment: match heading
                    avg_direction = sum(b["direction"] for b in nearby_boids) / len(
                        nearby_boids
                    )
                    alignment = (avg_direction - boid["direction"]) / num_cells
                    alignment *= ALIGNMENT_WEIGHT

                    # Cohesion: move toward others
                    avg_cell = sum(b["cell"] for b in nearby_boids) / len(nearby_boids)
                    cohesion = (avg_cell - current_cell) / num_cells
                    cohesion *= COHESION_WEIGHT

                    # Update velocity
                    boid["velocity"] += (
                        separation * SEPARATION_WEIGHT + alignment + cohesion
                    )

                # Damping
                boid["velocity"] *= 0.9
                boid["velocity"] = max(-2.0, min(2.0, boid["velocity"]))

                # Move boid
                boid["direction"] += boid["velocity"]
                new_cell = int(boid["direction"]) % num_cells
                boid["cell"] = new_cell

                # Leave trail
                trail[new_cell] = 1.0

            # Render
            frame = []
            for i in range(num_cells):
                # Check for boids
                boids_here = [b for b in boids if b["cell"] == i]

                if boids_here:
                    # Bright boids
                    brightness = 100
                    # Blend colors
                    hue = sum(b["hue"] for b in boids_here) / len(boids_here)
                else:
                    # Trail from nearby boids
                    brightness = trail[i] * 80
                    # Get hue from nearby boid trails
                    nearby_boids = [b for b in boids if abs(b["cell"] - i) < 2]
                    if nearby_boids:
                        hue = sum(b["hue"] for b in nearby_boids) / len(nearby_boids)
                    else:
                        hue = 0

                hue_norm = (hue % 360) / 360.0 * 100
                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Flocking/Swarm")
    parser.add_argument("--boids", type=int, default=5, help="Number of boids (1-8)")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_flocking(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        num_boids=args.boids,
    )
