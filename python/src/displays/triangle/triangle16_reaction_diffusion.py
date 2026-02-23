#!/usr/bin/env python

"""
Triangle16 Reaction-Diffusion Animation for Fadecandy

Simulates a Turing reaction-diffusion system that creates stripe and spot
patterns similar to animal markings. Two chemicals react and diffuse at
different rates, creating organized patterns from chaos.
"""

import opc
import time
import random
import argparse
from triangle_utils import TriangleGrid, hsb_to_rgb

# Parameters (Gray-Scott model approximation)
DIFFUSION_U = 0.16  # Diffusion rate of inhibitor
DIFFUSION_V = 0.08  # Diffusion rate of activator
FEED_RATE = 0.035  # External feed rate
KILL_RATE = 0.065  # Decay rate
COLOR_SATURATION = 100


def animate_triangle_reaction_diffusion(
    server_host="127.0.0.1", server_port=7890, duration=None, reset_mode="keep-alive"
):
    """Main animation loop

    Args:
        server_host: OPC server host
        server_port: OPC server port
        duration: Optional duration limit in seconds
        reset_mode: "keep-alive" (auto-reseed) or "reset" (full restart when pattern dies)
    """
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
    log_file = open('/tmp/triangle_reaction_diffusion.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    triangle = TriangleGrid()
    num_cells = triangle.num_cells

    def reset_state():
        """Reset chemical concentrations with new seed"""
        u = [1.0] * num_cells  # Inhibitor
        v = [0.0] * num_cells  # Activator

        # Seed with some activator
        for _ in range(3):
            idx = random.randint(0, num_cells - 1)
            v[idx] = 0.25

        return u, v

    # Two chemical concentrations
    u, v = reset_state()

    start_time = time.time()
    generation = 0

    print(
        f"Starting reaction-diffusion animation with {num_cells} cells (mode: {reset_mode})"
    )
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            # Reaction step
            for i in range(num_cells):
                reaction = u[i] * v[i] * v[i]
                u[i] = u[i] - reaction + FEED_RATE * (1 - u[i])
                v[i] = v[i] + reaction - (KILL_RATE + FEED_RATE) * v[i]

            # Diffusion step (simplified)
            new_u = u[:]
            new_v = v[:]

            for i in range(num_cells):
                for neighbor_idx in triangle.neighbors[i]:
                    if neighbor_idx >= 0:
                        new_u[i] += DIFFUSION_U * (u[neighbor_idx] - u[i])
                        new_v[i] += DIFFUSION_V * (v[neighbor_idx] - v[i])

            u = [max(0, min(1, x)) for x in new_u]
            v = [max(0, min(1, x)) for x in new_v]

            # Check if pattern has died out
            total_activity = sum(v)

            if total_activity < 0.05:  # Pattern is dead
                if reset_mode == "keep-alive":
                    # Inject new seeds while keeping current state (stronger re-energization)
                    for _ in range(2):  # Inject into 2 cells
                        v[random.randint(0, num_cells - 1)] = 0.6  # Stronger pulse
                else:  # "reset" mode
                    # Full restart
                    u, v = reset_state()
                    print(f"Pattern reset at generation {generation}")

            # Render based on chemical concentrations
            frame = []
            for i in range(num_cells):
                # v activator creates color, u inhibitor affects brightness
                brightness = v[i] * 100
                hue = (u[i] * 360) % 360
                hue_norm = (hue / 360.0) * 100

                r, g, b = hsb_to_rgb(hue_norm, COLOR_SATURATION, brightness)
                frame.append((r, g, b))

            # Send to OPC server with error handling
            try:
                client.put_pixels(frame)
            except Exception as e:
                log_file.write(f"Error sending pixels at {time.time()}: {e}\n")
                log_file.flush()
                print(f"Error sending pixels: {e}")

            time.sleep(1.0 / 30.0)
            generation += 1

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
    parser = argparse.ArgumentParser(description="Triangle16 Reaction-Diffusion")
    parser.add_argument(
        "--mode",
        choices=["keep-alive", "reset"],
        default="keep-alive",
        help="keep-alive: inject new seed when pattern dies, reset: full restart",
    )
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=7890)
    parser.add_argument("--duration", type=float, default=None)
    args = parser.parse_args()

    animate_triangle_reaction_diffusion(
        server_host=args.host,
        server_port=args.port,
        duration=args.duration,
        reset_mode=args.mode,
    )
