import time

from weather.visualizations.spaceship.simulation import Simulation
from weather.visualizations.spaceship.my_types import GridPos


def main():
    world_map = [[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 0]]
    targets: list[GridPos] = [(4, 0), (4, 2), (0, 0)]

    sim = Simulation(world_map, targets)

    for i in range(1000):
        if not sim.step(i):
            break

        if i % 5 == 0:
            state = sim.ship.get_state()
            print(
                f'Pos: {state["pos"][0]:.2f}, {state["pos"][1]:.2f} | Speed: {state["speed"]:.2f}'
            )

        time.sleep(0.03)


if __name__ == "__main__":
    main()
