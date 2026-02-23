def wrapper(funct: Callable) -> str:

def heyo(funct) -> Callable[[], str]:
    def wrapper(*args, **kwargs) -> str:
        return f"HEY\n{funct(*args, **kwargs)}\nYO"

    return wrapper


@heyo
def main():
    print(f'hi there')



if __name__ == '__main__':
    main()