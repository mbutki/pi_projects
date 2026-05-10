def main():
    eq = "2+(2*3)*4"
    answer = calc(eq)
    print(f"answer after sum:{answer}")
    return answer


def calc(eq: str) -> int:
    def get_next_number(i: int) -> tuple[int, int]:
        if eq[i] == "(":
            return extract_sub_expression(i)
        else:
            return extract_number(i)

    def extract_sub_expression(i: int) -> tuple[int, int]:
        left_parens_i = i
        right_parens_i = eq.index(")", i + 1)
        print(f"extracting:{eq[left_parens_i + 1 : right_parens_i]}")
        number = calc(eq[left_parens_i + 1 : right_parens_i])
        print(f"found:{number}")
        next_i = right_parens_i + 1
        return (number, next_i)

    def extract_number(i: int) -> tuple[int, int]:
        next_i = i
        while next_i < len(eq):
            if eq[next_i] in {"+", "-", "*", "/"}:
                break
            next_i += 1
        print(f"extracting:{eq[i:next_i]}")
        return (int(eq[i:next_i]), next_i)

    i = 0
    operator = ""
    stack: list[int] = []

    while i < len(eq):
        # read operator and advance i
        if i == 0:
            operator = "+"
        else:
            operator = eq[i]
            i += 1

        # read number and advance i
        number, next_i = get_next_number(i)
        print(f"stack before:{stack}")
        if operator == "+":
            print(f"saw +")
            stack.append(number)
        if operator == "-":
            print(f"saw -")
            stack.append(-number)
        elif operator == "*":
            print(f"saw *")
            stack.append(stack.pop() * number)
        elif operator == "/":
            print(f"saw /")
            stack.append(stack.pop() // number)
        print(f"stack after:{stack}")
        i = next_i

    return sum(stack)


if __name__ == "__main__":
    main()
