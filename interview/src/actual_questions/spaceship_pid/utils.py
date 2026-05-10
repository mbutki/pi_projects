from my_types import ShipPos, GridPos


def to_grid(pos: ShipPos) -> GridPos:
    return (int(round(pos[0])), int(round(pos[1])))
