import time
import math
import colorsys
import random

import opc

# Parameters
STEPS_PER_SECOND = 10
MAX_ENERGY = 20
MIN_ENERGY = 4
MIN_SATURATION = 10
MAX_SATURATION = 100
ENERGY_CHANGE_RATE = 0.01
HUE_SHIFT = (100.0 / 2) + 1.2
ALPHA = 10
ENERGY_EXP = 3.5

# Fadecandy server settings
FCSERVER_HOST = "127.0.0.1"
FCSERVER_PORT = 7890


class TriangleGrid:
    """16-cell triangular grid topology for the snake animation.

    Only the neighbor connectivity matters for the animation logic.
    Physical LED positioning is handled by the fcserver configuration.
    """

    def __init__(self):
        # Define the neighbor topology for a 16-cell triangular grid
        # Each cell has up to 3 neighbors (or -1 if no neighbor in that direction)
        self.neighbors = [
            # Bottom row
            [-1, 1, -1],  # Cell 0
            [11, 2, 0],  # Cell 1
            [-1, 3, 1],  # Cell 2
            [9, 4, 2],  # Cell 3
            [-1, 5, 3],  # Cell 4
            [7, 6, 4],  # Cell 5
            [-1, -1, 5],  # Cell 6
            # Second row
            [5, 8, -1],  # Cell 7
            [12, 9, 7],  # Cell 8
            [3, 10, 8],  # Cell 9
            [14, 11, 9],  # Cell 10
            [1, -1, 10],  # Cell 11
            # Third row
            [8, 13, -1],  # Cell 12
            [15, 14, 12],  # Cell 13
            [10, -1, 13],  # Cell 14
            # Top
            [13, -1, -1],  # Cell 15
        ]
        self.num_cells = len(self.neighbors)


def choose_maximum(scores):
    """Return the index of the largest nonzero member of 'scores'.
    Returns -1 if all members are <= 0.
    """
    result = -1
    best = 0
    for i, score in enumerate(scores):
        if score > best:
            result = i
            best = score
    return result


def choose_neighbor(current, triangle, cell_energies):
    """Look for a neighboring cell to move to. Each neighbor gets a
    score, either a random positive number or zero if it's unsuitable.
    """
    scores = [0.0] * 3
    for i in range(3):
        neighbor = triangle.neighbors[current][i]
        if neighbor >= 0 and cell_energies[neighbor] == 0:
            scores[i] = random.uniform(1, 2)

    neighbor_idx = choose_maximum(scores)
    if neighbor_idx < 0:
        return -1

    return triangle.neighbors[current][neighbor_idx]


def choose_empty(triangle, cell_energies):
    """Look for a random empty cell"""
    scores = [0.0] * triangle.num_cells
    for i in range(triangle.num_cells):
        if cell_energies[i] == 0:
            scores[i] = random.uniform(1, 2)

    return choose_maximum(scores)


def hsb_to_rgb(h, s, b):
    """Convert HSB color (0-100 range) to RGB (0-255 range)"""
    # Normalize to 0-1 range
    h_norm = h / 100.0
    s_norm = s / 100.0
    b_norm = b / 100.0

    # Use colorsys to convert HSV to RGB
    r, g, b_out = colorsys.hsv_to_rgb(h_norm, s_norm, b_norm)

    # Convert to 0-255 range
    return (int(r * 255), int(g * 255), int(b_out * 255))


def animate_triangle_snake(server_host="127.0.0.1", server_port=7890, duration=None):
    """Main animation loop"""
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
    num_leds = num_cells  # One LED per cell

    # Initialize cell state
    cell_hues = [0.0] * num_cells
    cell_energies = [0] * num_cells

    current_hue = random.uniform(0, 100)
    current_cell = random.randint(0, num_cells - 1)

    step_number = 0
    start_time = time.time()

    print(f"Starting animation with {num_cells} cells")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            # Check if duration limit reached
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            step_number += 1

            # Cell energies vary in sinusoidal epochs
            e = math.cos(step_number * ENERGY_CHANGE_RATE)
            e = (e + 1) / 2  # Map from [-1, 1] to [0, 1]
            e = pow(e, ENERGY_EXP)
            current_energy = int(e * (MAX_ENERGY - MIN_ENERGY) + MIN_ENERGY)

            # Cell decay
            for i in range(num_cells):
                cell_energies[i] = max(0, min(current_energy, cell_energies[i] - 1))

            # Can we keep going?
            if current_cell >= 0:
                current_cell = choose_neighbor(current_cell, triangle, cell_energies)

            if current_cell < 0:
                # New snake
                current_cell = choose_empty(triangle, cell_energies)
                if current_cell >= 0:
                    # Hues rotate between complementary colors
                    current_hue = (current_hue + HUE_SHIFT) % 100

            if current_cell >= 0:
                # We have somewhere to go
                cell_energies[current_cell] = current_energy
                cell_hues[current_cell] = current_hue

            # Calculate saturation based on current energy level
            saturation = (current_energy - MIN_ENERGY) / (MAX_ENERGY - MIN_ENERGY)
            saturation = MIN_SATURATION + saturation * (MAX_SATURATION - MIN_SATURATION)

            # Create pixel frame
            frame = []
            for i in range(num_cells):
                # Calculate brightness for this cell
                brightness = (
                    cell_energies[i] / current_energy if current_energy > 0 else 0
                )

                # Convert HSB to RGB
                r, g, b = hsb_to_rgb(cell_hues[i], saturation, brightness * 100)
                frame.append((r, g, b))

            # Send to OPC server
            client.put_pixels(frame)

            # Control frame rate
            time.sleep(1.0 / STEPS_PER_SECOND)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        # Turn off LEDs
        client.put_pixels([(0, 0, 0)] * num_leds)


if __name__ == "__main__":
    animate_triangle_snake(FCSERVER_HOST, FCSERVER_PORT)
