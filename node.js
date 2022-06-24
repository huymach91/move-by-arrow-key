export class Node {
  /**
   * constructor
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

    this.tickElement = p5.createElement('span');
    this.tickElement.elt.className = 'tick tick-purple material-icons';
    this.tickElement.elt.innerHTML = 'check_circle';

    // const elementWidth = this.tickElement.elt.getBoundingClientRect().width;
    // const elementHeight = this.tickElement.elt.getBoundingClientRect().height;
    this.tickElement.position(this.data.x - 7, this.data.y - 5);
  }

  defaultNodeStyle() {
    this.element.style('color', 'black');
    this.element.style('fontWeight', '500');
    this.element.style('background-color', '#ffff00');
    this.element.style('padding', '5px');
    this.element.style('border-which', '2px');
    this.element.style('border-style', 'solid');
    // this.element.style('maxWidth', '1-0px');
    this.element.style('border-color', '#3f3f3f');
    this.element.style('border-radius', '5px');
  }

  defaultEvents(fn) {
    this.element.mousePressed(() => {
      fn({ element: this.element, data: this.data });
    });
  }

  selfDestroy() {
    this.element.remove();
  }

  getNodeWidth() {
    const elementWidth = this.element.elt.getBoundingClientRect().width;
    return elementWidth;
  }

  getNodeHeight() {
    const elementHeight = this.element.elt.getBoundingClientRect().height;
    return elementHeight;
  }

  setBorderColor(borderColor) {
    this.element.style('border-color', borderColor);
  }

  setBackgroundColor(bacjgroundColor) {
    this.element.style('background-color', bacjgroundColor);
  }

  setSize(width, height) {
    this.element.style('width', width);
    this.element.style('height', height);
  }

  colorizeTick(color) {
    switch (color) {
      case 'purple':
        break;
      case 'green':
        break;
    }
  }

  setX(x) {
    this.element.position(x, this.element.position.y);
  }
}
