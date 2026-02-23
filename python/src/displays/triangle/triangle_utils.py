"""Shared utilities for triangle16 animations"""

import colorsys


class TriangleGrid:
    """16-cell triangular grid topology for simple animations like snake.

    Contains only the neighbor connectivity needed for path-based animations.
    """

    def __init__(self):
        # Define the neighbor topology for a 16-cell triangular grid
        # Each cell has up to 3 neighbors (or -1 if no neighbor in that direction)
        self.neighbors = [
            # Bottom row
            [-1, 1, -1],  # Cell 0
            [11, 2, 0],  # Cell 1
            [-1, 3, 1],  # Cell 2
            [9, 4, 2],  # Cell 3
            [-1, 5, 3],  # Cell 4
            [7, 6, 4],  # Cell 5
            [-1, -1, 5],  # Cell 6
            # Second row
            [5, 8, -1],  # Cell 7
            [12, 9, 7],  # Cell 8
            [3, 10, 8],  # Cell 9
            [14, 11, 9],  # Cell 10
            [1, -1, 10],  # Cell 11
            # Third row
            [8, 13, -1],  # Cell 12
            [15, 14, 12],  # Cell 13
            [10, -1, 13],  # Cell 14
            # Top
            [13, -1, -1],  # Cell 15
        ]
        self.num_cells = len(self.neighbors)


class TriangleGridCanvas:
    """16-cell triangular grid with LED positions for rendering-based animations.

    Includes neighbor connectivity and computed LED positions in canvas space.
    Suitable for animations like attractor that render to a virtual canvas.
    """

    def __init__(self, canvas_width=300, canvas_height=300):
        # Define the neighbor topology for a 16-cell triangular grid
        # Each cell has up to 3 neighbors (or -1 if no neighbor in that direction)
        self.neighbors = [
            # Bottom row
            [-1, 1, -1],  # Cell 0
            [11, 2, 0],  # Cell 1
            [-1, 3, 1],  # Cell 2
            [9, 4, 2],  # Cell 3
            [-1, 5, 3],  # Cell 4
            [7, 6, 4],  # Cell 5
            [-1, -1, 5],  # Cell 6
            # Second row
            [5, 8, -1],  # Cell 7
            [12, 9, 7],  # Cell 8
            [3, 10, 8],  # Cell 9
            [14, 11, 9],  # Cell 10
            [1, -1, 10],  # Cell 11
            # Third row
            [8, 13, -1],  # Cell 12
            [15, 14, 12],  # Cell 13
            [10, -1, 13],  # Cell 14
            # Top
            [13, -1, -1],  # Cell 15
        ]
        self.num_cells = len(self.neighbors)

        # Compute LED positions in canvas space matching the original Processing layout
        self.canvas_width = canvas_width
        self.canvas_height = canvas_height
        self.led_positions = self._compute_led_positions()

    def _compute_led_positions(self):
        """Compute LED positions using the same transformation as Processing version.

        This mimics the Processing code:
        - triangle.grid16()
        - triangle.mirror()
        - triangle.rotate(radians(60))
        - triangle.scale(height * 0.2)
        - triangle.translate(width * 0.5, height * 0.5)
        """
        import math

        h = math.sin(math.radians(60))

        # Cell positions from grid16()
        cell_data = [
            (0.0, h * 0 + h * 1 / 3, -1, 1, -1),
            (0.5, h * 0 + h * 2 / 3, 11, 2, 0),
            (1.0, h * 0 + h * 1 / 3, -1, 3, 1),
            (1.5, h * 0 + h * 2 / 3, 9, 4, 2),
            (2.0, h * 0 + h * 1 / 3, -1, 5, 3),
            (2.5, h * 0 + h * 2 / 3, 7, 6, 4),
            (3.0, h * 0 + h * 1 / 3, -1, -1, 5),
            (2.5, h * 1 + h * 1 / 3, 5, 8, -1),
            (2.0, h * 1 + h * 2 / 3, 12, 9, 7),
            (1.5, h * 1 + h * 1 / 3, 3, 10, 8),
            (1.0, h * 1 + h * 2 / 3, 14, 11, 9),
            (0.5, h * 1 + h * 1 / 3, 1, -1, 10),
            (1.0, h * 2 + h * 1 / 3, 8, 13, -1),
            (1.5, h * 2 + h * 2 / 3, 15, 14, 12),
            (2.0, h * 2 + h * 1 / 3, 10, -1, 14),
            (1.5, h * 3 + h * 1 / 3, 13, -1, -1),
        ]

        positions = [(x, y) for x, y, _, _, _ in cell_data]

        # Translate to origin (centroid)
        positions = [(x - 1.5, y - h * 4 / 3) for x, y in positions]

        # Mirror
        positions = [(-x, y) for x, y in positions]

        # Rotate by 60 degrees
        cos_a = math.cos(math.radians(60))
        sin_a = math.sin(math.radians(60))
        positions = [
            (x * cos_a - y * sin_a, x * sin_a + y * cos_a) for x, y in positions
        ]

        # Scale
        scale_factor = self.canvas_height * 0.2
        positions = [(x * scale_factor, y * scale_factor) for x, y in positions]

        # Translate to center
        center_x = self.canvas_width * 0.5
        center_y = self.canvas_height * 0.5
        positions = [(x + center_x, y + center_y) for x, y in positions]

        return positions


def hsb_to_rgb(h, s, b):
    """Convert HSB color (0-100 range) to RGB (0-255 range)"""
    # Normalize to 0-1 range
    h_norm = h / 100.0
    s_norm = s / 100.0
    b_norm = b / 100.0

    # Use colorsys to convert HSV to RGB
    r, g, b_out = colorsys.hsv_to_rgb(h_norm, s_norm, b_norm)

    # Convert to 0-255 range
    return (int(r * 255), int(g * 255), int(b_out * 255))


def rgb_to_hsb(r, g, b):
    """Convert RGB color (0-255 range) to HSB (0-100 range)"""
    # Normalize to 0-1 range
    r_norm = r / 255.0
    g_norm = g / 255.0
    b_norm = b / 255.0

    # Use colorsys to convert RGB to HSV
    h, s, b_out = colorsys.rgb_to_hsv(r_norm, g_norm, b_norm)

    # Convert to 0-100 range
    return (h * 100, s * 100, b_out * 100)
