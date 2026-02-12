from typing import TypeVar, Generic

T = TypeVar("T")
type Banana = int


def get_first_item(item: list[T]) -> T:
    return item[0]


class Container(Generic[T]):
    def __init__(self, item: T) -> None:
        self.item = item

    def get_item(self) -> T:
        return self.item


def main():
    a = [1, 2, 3]
    c = Container(a)
    print(f"c's item:{c.get_item()}")
    print(f"direct first item:{get_first_item(a)}")


if __name__ == "__main__":
    main()
