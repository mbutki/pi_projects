from copy import deepcopy

def main():
    buckets = [3, 5]
    max_bucket = max(buckets)
    target = 4
    visited = set()

    def inner(i, tank, path):
        if tank == target:
            return deepcopy(path)

        if i >= len(buckets) or tank > target + max_bucket or tank < 0:
            return None

        state = (i, tank)
        if state in visited:
            return None
        visited.add(state)

        bucket = buckets[i]

        # option1 1: add bucket
        path.append(bucket)
        result = inner(i, tank + bucket, path)
        path.pop()
        if result is not None:
            return result

        # option 2: remove bucket
        path.append(-bucket)
        result = inner(i, tank - bucket, path)
        path.pop()
        if result is not None:
            return result

        # option 3: skip bucket
        result = inner(i+1, tank, path)
        if result is not None:
            return result

        return None

    print(inner(0, 0, []))


if __name__ == '__main__':
    main()