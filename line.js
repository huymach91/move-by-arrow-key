export class Line {
  constructor(start, end, optional) {
    this.start = start;
    this.end = end;
    this.optional = optional || { isBezierCurve: false, style: 'solid' };
  }

  createLine(p5) {
    p5.strokeWeight(2);
    p5.stroke('#2b78e4');
    if (this.optional.style === 'dotted') {
      p5.drawingContext.beginPath();
      p5.drawingContext.setLineDash([5, 10]);
      p5.drawingContext.closePath();
    }
    if (this.optional.isBezierCurve) {
      p5.noFill();
      p5.beginShape();
      p5.vertex(this.start.x, this.start.y); // first point
      p5.bezierVertex(
        this.start.x,
        this.start.y,
        this.start.x + 10,
        this.start.y + 60,
        this.end.x,
        this.end.y
      );
      p5.endShape();
    } else {
      this.element = p5.line(
        this.start.x,
        this.start.y,
        this.end.x,
        this.end.y
      );
    }
  }
}
