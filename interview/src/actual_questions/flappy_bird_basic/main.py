import time

from simulation import Simulation


# --- Simple "Look Ahead" Autopilot ---
def run_autopilot():
    sim = Simulation()
    print("Simulation Started...")

    while sim.bird.is_alive:
        bird_state = sim.bird.get_state()

        # Find the next upcoming pipe
        next_pipe = [p for p in sim.pipes if p.x + p.width > sim.bird_x][0]

        # Logic: If we are falling below the center of the gap, FLAP!
        # We add a small buffer (0.2) so we don't flap too late.
        decision = bird_state["y"] > next_pipe.gap_y + 0.2

        if not sim.step(decision):
            print(f"CRASH! Final Score: {sim.bird.score}")
            break

        print(
            f"Y: {bird_state['y']:.2f} | Vel: {bird_state['vel']:.2f} | Next Pipe Gap: {next_pipe.gap_y:.2f}"
        )
        time.sleep(0.05)


if __name__ == "__main__":
    run_autopilot()
