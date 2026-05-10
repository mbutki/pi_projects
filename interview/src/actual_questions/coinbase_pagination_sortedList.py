from sortedcontainers import SortedList
from collections import defaultdict


class Curser:
    def __init__(self, processor):
        self.processor = processor
        self.size = 0
        self.start_time = 0
        self.end_time = 0
        self.index = 0

    def set_page_size(self, size):
        self.size = size

    def set_time(self, start_time, end_time):
        self.start_time = start_time
        self.end_time = end_time

    def next_page(self):
        if self.index >= len(self.processor.data):
            return []
        data = self.processor.filter_time(self.start_time, self.end_time)
        end = self.index + self.size
        page = data[self.index : end]
        self.index = end
        return page


class Item:
    def __init__(self, item):
        self.time, self.id, self.user, self.currency, self.amount = item

    def __lt__(self, other):
        return self.time < other.time

    def __repr__(self):
        return str([self.time, self.id, self.user, self.currency, self.amount])


class Processor:
    def __init__(self, data):
        self.data = SortedList()
        self.user_index = defaultdict(list)
        self.currency_index = defaultdict(list)
        for item in data:
            self.add_item(Item(item))

    def get_curser(self):
        return Curser(self)

    def add_item(self, item):
        self.data.add(item)

        self.user_index[item.user].append(item)
        self.currency_index[item.currency].append(item)

    def filter_time(self, start, end):
        # bisect expects the same type as input as the sortedList, which is Item, not just an int.
        i_start = self.data.bisect_left(Item([start, 1, 1, 1, 1]))
        i_end = self.data.bisect_right(Item([end, 1, 1, 1, 1]))

        if i_start < len(self.data):
            return self.data[i_start:i_end]

    def filter_user(self, item):
        return self.user_index[item]

    def filter_currency(self, item):
        return self.currency_index[item]


def main():
    # time, id, user, currency, amount
    data = [[1, 3, 1, 1, 5], [2, 4, 1, 2, 2], [3, 5, 2, 2, -10], [4, 6, 2, 1, 2]]
    p = Processor(data)
    print(f"time 2-3: {p.filter_time(2, 3)}")
    print(f"user 1: {p.filter_user(1)}")
    print(f"currency 2: {p.filter_currency(2)}")
    print("adding item with time 0")
    p.add_item(Item([0, 3, 1, 1, 5]))
    print(f"time 0-1: {p.filter_time(0,1)}")

    c = p.get_curser()
    c.set_page_size(2)
    c.set_time(0, 100)
    print(f"c1: page: {c.next_page()}")
    print(f"c1: page: {c.next_page()}")
    print(f"c1: page: {c.next_page()}")
    print(f"c1: page: {c.next_page()}")

    c2 = p.get_curser()
    c2.set_page_size(4)
    c2.set_time(0, 100)
    print(f"c2: page: {c2.next_page()}")
    print(f"c2: page: {c2.next_page()}")


if __name__ == "__main__":
    main()
