from collections import defaultdict
import networkx as nx


def main():
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

    dijsktra(graph, 1)


class Graph:
    def __init__(self):
        self.nodes = set()
        self.edges = defaultdict(list)
        self.distances = {}

    def add_node(self, value):
        self.nodes.add(value)

    def add_edge(self, from_node, to_node, distance):
        self.edges[from_node].append(to_node)
        self.edges[to_node].append(from_node)
        self.distances[(from_node, to_node)] = distance


def dijsktra(graph, initial):
    visited = {initial: 0}
    path = {}

    nodes = set(graph.nodes)

    while nodes:
        min_node = None
        for node in nodes:
            if node in visited:
                if min_node is None:
                    min_node = node
                elif visited[node] < visited[min_node]:
                    min_node = node

        if min_node is None:
            break

        nodes.remove(min_node)
        current_weight = visited[min_node]

        for start, end in graph.edges(min_node):
            edge_w = graph.edges[start, end]['weight']
            weight = current_weight + edge_w #graph.distance[(min_node, edge)] fo rour own Graph class
            if end not in visited or weight < visited[end]:
                visited[end] = weight
                path[end] = min_node

    return visited, path


if __name__ == "__main__":
    main()
