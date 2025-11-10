def insertion_sort(vals):
    i = 0
    j = 0
    for i, key in enumerate(vals):
        j = i-1
        while (j >= 0 and vals[j] > key):
            vals[j + 1] = vals[j]
            j = j -1
        vals[j + 1] = key

def quicksort_out_place(vals):
    if len(vals) <= 1:
        return vals
    pivot = vals.pop()
    less = []
    greater = []
    for val in vals:
        if val < pivot:
            less.append(val)
        else:
            greater.append(val)
    return quicksort_out_place(less) + [pivot] + quicksort_out_place(greater)

def swap(vals, a, b):
    a_val = vals[a]
    vals[a] = vals[b]
    vals[b] = a_val

#left is the index of the leftmost element of the subvals
#right is the index of the rightmost element of the subvals (inclusive)
def partition(vals, left, right, pivot_index):
    pivot_value = vals[pivot_index]
    swap(vals, pivot_index, right)
    new_pivot_index = left
    for i in range(left, right):
        if vals[i] <= pivot_value:
            swap(vals, i, new_pivot_index)
            new_pivot_index += 1
    swap(vals, new_pivot_index, right) # Move pivot to its final place
    return new_pivot_index

# Taken from wikipedia
def quicksort_in_place(vals, left, right):
    # If the list has 2 or more items
    if left < right:
        #choose any pivot_index such that left <= pivot_index <=right
        pivot_index = right
        # Get lists of bigger and smaller items and final position of pivot
        new_pivot_index = partition(vals, left, right, pivot_index)
        # Recursively sort elements smaller than the pivot
        quicksort_in_place(vals, left, new_pivot_index - 1)
        # Recursively sort elements at least as big as the pivot
        quicksort_in_place(vals, new_pivot_index + 1, right)

def merge(left_vals, right_vals):
    result = []
    i = 0
    j = 0
    while i < len(left_vals) and j < len(right_vals):
        if left_vals[i] <= right_vals[j]:
            result.append(left_vals[i])
            i += 1
        else:
            result.append(right_vals[j])
            j += 1

    result += left_vals[i:]
    result += right_vals[j:]
    return result

def merge_sort(vals):
    if len(vals) <= 1:
        return vals
    middle = int( len(vals) / 2 )
    left_vals = merge_sort(vals[:middle])
    right_vals = merge_sort(vals[middle:])
    return merge(left_vals, right_vals)

def heap_sort(node):
    def heapify(node):
        start = (len(node) - 2) / 2
        while start >= 0:
            sift_down(node, start, len(node) - 1)
            start -= 1

    def sift_down(node, start, end):
        root = start
        while root * 2 + 1 <= end:
            child = root * 2 + 1
            if child + 1 <= end and node[child] < node[child + 1]:
                child += 1
            if child <= end and node[root] < node[child]:
                node[root], node[child] = node[child], node[root]
                root = child
            else:
                return
    heapify(node)
    end = len(node) - 1
    while end > 0:
        node[end], node[0] = node[0], node[end]
        sift_down(node, 0, end - 1)
        end -= 1

def main():
    print('insertion sort')
    vals = [3,4,5,2,1]
    insertion_sort(vals)
    print(vals)

    print('quick sort out of place')
    vals = [3,4,5,2,1]
    print((quicksort_out_place(vals)))

    print('quick sort in place')
    vals = [3,4,5,2,1]
    quicksort_in_place(vals, 0, len(vals)-1)
    print(vals)

    print('merge sort')
    vals = [3,4,5,2,1]
    print((merge_sort(vals)))

    print('heap sort')
    vals = [3,4,5,2,1]
    heap_sort(vals)
    print(vals)

if __name__ == '__main__':
    main()
