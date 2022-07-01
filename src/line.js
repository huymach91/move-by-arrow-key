export class Line {
  constructor(start, end, optional) {
    this.start = start;
    this.end = end;
    this.optional = optional || { isBezierCurve: false, style: 'solid' };
  }

  createLine(p5) {
    const ctx = p5.drawingContext;
    const optional = this.optional;

    p5.push();
    p5.strokeWeight(2);
    p5.stroke('#2b78e4');

    if (optional.style === 'dash') {
      ctx.setLineDash([2, 10, 2, 10]);
    }
    
    if (this.optional.isBezierCurve) {
      p5.beginShape();
      p5.noFill();
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
    p5.pop();
  }
}
