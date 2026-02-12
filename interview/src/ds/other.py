from collections import deque
import heapq


def main():
    queues()
    heaps()
    dicts()
    funcational()


def funcational():
    a = [i * 2 for i in range(1, 6)]
    b = map(lambda x: -x, a)
    print(list(b))

    b = map(lambda x: -x, a)
    c = filter(lambda x: x < -5, b)
    print(list(c))


def dicts():
    a = {i: i * 2 for i in range(1, 6)}
    for k, v in a.items():
        print(f"key:{k}, val{v}")

    for k in a.keys():  # same as "for k in a:"
        print(f"key:{k}")

    for v in a.values():
        print(f"val:{v}")


def queues():
    a = deque()
    # Left to right
    a.appendleft(1)
    a.pop()

    # Right to left
    a.append(2)
    a.popleft()


def heaps():
    # Min heap
    a = [i for i in range(6, 0, -1)]
    heapq.heapify(a)
    heapq.heappop(a)
    heapq.heappush(a, -1)
    heapq.heappop(a)

    # Max heap
    a = [i for i in range(10)]
    heapq.heapify_max(a)
    heapq.heappop_max(a)
    heapq.heappush_max(a, 999)
    heapq.heappop_max(a)


if __name__ == "__main__":
    main()
