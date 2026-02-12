import random
import time
from uuid import uuid4
from collections import Counter
from typing import Any, TypedDict

RgbColor = tuple[int, int, int]


class PerfStats(TypedDict):
    total_generations: int
    total_time: float
    average_time_per_generation: float
    last_generation_time: float
    current_living_cells: int
    history_size: int


class Cell:
    def __init__(self, color: RgbColor) -> None:
        self.color = color
        self.id = uuid4()

    def __str__(self) -> str:
        return "Cell"

    def __hash__(self) -> int:
        return hash(self.id)

    def __eq__(self, other) -> bool:
        return self.id == other.id


Coord = tuple[int, int]
CellLocDict = dict[Coord, Cell]


class World:
    adjacent = ((1, 1), (1, 0), (0, 1), (1, -1), (-1, 1), (-1, -1), (-1, 0), (0, -1))

    def __init__(
        self,
        bounds: Coord,
        born: set[int],
        survive: set[int],
        seed: float,
        x_offset: int,
    ) -> None:
        self.cols, self.rows = bounds
        # Optimization 1: Sparse representation - only store living cells
        self.living_cells: CellLocDict = {}  # {(r, c): Cell} - only living cells
        self.born = born
        self.survive = survive
        self.seed = seed
        self.x_offset = x_offset
        self.age: int = 0
        self.cell_cnt: int = 0

        # Optimization 7: Smart history management
        self.history = set()
        self.max_history_size: int = 100
        self.history_trim_size: int = 50

        # Optimization 8: Performance profiling
        self.last_advance_time: float = 0
        self.total_advance_time: float = 0
        self.advance_count: int = 0

    def reset(self) -> None:
        # Optimization 7: Smart history management
        self.history = set()
        self.living_cells = {}
        self.age = 0
        self.last_advance_time = 0
        self.total_advance_time = 0
        self.advance_count = 0
        self.populate()

        # Debug blinker
        # self.living_cells[(1, 2)] = Cell((random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        # self.living_cells[(2, 2)] = Cell((random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        # self.living_cells[(3, 2)] = Cell((random.randint(0,255), random.randint(0,255), random.randint(0,255)))

    def populate(self) -> None:
        for r in range(self.rows):
            for c in range(self.cols):
                if random.random() <= self.seed:
                    self.living_cells[(r, c)] = Cell(
                        (
                            random.randint(0, 255),
                            random.randint(0, 255),
                            random.randint(0, 255),
                        )
                    )

    def wrap_coordinates(self, r: int, c: int) -> Coord:
        """Helper method to handle coordinate wrapping"""
        if r == -1:
            r = self.rows - 1
        elif r == self.rows:
            r = 0
        if c == -1:
            c = self.cols - 1
        elif c == self.cols:
            c = 0
        return (r, c)

    # Optimization 2: Active region processing
    def get_active_region(self) -> set[Coord]:
        """Get all cells that need to be evaluated (living + their neighbors)"""
        active = set()
        for r, c in self.living_cells:
            active.add((r, c))  # Living cell
            # Add all neighbors
            for dr, dc in World.adjacent:
                nr, nc = self.wrap_coordinates(r + dr, c + dc)
                active.add((nr, nc))
        return active

    # Optimization 3: Efficient neighbor counting
    def get_neighbor_counts(self, active_cells: set[Coord]) -> dict[Coord, int]:
        """Get neighbor counts for all active cells at once"""
        neighbor_counts = {}

        # Initialize all active cells with 0 count
        for cell_pos in active_cells:
            neighbor_counts[cell_pos] = 0

        # Count neighbors efficiently
        for r, c in self.living_cells:
            for dr, dc in World.adjacent:
                nr, nc = self.wrap_coordinates(r + dr, c + dc)
                if (nr, nc) in active_cells:
                    neighbor_counts[(nr, nc)] += 1

        return neighbor_counts

    def gen_state(self) -> tuple[Coord, ...]:
        """Generate a state representation compatible with original loop detection"""
        # Sort coordinates to ensure consistent ordering for comparison
        living_coords = sorted(self.living_cells.keys())
        return tuple(living_coords)

    def advance(self) -> bool:
        # Optimization 8: Performance profiling
        start_time = time.time()

        # First add current state to history BEFORE making any changes
        current_state = self.gen_state()
        self.history.add(current_state)

        self.age += 1

        # Optimization 2: Only evaluate active region
        active_cells = self.get_active_region()

        # Optimization 3: Efficient neighbor counting
        neighbor_counts = self.get_neighbor_counts(active_cells)

        new_living_cells = {}

        for r, c in active_cells:
            is_alive = (r, c) in self.living_cells
            local_alive_cnt = neighbor_counts[(r, c)]

            if is_alive:
                if local_alive_cnt in self.survive:
                    new_living_cells[(r, c)] = self.living_cells[(r, c)]
            else:  # It was dead
                if local_alive_cnt in self.born:
                    new_living_cells[(r, c)] = Cell(self.get_baby_color_fast(r, c))

        # Update to new state
        self.living_cells = new_living_cells

        # Generate new state and check if we've seen it before
        new_state = self.gen_state()
        loop_detected = new_state in self.history

        # Optimization 7: Smart history management
        if len(self.history) > self.max_history_size:
            # Keep only recent states
            recent_history = list(self.history)[-self.history_trim_size :]
            self.history = set(recent_history)

        # Optimization 8: Performance profiling
        self.last_advance_time = time.time() - start_time
        self.total_advance_time += self.last_advance_time
        self.advance_count += 1

        # if self.age % 100 == 0:  # Log every 100 generations
        #    avg_time = self.total_advance_time / self.advance_count
        #    print(f"Generation {self.age}: {self.last_advance_time:.4f}s (avg: {avg_time:.4f}s, living: {len(self.living_cells)})")

        return loop_detected

    # Optimization 5: Optimized color calculation
    def get_baby_color_fast(self, r: int, c: int) -> RgbColor:
        """Optimized color calculation using Counter instead of statistics.mode"""
        colors = []
        for dr, dc in World.adjacent:
            nr, nc = self.wrap_coordinates(r + dr, c + dc)
            if (nr, nc) in self.living_cells:
                colors.append(self.living_cells[(nr, nc)].color)

        if not colors:
            return (255, 255, 255)  # Default color if no neighbors

        # Use Counter instead of statistics.mode for better performance
        most_common_color = Counter(colors).most_common(1)[0][0]
        return most_common_color

    def draw(self, canvas: Any) -> None:
        for (r, c), cell in self.living_cells.items():
            x = c + self.x_offset
            y = r
            canvas.SetPixel(x, y, cell.color[0], cell.color[1], cell.color[2])

    def count_living(self) -> int:
        return len(self.living_cells)

    def get_performance_stats(self) -> PerfStats | None:
        """Get performance statistics"""
        if self.advance_count == 0:
            return

        avg_time = self.total_advance_time / self.advance_count
        return {
            "total_generations": self.age,
            "total_time": self.total_advance_time,
            "average_time_per_generation": avg_time,
            "last_generation_time": self.last_advance_time,
            "current_living_cells": len(self.living_cells),
            "history_size": len(self.history),
        }

    def __str__(self) -> str:
        # Convert sparse representation back to matrix format for display
        result = []
        for r in range(self.rows):
            row = []
            for c in range(self.cols):
                if (r, c) in self.living_cells:
                    row.append(str(self.living_cells[(r, c)]))
                else:
                    row.append("None")
            result.append("\t".join(row))
        return "\n".join(result)
