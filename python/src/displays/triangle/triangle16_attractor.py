#!/usr/bin/env python

import time
import math
import random

from triangle_utils import TriangleGridCanvas, rgb_to_hsb
import opc

# Parameters
NUM_PARTICLES = 10
CORNER_COEFFICIENT = 0.2  # Original Processing value
INTEGRATION_STEPS = 40  # Increased from 20 for more dynamic motion
MAX_OPACITY = 100
STEP_FAST = 1.0 / 40
STEP_SLOW = 1.0 / 1000

# Canvas settings
CANVAS_WIDTH = 300
CANVAS_HEIGHT = 300

# Fadecandy server settings
FCSERVER_HOST = "127.0.0.1"
FCSERVER_PORT = 7890


class VirtualCanvas:
    """Simple 2D pixel buffer for rendering"""

    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.clear()

    def clear(self):
        """Clear canvas to black"""
        self.pixels = [
            [(0, 0, 0) for _ in range(self.width)] for _ in range(self.height)
        ]

    def add_pixel(self, x, y, color):
        """Add color to a pixel using additive blending"""
        x = int(round(x))
        y = int(round(y))

        if 0 <= x < self.width and 0 <= y < self.height:
            r, g, b = color
            r0, g0, b0 = self.pixels[y][x]
            self.pixels[y][x] = (
                min(255, r + r0),
                min(255, g + g0),
                min(255, b + b0),
            )

    def sample(self, x, y):
        """Get color at position (with bilinear interpolation)"""
        x = float(x)
        y = float(y)

        x = max(0, min(self.width - 1.001, x))
        y = max(0, min(self.height - 1.001, y))

        x0 = int(x)
        y0 = int(y)
        x1 = min(x0 + 1, self.width - 1)
        y1 = min(y0 + 1, self.height - 1)

        fx = x - x0
        fy = y - y0

        c00 = self.pixels[y0][x0]
        c10 = self.pixels[y0][x1]
        c01 = self.pixels[y1][x0]
        c11 = self.pixels[y1][x1]

        # Bilinear interpolation
        result = []
        for i in range(3):
            c0 = c00[i] * (1 - fx) + c10[i] * fx
            c1 = c01[i] * (1 - fx) + c11[i] * fx
            result.append(int(c0 * (1 - fy) + c1 * fy))

        return tuple(result)


class Particle:
    """A particle with position, velocity, and color"""

    def __init__(self, x, y, rgb, canvas_width, canvas_height):
        self.x = x * canvas_width
        self.y = y * canvas_height
        self.vx = 0.0
        self.vy = 0.0
        self.rgb = rgb  # (r, g, b) tuple in range 0-255
        self.canvas_width = canvas_width
        self.canvas_height = canvas_height

    def damp(self, factor):
        """Dampen velocity"""
        self.vx *= factor
        self.vy *= factor

    def integrate(self):
        """Update position based on velocity"""
        self.x += self.vx
        self.y += self.vy

    def attract(self, target_x, target_y, coefficient):
        """Apply attraction to a point using inverse-square law (like gravity)"""
        target_x *= self.canvas_width
        target_y *= self.canvas_height

        dx = target_x - self.x
        dy = target_y - self.y
        dist_sq = dx * dx + dy * dy

        # Use inverse-square law: force = coefficient / max(1, distance^2)
        # This matches the Processing version exactly
        force = coefficient / max(1.0, dist_sq)

        self.vx += dx * force
        self.vy += dy * force

    def energy(self):
        """Return kinetic energy (velocity magnitude squared)"""
        return self.vx * self.vx + self.vy * self.vy

    def draw(self, canvas, opacity):
        """Draw particle to canvas using additive blending"""
        # Particle size (in pixels) - Processing uses larger image-based particles
        size = self.canvas_height * 0.1

        # Draw a soft circle using a simple distance-based falloff
        color_with_opacity = tuple(int(c * opacity) for c in self.rgb)

        # Draw a small point cloud around the particle position
        for dx in range(-int(size), int(size) + 1):
            for dy in range(-int(size), int(size) + 1):
                dist = math.sqrt(dx * dx + dy * dy)
                if dist <= size:
                    # Gaussian falloff
                    falloff = math.exp(-((dist / (size * 0.5)) ** 2))
                    blended_color = tuple(int(c * falloff) for c in color_with_opacity)
                    canvas.add_pixel(self.x + dx, self.y + dy, blended_color)


def get_color_from_palette():
    """Get a random color from a simple palette"""
    # Use a variety of hues at full saturation
    hues = [0, 10, 20, 40, 60, 120, 180, 240, 280, 320]
    h = random.choice(hues)
    s = random.uniform(0.7, 1.0)
    b = random.uniform(0.6, 1.0)

    # Convert HSV (0-1 range) to RGB (0-255)
    import colorsys

    r, g, b_out = colorsys.hsv_to_rgb(h / 360.0, s, b)
    return (int(r * 255), int(g * 255), int(b_out * 255))


