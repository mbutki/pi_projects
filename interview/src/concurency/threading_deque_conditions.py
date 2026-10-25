from collections import deque
from typing import TypeVar, Generic
import threading
from threading import Thread, Lock, Condition
import time

T = TypeVar('T')

class ProductionQueue(Generic[T]):
    def __init__(self, capacity: int) -> None:
        self.queue: deque[T] = deque()
        self.capacity: int = capacity

        self.is_closed: bool = False
        self.mutex: Lock = threading.Lock()
        self.not_full: Condition = threading.Condition(self.mutex)
        self.not_empty: Condition = threading.Condition(self.mutex)

    def append(self, item: T) -> None:
        with self.not_full:
            while len(self.queue) == self.capacity and not self.is_closed:
                _ = self.not_full.wait()
            
            if self.is_closed:
                raise RuntimeError("Cannot put to a closed queue")

            self.queue.append(item)
            print(f'Adding: {item}, Queue size: {len(self.queue)}')
            self.not_empty.notify()

    def pop(self) -> T | None:
        with self.not_empty:
            while len(self.queue) == 0 and not self.is_closed:
                _ = self.not_empty.wait()
            
            if self.is_closed and len(self.queue) == 0:
                return None
            
            item = self.queue.popleft()
            print(f'Removing: {item}, Queue size: {len(self.queue)}')
            self.not_full.notify()
        return item
    
    def close(self) -> None:
        with self.mutex:
            print('start close, wake up all threads')
            self.is_closed = True
            self.not_full.notify_all()
            self.not_empty.notify_all()

def producer(pq: ProductionQueue[int], item: int) -> None:
    try:
        pq.append(item)
    except RuntimeError:
        # Ignore put errors on closed queue
        pass

def consumer(pq: ProductionQueue[int], out_list: list[int]) -> None:
    while True:
        item = pq.pop()
        if item is None:
            break
        out_list.append(item)

def main() -> None: 
    pq: ProductionQueue[int] = ProductionQueue(3)

    producers = [Thread(target=producer, args=(pq, i)) for i in range(10)]
    results: list[list[int]] = [[], []]
    consumers = [Thread(target=consumer, args=(pq, results[i])) for i in range(2)]

    for thread in producers + consumers: thread.start()
    time.sleep(0.1)
    pq.close()
    for thread in producers + consumers: thread.join()

    print("Consumed by consumer 0:", results[0])
    print("Consumed by consumer 1:", results[1])
    all_consumed = results[0] + results[1]
    print("Total consumed:", len(all_consumed), "items:", sorted(all_consumed))

if __name__ == '__main__':
    main()