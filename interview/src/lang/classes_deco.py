from typing import Callable


def heyo(funct) -> Callable[[], str]:
    def wrapper(*args, **kwargs) -> str:
        return f"HEY\n{funct(*args, **kwargs)}\nYO"

    return wrapper


class Animal:
    # Note: These are static methods (i.e. "class" methods)
    planet = "Earth"
    __secret = "There are no gods"  # turns into _Animal__secret (name mangeling)
    _secret = "Aren't gods great?"  # discouraged, but accessable

    def __init__(self, name: str = "animal", noise: str = "blablabla") -> None:
        self._name = name  # Note: Have to use _var to get it to work with setter method (else inf loop!)
        self.noise = noise

    def speak(self) -> str:
        return f"{self.name} says {self.noise}"

    def __str__(self) -> str:
        return self.speak()

    @heyo
    @staticmethod
    def poop() -> str:
        return "Everyone poops!"

    @classmethod
    def big_poop(cls) -> str:
        cls.planet = "Moon"
        return "you pooped so hard you flew to the moon"

    @property
    def name(self) -> str:
        return self._name

    @name.setter
    def name(self, new_value: str) -> None:
        self._name = new_value


class Dog(Animal):
    def __init__(self) -> None:
        super().__init__("dog", "bark")


class Cat(Animal):
    def __init__(self) -> None:
        super().__init__("cat", "meow")


class Human(Animal):
    def __init__(self) -> None:
        super().__init__("human", "this is a secret")

    def __str__(self) -> str:
        return "Humans don't have to play by the rules!"


def main():
    a = Animal()
    b = Dog()
    c = Cat()
    h = Human()
    for x in [a, b, c, h]:
        print(x)

    # print(Animal.__secret) # Thorws error
    print(Animal._Animal__secret)  # Can still access mangled version
    print(Animal._secret)  # Just discouraged
    print(Animal.planet)  # This is fine

    print(Animal.poop())  # type: ignore
    print(Animal.planet)
    print(Animal.big_poop())
    print(Animal.planet)


if __name__ == "__main__":
    main()
