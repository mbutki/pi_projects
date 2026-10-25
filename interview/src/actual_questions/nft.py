from pprint import pprint
import copy
from typing import TypedDict

class Trait(TypedDict):
    name: str
    values: list[str]

class Nft(TypedDict):
    traits: list[Trait]

def main():
    data: Nft = {
        'traits': [
            {'name': '1', 'values': ['a', 'b', 'c']},
            {'name': '2', 'values': ['d', 'e', 'f']},
        ]
    }
    pprint(generate(data, 12))

def generate(data, n):
    traits = data['traits']
    output = []
    instance = []

    def inner(i):
        if i == len(traits):
            output.append(copy.deepcopy(instance))
            return
        for value in traits[i]['values']:
            if len(output) < n:
                instance.append(value)
                inner(i+1)
                instance.pop()
    inner(0)
    return output

if __name__ == '__main__':
    main()
