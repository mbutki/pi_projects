import math
import time
from a_star import a_star

from ship import Ship
from autopilot import Autopilot
from my_types import GridPos, ShipPos

# Constants for testing
GRAVITY = (0, 9.8)  # Pulls down (Positive Y in many 2D engines)
WIND = (-2.0, 0)  # Pushes left (Negative X)


class Simulation:
    def __init__(self, world_map: list[list[int]], targets: list[GridPos]):
        self.map = world_map
        self.targets = targets
        self.target_index = 0

        self.ship = Ship()
        self.auto = Autopilot(pull=3.0, brakes=2.0)

        self.waypoints = a_star(self.map, self.ship.get_grid_pos(), targets[0])
        print(f"Waypoints:{self.waypoints}")

        self.last_time = time.time()

    def is_valid_move(self, pos: list[float]) -> bool:
        x, y = int(round(pos[0])), int(round(pos[1]))

        if 0 <= x < len(self.map[0]) and 0 <= y < len(self.map):
            return self.map[y][x] == 0
        return False

    def has_line_of_sight(self, p1: ShipPos, p2: GridPos) -> bool:
        """Checks if a straight line between two points is clear of obstacles."""

        # Number of samples to check along the line
        dist = math.dist(p1, p2)
        steps = int(dist * 5)  # Check every 0.2 units

        for i in range(steps + 1):
            # Linear interpolation (LERP) between p1 and p2
            t = i / steps if steps > 0 else 0
            curr_x = p1[0] + (p2[0] - p1[0]) * t
            curr_y = p1[1] + (p2[1] - p1[1]) * t

            if not self.is_valid_move([curr_x, curr_y]):
                return False
        return True

    def step(self, step_index: int) -> bool:
        # Time delta
        now = time.time()
        dt = now - self.last_time
        self.last_time = now

        if self.target_index >= len(self.targets):
            print("Finished")
            return False

        ship_pos = best_wp = self.ship.get_pos()
        for wp in reversed(self.waypoints):
            if self.has_line_of_sight(ship_pos, wp):
                best_wp = wp
                break

        if step_index % 5 == 0:
            print(f"moving towards:{best_wp}")
        # 1: Autopilot determins thrust vector
        thrust = self.auto.calculate_thrust(self.ship.get_state(), best_wp, dt)

        # 2: Move Character
        # Store old position in case of collision
        old_pos = self.ship.pos
        self.ship.apply_physics(thrust, dt)

        # 3: Check for collisions
        if not self.is_valid_move(self.ship.pos):
            print(f"Hit obsticle at {self.ship.pos[0]}, {self.ship.pos[1]}. Reversing")
            self.ship.pos = old_pos
            # self.char.vel = [0.0, 0.0]  # hit stops momentum
            self.ship.vel[0] *= -0.5  # Optional: slight "bounce" back
            self.ship.vel[1] *= -0.5
            self.auto.accmu = [0.0, 0.0]

        # 4 Check if you reached target
        cur_target = self.targets[self.target_index]
        remaining = math.dist(self.ship.pos, cur_target)
        if remaining < 0.3:
            print(f"Target {self.target_index} ({cur_target}) hit")
            self.target_index += 1
            self.auto.accmu = [0.0, 0.0]

            # RECALCULATE waypoints for the NEXT mission target
            if self.target_index < len(self.targets):
                self.waypoints = a_star(
                    self.map, self.ship.get_grid_pos(), self.targets[self.target_index]
                )
                print(f"Waypoints:{self.waypoints}")

        return True
