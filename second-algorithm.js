// Algoritmo: Dijkstra com fila de prioridade

class PriorityQueueElement { 
  constructor(element, priority) { 
    this.element = element; 
    this.priority = priority; 
  }
} 

class PriorityQueue { 
  constructor() { 
    this.nodes = []; 
  } 

  queue = (element, priority) => { 
    var node = new PriorityQueueElement(element, priority); 
    var added = false; 
  
    // Adciona o nó levando em conta a sua prioridade
    this.nodes.forEach((currentNode, index) => { 
      if (!added && currentNode.priority > node.priority) { 
        this.nodes.splice(index, 0, node); 
        added = true; 
      }
    });

    // Adiciona no fim da fila, caso não tenha sido antes
    if (!added) this.nodes.push(node); 
  };

  dequeue = () => this.nodes.shift().element;

  isEmpty = () => this.nodes.length === 0; 
}

class Graph {
  constructor(...nodes) {
    this.nodes = nodes;
    this.edges = nodes.map(() => []);
  }

  // Adiciona a aresta (index do array de arestas) bidirecional e
  //  dá um push pro array de adjecencias
  addEdge = (node1, node2, weight) => {
    this.edges[node1].push({node:node2, weight});
    this.edges[node2].push({node:node1, weight});
  };

  dijkstra = (source) => {
    let cost = [];
    cost[source] = 0;
    let previousNode = [];
    const nodeQueue = new PriorityQueue();

    // Inicializa as estruturas de dados: array de custos (para saber o 
    //  caminho mais barato) e a fila de prioridade de nós a serem analizados
    this.nodes.forEach(node => {
      if (node !== source){
        cost[node] = Infinity;
      }
      nodeQueue.queue(node, cost[node]);
    });

    while(!nodeQueue.isEmpty()) {
      const cheapestNode = nodeQueue.dequeue();

      // Calcula os custo e origem para o nó mais barato (algorítmo guloso)
      this.edges[cheapestNode].forEach(destiny => {
        const costToNode = cost[cheapestNode] + destiny.weight;
        if (costToNode < cost[destiny.node]) {
          cost[destiny.node] = costToNode;
          previousNode[destiny.node] = cheapestNode;
          nodeQueue.queue(destiny.node, costToNode);
        }
      })
    }

    return [cost, previousNode];
  };

  // Backtracking para pegar o caminho ao nó destino
  static backtrack = (node, previousNode, origin, path = '') => (
    previousNode[node] !== undefined
      ? Graph.backtrack(previousNode[node], previousNode, origin, `${node}-${path}`)
      : `${node}-${path}`.slice(0, -1)
  )
}

// Inicializa o grafo
const graph = new Graph(0, 1, 2, 3, 4, 5, 6, 7);
graph.addEdge(0, 1, 2);
graph.addEdge(0, 4, 3);
graph.addEdge(1, 3, 8);
graph.addEdge(1, 5, 9);
graph.addEdge(1, 6, 6);
graph.addEdge(2, 5, 3);
graph.addEdge(2, 6, 7);
graph.addEdge(3, 7, 6);
graph.addEdge(4, 7, 9);
graph.addEdge(4, 6, 5);
graph.addEdge(5, 6, 4);
graph.addEdge(5, 7, 5);

const origin = 3;

const [cost, previousNode] = graph.dijkstra(origin);

graph.nodes.forEach((node) => {
  const path = Graph.backtrack(node, previousNode, origin);
  console.log(`Vertex, Cost, Path -> ${node}, ${cost[node]}, ${path}`)
});