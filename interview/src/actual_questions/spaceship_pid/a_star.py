import heapq
import math
from my_types import GridPos


def a_star(map_grid: list[list[int]], start: GridPos, goal: GridPos) -> list[GridPos]:
    """Returns a list of tuples as a path from start to goal."""
    rows, cols = len(map_grid), len(map_grid[0])
    # Directions: Up, Down, Left, Right, and Diagonals
    neighbors = [(0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)]

    q = [(0.0, start)]
    came_from: dict[GridPos, GridPos | None] = {start: None}
    cost_so_far = {start: 0.0}

    while q:
        _, current = heapq.heappop(q)

        if current == goal:
            break

        for dx, dy in neighbors:
            next_node = (current[0] + dx, current[1] + dy)

            # Bounds and Obstacle Check
            if 0 <= next_node[1] < rows and 0 <= next_node[0] < cols:
                if map_grid[next_node[1]][next_node[0]] == 1:
                    continue

                # Diagonal movement costs slightly more (sqrt 2)
                new_cost = cost_so_far[current] + (1.0 if dx == 0 or dy == 0 else 1.41)

                if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                    cost_so_far[next_node] = new_cost
                    # priority = known traveled cost + estimated remaining cost
                    priority = new_cost + math.dist(next_node, goal)
                    heapq.heappush(q, (priority, next_node))
                    came_from[next_node] = current

    # Reconstruct path
    path: list[GridPos] = []
    curr = goal
    while curr is not None:
        path.append(curr)
        curr = came_from.get(curr)
    path.reverse()  # Reverse to get start -> goal

    return path
