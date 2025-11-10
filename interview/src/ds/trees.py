class Node():
    def __init__(self, name):
        self.left_child = None
        self.right_child = None
        self.name = name

    def get_name(self):
        return self.name

    def set_name(self, name):
        self.name = name

    def set_left_child(self, node):
        self.left_child = node

    def set_right_child(self, node):
        self.right_child = node

    def get_right_child(self):
        return self.right_child

    def get_left_child(self):
        return self.left_child

    def __lt__(self, other):
        return self.get_name() < other.get_name()

    def __le__(self, other):
        return self.get_name() <= other.get_name()

    def __gt__(self, other):
        return self.get_name() > other.get_name()

    def __ge__(self, other):
        return self.get_name() >= other.get_name()

    def __str__(self):
        left = self.left_child
        if left:
            left = self.left_child.get_name()

        right = self.right_child
        if right:
            right = self.right_child.get_name()

        return f'name:{self.name} left_child:{left} right_child:{right}'

class BiTree():
    def __init__(self):
        self.root = None

    def insert_iter(self, node):
        if self.root is None:
            self.root = node
            return

        cur_node = self.root
        while cur_node is not None:
            if node <= cur_node:
                left_child = cur_node.get_left_child()
                if left_child is None:
                    cur_node.set_left_child(node)
                    return
                cur_node = left_child # iter solution
            if node > cur_node:
                right_child = cur_node.get_right_child()
                if right_child is None:
                    cur_node.set_right_child(node)
                    return
                cur_node = right_child # iter solution

    def insert_recur(self, node):
        if self.root is None:
            self.root = node
            return
        self.insert_recur_helper(self.root, node)

    def insert_recur_helper(self, cur_node, node):
        if node <= cur_node:
            left_child = cur_node.get_left_child()
            if left_child is None:
                cur_node.set_left_child(node)
                return
            self.insert_recur_helper(left_child, node)

        if node > cur_node:
            right_child = cur_node.get_right_child()
            if right_child is None:
                cur_node.set_right_child(node)
                return
            self.insert_recur_helper(right_child, node)

    def delete_recur(self, node):
        if self.root is None:
            return
        self.delete_recur_helper(self.root, None, node)

    # We need to know the current parent so we can delete in the no children base case
    def delete_recur_helper(self, cur_node, cur_parent, node):
        if node < cur_node: # just trying to find the node
            left_child = cur_node.get_left_child()
            if left_child is None:
                cur_node.set_left_child(node)
                return
            self.delete_recur_helper(left_child, cur_node, node)
        elif node > cur_node: # just trying to find the node
            right_child = cur_node.get_right_child()
            if right_child is None:
                cur_node.set_right_child(node)
                return
            self.delete_recur_helper(right_child, cur_node, node)
        else: # Node found
            left_child = cur_node.get_left_child()
            right_child = cur_node.get_right_child()
            if left_child and right_child: # find right most child of direct left child, copy value up, call recursive on that child
                largest_child, largest_child_parent = self.find_largest_child(left_child)
                cur_node.set_name(largest_child.get_name())
                self.delete_recur_helper(largest_child, largest_child_parent, node)
            elif left_child: # only 1 child, copy child value up, delete child
                cur_node.set_name(left_child.get_name())
                cur_node.set_left_child(None)
            elif right_child: # only 1 child, copy child value up, delete child
                cur_node.set_name(right_child.get_name())
                cur_node.set_right_child(None)
            else: # Just delete the node
                if cur_parent.get_left_child() == cur_node:
                    cur_parent.set_left_child(None)
                else:
                    cur_parent.set_right_child(None)

    def find_largest_child(self, node):
        while node.get_right_child():
            parent = node
            node = node.get_right_child()
        return node, parent

    # All that changes is the placement of the print statement
    def dfs_recur_pre(self, node, goal):
        if node is None:
            return
        print(node.get_name())
        self.dfs_recur_pre(node.get_left_child(), goal)
        self.dfs_recur_pre(node.get_right_child(), goal)

    def dfs_recur_in(self, node, goal):
        if node is None:
            return
        self.dfs_recur_in(node.get_left_child(), goal)
        print(node.get_name())
        self.dfs_recur_in(node.get_right_child(), goal)

    def dfs_recur_post(self, node, goal):
        if node is None:
            return
        self.dfs_recur_post(node.get_left_child(), goal)
        self.dfs_recur_post(node.get_right_child(), goal)
        print(node.get_name())

    # The easiest of the iterative
    def dfs_iter_pre(self, _goal):
        stack = [self.root]
        while len(stack) != 0:
            node = stack.pop()
            if node is None:
                continue
            print(node.get_name())
            stack.append(node.get_right_child())
            stack.append(node.get_left_child())
        return False

    # push nodes on to stack going down-left, until you hit null, then pop, print, go right once, and start again
    # push onto stack until hit null, then pop, go right, repeat
    def dfs_iter_in(self, _goal):
        stack = []
        cur_node = self.root
        while len(stack) != 0 or cur_node:
            if cur_node:
                stack.append(cur_node)
                cur_node = cur_node.get_left_child()
            else:
                cur_node = stack.pop()
                print(cur_node.get_name())
                cur_node = cur_node.get_right_child()
        return False

    # using preorder with two stacks is the easiest way, but it will take memory O(# of node) rather then O(# of levels)
    def dfs_iter_post(self, _goal):
        stack = [self.root]
        output_stack = [] # add output stack
        while len(stack) != 0:
            node = stack.pop()
            output_stack.append(node) # append current node to output
            if node is None:
                continue
            stack.append(node.get_left_child())  # you have to...
            stack.append(node.get_right_child()) # swap these two ...
        while len(output_stack) != 0: # Now just pop off the output stack
            node = output_stack.pop()
            if node:
                print(node.get_name())
        return False

    def bfs_iter(self, _goal):
        queue = [self.root]
        while len(queue) != 0:
            node = queue.pop(0)
            print(node.get_name())
            if node.get_left_child():
                queue.append(node.get_left_child())
            if node.get_right_child():
                queue.append(node.get_right_child())

def main():
    node0 = Node(0)
    node1 = Node(1)
    node2 = Node(2)
    node3 = Node(3)
    node4 = Node(4)
    node5 = Node(5)
    node6 = Node(6)

    tree = BiTree()
    #tree.insert_iter(node3)
    #tree.insert_iter(node1)
    #tree.insert_iter(node5)
    #tree.insert_iter(node0)
    #tree.insert_iter(node2)
    #tree.insert_iter(node4)
    #tree.insert_iter(node6)
    tree.insert_recur(node3)
    tree.insert_recur(node1)
    tree.insert_recur(node5)
    tree.insert_recur(node0)
    tree.insert_recur(node2)
    tree.insert_recur(node4)
    tree.insert_recur(node6)

    print('depth preorder')
    tree.dfs_recur_pre(node3, '4')
    print('depth inorder')
    tree.dfs_recur_in(node3, '4')
    print('depth postorder')
    tree.dfs_recur_post(node3, '4')

    print('deleting node 3')
    tree.delete_recur(node3)

    print('depth preorder')
    tree.dfs_iter_pre('4')
    print('depth inorder')
    tree.dfs_iter_in('4')
    print('depth postorder')
    tree.dfs_iter_post('4')

    print('breadth iter')
    tree.bfs_iter('4')


if __name__ == '__main__':
    main()
