#!/usr/bin/env python

"""
Triangle16 Cellular Automata Animation for Fadecandy

Conway's Game of Life adapted for the 16-cell triangle grid.
Cells are born, live, and die based on neighbor count, creating
organic-looking patterns that emerge from simple rules.
"""

import opc
import time
import random
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
BIRTH_THRESHOLD = [3]  # Neighbor counts that cause birth
SURVIVAL_THRESHOLD = [2, 3]  # Neighbor counts that allow survival
DECAY_RATE = 0.95  # How fast dead cells fade out
COLOR_SATURATION = 100
BASE_HUE = 120  # Green for living cells


def animate_triangle_cellular(
    server_host="127.0.0.1", server_port=7890, duration=None, seed_density=0.4
):
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

    # Setup logging
    log_file = open('/tmp/triangle_cellular_automata.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # State: alive (1.0) or dead (0.0), but with fade-out (0.0-1.0)
    cell_state = [
        1.0 if random.random() < seed_density else 0.0 for _ in range(num_cells)
    ]

    start_time = time.time()
    generation = 0

    print(f"Starting cellular automata with {num_cells} cells")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Calculate next generation
            new_state = [0.0] * num_cells

            for i in range(num_cells):
                # Count live neighbors
                live_neighbors = 0
                for neighbor_idx in triangle.neighbors[i]:
                    if neighbor_idx >= 0 and cell_state[neighbor_idx] > 0.5:
                        live_neighbors += 1

                # Apply rules
                if live_neighbors in BIRTH_THRESHOLD and cell_state[i] < 0.5:
                    new_state[i] = 1.0  # Birth
                elif live_neighbors in SURVIVAL_THRESHOLD and cell_state[i] > 0.5:
                    new_state[i] = 1.0  # Survive
                elif cell_state[i] > 0.5:
                    new_state[i] = 0.0  # Death
                else:
                    new_state[i] = cell_state[i] * DECAY_RATE  # Fade out dead cells

            cell_state = new_state
            generation += 1

            # Regenerate if all cells die
            if sum(1 for s in cell_state if s > 0.5) == 0:
                cell_state = [
                    1.0 if random.random() < seed_density else 0.0
                    for _ in range(num_cells)
                ]

            # Render
            frame = []
            for i in range(num_cells):
                brightness = cell_state[i] * 100
                hue_norm = (BASE_HUE / 360.0) * 100
                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            # Send to OPC server with error handling
            try:
                client.put_pixels(frame)
            except Exception as e:
                log_file.write(f"Error sending pixels at {time.time()}: {e}\n")
                log_file.flush()
                print(f"Error sending pixels: {e}")

            time.sleep(0.5)  # Slower update for cellular automata

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
    parser = argparse.ArgumentParser(description="Triangle16 Cellular Automata")
    parser.add_argument(
        "--seed", type=float, default=0.4, help="Initial cell density (0-1)"
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_cellular(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        seed_density=args.seed,
    )