def begin_epoch(particles, canvas_width, canvas_height):
    """Start a new particle epoch"""
    # Center of bundle (slightly randomized from screen center) in normalized space
    s = 0.5
    cx = 0.5 + random.uniform(-s, s)
    cy = 0.5 + random.uniform(-s, s)

    # Half-width of particle bundle (in normalized space)
    w = 0.2

    # Initialize particles around the center point
    for i in range(NUM_PARTICLES):
        x = cx + random.uniform(-w, w)
        y = cy + random.uniform(-w, w)
        color = get_color_from_palette()
        particles[i] = Particle(x, y, color, canvas_width, canvas_height)

    return 0.0  # Reset epoch timer


def get_brightness(pixels):
    """Calculate the brightness of the pixels (0-1)"""
    max_brightness = 0.0
    for r, g, b in pixels:
        max_brightness = max(max_brightness, r, g, b)
    return max_brightness / 255.0


def get_total_energy(particles):
    """Calculate total energy of all particles"""
    total = 0.0
    for particle in particles:
        total += particle.energy()
    return total


def animate_triangle_attractor(
    server_host="127.0.0.1", server_port=7890, duration=None
):
    """Main animation loop"""
    # Connect to OPC server
    try:
        client = opc.Client(f"{server_host}:{server_port}")
        if not client.can_connect():
            print(f"Error: Cannot connect to OPC server at {server_host}:{server_port}")
            return
        print(f"Connected to OPC server at {server_host}:{server_port}")
    except Exception as e:
        print(f"Error connecting to OPC server: {e}")
        return

    # Setup logging
    log_file = open('/tmp/triangle_attractor.log', 'a')
    log_file.write(f"\n=== Started at {time.time()} ===\n")
    log_file.flush()

    # Create triangle grid with LED positions
    triangle = TriangleGridCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)
    num_cells = triangle.num_cells
    led_positions = triangle.led_positions

    # Define the three corners of the triangle in normalized space (0-1)
    # These correspond to cells 0, 6, and 15 of the grid
    corners = [
        (led_positions[0][0] / CANVAS_WIDTH, led_positions[0][1] / CANVAS_HEIGHT),
        (led_positions[6][0] / CANVAS_WIDTH, led_positions[6][1] / CANVAS_HEIGHT),
        (led_positions[15][0] / CANVAS_WIDTH, led_positions[15][1] / CANVAS_HEIGHT),
    ]

    # Create virtual canvas
    canvas = VirtualCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

    # Initialize particles
    particles = [None] * NUM_PARTICLES
    epoch = begin_epoch(particles, CANVAS_WIDTH, CANVAS_HEIGHT)

    step_number = 0
    start_time = time.time()

    print(
        f"Starting attractor animation with {num_cells} LEDs and {NUM_PARTICLES} particles"
    )
    print(f"Press Ctrl+C to stop")

    try:
        while True:
            # Check if duration limit reached
            if duration is not None:
                elapsed = time.time() - start_time
                if elapsed > duration:
                    break

            step_number += 1

            # Clear canvas
            canvas.clear()

            # Calculate energy of current system
            total_energy = get_total_energy(particles)

            # Physics updates: integrate and apply attraction
            for step in range(INTEGRATION_STEPS):
                for particle in particles:
                    particle.integrate()
                    particle.damp(0.95)  # Reduced damping for more energetic movement

                    # Apply attraction to each corner
                    for corner_x, corner_y in corners:
                        particle.attract(corner_x, corner_y, CORNER_COEFFICIENT)

            # Draw particles to canvas
            opacity = math.sin(epoch * math.pi) * MAX_OPACITY / 100.0
            for particle in particles:
                particle.draw(canvas, opacity)

            # Sample canvas at LED positions to create frame
            frame = []
            for led_x, led_y in led_positions:
                color = canvas.sample(led_x, led_y)
                frame.append(color)

            # Calculate brightness
            brightness = get_brightness(frame)

            # Decide whether to slow down time (interesting state) or speed up
            # We're interested if we have both high energy and high brightness
            if total_energy > 1.5 and brightness > 0.8:
                # Time moves slower when we're interested
                epoch += STEP_SLOW
            else:
                epoch += STEP_FAST

            # Reset epoch if it completes
            if epoch > 1.0:
                epoch = begin_epoch(particles, CANVAS_WIDTH, CANVAS_HEIGHT)

            # Send to OPC server
            client.put_pixels(frame)

            # Control frame rate (approximately 40 FPS)
            time.sleep(1.0 / 40.0)

    except KeyboardInterrupt:
        print("\nAnimation stopped")
        # Turn off LEDs
        client.put_pixels([(0, 0, 0)] * num_cells)


if __name__ == "__main__":
    animate_triangle_attractor(FCSERVER_HOST, FCSERVER_PORT)
