from typing import Self

from sortedcontainers import SortedList


class File:
    def __init__(self, name: str, size: int, content: str):
        self.name = name
        self.size = size
        self.content = content

    def __lt__(self, other: Self):
        return (self.size, self.name) > (other.size, other.name)


class FileSystem:
    def __init__(self):
        self.files: SortedList[File] = SortedList()
        self.lookup: dict[str, File] = {}

        self.files_by_size: SortedList[File] = SortedList(key=lambda x: x.size)

    def add_file(self, file: File):
        self.lookup[file.name] = file
        self.files.add(file)

    def remove_largest_file(self):
        largest = self.files.pop()
        del self.lookup[largest.name]
