import bisect
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


class Processor:
    def __init__(self, data):
        self.data = []
        self.user_index = defaultdict(list)
        self.currency_index = defaultdict(list)
        for item in data:
            self.add_item(item)

    def get_curser(self):
        return Curser(self)

    def add_item(self, item):
        entry = {
            "time": item[0],
            "id": item[1],
            "user": item[2],
            "currency": item[3],
            "amount": item[4],
        }
        bisect.insort(self.data, entry, key=lambda x: x["time"])

        self.user_index[entry["user"]].append(entry)
        self.currency_index[entry["currency"]].append(entry)

    def filter_time(self, start, end):
        i_start = bisect.bisect_left(self.data, start, key=lambda x: x["time"])
        i_end = bisect.bisect_right(self.data, end, key=lambda x: x["time"])

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
    p.add_item([0, 3, 1, 1, 5])
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
