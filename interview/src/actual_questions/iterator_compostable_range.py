from collections.abc import Iterable
from typing import TypeVar, Callable, Any, Iterator

T = TypeVar('T')

class RangeIterator:
    """
    A custom range iterator supporting forward/backward iteration, 
    inclusive/exclusive endpoints, and negative steps.
    """
    def __init__(self, start, end, step=1, inclusive=False):
        if step == 0:
            raise ValueError("Range step must not be zero")
        
        self.start = start
        self.end = end
        self.step = step
        self.inclusive = inclusive
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.step > 0:
            if self.inclusive and self.current > self.end:
                raise StopIteration
            elif not self.inclusive and self.current >= self.end:
                raise StopIteration
        else:
            if self.inclusive and self.current < self.end:
                raise StopIteration
            elif not self.inclusive and self.current <= self.end:
                raise StopIteration

        result = self.current
        self.current += self.step
        return result


def map_iter(func: Callable[[T], Any], iterable: Iterable[T]) -> Iterator[Any]:
    for item in iterable:
        yield func(item)

def filter_iter(predicate: Callable[[T], bool], iterable: Iterable[T]) -> Iterator[T]:
    for item in iterable:
        if predicate(item):
            yield item

def zip_iter(*iterables: Iterable) -> Iterator[tuple]:
    iterators = [iter(it) for it in iterables]
    while True:
        try:
            # Yields a tuple of the next elements; stops if ANY iterator is exhausted
            yield tuple(next(it) for it in iterators)
        except StopIteration:
            break

def take_iter(n: int, iterable: Iterable[T]) -> Iterator[T]:
    if n <= 0:
        return
    iterator = iter(iterable)
    for _ in range(n):
        try:
            yield next(iterator)
        except StopIteration:
            break

def drop_iter(n: int, iterable: Iterable[T]) -> Iterator[T]:
    iterator = iter(iterable)
    # Consume n elements
    for _ in range(n):
        try:
            next(iterator)
        except StopIteration:
            return # Iterable exhausted before n elements were dropped
    # Yield the rest
    for item in iterator:
        yield item

def chain_iter(*iterables: Iterable[T]) -> Iterator[T]:
    for iterable in iterables:
        for item in iterable:
            yield item