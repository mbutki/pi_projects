import math
from typing import TypedDict
import time


class CharacterInfo(TypedDict):
    pos: list[float]
    vel: list[float]
    speed: float


type Position = tuple[float, float]
type Thrust = tuple[float, float]

# Constants for testing
GRAVITY = (0, 9.8)  # Pulls down (Positive Y in many 2D engines)
WIND = (-2.0, 0)  # Pushes left (Negative X)


class Character:
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

    def get_state(self) -> CharacterInfo:
        return {
            "pos": self.pos,
            "vel": self.vel,
            "speed": math.sqrt(self.vel[0] ** 2 + self.vel[1] ** 2),
        }


class Autopilot:
    def __init__(self, pull=2.5, accumulation=0.1, brakes=11.5):
        self.k_p = pull
        self.k_i = accumulation
        self.k_d = brakes

        self.accmu = [0.0, 0.0]

    def calculate_thrust(
        self, char: CharacterInfo, target_pos: Position, dt: float
    ) -> Thrust:
        # Calculate thrust needed to reach target

        remaining = [target_pos[0] - char["pos"][0], target_pos[1] - char["pos"][1]]

        self.accmu[0] += remaining[0] * dt
        self.accmu[1] += remaining[1] * dt

        # Anti-Windup: Don't let the accumulation get too powerful
        limit = 5.0
        self.accmu[0] = max(-limit, min(limit, self.accmu[0]))
        self.accmu[1] = max(-limit, min(limit, self.accmu[1]))

        # PID = Pull + Accumulation - Breaks
        pull = remaining[0] * self.k_p
        accumulation = self.accmu[0] * self.k_i
        brakes = char["vel"][0] * self.k_d
        thrust_x = pull + accumulation - brakes

        pull = remaining[1] * self.k_p
        accumulation = self.accmu[1] * self.k_i
        brakes = char["vel"][1] * self.k_d
        thrust_y = pull + accumulation - brakes
        return (thrust_x, thrust_y)


class Simulation:
    def __init__(self, map, targets):
        self.map = map
        self.targets = targets
        self.target_index = 0

        self.char = Character()
        self.auto = Autopilot(pull=3.0, brakes=2.0)
        self.last_time = time.time()

    def is_valid_move(self, pos: list[float]) -> bool:
        x, y = int(round(pos[0])), int(round(pos[1]))

        if 0 <= x < len(self.map[0]) and 0 <= y < len(self.map):
            return self.map[y][x] == 0
        return False

    def step(self) -> bool:
        # Time delta
        now = time.time()
        dt = now - self.last_time
        self.last_time = now

        if self.target_index >= len(self.targets):
            print("Finished")
            return False

        cur_target = self.targets[self.target_index]
        # 1: Autopilot determins thrust vector
        thrust = self.auto.calculate_thrust(self.char.get_state(), cur_target, dt)

        # 2: Move Character
        # Store old position in case of collision
        old_pos = self.char.pos
        self.char.apply_physics(thrust, dt)

        # 3: Check for collisions
        if not self.is_valid_move(self.char.pos):
            print(f"Hit obsticle at {self.char.pos[0]}, {self.char.pos[1]}. Reversing")
            self.char.pos = old_pos
            # self.char.vel = [0.0, 0.0]  # hit stops momentum
            self.char.vel[0] *= -0.5  # Optional: slight "bounce" back
            self.char.vel[1] *= -0.5
            self.auto.accmu = [0.0, 0.0]

        # 4 Check if you reached target
        remaining = math.dist(self.char.pos, self.targets[self.target_index])
        if remaining < 0.3:
            print(f"Target {self.target_index} ({cur_target}) hit")
            self.target_index += 1
            self.auto.accmu = [0.0, 0.0]

        return True


def main():
    world_map = [[0, 0, 0, 0, 0], [0, 1, 1, 1, 0], [0, 0, 0, 0, 0]]
    targets = [(4, 0), (4, 2), (0, 0)]

    sim = Simulation(world_map, targets)

    for i in range(1000):
        if not sim.step():
            break

        if i % 5 == 0:
            state = sim.char.get_state()
            print(
                f'Pos: {state["pos"][0]:.2f}, {state["pos"][1]:.2f} | Speed: {state["speed"]:.2f}'
            )

        time.sleep(0.03)


if __name__ == "__main__":
    main()
