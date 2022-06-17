import dagre from 'dagre';
import { preorderTraversal } from './helper';
import { Node } from './node';
import { Line } from './line';

export class GraphLayout {
  /**
   * constructor
   * @param {object} data - data is an object json
   * { id: name, name: string, children: [] }
   */
  constructor(data) {
    this.data = data;
  }

  createGraph(p5) {
    this.g = new dagre.graphlib.Graph();
    this.g.setGraph({});
    this.g.setDefaultEdgeLabel(function () {
      return {};
    });

    const defaultNodeSize = {
      width: 120,
      height: 80,
    };

    preorderTraversal(this.data, (root, child, childIndex) => {
      if (childIndex === 0) {
        this.g.setNode(
          root.name,
          Object.assign({ label: root.name }, defaultNodeSize)
        );
      }
      this.g.setNode(
        child.name,
        Object.assign({ label: child.name }, defaultNodeSize)
      );
      this.g.setEdge(root.name, child.name);
    });

    dagre.layout(this.g);

    this.g.nodes().forEach((v) => {
      const nodeData = this.g.node(v);
      const node = new Node(Object.assign({ name: nodeData.label }, nodeData));
      node.createNode(p5);
      node.setSize(nodeData.width, nodeData.height);
    });

    this.g.edges().forEach((e) => {
      const edgeData = this.g.edge(e)['points'];
      const nodeStart = this.g.node(e.v);
      const nodeEnd = this.g.node(e.w);

      const line = new Line(edgeData[0], edgeData[2]);
      line.createLine(p5);
    });
  }
}
