from sortedcontainers import SortedList


def main():
    pass


class DbBasic:
    def __init__(self):
        self.a = []
        self.setup()
        self.index = 0
        self.step = 10

    def setup(self):
        id = "123"
        score = 555
        payload = "the data"
        self.a.append((score, id, payload))
        self.a.sort()

    def fetch(self):
        data = self.a[self.index : self.index + self.step]
        self.index += self.step
        return data, self.step


class DbSortedList:
    def __init__(self):
        # SortedList stores tuples: (score, id, payload)
        # It handles the multi-level sort (score ASC, id ASC) automatically.
        self._data = SortedList()

    def insert(self, row_id: str, score: int, payload: str):
        # O(log N) insertion
        self._data.add((score, row_id, payload))

    def _encode_cursor(self, score, row_id):
        # Create an opaque string for the client
        cursor_str = f"{score}|{row_id}"
        return base64.b64encode(cursor_str.encode()).decode()

    def _decode_cursor(self, cursor_str):
        try:
            decoded = base64.b64decode(cursor_str.encode()).decode()
            score_str, row_id = decoded.split("|")
            return int(score_str), row_id
        except Exception:
            return None

    def query(self, min_score, page_size, cursor=None):
        # 1. Determine the search key
        if cursor:
            last_score, last_id = self._decode_cursor(cursor)
            # Use a high-empty string or specific logic to ensure we start AFTER this key
            search_key = (last_score, last_id, "")
            # bisect_right finds the index AFTER the last seen item
            start_idx = self._data.bisect_right(search_key)
        else:
            # Start at the very first record that could satisfy min_score
            search_key = (min_score, "", "")
            start_idx = self._data.bisect_left(search_key)

        # 2. Slice the data
        # SortedList supports efficient slicing, but we must ensure min_score constraint
        results = []
        for i in range(start_idx, min(start_idx + page_size, len(self._data))):
            row = self._data[i]
            if row[0] < min_score:
                continue  # This handles cases where bisect_right might land before min_score

            results.append({"id": row[1], "score": row[0], "payload": row[2]})

        # 3. Generate next cursor
        next_cursor = None
        if results and (start_idx + len(results) < len(self._data)):
            last_row = results[-1]
            next_cursor = self._encode_cursor(last_row["score"], last_row["id"])

        return results, next_cursor
