import math
from typing import TypedDict
from my_types import Thrust, ShipPos, GridPos
import utils


class ShipInfo(TypedDict):
    pos: ShipPos
    vel: tuple[float, float]
    speed: float


class Ship:
    def __init__(self, x=0.0, y=0.0) -> None:
        self.pos = [x, y]
        self.vel = [0.0, 0.0]
        self.mass = 1.0
        self.radius = 0.3
        self.max_speed = 10

    def apply_physics(self, force: Thrust, dt: float) -> None:
        # Apply thrust vector to character

        dt = min(dt, 0.1)

        # force = mass * accel
        # accel = force / mass
        # velocity = accel * time_delta

        self.vel[0] += (force[0] / self.mass) * dt
        self.vel[1] += (force[1] / self.mass) * dt

        # Cap speed so we don't phase through walls
        speed = math.sqrt(self.vel[0] ** 2 + self.vel[1] ** 2)
        if speed > self.max_speed:
            self.vel[0] = (self.vel[0] / speed) * self.max_speed
            self.vel[1] = (self.vel[1] / speed) * self.max_speed

        self.pos[0] += self.vel[0] * dt
        self.pos[1] += self.vel[1] * dt

    def get_state(self) -> ShipInfo:
        return {
            "pos": self.to_pair(self.pos),
            "vel": self.to_pair(self.vel),
            "speed": math.sqrt(self.vel[0] ** 2 + self.vel[1] ** 2),
        }

    def to_pair(self, x: list[float]) -> tuple[float, float]:
        return (x[0], x[1])

    def get_grid_pos(self) -> GridPos:
        return utils.to_grid(self.to_pair(self.pos))

    def get_pos(self) -> ShipPos:
        return (self.pos[0], self.pos[1])
