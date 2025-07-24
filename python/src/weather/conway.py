import random
import statistics
import uuid

class Cell():
    def __init__(self, color):
        self.color = color
        self.id = uuid.uuid4()

    def __str__(self):
        return "Cell"

    def __hash__(self):
        return self.id

    def __eq__(self, other):
        return self.id == other.id

class World():
    adjacent = ((1, 1), (1, 0), (0, 1), (1, -1), (-1, 1), (-1, -1), (-1, 0), (0, -1))

    def __init__(self, bounds, born, survive, seed, x_offset):
        self.cols, self.rows = bounds
        self.world = self.get_new_matrix()
        self.buffer = self.get_new_matrix()
        self.born = born
        self.survive = survive
        self.seed = seed
        self.x_offset = x_offset
        self.age = 0
        self.cell_cnt = 0
        self.history = set()

    def get_new_matrix(self):
        return [[None] * self.cols for _ in range(self.rows)]

    def reset(self):
        self.history = set()
        self.world = self.get_new_matrix()
        self.buffer = self.get_new_matrix()
        self.populate()

        # Debug blinker
        #self.world[1][2] = Cell(graphics.Color(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        #self.world[2][2] = Cell(graphics.Color(random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        #self.world[3][2] = Cell(graphics.Color(random.randint(0,255), random.randint(0,255), random.randint(0,255)))

    def swap_buffer(self):
        self.world = self.buffer
        self.buffer = self.get_new_matrix()

    def populate(self):
        for r in range(len(self.world)):
            for c in range(len(self.world[r])):
                if random.random() <= self.seed:
                    self.world[r][c] = Cell((random.randint(0,255), random.randint(0,255), random.randint(0,255)))
                else:
                    self.world[r][c] = None

    def gen_state(self):
        state = []
        for r in range(len(self.world)):
            for c in range(len(self.world[r])):
                if self.world[r][c]:
                    state.append((r,c))
        return tuple(state)

    def advance(self):
        self.age += 1
        for r in range(len(self.world)):
            for c in range(len(self.world[r])):
                self.fate(r, c)

        self.history.add(self.gen_state())
        self.swap_buffer()

    def fate(self, r, c):
        is_alive = self.world[r][c]
        local_alive_cnt = self.get_local_alive_cnt(r, c)

        if is_alive:
            if local_alive_cnt in self.survive:
                self.buffer[r][c] = self.world[r][c]
            else:
                self.buffer[r][c] = None
        else: # It was dead
            if local_alive_cnt in self.born:
                self.buffer[r][c] = Cell(self.get_baby_color(r,c))
            else:
                self.buffer[r][c] = None

    # Baby's color is the mode of colors of neighbors
    def get_baby_color(self, r, c):
        colors = []
        neighbor_locs = self.find_adjacent_with_wrapping(r, c)
        cells = filter(None, [self.world[r][c] for r, c in neighbor_locs])
        colors = [cell.color for cell in cells]
        result = statistics.mode(colors)
        return result

    def get_local_alive_cnt(self, r, c):
        neighbor_locs = self.find_adjacent_with_wrapping(r, c)

        return sum(1 if self.world[r][c] else 0 for r, c in neighbor_locs)

    def find_adjacent_with_wrapping(self, r, c):
        result = []
        for dr, dc in World.adjacent:
            nr = r + dr
            nc = c + dc
            if nr == -1:
                nr = self.rows - 1
            elif nr == self.rows:
                nr = 0
            if nc == -1:
                nc = self.cols - 1
            elif nc == self.cols:
                nc = 0
            result.append((nr, nc))

        return result

    def draw(self, canvas):
        for r in range(len(self.world)):
            for c in range(len(self.world[r])):
                cell = self.world[r][c]
                if cell:
                    x = c + self.x_offset
                    y = r
                    canvas.SetPixel(x, y, cell.color[0], cell.color[1], cell.color[2])

    def count_living(self):
        s = 0
        for r in range(len(self.world)):
            for c in range(len(self.world[r])):
                if self.world[r][c]:
                    s += 1
        return s

    def __str__(self):
        return '\n'.join(['\t'.join([str(cell) for cell in row]) for row in self.world])
