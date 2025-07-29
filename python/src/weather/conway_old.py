import random
import time
import uuid
import numpy as np
from collections import Counter
from scipy import ndimage
import multiprocessing as mp
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

# Global functions for multiprocessing (they need to be picklable)
def _populate_chunk_worker(args):
    """Worker function for parallel population - must be at module level for pickling"""
    start_r, end_r, cols, seed = args
    local_alive = []
    local_colors = []
    local_cells = []
    
    np.random.seed()  # Ensure different random seeds per process
    
    for r in range(start_r, end_r):
        for c in range(cols):
            if np.random.random() <= seed:
                color = (np.random.randint(0, 256), np.random.randint(0, 256), np.random.randint(0, 256))
                local_alive.append((r, c))
                local_colors.append((r, c, color))
                # We can't pickle Cell objects easily, so just store color info
                local_cells.append((r, c, color))
    
    return local_alive, local_colors, local_cells

def _process_births_worker(args):
    """Worker function for processing births - must be at module level for pickling"""
    birth_coords_chunk, alive_grid, color_grid, rows, cols = args
    local_cells = []
    local_colors = []
    
    for r, c in birth_coords_chunk:
        # Get baby color based on neighbors
        colors = []
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                
                nr = (r + dr) % rows
                nc = (c + dc) % cols
                
                if alive_grid[nr, nc]:
                    colors.append(tuple(color_grid[nr, nc]))
        
        if not colors:
            color = (255, 255, 255)
        else:
            # Use Counter for most common color
            most_common_color = Counter(colors).most_common(1)[0][0]
            color = most_common_color
        
        local_cells.append((r, c, color))
        local_colors.append((r, c, color))
    
    return local_cells, local_colors

class Cell():
    def __init__(self, color):
        self.color = color
        self.id = uuid.uuid4()

    def __str__(self):
        return "Cell"

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        return self.id == other.id

