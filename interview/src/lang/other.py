def main():
    sorting()
    comprehension()
    nesting()


def nesting():
    # nonlocal is needed if writing to outside of nested funct
    a = 1

    def inner():
        a = 5

    inner()
    assert a == 1

    def inner2():
        nonlocal a
        a = 5

    inner2()
    assert a == 5


def sorting():
    a = ["hi", "there", "x", "mike"]
    a.sort(key=len, reverse=True)
    print(a)

    a = ["hi", "there", "x", "mike"]
    a.sort(key=lambda x: len(x) + 1)
    print(a)

    def str_len(s):
        return len(s) + 1

    a = ["hi", "there", "x", "mike"]
    a.sort(key=str_len)
    print(a)

    a = ["hi", "there", "x", "mike"]
    x = sorted(a)
    print(x)


def comprehension():
    # list
    a = [i * 2 for i in range(1, 6)]
    print(a)

    # list with filter
    a = [i for i in range(0, 21) if i % 5 == 0]
    print(a)

    # generator
    a = (i * 2 for i in range(1, 6))
    print(a)
    while a:
        try:
            print(next(a))
        except StopIteration:
            break

    # 2d list
    # 5 x 10 (row x col)
    row = 2
    col = 4
    a = [[0] * col for i in range(row)]
    print(a)

    # dict
    a = {i: i * 2 for i in range(1, 5)}
    print(a)


if __name__ == "__main__":
    main()
