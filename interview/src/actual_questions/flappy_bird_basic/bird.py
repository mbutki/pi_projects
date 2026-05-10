from typing import TypedDict


class BirdState(TypedDict):
    y: float
    vel: float
    is_alive: bool


class FlappyBird:
    def __init__(self):
        # Physics Constants
        self.gravity = 15.0  # Downward acceleration
        self.flap_strength = -7.0  # Instant upward velocity
        self.terminal_vel = 10.0  # Max falling speed

        # State
        self.y = 5.0  # Start in the middle (0-10 range)
        self.vel = 0.0
        self.is_alive = True
        self.score = 0

    def flap(self):
        if self.is_alive:
            self.vel = self.flap_strength

    def update(self, dt: float):
        if not self.is_alive:
            return

        # 1. Apply Gravity (v = v + a*dt)
        self.vel += self.gravity * dt
        self.vel = min(self.vel, self.terminal_vel)

        # 2. Update Position (y = y + v*dt)
        self.y += self.vel * dt

        # 3. Floor/Ceiling collisions
        if self.y > 10.0 or self.y < 0:
            self.is_alive = False

    def get_state(self) -> BirdState:
        return {"y": self.y, "vel": self.vel, "is_alive": self.is_alive}
