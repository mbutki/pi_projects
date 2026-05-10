from weather.visualizations.spaceship.ship import ShipInfo
from weather.visualizations.spaceship.my_types import ShipPos, Thrust


class Autopilot:
    # def __init__(self, pull=3, accumulation=0.1, brakes=1): #funny fast and drifty
    # def __init__(self, pull=2.5, accumulation=0.1, brakes=2):
    def __init__(self, pull=3, accumulation=0.1, brakes=2):
        self.k_p = pull
        self.k_i = accumulation
        self.k_d = brakes

        self.accmu = [0.0, 0.0]

    def calculate_thrust(
        self, char: ShipInfo, target_pos: ShipPos, dt: float
    ) -> Thrust:
        # Calculate thrust needed to reach target

        error = [target_pos[0] - char["pos"][0], target_pos[1] - char["pos"][1]]

        self.accmu[0] += error[0] * dt
        self.accmu[1] += error[1] * dt

        # Anti-Windup: Don't let the accumulation get too powerful
        limit = 5.0
        self.accmu[0] = max(-limit, min(limit, self.accmu[0]))
        self.accmu[1] = max(-limit, min(limit, self.accmu[1]))

        # PID = Pull + Accumulation - Breaks
        pull = error[0] * self.k_p
        accumulation = self.accmu[0] * self.k_i
        brakes = char["vel"][0] * self.k_d
        thrust_x = pull + accumulation - brakes

        pull = error[1] * self.k_p
        accumulation = self.accmu[1] * self.k_i
        brakes = char["vel"][1] * self.k_d
        thrust_y = pull + accumulation - brakes
        return (thrust_x, thrust_y)
