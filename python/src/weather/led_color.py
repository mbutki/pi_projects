import colorsys
from typing import Any

from rgbmatrix import graphics


class Color:
    def __init__(self, h: float, s: float, v: float) -> None:
        self.h = h
        self.s = s
        self.v = v

    def hsv(self) -> tuple[float, float, float]:
        return (self.h, self.s, self.v)

    def rgb(self) -> tuple[float, float, float]:
        return colorsys.hsv_to_rgb(*self.hsv())

    def led(self) -> Any:
        return graphics.Color(*self.rgb())
