export class Line {
  constructor(start, end, optional) {
    this.start = start;
    this.end = end;
  }

  createLine(p5) {
    this.element = p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}
