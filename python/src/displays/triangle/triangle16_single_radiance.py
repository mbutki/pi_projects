#!/usr/bin/env python

"""
Triangle16 Radiance Animation for Fadecandy

An organic, breathing animation where energy pulses flow through the triangle
grid, diffusing to neighboring cells and creating waves of light.
"""

import opc
import time
import random
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
ENERGY_DECAY = 0.98  # How fast energy fades (0-1)
ENERGY_DIFFUSION = 0.12  # How much energy spreads to neighbors
PULSE_STRENGTH = 180  # Energy added when a pulse is triggered
PULSE_INTERVAL = 0.15  # Seconds between random pulses
BASE_HUE = 0  # Hue in degrees (0-360)
COLOR_SATURATION = 100  # HSV saturation (0-100)
ENERGY_TO_BRIGHTNESS = 100  # Max brightness multiplier


def animate_triangle_radiance(server_host="127.0.0.1", server_port=7890, duration=None):
    """Main animation loop

    Args:
        server_host: OPC server host
        server_port: OPC server port
        duration: Optional duration limit in seconds
    """
    # Connect to OPC server
    try:
        client = opc.Client(f"{server_host}:{server_port}")
        if not client.can_connect():
            print(f"Error: Cannot connect to OPC server at {server_host}:{server_port}")
            return
        print(f"Connected to OPC server at {server_host}:{server_port}")
    except Exception as e:
        print(f"Error connecting to OPC server: {e}")
        return

    # Create triangle grid
    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Initialize energy levels for each cell
    cell_energy = [0.0] * num_cells

    # Track time for pulsing
    start_time = time.time()
    last_pulse_time = start_time

    print(f"Starting radiance animation with {num_cells} LEDs")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            # Check if duration limit reached
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            current_time = time.time()

            # Energy decay
            for i in range(num_cells):
                cell_energy[i] *= ENERGY_DECAY

            # Random pulse occasionally
            if current_time - last_pulse_time > PULSE_INTERVAL:
                if random.random() < 0.7:  # 70% chance to pulse
                    pulse_cell = random.randint(0, num_cells - 1)
                    cell_energy[pulse_cell] += PULSE_STRENGTH
                last_pulse_time = current_time

            # Energy diffusion - spread energy to neighboring cells
            new_energy = cell_energy[:]

            for i in range(num_cells):
                if cell_energy[i] > 0:
                    # Spread to each neighbor
                    for neighbor_idx in triangle.neighbors[i]:
                        if neighbor_idx >= 0:
                            transfer = cell_energy[i] * ENERGY_DIFFUSION
                            new_energy[neighbor_idx] += transfer
                    # Reduce current cell by amount transferred
                    num_neighbors = sum(1 for n in triangle.neighbors[i] if n >= 0)
                    new_energy[i] -= cell_energy[i] * ENERGY_DIFFUSION * num_neighbors

            cell_energy = new_energy

            # Clamp energy to valid range
            for i in range(num_cells):
                cell_energy[i] = max(0, min(255, cell_energy[i]))

            # Generate frame
            frame = []
            for i in range(num_cells):
                energy = cell_energy[i]
                brightness = (energy / 255.0) * ENERGY_TO_BRIGHTNESS

                # Normalize hue to 0-100 range for hsb_to_rgb
                hue_normalized = (BASE_HUE / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_normalized, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            # Send to OPC server
            client.put_pixels(frame)

            # Control frame rate (30 FPS)
            time.sleep(1.0 / 30.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        # Turn off LEDs
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    animate_triangle_radiance()
