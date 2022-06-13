export class Text {
  /**
   * create a text
   * @param {object} data - data is an object json
   * { text: string, x: number, y: number }
   */
  constructor(data) {
    this.data = data;
  }

  createText(p5) {
    p5.fill('#000');
    p5.textSize(25);
    p5.textStyle(p5.BOLD);
    this.element = p5.text(this.data.text, this.data.x, this.data.y);
  }
}
