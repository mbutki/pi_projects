from abc import ABC, abstractmethod


class Vehicle(ABC):
    @property
    @abstractmethod
    def color(self):
        """
        Abstract property representing the color of the vehicle.
        Subclasses must implement this property.
        """
        pass

    @property
    @abstractmethod
    def registration_number(self):
        """
        Abstract property representing the registration number of the vehicle.
        Subclasses must implement this property.
        """
        pass

    def crash(self):
        print("Oh, no. You crashed")


class Car(Vehicle):
    def __init__(self, color, reg_num):
        self._color = color
        self._registration_number = reg_num

    @property
    def color(self):
        return self._color

    @property
    def registration_number(self):
        return self._registration_number


# Attempting to instantiate Vehicle directly will raise a TypeError
# vehicle = Vehicle() # This would raise: TypeError: Can't instantiate abstract class Vehicle with abstract methods color, registration_number

# Instantiating Car, which implements the abstract properties
my_car = Car("blue", "XYZ-123")
print(f"My car's color: {my_car.color}")
print(f"My car's registration number: {my_car.registration_number}")
