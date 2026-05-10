import random


class Pipe:
    def __init__(self, x: float):
        self.x = x
        self.gap_y = random.uniform(2.0, 8.0)  # Center of the opening
        self.gap_width = 2.5  # Size of the opening
        self.width = 1.0

    def check_collision(self, bird_x: float, bird_y: float) -> bool:
        # Check if bird is horizontally inside the pipe
        if bird_x > self.x and bird_x < self.x + self.width:
            # Check if bird is NOT inside the vertical gap
            half_gap = self.gap_width / 2
            if bird_y < (self.gap_y - half_gap) or bird_y > (self.gap_y + half_gap):
                return True
        return False
