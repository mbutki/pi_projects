#!/usr/bin/env python

"""
Triangle16 Random Walk Animation for Fadecandy

Multiple agents perform random walks on the triangle grid, leaving trails
of light behind them. Each agent has its own colored trail that gradually fades.
Creates organic, worm-like patterns.
"""

import opc
import time
import random
import argparse
import math
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
NUM_AGENTS = 4  # Number of walking entities
TRAIL_FADE = 0.95  # How fast trails fade (1.0=permanent, 0.9=quick fade)
COLOR_SATURATION = 100
BASE_HUES = [0, 120, 240, 60, 300, 180]  # Colors for different agents


def animate_triangle_randomwalk(
    server_host="127.0.0.1", server_port=7890, duration=None, num_agents=4
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
    log_file = open('/tmp/triangle_randomwalk.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Agent positions and colors
    agents = [
        {"pos": random.randint(0, num_cells - 1), "hue": BASE_HUES[i % len(BASE_HUES)]}
        for i in range(min(num_agents, 6))
    ]

    # Trail brightness at each cell
    trail = [0.0] * num_cells

    start_time = time.time()

    print(
        f"Starting random walk animation with {len(agents)} agents on {num_cells} cells"
    )
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Fade trails
            trail = [t * TRAIL_FADE for t in trail]

            # Move each agent
            for agent in agents:
                current_pos = agent["pos"]
                # Random neighbor or stay put
                neighbors = [n for n in triangle.neighbors[current_pos] if n >= 0]
                if neighbors and random.random() < 0.8:
                    agent["pos"] = random.choice(neighbors)

                # Leave bright trail
                trail[agent["pos"]] = 1.0

            # Render
            frame = []
            for i in range(num_cells):
                # Check if any agent is here
                agent_here = next((a for a in agents if a["pos"] == i), None)

                if agent_here:
                    # Agent is bright
                    brightness = 100
                    hue = agent_here["hue"]
                else:
                    # Just trail
                    brightness = trail[i] * 100
                    # Blend colors of nearby agents for trail hue
                    nearby_colors = []
                    for neighbor_idx in triangle.neighbors[i]:
                        if neighbor_idx >= 0:
                            agent_near = next(
                                (a for a in agents if a["pos"] == neighbor_idx), None
                            )
                            if agent_near:
                                nearby_colors.append(agent_near["hue"])

                    if nearby_colors:
                        hue = sum(nearby_colors) / len(nearby_colors)
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
    parser = argparse.ArgumentParser(description="Triangle16 Random Walk")
    parser.add_argument("--agents", type=int, default=4, help="Number of agents (1-6)")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_randomwalk(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        num_agents=args.agents,
    )
