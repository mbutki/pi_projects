#!/usr/bin/env python

"""
Triangle16 Lorenz Attractor Animation for Fadecandy

Simulates the famous Lorenz attractor (butterfly effect) in 3D space and
maps the trajectory onto the triangle grid. Creates chaotic but beautiful
flowing patterns with strange attractor behavior.
"""

import opc
import time
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters (Lorenz system)
SIGMA = 10.0
RHO = 28.0
BETA = 8.0 / 3.0
DT = 0.01  # Time step for integration
NUM_PARTICLES = 3  # Multiple Lorenz tracers
COLOR_SATURATION = 90


def lorenz_step(x, y, z, dt):
    """Single step of Lorenz attractor simulation"""
    dx = SIGMA * (y - x)
    dy = x * (RHO - z) - y
    dz = x * y - BETA * z
    return x + dx * dt, y + dy * dt, z + dz * dt


def animate_triangle_lorenz(server_host="127.0.0.1", server_port=7890, duration=None):
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
    log_file = open('/tmp/triangle_lorenz.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Initialize particles at slightly different positions
    particles = [
        {"x": 1.0, "y": 1.0, "z": 1.0 + i * 0.1, "hue": i * (360 / NUM_PARTICLES)}
        for i in range(NUM_PARTICLES)
    ]

    # Trail strength at each cell
    trail = [0.0] * num_cells
    TRAIL_DECAY = 0.97

    start_time = time.time()

    print(f"Starting Lorenz attractor animation with {NUM_PARTICLES} particles")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Decay trails
            trail = [t * TRAIL_DECAY for t in trail]

            # Update each particle
            for particle in particles:
                # Lorenz step
                particle["x"], particle["y"], particle["z"] = lorenz_step(
                    particle["x"], particle["y"], particle["z"], DT
                )

                # Map 3D position to cell index
                # Normalize coordinates
                x_norm = (particle["x"] + 30) / 60.0
                y_norm = (particle["y"] + 30) / 60.0
                z_norm = (particle["z"] + 1) / 50.0

                # Map to cell (0-15)
                cell_idx = int((x_norm + y_norm + z_norm) / 3.0 * num_cells) % num_cells

                # Leave trail
                trail[cell_idx] = 1.0

            # Render
            frame = []
            for i in range(num_cells):
                # Check which particles are near
                brightness = trail[i] * 100

                # Blend nearby particle colors
                nearby_hues = []
                hue_sum = 0
                for neighbor_idx in triangle.neighbors[i]:
                    if neighbor_idx >= 0 and trail[neighbor_idx] > 0.5:
                        # Assume particle color based on trail
                        hue_sum += (neighbor_idx * 60) % 360
                        nearby_hues.append(neighbor_idx)

                if nearby_hues:
                    hue = hue_sum / len(nearby_hues)
                else:
                    hue = (i * 60) % 360

                hue_norm = (hue / 360.0) * 100
                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            client.put_pixels(frame)
            time.sleep(1.0 / 60.0)  # Faster update for smooth chaos

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Triangle16 Lorenz Attractor")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_lorenz(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
    )
