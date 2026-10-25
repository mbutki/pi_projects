import asyncio
import collections

class AsyncBoundedDeque:
    def __init__(self, maxsize):
        # 1. The raw, non-async data structure
        self._buffer = collections.deque()
        
        # 2. Async Semaphores to handle yielding to the Event Loop
        self._items = asyncio.Semaphore(0)
        self._spaces = asyncio.Semaphore(maxsize)
        
        # Notice: NO MUTEX/LOCK! Memory corruption is impossible
        # in a single-threaded event loop.

    async def put(self, item):
        """Yields until space is available, then appends to the deque."""
        
        # If spaces == 0, this instantly yields control to the Event Loop
        # putting this specific coroutine to sleep until a consumer reads.
        await self._spaces.acquire()
        
        # ONCE WE ARE HERE, we own the thread. We can safely modify the deque.
        # This synchronous operation cannot be interrupted.
        self._buffer.append(item)
        
        # Signal that an item is available
        self._items.release()

    async def get(self):
        """Yields until an item is available, then pops from the deque."""
        
        # Yield to the Event Loop if the deque is empty (items == 0)
        await self._items.acquire()
        
        # We own the thread. Safely pop.
        item = self._buffer.popleft()
        
        # Signal that a space opened up
        self._spaces.release()
        
        return item


# --- USAGE DEMONSTRATION ---

async def fast_producer(q, producer_id):
    for i in range(1, 4):
        item = f"Data {i} (from P{producer_id})"
        await q.put(item)
        print(f"[Producer {producer_id}] Added '{item}'")

async def slow_consumer(q, consumer_id):
    while True:
        item = await q.get()
        print(f"    [Consumer {consumer_id}] Processed '{item}'")
        await asyncio.sleep(0.5) # Simulate work

async def main():
    # Initialize our custom deque queue with a max capacity of 2
    shared_q = AsyncBoundedDeque(maxsize=2)
    
    consumers = [asyncio.create_task(slow_consumer(shared_q, i)) for i in range(2)]
    producers = [asyncio.create_task(fast_producer(shared_q, i)) for i in range(2)]
    
    # Wait for producers to finish adding their data
    await asyncio.gather(*producers)
    
    # Give consumers a moment to drain the deque
    # (Since we didn't implement task_done() tracking in our custom class, 
    # we just sleep briefly to let them finish)
    await asyncio.sleep(1.5)
    
    # Forcefully shut down the consumers
    for c in consumers:
        c.cancel()
        
    print("Main Coroutine: Done.")

if __name__ == "__main__":
    asyncio.run(main())