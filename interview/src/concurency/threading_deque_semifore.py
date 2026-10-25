import threading
import collections
import time
import random

class SemaphoreBoundedQueue:
    def __init__(self, maxsize):
        # The raw, non-thread-safe data structure
        self._buffer = collections.deque()
        
        # The Bouncers (Control flow & sleeping)
        self._items = threading.Semaphore(0)         # Blocks consumers if 0
        self._spaces = threading.Semaphore(maxsize)  # Blocks producers if 0
        
        # The Bathroom Door (Prevents memory corruption)
        self._mutex = threading.Lock()
        
        # Our custom shutdown flag
        self._is_closed = False

    def put(self, item):
        """Waits for space, locks memory, writes data, and wakes a consumer."""
        self._spaces.acquire()
        
        with self._mutex:
            if self._is_closed:
                # Always good practice to prevent adding to a closed queue
                self._spaces.release() 
                raise RuntimeError("Cannot put into a closed queue")
            
            self._buffer.append(item)
            
        self._items.release()

    def get(self):
        """Waits for an item (or a shutdown signal), reads data, and frees space."""
        # Thread goes to sleep here if the queue is completely empty
        self._items.acquire()
        
        with self._mutex:
            # 1. Did we wake up because of a "fake release" shutdown signal?
            if self._is_closed and len(self._buffer) == 0:
                return None
                
            # 2. We woke up because of real data (or data is still left to drain)
            item = self._buffer.popleft()
            
        # Signal to the producers that a space just opened up
        self._spaces.release()
        
        return item
        
    def close(self, num_consumers):
        """Triggers the shutdown protocol for the queue."""
        with self._mutex:
            self._is_closed = True
            
        # THE FAKE RELEASE:
        # We manually crank the semaphore up by the exact number of consumers.
        # This forcefully wakes up any sleeping consumers. If they aren't sleeping 
        # yet, it ensures they will bypass the .acquire() block when they finish 
        # draining the real data.
        for _ in range(num_consumers):
            self._items.release()


# --- USAGE DEMONSTRATION ---

def producer(producer_id, shared_q):
    for i in range(1, 6):
        item = f"Job-{i} (from P{producer_id})"
        print(f"[Producer {producer_id}] Generating {item}...")
        shared_q.put(item)
        time.sleep(random.uniform(0.1, 0.3))
        
    print(f"--- [Producer {producer_id}] Finished generating data ---")

def consumer(consumer_id, shared_q):
    while True:
        item = shared_q.get()
        
        if item is None:
            print(f"    [Consumer {consumer_id}] Queue closed & empty! Shutting down.")
            break
            
        print(f"    [Consumer {consumer_id}] Processing '{item}'")
        time.sleep(random.uniform(0.4, 0.8))

def main():
    NUM_CONSUMERS = 3
    NUM_PRODUCERS = 2
    
    # Initialize our custom semaphore queue
    pipeline_queue = SemaphoreBoundedQueue(maxsize=5)
    
    # Start Consumers
    consumers = []
    for i in range(NUM_CONSUMERS):
        c = threading.Thread(target=consumer, args=(i, pipeline_queue))
        c.start()
        consumers.append(c)
        
    # Start Producers
    producers = []
    for i in range(NUM_PRODUCERS):
        p = threading.Thread(target=producer, args=(i, pipeline_queue))
        p.start()
        producers.append(p)
        
    # Wait for all Producers to finish
    for p in producers:
        p.join()
    print("\nMain Thread: All producers are done. Triggering queue shutdown...\n")
        
    # Initiate Shutdown Protocol
    # We no longer need queue.join()! We just close the queue. 
    # Consumers will naturally drain any remaining real jobs first because
    # those jobs were already appended to the deque. Once empty, the "fake releases"
    # we inject here will trigger the return None condition.
    pipeline_queue.close(NUM_CONSUMERS)
    
    # Wait for consumers to safely process the remaining backlog and die
    for c in consumers:
        c.join()
        
    print("\nMain Thread: All consumers are safely dead. Program finished.")

if __name__ == "__main__":
    main()