class World():
    # Conway kernel for counting neighbors (8-connectivity)
    CONWAY_KERNEL = np.array([[1, 1, 1],
                             [1, 0, 1],
                             [1, 1, 1]], dtype=np.int8)

    def __init__(self, bounds, born, survive, seed, x_offset):
        self.cols, self.rows = bounds
        self.born = set(born)
        self.survive = set(survive)
        self.seed = seed
        self.x_offset = x_offset
        self.age = 0
        
        # Grid representations
        self.alive_grid = np.zeros((self.rows, self.cols), dtype=bool)
        self.color_grid = np.zeros((self.rows, self.cols, 3), dtype=np.uint8)
        self.cell_objects = {}  # Store Cell objects for living cells: {(r,c): Cell}
        
        # History management
        self.history = set()
        self.max_history_size = 100
        self.history_trim_size = 50
        
        # Performance tracking
        self.last_advance_time = 0
        self.total_advance_time = 0
        self.advance_count = 0
        
        # Multiprocessing configuration
        self.use_multiprocessing = False
        self.num_processes = mp.cpu_count()
        self.min_chunk_size = 1000  # Minimum cells per chunk to justify multiprocessing overhead
        
        # Convolution optimization
        self.use_scipy = True  # Set to False to use pure NumPy
        
        print(f"Initialized with {self.num_processes} CPU cores available")

    def reset(self):
        """Reset the world state"""
        self.history = set()
        self.alive_grid = np.zeros((self.rows, self.cols), dtype=bool)
        self.color_grid = np.zeros((self.rows, self.cols, 3), dtype=np.uint8)
        self.cell_objects = {}
        self.age = 0
        self.last_advance_time = 0
        self.total_advance_time = 0
        self.advance_count = 0
        self.populate()

    def populate(self):
        """Randomly populate the world with living cells"""
        if self.use_multiprocessing and self.rows * self.cols > self.min_chunk_size:
            print('using multiprocessing for population')
            self._populate_parallel()
        else:
            print('NOT using multiprocessing for population')
            self._populate_serial()

    def _populate_serial(self):
        """Serial population method"""
        for r in range(self.rows):
            for c in range(self.cols):
                if random.random() <= self.seed:
                    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
                    self.alive_grid[r, c] = True
                    self.color_grid[r, c] = color
                    self.cell_objects[(r, c)] = Cell(color)

    def _populate_parallel(self):
        """Parallel population using multiprocessing"""
        # Split work into chunks
        chunk_size = max(1, self.rows // self.num_processes)
        chunks = []
        for i in range(0, self.rows, chunk_size):
            end_r = min(i + chunk_size, self.rows)
            chunks.append((i, end_r, self.cols, self.seed))

        # Process chunks in parallel
        with mp.Pool(self.num_processes) as pool:
            results = pool.map(_populate_chunk_worker, chunks)

        # Combine results
        for alive_coords, color_coords, cell_coords in results:
            for r, c in alive_coords:
                self.alive_grid[r, c] = True
            for r, c, color in color_coords:
                self.color_grid[r, c] = color
            for r, c, color in cell_coords:  # Now color instead of cell object
                self.cell_objects[(r, c)] = Cell(color)

    def count_neighbors_convolution(self):
        """Count neighbors using convolution - much faster than manual counting"""
        if self.use_scipy:
            # Use scipy.ndimage for optimized convolution with proper boundary handling
            neighbor_counts = ndimage.convolve(
                self.alive_grid.astype(np.int8), 
                self.CONWAY_KERNEL, 
                mode='wrap'  # Wrapping boundaries like original implementation
            )
        else:
            # Pure NumPy implementation (slower but no scipy dependency)
            # Pad the grid with wrapping
            padded = np.pad(self.alive_grid.astype(np.int8), 1, mode='wrap')
            
            # Manual convolution
            neighbor_counts = np.zeros_like(self.alive_grid, dtype=np.int8)
            for i in range(3):
                for j in range(3):
                    if i == 1 and j == 1:  # Skip center cell
                        continue
                    neighbor_counts += padded[i:i+self.rows, j:j+self.cols]
        
        return neighbor_counts

    def _process_births_chunk(self, args):
        """Process births for a chunk of coordinates"""
        birth_coords_chunk, = args
        local_cells = []
        local_colors = []
        
        for r, c in birth_coords_chunk:
            color = self.get_baby_color_fast(r, c)
            local_cells.append((r, c, Cell(color)))
            local_colors.append((r, c, color))
        
        return local_cells, local_colors

    def _process_births_parallel(self, birth_coords):
        """Process births in parallel using multiprocessing for larger chunks, threading for smaller ones"""
        coord_list = list(zip(birth_coords[0], birth_coords[1]))
        
        if len(coord_list) < self.min_chunk_size // 10:  # Small number of births
            print('NOT using multiprocessing for births')
            return self._process_births_serial(birth_coords)
        
        new_cells = {}
        new_colors = {}
        
        if len(coord_list) > 1000:  # Use multiprocessing for large numbers of births
            print('using multiprocessing for births')
            # Split birth coordinates into chunks
            chunk_size = max(1, len(coord_list) // self.num_processes)
            chunks = [coord_list[i:i+chunk_size] for i in range(0, len(coord_list), chunk_size)]
            
            # Prepare arguments for worker processes
            worker_args = []
            for chunk in chunks:
                worker_args.append((chunk, self.alive_grid, self.color_grid, self.rows, self.cols))
            
            # Process with multiprocessing
            with mp.Pool(self.num_processes) as pool:
                results = pool.map(_process_births_worker, worker_args)
            
            # Combine results
            for cells, colors in results:
                for r, c, color in cells:
                    new_cells[(r, c)] = Cell(color)
                for r, c, color in colors:
                    new_colors[(r, c)] = color
        else:
            # Use ThreadPoolExecutor for smaller numbers (avoids multiprocessing overhead)
            chunk_size = max(1, len(coord_list) // self.num_processes)
            chunks = [coord_list[i:i+chunk_size] for i in range(0, len(coord_list), chunk_size)]
            
            with ThreadPoolExecutor(max_workers=self.num_processes) as executor:
                futures = [executor.submit(self._process_births_chunk, (chunk,)) for chunk in chunks]
                
                for future in as_completed(futures):
                    cells, colors = future.result()
                    for r, c, cell in cells:
                        new_cells[(r, c)] = cell
                    for r, c, color in colors:
                        new_colors[(r, c)] = color
        
        return new_cells, new_colors

    def _process_births_serial(self, birth_coords):
        """Process births serially"""
        new_cells = {}
        new_colors = {}
        
        for r, c in zip(birth_coords[0], birth_coords[1]):
            color = self.get_baby_color_fast(r, c)
            new_cells[(r, c)] = Cell(color)
            new_colors[(r, c)] = color
        
        return new_cells, new_colors

    def gen_state(self):
        """Generate a state representation for loop detection"""
        # Convert alive grid to tuple of coordinates for consistency with original
        living_coords = tuple(sorted(zip(*np.where(self.alive_grid))))
        return living_coords

    def advance(self):
        """Advance one generation using convolution-based neighbor counting"""
        start_time = time.time()
        
        # Add current state to history
        current_state = self.gen_state()
        self.history.add(current_state)
        
        self.age += 1
        
        # Count neighbors using convolution - this is the key optimization!
        neighbor_counts = self.count_neighbors_convolution()
        
        # Apply Conway's rules vectorized
        # Birth: dead cells with correct neighbor count become alive
        birth_mask = (~self.alive_grid) & np.isin(neighbor_counts, list(self.born))
        
        # Survival: living cells with correct neighbor count stay alive
        survival_mask = self.alive_grid & np.isin(neighbor_counts, list(self.survive))
        
        # Create new alive grid
        new_alive_grid = birth_mask | survival_mask
        
        # Handle cell objects and colors
        new_cell_objects = {}
        new_color_grid = np.zeros_like(self.color_grid)
        
        # Process survivors - keep existing cells and colors (this is fast, no parallelization needed)
        survivor_coords = np.where(self.alive_grid & new_alive_grid)
        for r, c in zip(survivor_coords[0], survivor_coords[1]):
            new_cell_objects[(r, c)] = self.cell_objects[(r, c)]
            new_color_grid[r, c] = self.color_grid[r, c]
        
        # Process births - potentially parallel
        birth_coords = np.where(birth_mask)
        if len(birth_coords[0]) > 0:
            if self.use_multiprocessing:
                birth_cells, birth_colors = self._process_births_parallel(birth_coords)
            else:
                birth_cells, birth_colors = self._process_births_serial(birth_coords)
            
            # Add birth results
            new_cell_objects.update(birth_cells)
            for (r, c), color in birth_colors.items():
                new_color_grid[r, c] = color
        
        # Update state
        self.alive_grid = new_alive_grid
        self.color_grid = new_color_grid
        self.cell_objects = new_cell_objects
        
        # Check for loops
        new_state = self.gen_state()
        loop_detected = new_state in self.history
        
        # History management
        if len(self.history) > self.max_history_size:
            recent_history = list(self.history)[-self.history_trim_size:]
            self.history = set(recent_history)
        
        # Performance tracking
        self.last_advance_time = time.time() - start_time
        self.total_advance_time += self.last_advance_time
        self.advance_count += 1
        
        if self.age % 100 == 0:
            avg_time = self.total_advance_time / self.advance_count
            living_count = np.sum(self.alive_grid)
            mp_status = "ON" if self.use_multiprocessing else "OFF"
            print(f"Generation {self.age}: {self.last_advance_time:.4f}s (avg: {avg_time:.4f}s, living: {living_count}, MP: {mp_status})")
        
        return loop_detected

    def get_baby_color_fast(self, r, c):
        """Get color for newborn cell based on neighbors"""
        colors = []
        
        # Check all 8 neighbors with wrapping
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                
                nr = (r + dr) % self.rows
                nc = (c + dc) % self.cols
                
                if self.alive_grid[nr, nc]:
                    colors.append(tuple(self.color_grid[nr, nc]))
        
        if not colors:
            return (255, 255, 255)
        
        # Use Counter for most common color
        most_common_color = Counter(colors).most_common(1)[0][0]
        return most_common_color

    def draw(self, canvas):
        """Draw the world to canvas"""
        living_coords = np.where(self.alive_grid)
        for r, c in zip(living_coords[0], living_coords[1]):
            x = c + self.x_offset
            y = r
            color = self.color_grid[r, c]
            canvas.SetPixel(x, y, int(color[0]), int(color[1]), int(color[2]))

    def count_living(self):
        """Count living cells"""
        return np.sum(self.alive_grid)

    def get_performance_stats(self):
        """Get performance statistics"""
        if self.advance_count == 0:
            return "No generations processed yet"
        
        avg_time = self.total_advance_time / self.advance_count
        return {
            'total_generations': self.age,
            'total_time': self.total_advance_time,
            'average_time_per_generation': avg_time,
            'last_generation_time': self.last_advance_time,
            'current_living_cells': int(np.sum(self.alive_grid)),
            'history_size': len(self.history),
            'convolution_method': 'scipy' if self.use_scipy else 'numpy',
            'multiprocessing': self.use_multiprocessing,
            'num_processes': self.num_processes
        }

    def __str__(self):
        """String representation of the world"""
        result = []
        for r in range(self.rows):
            row = []
            for c in range(self.cols):
                if self.alive_grid[r, c]:
                    row.append("Cell")
                else:
                    row.append("None")
            result.append('\t'.join(row))
        return '\n'.join(result)

    # Utility methods for analysis and debugging
    def get_living_cells_dict(self):
        """Convert back to dictionary format like original (for compatibility)"""
        living_dict = {}
        living_coords = np.where(self.alive_grid)
        for r, c in zip(living_coords[0], living_coords[1]):
            living_dict[(r, c)] = self.cell_objects[(r, c)]
        return living_dict

    def set_pattern(self, pattern, start_r=0, start_c=0):
        """Set a specific pattern (useful for testing)"""
        self.alive_grid[:] = False
        self.color_grid[:] = 0
        self.cell_objects.clear()
        
        for r, c in pattern:
            if 0 <= start_r + r < self.rows and 0 <= start_c + c < self.cols:
                actual_r, actual_c = start_r + r, start_c + c
                color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))
                self.alive_grid[actual_r, actual_c] = True
                self.color_grid[actual_r, actual_c] = color
                self.cell_objects[(actual_r, actual_c)] = Cell(color)

    def toggle_convolution_method(self):
        """Switch between scipy and numpy convolution methods"""
        self.use_scipy = not self.use_scipy
        method = 'scipy' if self.use_scipy else 'numpy'
        print(f"Switched to {method} convolution method")

    def toggle_multiprocessing(self):
        """Toggle multiprocessing on/off"""
        self.use_multiprocessing = not self.use_multiprocessing
        status = "enabled" if self.use_multiprocessing else "disabled"
        print(f"Multiprocessing {status} ({self.num_processes} cores available)")

    def set_num_processes(self, num_processes):
        """Set the number of processes to use"""
        if num_processes > 0 and num_processes <= mp.cpu_count():
            self.num_processes = num_processes
            print(f"Set number of processes to {num_processes}")
        else:
            print(f"Invalid number of processes. Must be between 1 and {mp.cpu_count()}")

    def benchmark_methods(self, generations=10):
        """Benchmark different processing methods"""
        print(f"\nBenchmarking over {generations} generations...")
        
        # Save current state
        original_state = self.alive_grid.copy()
        original_mp = self.use_multiprocessing
        
        methods = [
            ("Serial", False),
            ("Parallel", True)
        ]
        
        results = {}
        
        for method_name, use_mp in methods:
            print(f"\nTesting {method_name} method...")
            
            # Reset to original state
            self.alive_grid = original_state.copy()
            self.use_multiprocessing = use_mp
            self.age = 0
            self.total_advance_time = 0
            self.advance_count = 0
            
            # Run benchmark
            start_time = time.time()
            for _ in range(generations):
                self.advance()
            total_time = time.time() - start_time
            
            results[method_name] = {
                'total_time': total_time,
                'avg_per_generation': total_time / generations,
                'living_cells': int(np.sum(self.alive_grid))
            }
            
            print(f"{method_name}: {total_time:.3f}s total, {total_time/generations:.4f}s per generation")
        
        # Restore original settings
        self.use_multiprocessing = original_mp
        
        print(f"\nBenchmark Results:")
        for method, stats in results.items():
            print(f"{method}: {stats['avg_per_generation']:.4f}s per generation")
        
        if len(results) > 1:
            serial_time = results['Serial']['avg_per_generation']
            parallel_time = results['Parallel']['avg_per_generation']
            speedup = serial_time / parallel_time
            print(f"Speedup: {speedup:.2f}x")
        
        return results