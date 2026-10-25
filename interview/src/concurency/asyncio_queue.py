import asyncio

async def fast_producer(q, producer_id):
    for i in range(1, 6):
        item = f"Data {i} (from P{producer_id})"
        print(f"[Producer {producer_id}] Attempting to add '{item}'...")
        
        # CRITICAL: We use 'await'.
        # If the queue is at max capacity, this instantly yields control 
        # of the CPU back to the event loop, putting this producer to sleep.
        await q.put(item)
        
        print(f"[Producer {producer_id}] Successfully added '{item}'")
        await asyncio.sleep(0.1)

async def slow_consumer(q, consumer_id):
    while True:
        # CRITICAL: We use 'await'.
        # If the queue is empty, this yields control of the CPU 
        # back to the event loop until a producer adds something.
        item = await q.get()
        
        print(f"    [Consumer {consumer_id}] Processing '{item}'...")
        await asyncio.sleep(1.0) # Simulating heavy I/O wait
        
        # We must tell the queue the task is complete
        q.task_done()

async def main():
    # 1. Create a Bounded Queue with a max capacity of 2
    shared_queue = asyncio.Queue(maxsize=2)
    
    # 2. Start the Consumers in the background as Tasks
    # They will immediately pause at 'await q.get()' because the queue is empty.
    consumers = [asyncio.create_task(slow_consumer(shared_queue, i)) for i in range(2)]
    
    # 3. Start the Producers in the background as Tasks
    producers = [asyncio.create_task(fast_producer(shared_queue, i)) for i in range(2)]
    
    # 4. Wait for the Producers to completely finish generating their data
    await asyncio.gather(*producers)
    print("\n--- All producers finished. Waiting for backlog to clear... ---\n")
    
    # 5. Wait for the queue to empty out
    # This pauses the main function until every .put() has a matching .task_done()
    await shared_queue.join()
    
    # 6. SHUTDOWN PROTOCOL: Task Cancellation
    # Because consumers are stuck in infinite 'while True' loops waiting for data,
    # we don't need poison pills. We can just tell the event loop to cancel them.
    for c in consumers:
        c.cancel()
        
    print("Main Coroutine: Program exited cleanly.")

if __name__ == "__main__":
    # Start the asyncio Event Loop
    asyncio.run(main())