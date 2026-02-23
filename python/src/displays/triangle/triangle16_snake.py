import time
import math
import random

import opc
from triangle_utils import TriangleGrid, hsb_to_rgb

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

    # Open a log file for debugging
    log_file = open("/tmp/triangle_snake.log", "a")
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

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

            # Send to OPC server with error handling
            try:
                client.put_pixels(frame)
            except Exception as e:
                log_file.write(f"Error sending pixels at {time.time()}: {e}\n")
                log_file.flush()
                print(f"Error sending pixels: {e}")

            # Control frame rate
            time.sleep(1.0 / STEPS_PER_SECOND)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        try:
            client.put_pixels([(0, 0, 0)] * triangle.num_cells)
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
    animate_triangle_snake(FCSERVER_HOST, FCSERVER_PORT)
