export class Line {
  constructor(start, end, optional) {
    this.start = start;
    this.end = end;
  }

  createLine(p5) {
    p5.strokeWeight(3);
    p5.stroke('#2b78e4');
    this.element = p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}
