import threading
import queue
import time
import random

def producer(producer_id, shared_q):
    """Produces data and safely puts it into the queue."""
    for i in range(1, 6):
        item = f"Job-{i} (from P{producer_id})"
        print(f"[Producer {producer_id}] Generating {item}...")
        
        # q.put() is 100% thread-safe. 
        # Because we set maxsize=5, this will automatically pause 
        # the thread if the queue is full, preventing memory flooding.
        shared_q.put(item)
        
        time.sleep(random.uniform(0.1, 0.3)) # Simulate work
        
    print(f"--- [Producer {producer_id}] Finished generating all data ---")

def consumer(consumer_id, shared_q):
    """Consumes data from the queue forever."""
    while True:
        # q.get() is 100% thread-safe.
        # This automatically pauses the thread (0% CPU) if the queue is empty.
        item = shared_q.get()
        
        print(f"    [Consumer {consumer_id}] Processing '{item}'")
        time.sleep(random.uniform(0.4, 0.8)) # Simulate heavy processing
        
        # CRITICAL: You must tell the queue that the item is fully processed.
        # This decrements the queue's internal "unfinished tasks" counter.
        shared_q.task_done()

def main():
    # 1. Initialize the thread-safe queue with a bounded capacity
    pipeline_queue = queue.Queue(maxsize=5)
    
    # 2. Start the Consumer threads
    # We set daemon=True so these infinite-loop threads will automatically 
    # be killed by the OS when the main program finishes.
    NUM_CONSUMERS = 3
    for i in range(NUM_CONSUMERS):
        c = threading.Thread(target=consumer, args=(i, pipeline_queue), daemon=True)
        c.start()
        
    # 3. Start the Producer threads
    NUM_PRODUCERS = 2
    producers = []
    for i in range(NUM_PRODUCERS):
        p = threading.Thread(target=producer, args=(i, pipeline_queue))
        p.start()
        producers.append(p)
        
    # 4. Wait for all Producers to finish creating data
    for p in producers:
        p.join()
    print("\nMain Thread: All producers are done. Waiting for backlog to clear...\n")
        
    # 5. Wait for the queue to completely empty out
    # .join() blocks the main thread until the number of items added via .put() 
    # exactly matches the number of times .task_done() was called.
    pipeline_queue.join()
    
    print("Main Thread: Queue is empty and all tasks are done. Exiting program.")

if __name__ == "__main__":
    main()