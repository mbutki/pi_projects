#!/usr/bin/env python
class SListNode:
    """Singly-linked list node"""

    def __init__(self, next_node=None, my_data=None):
        self.next = next_node
        self.data = my_data

    def get_next_node(self):
        return self.next

    def set_next_node(self, next_node):
        self.next = next_node

    def get_data(self):
        return self.data

    def set_data(self, my_data):
        self.data = my_data


class SList:
    """Singly-linked list"""

    def __init__(self):
        self.root = SListNode()
        self.root.set_next_node(self.root)
        self.length = 0

    def get_root_node(self):
        return self.root

    def insert(self, data):
        new_node = SListNode()
        new_node.set_data(data)
        new_node.set_next_node(self.root.get_next_node())
        self.root.set_next_node(new_node)
        self.length = self.length + 1

    def get_length(self):
        return self.length

    def traverse(self):
        tnode = self.root.get_next_node()
        while tnode != self.root:
            print(f"{tnode.get_data()} ")
            tnode = tnode.get_next_node()


if __name__ == "__main__":
    intlist = SList()
    for x in range(10):
        intlist.insert(x + 1)
        print(f"There are {intlist.get_length()} elements in the list")
        intlist.traverse()
