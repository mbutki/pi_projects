from abc import ABC, abstractmethod
from enum import Enum
from collections.abc import Iterator


class Kingdom(Enum):
    ANIMALIA = 1
    PLANTAE = 2
    FUNGI = 3
    PROTISTA = 4
    BACTERIA = 5
    ARCHAEA = 6


class Life(ABC):
    def __init__(
        self, kingdom: Kingdom, name: str, call: str | None, extinct: bool = False
    ) -> None:
        self.kingdom = kingdom
        self.name = name
        self.call = call
        self.extinct = extinct

    def speak(self):
        return (
            f"{self.name} says {self.call}"
            if not self.call is None
            else f"{self.name} has no call"
        )

    @abstractmethod
    def poop(self) -> str:
        pass

    @staticmethod
    def kingdoms() -> Iterator[Kingdom]:
        return (k for k in Kingdom)


class Dog(Life):
    def __init__(self, name: str, call: str | None) -> None:
        Life.__init__(self, Kingdom.ANIMALIA, name, call, False)

    def poop(self) -> str:
        return "Gotta poop like a DOG!"


class Cat(Life):
    def __init__(self, name: str, call: str | None) -> None:
        Life.__init__(self, Kingdom.ANIMALIA, name, call, False)

    def poop(self) -> str:
        return "Gotta poop like a CAT!"


class Fern(Life):
    def __init__(self, name: str, call: str | None) -> None:
        Life.__init__(self, Kingdom.PLANTAE, name, call, False)

    def poop(self) -> str:
        return "I don't poop dude!"


def main():
    d = Dog("Shitzu", "bow-wow")
    print(d.poop())

    f = Fern("spotted", "swish-swish")
    print(f.poop())

    for k in Life.kingdoms():
        print(k)


if __name__ == "__main__":
    main()
