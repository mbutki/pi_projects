import time
import random

from bird import FlappyBird
from pipe import Pipe


class Simulation:
    def __init__(self):
        self.bird = FlappyBird()
        self.pipes = [Pipe(x=10), Pipe(x=15), Pipe(x=20)]
        self.bird_x = 2.0
        self.scroll_speed = 3.0
        self.last_time = time.time()

    def step(self, should_flap: bool):
        now = time.time()
        dt = min(now - self.last_time, 0.1)  # Clamp dt for stability
        self.last_time = now

        if should_flap:
            self.bird.flap()

        self.bird.update(dt)

        # Move pipes and check collisions
        for pipe in self.pipes:
            pipe.x -= self.scroll_speed * dt

            if pipe.check_collision(self.bird_x, self.bird.y):
                self.bird.is_alive = False

            # Recycle pipes that leave the screen
            if pipe.x < -2.0:
                pipe.x = 13.0
                pipe.gap_y = random.uniform(2.0, 8.0)
                self.bird.score += 1

        return self.bird.is_alive
