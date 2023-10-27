class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    strokeWeight(8);
    point(this.x, this.y);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x >= width || this.x < 0) {
      this.dx *= -1;
    }

    if (this.y >= height || this.y < 0) {
      this.dy *= -1;
    }
  }
}
