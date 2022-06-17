import dagre from 'dagre';

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
    var g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(function () {
      return {};
    });
  }
}
