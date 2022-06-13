export class Line {
  constructor(start, end, optional) {
    this.start = start;
    this.end = end;
  }

  createLine(p5) {
    p5.strokeWeight(3);
    p5.stroke('#2b78e4');
    // p5.fill('#2b78e4');
    // console.log(this.start.y, this.end.y);
    // let startX = this.start.x;
    // let startY = this.start.y;
    // while (startY <= this.end.y) {
    //   const point = p5.point(startX, startY);
    //   // startX += 5;
    //   startY += 15;
    // }
    // for (
    //   let x = this.start.x, y = this.start.y;
    //   x < this.end.x && y <= this.end.y;
    //   y = y + 10, x = x + 10
    // ) {
    //   const point = p5.point(x, y);
    // }
    this.element = p5.line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}
