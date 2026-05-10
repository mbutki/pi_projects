# pylint: disable=unused-variable
## cheetsheet: https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html


# W0612:unused-variable
def basic():
    x: int = 1
    x: float = 1.0
    x: bool = True
    x: str = "test"
    x: bytes = b"test"

    # For collections on Python 3.9+, the type of the collection item is in brackets
    x: list[int] = [1]
    x: set[int] = {6, 7}

    # For mappings, we need the types of both keys and values
    x: dict[str, float] = {"field": 2.0}  # Python 3.9+

    # For tuples of fixed size, we specify the types of all the elements
    x: tuple[int, str, float] = (3, "yes", 7.5)  # Python 3.9+

    # For tuples of variable size, we use one type and ellipsis
    x: tuple[int, ...] = (1, 2, 3)  # Python 3.9+

    # On Python 3.10+, use the | operator when something could be one of a few types
    x: list[int | str] = [3, 5, "test", "fun"]  # Python 3.10+

    # Use X | None for a value that could be None on Python 3.10+
    x: str | None = "something" if some_condition() else None
    if x is not None:
        # Mypy understands x won't be None here because of the if-statement
        print(x.upper())
    # If you know a value can never be None due to some logic that mypy doesn't
    # understand, use an assert
    assert x is not None
    print(x.upper())


def funcations():
    from collections.abc import Iterator, Callable

    # This is how you annotate a function definition
    def stringify(num: int) -> str:
        return str(num)

    # And here's how you specify multiple arguments
    def plus(num1: int, num2: int) -> int:
        return num1 + num2

    # If a function does not return a value, use None as the return type
    # Default value for an argument goes after the type annotation
    def show(value: str, excitement: int = 10) -> None:
        print(value + "!" * excitement)

    # Note that arguments without a type are dynamically typed (treated as Any)
    # and that functions without any annotations are not checked
    def untyped(x):
        x.anything() + 1 + "string"  # no errors

    # This is how you annotate a callable (function) value
    x: Callable[[int, float], float] = f

    def register(callback: Callable[[str], int]) -> None: ...

    # A generator function that yields ints is secretly just a function that
    # returns an iterator of ints, so that's how we annotate it
    def gen(n: int) -> Iterator[int]:
        i = 0
        while i < n:
            yield i
            i += 1

    # You can of course split a function annotation over multiple lines
    def send_email(
        address: str | list[str],
        sender: str,
        cc: list[str] | None,
        bcc: list[str] | None,
        subject: str = "",
        body: list[str] | None = None,
    ) -> bool: ...

    # Mypy understands positional-only and keyword-only arguments
    # Positional-only arguments can also be marked by using a name starting with
    # two underscores
    def quux(x: int, /, *, y: int) -> None:
        pass

    quux(3, y=5)  # Ok
    quux(3, 5)  # error: Too many positional arguments for "quux"
    quux(x=3, y=5)  # error: Unexpected keyword argument "x" for "quux"

    # This says each positional arg and each keyword arg is a "str"
    def call(self, *args: str, **kwargs: str) -> str:
        reveal_type(args)  # Revealed type is "tuple[str, ...]"
        reveal_type(kwargs)  # Revealed type is "dict[str, str]"
        request = make_request(*args, **kwargs)
        return self.do_api_query(request)


def classes():
    from typing import ClassVar

    class BankAccount:
        # The "__init__" method doesn't return anything, so it gets return
        # type "None" just like any other method that doesn't return anything
        def __init__(self, account_name: str, initial_balance: int = 0) -> None:
            # mypy will infer the correct types for these instance variables
            # based on the types of the parameters.
            self.account_name = account_name
            self.balance = initial_balance

        # For instance methods, omit type for "self"
        def deposit(self, amount: int) -> None:
            self.balance += amount

        def withdraw(self, amount: int) -> None:
            self.balance -= amount

    # User-defined classes are valid as types in annotations
    account: BankAccount = BankAccount("Alice", 400)

    def transfer(src: BankAccount, dst: BankAccount, amount: int) -> None:
        src.withdraw(amount)
        dst.deposit(amount)

    # Functions that accept BankAccount also accept any subclass of BankAccount!
    class AuditedBankAccount(BankAccount):
        # You can optionally declare instance variables in the class body
        audit_log: list[str]

        def __init__(self, account_name: str, initial_balance: int = 0) -> None:
            super().__init__(account_name, initial_balance)
            self.audit_log: list[str] = []

        def deposit(self, amount: int) -> None:
            self.audit_log.append(f"Deposited {amount}")
            self.balance += amount

        def withdraw(self, amount: int) -> None:
            self.audit_log.append(f"Withdrew {amount}")
            self.balance -= amount

    audited = AuditedBankAccount("Bob", 300)
    transfer(audited, account, 100)  # type checks!

    # You can use the ClassVar annotation to declare a class variable
    class Car:
        seats: ClassVar[int] = 4
        passengers: ClassVar[list[str]]

    # If you want dynamic attributes on your class, have it
    # override "__setattr__" or "__getattr__"
    class A:
        # This will allow assignment to any A.x, if x is the same type as "value"
        # (use "value: Any" to allow arbitrary types)
        def __setattr__(self, name: str, value: int) -> None: ...

        # This will allow access to any A.x, if x is compatible with the return type
        def __getattr__(self, name: str) -> int: ...

    a = A()
    a.foo = 42  # Works
    a.bar = "Ex-parrot"  # Fails type checking


if __name__ == "__main__":
    basic()
