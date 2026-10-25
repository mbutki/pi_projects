from multiprocessing import Lock, Event, shared_memory, Semaphore, Value, Process
import time
import random

class MultiProcessQueue:
    def __init__(self, capacity: int) -> None:
        self.capacity = capacity

        # The Raw Shared Memory
        self.buffer = shared_memory.ShareableList([0] * capacity)
        
        # Pointers and Size (Shared cross-process integers)
        self.head = Value('i', 0)
        self.tail = Value('i', 0)
        self.size = Value('i', 0) # Explicitly track size to distinguish empty vs full

        # Synchronization Primitives
        self.mutex = Lock()
        self.free_spots = Semaphore(capacity)
        self.occupied_spots = Semaphore(0)
        
        # The cross-process shutdown flag
        self.is_closed = Event()

    def put(self, item: int) -> None:
        self.free_spots.acquire()
        
        with self.mutex:
            if self.is_closed.is_set():
                self.free_spots.release()
                raise RuntimeError("Cannot put into a closed queue")
                
            self.buffer[self.head.value] = item
            self.head.value = (self.head.value + 1) % self.capacity
            self.size.value += 1
            
        self.occupied_spots.release()

    def get(self) -> int:
        self.occupied_spots.acquire()
        
        with self.mutex:
            # 1. Did we wake up from a "fake release" and the queue is completely drained?
            if self.is_closed.is_set() and self.size.value == 0:
                return None
                
            # 2. Otherwise, read the real data
            item = self.buffer[self.tail.value]
            self.tail.value = (self.tail.value + 1) % self.capacity
            self.size.value -= 1
            
        self.free_spots.release()
        return item
        
    def close(self, num_consumers: int) -> None:
        """Triggers cross-process shutdown and injects fake releases."""
        with self.mutex:
            self.is_closed.set()
            
        # Manually wake up all sleeping processes so they can see the Event is set
        for _ in range(num_consumers):
            self.occupied_spots.release()

    def cleanup(self):
        """Must be called to prevent OS RAM leaks."""
        self.buffer.shm.close()
        self.buffer.shm.unlink()


# --- USAGE DEMONSTRATION ---

def fast_producer(producer_id, q):
    for i in range(1, 6):
        item = (producer_id * 100) + i # Just making a unique integer job ID
        print(f"[Producer {producer_id}] Writing {item} to memory...")
        q.put(item)
        time.sleep(random.uniform(0.1, 0.2))

def slow_consumer(consumer_id, q):
    while True: # Changed to an infinite loop
        item = q.get()
        
        if item is None:
            print(f"    [Consumer {consumer_id}] Shutdown signal received. Exiting.")
            break
            
        print(f"    [Consumer {consumer_id}] Read {item} from memory")
        time.sleep(random.uniform(0.3, 0.7)) # Simulating heavy work

def main():
    NUM_PRODUCERS = 2
    NUM_CONSUMERS = 3
    
    # Create a Queue with a strict capacity
    shared_q = MultiProcessQueue(capacity=5)

    try:
        consumers = []
        for i in range(NUM_CONSUMERS):
            c = Process(target=slow_consumer, args=(i, shared_q))
            c.start()
            consumers.append(c)

        producers = []
        for i in range(NUM_PRODUCERS):
            p = Process(target=fast_producer, args=(i, shared_q))
            p.start()
            producers.append(p)

        # Wait for producers to finish generating data
        for p in producers:
            p.join()
            
        print("\n[Main] All producers finished. Triggering queue shutdown...\n")
        
        # Initiate the cross-process graceful shutdown
        shared_q.close(NUM_CONSUMERS)
        
        # Wait for consumers to drain the backlog and exit
        for c in consumers:
            c.join()

        print("\n[Main] All processes completed successfully.")

    finally:
        print("Cleaning up OS memory blocks...")
        shared_q.cleanup()

if __name__ == "__main__":
    main()