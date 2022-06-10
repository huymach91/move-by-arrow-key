export class Node {
  /**
   * create a node
   * @param {object} data - data is an object json
   * { id: name, name: string, x: number, y: number }
   */
  constructor(data) {
    this.data = data;
  }

  /**
   * @param {p5js} p5 - p5 is an instance of p5js
   */
  createNode(p5) {
    const text = this.data.name;
    this.element = p5.createElement('div', text);
    this.element.position(this.data.x, this.data.y);
    this.defaultNodeStyle();
  }

  defaultNodeStyle() {
    this.element.style('color', 'black');
    this.element.style('fontWeight', '500');
    this.element.style('background-color', '#ffff00');
    this.element.style('padding', '5px');
    this.element.style('border', '2px solid #3f3f3f');
    this.element.style('border-radius', '5px');
  }

  defaultEvents(fn) {
    this.element.mousePressed(function () {
      fn(this.element);
    });
  }

  getNodeWidth() {
    return this.element.elt.offsetWidth;
  }
}