from abc import ABC, abstractmethod
from typing import TypeVar, Generic, cast
import unittest

T = TypeVar('T')

class Iterator(ABC, Generic[T]):
    @abstractmethod
    def has_next(self) -> bool:
        pass

    @abstractmethod
    def next(self) -> T:
        pass

class ArrayIterator(Iterator[T]):
    def __init__(self, array: list[T]) -> None:
        self.array = array
        self.index = 0
        self.size = len(self.array)

    def has_next(self) -> bool:
        return self.index < self.size

    def next(self) -> T:
        if not self.has_next():
            raise StopIteration('Iterator OOB')

        item = self.array[self.index]
        self.index += 1
        return item

class PeakingIterator(Iterator[T]):
    def __init__(self, iterator: Iterator[T]):
        self.iterator = iterator
        self.has_cache = False
        self.peak_cache: T | None = None

    def has_next(self) -> bool:
        return self.has_cache | self.iterator.has_next()
    
    def next(self) -> T:
        if self.has_cache:
            self.has_cache = False
            return cast(T, self.peak_cache)
        
        return self.iterator.next()

    def peak(self) -> T:
        if not self.has_cache:
            if not self.iterator.has_next():
                raise StopIteration('Peak Iterator OOB')
            self.has_cache = True
            self.peak_cache = self.iterator.next()

        # Since we use has_cache to track state, we can safely cast the
        # cache to T, even if None is a valid value for T.
        return cast(T, self.peak_cache)

class TestIterators(unittest.TestCase):
    def test_empty_input(self) -> None:
        array_it = ArrayIterator([])
        peak_it = PeakingIterator(array_it)

        self.assertFalse(array_it.has_next())
        with self.assertRaises(StopIteration):
            array_it.next()
        with self.assertRaises(StopIteration):
            peak_it.peak()

    def test_single_element(self) -> None:
        array_it = ArrayIterator([42])
        peak_it = PeakingIterator(array_it)

        self.assertTrue(peak_it.has_next())
        self.assertEqual(peak_it.peak(), 42)
        self.assertEqual(peak_it.peak(), 42)
        self.assertTrue(peak_it.has_next())
        self.assertEqual(peak_it.next(), 42)
        self.assertFalse(peak_it.has_next())
        with self.assertRaises(StopIteration):
            peak_it.has_next()
        with self.assertRaises(StopIteration):
            peak_it.next()

if __name__ == '__main__':
    unittest.main()