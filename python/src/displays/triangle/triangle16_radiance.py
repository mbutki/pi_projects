#!/usr/bin/env python

"""
Triangle16 Radiance Animation for Fadecandy

An organic, breathing animation where energy pulses flow through the triangle
grid, diffusing to neighboring cells and creating waves of light.

Color modes:
  1. solid    - Single solid hue (all cells same color)
  2. cycling  - Time-cycling hue (all cells cycle through spectrum)
  3. energy   - Energy-level-based color (low=red, mid=green, high=blue)
  4. spatial  - Position-based color zones (different areas different hues)
  5. pulse    - Hue follows energy "age" (fresh pulse=red, fades through spectrum)
"""

import opc
import time
import random
import argparse
import math
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
ENERGY_DECAY = 0.98  # How fast energy fades (0-1)
ENERGY_DIFFUSION = 0.12  # How much energy spreads to neighbors
PULSE_STRENGTH = 180  # Energy added when a pulse is triggered
PULSE_INTERVAL = 0.15  # Seconds between random pulses
COLOR_SATURATION = 100  # HSV saturation (0-100)
ENERGY_TO_BRIGHTNESS = 100  # Max brightness multiplier


def animate_triangle_radiance(
    server_host="127.0.0.1", server_port=7890, duration=None, color_mode="solid"
):
    """Main animation loop

    Args:
        server_host: OPC server host
        server_port: OPC server port
        duration: Optional duration limit in seconds
        color_mode: How to render colors ('solid', 'cycling', 'energy', 'spatial', 'pulse')
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

    # Setup logging
    log_file = open('/tmp/triangle_radiance.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    # Create triangle grid
    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Initialize energy levels for each cell
    cell_energy = [0.0] * num_cells

    # Track cell age (time since last pulse) for pulse-mode coloring
    cell_age = [0.0] * num_cells

    # Pre-compute position-based hues for spatial mode
    # Assign hues based on cell index (0-15 maps to 0-360 degrees)
    position_hues = [(i * 360.0 / num_cells) for i in range(num_cells)]

    # Track time for pulsing
    start_time = time.time()
    last_pulse_time = start_time

    print(
        f"Starting radiance animation with {num_cells} LEDs (color mode: {color_mode})"
    )
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
                # Track age for pulse-mode coloring
                cell_age[i] += 1.0 / 30.0  # ~33ms per frame at 30 FPS

            # Random pulse occasionally
            if current_time - last_pulse_time > PULSE_INTERVAL:
                if random.random() < 0.7:  # 70% chance to pulse
                    pulse_cell = random.randint(0, num_cells - 1)
                    cell_energy[pulse_cell] += PULSE_STRENGTH
                    cell_age[pulse_cell] = 0.0  # Reset age when pulsed
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

                # Calculate hue based on color mode
                if color_mode == "solid":
                    # Single solid hue (red)
                    hue = 0

                elif color_mode == "cycling":
                    # Time-cycling hue (all cells cycle together)
                    elapsed = time.time() - start_time
                    hue = (elapsed * 30) % 360  # Cycles every ~12 seconds

                elif color_mode == "energy":
                    # Map energy level to hue: 0-60 degrees (red to cyan)
                    # Low energy = red (0), high energy = blue (240)
                    hue = (energy / 255.0) * 240

                elif color_mode == "spatial":
                    # Position-based color zones
                    hue = position_hues[i]

                elif color_mode == "pulse":
                    # Hue follows energy age (fresh=red, aging cycles through spectrum)
                    age_seconds = cell_age[i]
                    hue = (age_seconds * 60) % 360  # 6 seconds for full color cycle

                else:
                    hue = 0  # Default to red

                # Normalize hue to 0-100 range for hsb_to_rgb
                hue_normalized = (hue % 360) / 360.0 * 100

                r, g, b = hsb_to_rgb(hue_normalized, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            # Send to OPC server with error handling
            try:
                client.put_pixels(frame)
            except Exception as e:
                log_file.write(f"Error sending pixels at {time.time()}: {e}\n")
                log_file.flush()
                print(f"Error sending pixels: {e}")

            # Control frame rate (30 FPS)
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
    parser = argparse.ArgumentParser(
        description="Triangle16 Radiance Animation - Energy waves flowing through triangle grid"
    )
    parser.add_argument(
        "--mode",
        choices=["solid", "cycling", "energy", "spatial", "pulse"],
        default="solid",
        help="Color mode: solid (single hue), cycling (time-cycles through spectrum), energy (hue=energy level), spatial (position-based zones), pulse (hue follows energy age)",
    )
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="OPC server host (default: 127.0.0.1)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=7890,
        help="OPC server port (default: 7890)",
    )
    parser.add_argument(
        "--duration",
        type=float,
        default=None,
        help="Duration in seconds (default: infinite)",
    )

    args = parser.parse_args()

    animate_triangle_radiance(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        color_mode=args.mode,
    )
