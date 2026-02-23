#!/usr/bin/env python

"""
Triangle16 Interference Animation for Fadecandy

Multiple sine waves at different frequencies and phases interfere with each other,
creating a complex pattern of nodes and antinodes that shift and morph over time.
Like watching ripples from multiple sources create standing wave patterns.

The result is a mesmerizing, constantly-shifting interference pattern with
no particle system, no energy diffusion—just pure wave mathematics.
"""

import opc
import time
import math
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
NUM_WAVES = 3  # Number of interfering sine waves
BASE_FREQUENCY = 2.0  # Base frequency for primary wave
FREQUENCY_MULTIPLIER = 1.618  # Golden ratio for harmonic variation
PHASE_SHIFT_SPEED = 0.3  # How fast the waves rotate in phase space
BRIGHTNESS_BOOST = 1.2  # Amplify the interference pattern
COLOR_SATURATION = 90  # HSV saturation (0-100)


def animate_triangle_interference(
    server_host="127.0.0.1", server_port=7890, duration=None, complexity=3
):
    """Main animation loop

    Args:
        server_host: OPC server host
        server_port: OPC server port
        duration: Optional duration limit in seconds
        complexity: Number of interfering waves (1-6)
    """
    complexity = max(1, min(6, complexity))

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
    log_file = open('/tmp/triangle_interference.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    # Create triangle grid
    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Pre-compute cell positions as normalized distances around a circle
    # Map 16 cells to a circle for distance-based wave calculations
    cell_positions = [
        (math.cos(2 * math.pi * i / num_cells), math.sin(2 * math.pi * i / num_cells))
        for i in range(num_cells)
    ]

    # Track time
    start_time = time.time()

    print(f"Starting interference animation with {num_cells} LEDs ({complexity} waves)")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            # Check if duration limit reached
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            current_time = time.time() - start_time

            # Generate frame
            frame = []
            for i in range(num_cells):
                x, y = cell_positions[i]
                distance = math.sqrt(x * x + y * y)
                angle = math.atan2(y, x)

                # Superpose multiple interfering waves
                interference = 0.0
                hue_blend = 0.0

                for wave_idx in range(complexity):
                    # Each wave has a different frequency and phase
                    frequency = BASE_FREQUENCY * (FREQUENCY_MULTIPLIER**wave_idx)
                    phase_offset = current_time * PHASE_SHIFT_SPEED + (
                        wave_idx * 2 * math.pi / complexity
                    )

                    # Wave 1: Radial wave from center
                    radial_wave = math.sin(distance * frequency + phase_offset)

                    # Wave 2: Angular wave around the circle
                    angular_wave = math.sin(angle * frequency + phase_offset)

                    # Wave 3: Time-dependent wave
                    temporal_wave = math.sin(
                        (distance + angle) * frequency + phase_offset
                    )

                    # Combine all three for rich interference
                    combined = (radial_wave + angular_wave + temporal_wave) / 3.0

                    # Accumulate interference (this creates the standing wave pattern)
                    interference += combined

                    # Track hue based on which wave dominates
                    hue_blend += (wave_idx * 120 / complexity) * abs(combined)

                # Normalize interference to brightness range
                # Clamp to avoid oversaturation
                interference = max(-2.0, min(2.0, interference))
                brightness = ((interference + 2.0) / 4.0) * 100 * BRIGHTNESS_BOOST
                brightness = max(0, min(100, brightness))

                # Hue shifts based on interference pattern and time
                base_hue = (current_time * 30) % 360
                local_hue = (base_hue + hue_blend) % 360
                hue_normalized = (local_hue / 360.0) * 100

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
        description="Triangle16 Interference Animation - Wave superposition creates complex patterns"
    )
    parser.add_argument(
        "--complexity",
        type=int,
        default=3,
        help="Number of interfering waves (1-6, default: 3)",
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

    animate_triangle_interference(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        complexity=args.complexity,
    )
