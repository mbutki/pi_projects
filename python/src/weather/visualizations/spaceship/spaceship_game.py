import random
from collections import deque
from typing import Any

from weather.visualizations.spaceship.simulation import Simulation
from weather.visualizations.spaceship.my_types import GridPos


class SpaceshipGame:
    def __init__(self, x_offset, mapsize) -> None:
        self.map_width, self.map_height = mapsize
        self.x_offset = x_offset
        self.world_map = self._generate_world_map()
        self.reachable_cells = self._get_reachable_empty_cells(self.world_map)
        self.targets: list[GridPos] = self._generate_targets(10)
        self.start_pos = self._choose_start_pos()

        self.sim = Simulation(self.world_map, self.targets, self.start_pos)

    def _generate_world_map(self) -> list[list[int]]:
        """Generate a random world map with obstructions and guaranteed paths."""
        world_map: list[list[int]] = [
            [0] * self.map_width for _ in range(self.map_height)
        ]

        # Add random obstructions of various sizes
        obstruction_count = random.randint(
            # 2, max(3, min(self.map_width, self.map_height) // 2)
            10,
            30,
        )

        for _ in range(obstruction_count):
            # Random obstruction size
            # width = random.randint(1, min(3, max(1, self.map_width // 2)))
            width = random.randint(3, 15)
            # height = random.randint(1, min(3, max(1, self.map_height // 2)))
            height = random.randint(3, 10)

            # Random position
            x = random.randint(0, max(0, self.map_width - width))
            y = random.randint(0, max(0, self.map_height - height))

            # Place obstruction
            for dy in range(height):
                for dx in range(width):
                    if y + dy < self.map_height and x + dx < self.map_width:
                        world_map[y + dy][x + dx] = 1

        # Ensure there's a path by checking connectivity
        if not self._has_path(world_map):
            # Retry with fewer obstructions
            world_map = [[0] * self.map_width for _ in range(self.map_height)]
            obstruction_count = max(1, obstruction_count - 1)

            for _ in range(obstruction_count):
                width = random.randint(1, min(2, max(1, self.map_width // 3)))
                height = random.randint(1, min(2, max(1, self.map_height // 3)))
                x = random.randint(0, max(0, self.map_width - width))
                y = random.randint(0, max(0, self.map_height - height))

                for dy in range(height):
                    for dx in range(width):
                        if y + dy < self.map_height and x + dx < self.map_width:
                            world_map[y + dy][x + dx] = 1

        return world_map

    def _has_path(self, world_map: list[list[int]]) -> bool:
        """Check if there's a valid path through the map using BFS."""
        # Find start position (first empty cell)
        start = None
        for y in range(self.map_height):
            for x in range(self.map_width):
                if world_map[y][x] == 0:
                    start = (x, y)
                    break
            if start:
                break

        if not start:
            return False

        # BFS to find reachable area
        visited = set()
        queue = deque([start])
        visited.add(start)

        while queue:
            x, y = queue.popleft()

            # Explore neighbors
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx, ny = x + dx, y + dy

                if 0 <= nx < self.map_width and 0 <= ny < self.map_height:
                    if (nx, ny) not in visited and world_map[ny][nx] == 0:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

        # Require at least 30% of the map to be reachable
        return len(visited) > self.map_width * self.map_height * 0.3

    def _generate_targets(self, num_targets: int = 3) -> list[GridPos]:
        """Generate random targets in a reachable, non-obstructed region."""
        candidates = self.reachable_cells
        if not candidates:
            return []

        num_targets = min(num_targets, len(candidates))
        return random.sample(candidates, num_targets)

    def _get_reachable_empty_cells(self, world_map: list[list[int]]) -> list[GridPos]:
        """Return all empty cells reachable from the first empty grid cell."""
        start = None
        for y in range(self.map_height):
            for x in range(self.map_width):
                if world_map[y][x] == 0:
                    start = (x, y)
                    break
            if start:
                break

        if not start:
            return []

        visited = set([start])
        queue = deque([start])

        while queue:
            x, y = queue.popleft()
            for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < self.map_width and 0 <= ny < self.map_height:
                    if (nx, ny) not in visited and world_map[ny][nx] == 0:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

        return list(visited)

    def _choose_start_pos(self) -> GridPos:
        if self.reachable_cells:
            return random.choice(self.reachable_cells)
        return (0, 0)

    def step(self) -> None:
        is_running = self.sim.step()

        if not is_running:
            self.world_map = self._generate_world_map()
            self.reachable_cells = self._get_reachable_empty_cells(self.world_map)
            self.targets: list[GridPos] = self._generate_targets(10)
            self.start_pos = self._choose_start_pos()
            self.sim = Simulation(self.world_map, self.targets, self.start_pos)
            # self.sim.reset()

    def reset(self) -> None:
        self.world_map = self._generate_world_map()
        self.reachable_cells = self._get_reachable_empty_cells(self.world_map)
        self.targets: list[GridPos] = self._generate_targets(10)
        self.start_pos = self._choose_start_pos()
        self.sim = Simulation(self.world_map, self.targets, self.start_pos)
        # self.sim.reset()

    def draw(self, canvas: Any) -> None:
        self.draw_map(canvas)
        self.draw_debug_overlay(canvas)
        self.draw_waypoints(canvas)
        self.draw_target(canvas)
        self.draw_ship(canvas)

    def draw_target(self, canvas: Any) -> None:
        x, y = self.sim.current_target()
        x = self.clamp(x, 0, self.map_width - 1)
        y = self.clamp(y, 0, self.map_height - 1)

        canvas.SetPixel(x + self.x_offset, y, 255, 0, 0)

    def draw_ship(self, canvas: Any) -> None:
        x, y = self.sim.ship.get_grid_pos()
        x = self.clamp(x, 0, self.map_width - 1)
        y = self.clamp(y, 0, self.map_height - 1)

        canvas.SetPixel(x + self.x_offset, y, 0, 255, 0)

    def draw_map(self, canvas: Any) -> None:
        for y, row in enumerate(self.world_map):
            for x, item in enumerate(row):
                if item == 1:
                    canvas.SetPixel(x + self.x_offset, y, 180, 180, 180)

    def draw_waypoints(self, canvas: Any) -> None:
        for wp in reversed(self.sim.waypoints):
            if self.sim.has_line_of_sight(self.sim.ship.get_pos(), wp):
                x = self.clamp(wp[0], 0, self.map_width - 1)
                y = self.clamp(wp[1], 0, self.map_height - 1)

                canvas.SetPixel(x + self.x_offset, y, 0, 255, 255)
                break

    def draw_debug_overlay(self, canvas: Any) -> None:
        # Draw a faint border around the game map area for verification
        border_color = (40, 40, 40)
        left = self.x_offset
        right = self.x_offset + self.map_width - 1
        top = 0
        bottom = self.map_height - 1

        for x in range(self.map_width):
            canvas.SetPixel(left + x, top, *border_color)
            canvas.SetPixel(left + x, bottom, *border_color)
        for y in range(self.map_height):
            canvas.SetPixel(left, y, *border_color)
            canvas.SetPixel(right, y, *border_color)

        # Draw all computed waypoints as a faint purple path
        for wp in self.sim.waypoints:
            if 0 <= wp[0] < self.map_width and 0 <= wp[1] < self.map_height:
                canvas.SetPixel(wp[0] + self.x_offset, wp[1], 30, 0, 70)

    def _draw_marker(self, canvas: Any, x: int, y: int, r: int, g: int, b: int) -> None:
        center_x = self.clamp(x, 0, self.map_width - 1) + self.x_offset
        center_y = self.clamp(y, 0, self.map_height - 1)
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1), (0, 0)]:
            px = center_x + dx
            py = center_y + dy
            if 0 <= px < self.x_offset + self.map_width and 0 <= py < self.map_height:
                canvas.SetPixel(px, py, r, g, b)

    def clamp(self, val: int, val_min: int, val_max: int) -> int:
        return max(val_min, min(val_max, val))
