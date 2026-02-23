#!/usr/bin/env python

"""
Triangle16 Traveling Lights Animation for Fadecandy

Multiple lights chase around orbits and paths on the triangle grid, creating
a sense of motion and momentum. Like watching vehicles move along circular
and winding routes, each with its own rhythm and color.
"""

import opc
import time
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
NUM_TRAVELERS = 3  # Number of lights
ORBIT_SPEEDS = [0.5, 0.7, 0.3]  # Speed for each traveler
TRAVELER_COLORS = [0, 120, 240]  # Red, Green, Blue
COLOR_SATURATION = 100
TRAIL_LENGTH = 3  # How many cells light up behind traveler
TRAIL_FADE = 0.8  # How fast trail fades


def animate_triangle_traveling_lights(
    server_host="127.0.0.1", server_port=7890, duration=None, num_travelers=3
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
    log_file = open('/tmp/triangle_traveling_lights.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Travelers with position and velocity
    travelers = [
        {
            "position": i * (num_cells // min(num_travelers, 3)),
            "distance": 0.0,  # Float position on circle
            "hue": TRAVELER_COLORS[i % len(TRAVELER_COLORS)],
            "speed": ORBIT_SPEEDS[i % len(ORBIT_SPEEDS)],
        }
        for i in range(min(num_travelers, 6))
    ]

    # Trail brightness at each cell
    trail = [0.0] * num_cells

    start_time = time.time()

    print(f"Starting traveling lights with {len(travelers)} paths")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Fade trails
            trail = [t * TRAIL_FADE for t in trail]

            # Update each traveler
            for traveler in travelers:
                # Move along orbit
                traveler["distance"] += traveler["speed"] * 0.2
                position = int(traveler["distance"]) % num_cells

                traveler["position"] = position

                # Light up this cell and nearby cells (trail)
                trail[position] = 1.0
                for j in range(1, TRAIL_LENGTH + 1):
                    nearby = (position - j) % num_cells
                    trail[nearby] = max(trail[nearby], 1.0 - (j / (TRAIL_LENGTH + 1)))

            # Render
            frame = []
            for i in range(num_cells):
                # Check if any traveler is here
                traveler_here = next((t for t in travelers if t["position"] == i), None)

                if traveler_here:
                    # Bright light
                    brightness = 100
                    hue = traveler_here["hue"]
                else:
                    # Trail
                    brightness = trail[i] * 100
                    # Determine hue from nearby travelers
                    nearby_hues = [
                        t["hue"]
                        for t in travelers
                        if abs(t["position"] - i) < TRAIL_LENGTH + 1
                    ]
                    if nearby_hues:
                        hue = sum(nearby_hues) / len(nearby_hues)
                    else:
                        hue = 0

                hue_norm = (hue / 360.0) * 100
                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Traveling Lights")
    parser.add_argument(
        "--travelers", type=int, default=3, help="Number of moving lights (1-6)"
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_traveling_lights(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        num_travelers=args.travelers,
    )
