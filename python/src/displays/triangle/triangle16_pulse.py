#!/usr/bin/env python

"""
Triangle16 Pulse Animation for Fadecandy

All 16 LEDs are always lit with continuously shifting colors and brightness.
Each cell has a gentle, organic pulse that flows through the grid, creating
a living, breathing effect. No dark cells—the triangle always glows.
"""

import opc
import time
import math
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters
PULSE_SPEED = 0.5  # How fast the overall pulse moves (0.1=slow, 1.0=fast)
BRIGHTNESS_RANGE = (30, 100)  # Min and max brightness (0-100)
COLOR_SHIFT_SPEED = 0.2  # How fast hue shifts over time
SPATIAL_VARIATION = (
    1.0  # How much cell position affects the wave (0=all same, 1=rippling)
)
COLOR_SATURATION = 85  # HSV saturation (0-100)


def animate_triangle_pulse(
    server_host="127.0.0.1", server_port=7890, duration=None, wave_mode="sine"
):
    """Main animation loop

    Args:
        server_host: OPC server host
        server_port: OPC server port
        duration: Optional duration limit in seconds
        wave_mode: Type of wave ('sine', 'triangle', 'sawtooth')
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
    log_file = open('/tmp/triangle_pulse.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    # Create triangle grid
    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    # Track time
    start_time = time.time()

    print(f"Starting pulse animation with {num_cells} LEDs (wave mode: {wave_mode})")
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            # Check if duration limit reached
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            current_time = time.time() - start_time

            # Generate frame - all cells always lit
            frame = []
            for i in range(num_cells):
                # Primary pulse: global oscillation affecting all cells
                global_pulse = math.sin(current_time * PULSE_SPEED * math.pi)

                # Spatial variation: cell index creates phase shift for ripple effect
                phase_shift = (i / num_cells) * SPATIAL_VARIATION * 2 * math.pi

                # Generate wave based on mode
                if wave_mode == "sine":
                    wave = math.sin(current_time * PULSE_SPEED * math.pi + phase_shift)
                elif wave_mode == "triangle":
                    # Triangle wave: sawtooth with reflection
                    t = (current_time * PULSE_SPEED + phase_shift / (2 * math.pi)) % 2.0
                    wave = 1.0 - abs(2.0 * (t - 0.5)) * 2.0 - 1.0
                elif wave_mode == "sawtooth":
                    # Sawtooth wave: linear ramp
                    t = (current_time * PULSE_SPEED + phase_shift / (2 * math.pi)) % 1.0
                    wave = 2.0 * t - 1.0
                else:
                    wave = global_pulse

                # Normalize wave to 0-1 range
                wave_normalized = (wave + 1.0) / 2.0

                # Map to brightness range
                brightness = BRIGHTNESS_RANGE[0] + wave_normalized * (
                    BRIGHTNESS_RANGE[1] - BRIGHTNESS_RANGE[0]
                )

                # Hue shifts over time, influenced by cell position
                base_hue = (current_time * COLOR_SHIFT_SPEED * 60) % 360
                hue = (base_hue + (i / num_cells) * 120) % 360

                # Normalize hue to 0-100 range for hsb_to_rgb
                hue_normalized = (hue / 360.0) * 100

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
    import argparse

    parser = argparse.ArgumentParser(
        description="Triangle16 Pulse Animation - All LEDs always glowing with shifting colors"
    )
    parser.add_argument(
        "--mode",
        choices=["sine", "triangle", "sawtooth"],
        default="sine",
        help="Wave shape: sine (smooth), triangle (sharp peaks), sawtooth (linear ramps)",
    )
    parser.add_argument(
        "--speed",
        type=float,
        default=0.5,
        help="Pulse speed (0.1=slow, 1.0=normal, 2.0=fast)",
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

    # Override default speed if provided
    if args.speed != 0.5:
        PULSE_SPEED = args.speed

    animate_triangle_pulse(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        wave_mode=args.mode,
    )
