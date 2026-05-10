from weather.visualizations.spaceship.my_types import ShipPos, GridPos


def to_grid(pos: ShipPos) -> GridPos:
    return (int(round(pos[0])), int(round(pos[1])))


def to_ship(pos: GridPos) -> ShipPos:
    return (float(pos[0]), float(pos[1]))
