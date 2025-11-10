import unittest
import networkx as nx

import src.ds.graphs as graphs
import src.algos.sorting as sorting


class GraphTests(unittest.TestCase):
    def test_dijsktra(self):
        graph = nx.Graph()
        graph.add_edge(1, 2, weight=7)
        graph.add_edge(1, 3, weight=9)
        graph.add_edge(1, 6, weight=14)
        graph.add_edge(2, 3, weight=10)
        graph.add_edge(2, 4, weight=15)
        graph.add_edge(3, 6, weight=2)
        graph.add_edge(3, 4, weight=11)
        graph.add_edge(6, 5, weight=9)
        graph.add_edge(4, 5, weight=6)

        visited, path = graphs.dijsktra(graph, 1)

        self.assertEqual(set(visited), {1, 2, 3, 4, 5, 6})
        self.assertEqual(path, {2: 1, 3: 1, 4: 3, 5: 6, 6: 3})


class SortingTests(unittest.TestCase):
    def test_insertion(self):
        preorder = [3, 4, 5, 2, 1]
        postorder = [1, 2, 3, 4, 5]
        self.assertNotEqual(preorder, postorder)
        sorting.insertion_sort(preorder)
        self.assertEqual(preorder, postorder)


if __name__ == "__main__":
    unittest.main()
