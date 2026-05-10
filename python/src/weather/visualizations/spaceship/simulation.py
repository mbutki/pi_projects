import math
import time
import random

from weather.visualizations.spaceship.a_star import a_star
from weather.visualizations.spaceship.ship import Ship
from weather.visualizations.spaceship.autopilot import Autopilot
from weather.visualizations.spaceship.my_types import GridPos, ShipPos

# Constants for testing
GRAVITY = (0, 9.8)  # Pulls down (Positive Y in many 2D engines)
WIND = (-2.0, 0)  # Pushes left (Negative X)


class Simulation:
    def __init__(
        self,
        world_map: list[list[int]],
        targets: list[GridPos],
        start_pos: GridPos | None = None,
    ):
        self.map = world_map
        self.targets = targets
        self.target_index = 0

        self.start_pos = start_pos if start_pos is not None else self.find_empty_cell()
        self.ship = Ship(self.start_pos)
        self.auto = Autopilot()

        self.waypoints = a_star(self.map, self.ship.get_grid_pos(), targets[0])

        self.last_time = time.time()
        self.last_grid_pos = self.ship.get_grid_pos()
        self.stuck_time = 0.0
        self.stuck_timeout = 1.5  # seconds in same grid cell before reset

    def find_empty_cell(self) -> GridPos:
        """Generate random targets in non-obstructed areas."""
        empty_cells: list[GridPos] = []

        # Find all empty cells
        for y, row in enumerate(self.map):
            for x, item in enumerate(row):
                if item == 0:
                    empty_cells.append((x, y))

        # Select random targets from empty cells
        if len(empty_cells) > 0:
            return random.sample(empty_cells, 1)[0]

        return (0, 0)

    def current_target(self) -> GridPos:
        return self.targets[self.target_index]

    def is_valid_move(self, pos: ShipPos) -> bool:
        x, y = int(round(pos[0])), int(round(pos[1]))

        if 0 <= x < len(self.map[0]) and 0 <= y < len(self.map):
            return self.map[y][x] == 0
        return False

    def _find_nearest_free_cell(self, pos: ShipPos) -> GridPos:
        x, y = int(round(pos[0])), int(round(pos[1]))
        best = None
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                nx, ny = x + dx, y + dy
                if 0 <= ny < len(self.map) and 0 <= nx < len(self.map[0]):
                    if self.map[ny][nx] == 0:
                        return (nx, ny)
                    if best is None:
                        best = (nx, ny)
        return best or (0, 0)

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

            if not self.is_valid_move((curr_x, curr_y)):
                return False
        return True

    def reset(self) -> None:
        self.target_index = 0

        self.ship = Ship(self.start_pos)
        self.auto = Autopilot()

        self.waypoints = a_star(self.map, self.ship.get_grid_pos(), self.targets[0])

        self.last_time = time.time()
        self.last_grid_pos = self.ship.get_grid_pos()
        self.stuck_time = 0.0

    def step(self) -> bool:
        # Time delta
        now = time.time()
        dt = now - self.last_time
        self.last_time = now

        ship_pos = best_wp = self.ship.get_pos()
        for wp in reversed(self.waypoints):
            if self.has_line_of_sight(ship_pos, wp):
                best_wp = wp
                break

        # 1: Autopilot determins thrust vector
        thrust = self.auto.calculate_thrust(self.ship.get_state(), best_wp, dt)

        # 2: Move Character
        # Store old position in case of collision
        old_pos = self.ship.pos.copy()
        self.ship.apply_physics(thrust, dt)

        # 3: Check for collisions
        if not self.is_valid_move(self.ship.get_pos()):
            self.ship.pos = old_pos
            self.ship.vel[0] *= -0.5  # Optional: slight "bounce" back
            self.ship.vel[1] *= -0.5
            self.auto.accmu = [0.0, 0.0]

            # If rolled back position is still invalid, snap to nearest free cell.
            if not self.is_valid_move(self.ship.get_pos()):
                self.ship.pos = list(self._find_nearest_free_cell(old_pos))
                self.ship.vel = [0.0, 0.0]
                self.auto.accmu = [0.0, 0.0]

        # 4: Track whether the ship is stuck in the same grid cell.
        current_grid_pos = self.ship.get_grid_pos()
        if current_grid_pos == self.last_grid_pos:
            self.stuck_time += dt
        else:
            self.stuck_time = 0.0
            self.last_grid_pos = current_grid_pos

        if self.stuck_time > self.stuck_timeout:
            return False

        # 5: Check if you reached target
        cur_target = self.current_target()
        remaining = math.dist(self.ship.pos, cur_target)
        if remaining < 0.5:
            self.auto.accmu = [0.0, 0.0]

            if self.target_index == len(self.targets) - 1:
                self.reset()
                return False

            self.target_index += 1
            # RECALCULATE waypoints for the NEXT mission target
            self.waypoints = a_star(
                self.map, self.ship.get_grid_pos(), self.current_target()
            )

        return True
