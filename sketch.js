// Array.prototype.insert = function ( index, ...items ) {
//   this.splice( index, 0, ...items );
// };

let points = [];
let resetBtn, undoBtn, redoBtn;
let removedPoints = [];
let pointsDiv, buttonDiv;
let t;

const SIZE = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pointsDiv = createDiv();
  pointsDiv.position(10, 10);
  pointsDiv.style("color", "white");
  pointsDiv.style("display", "flex");
  pointsDiv.style("flex-direction", "column");

  t = 0;

  buttonDiv = createDiv();
  buttonDiv.position(0, windowHeight - 50);
  // labels
  resetBtn = createButton("Reset");
  undoBtn = createButton("Undo");
  redoBtn = createButton("Redo");

  // size
  resetBtn.size(SIZE + 50, SIZE);
  undoBtn.size(SIZE + 50, SIZE);
  redoBtn.size(SIZE + 50, SIZE);

  // add functions to each button
  resetBtn.mousePressed(resetArray);
  undoBtn.mousePressed(undoAction);
  redoBtn.mousePressed(redoAction);
}

function resetArray() {
  points = [];
  pointsDiv.html("");
}

function undoAction() {
  if (points.length == 0) {
    alert("First action undone");
    return;
  }
  removedPoints.push(points.pop());
}

function redoAction() {
  if (removedPoints.length == 0) {
    alert("Last action redone");
    return;
  }
  points.push(removedPoints.pop());
}

function mousePressed() {
  if(mouseY > height) return;
  for (let p of points) {
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 8) {
      p.moveVertex = true;
      return;
    }
  }
  points.push(new Point(mouseX, mouseY));
  // pointsDiv.html(
  //   `<div>p${points.length - 1}: (x: ${mouseX}, y: ${mouseY})</div>`,
  //   true
  // );
}

function mouseReleased() {
  for (let p of points) {
    p.moveVertex = false;
  }
}

function mouseDragged() {
  for (let p of points) {
    if (p.moveVertex) {
      p.x = mouseX;
      p.y = mouseY;
    }
  }
}

function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

function ncr(n, r) {
  den = factorial(n - r) * factorial(r);
  return factorial(n) / den;
}

function getBezierBasis(n, r, t) {
  return ncr(n, r) * t ** r * (1 - t) ** (n - r);
}

// function blendSpline(i, n, u) {
//   let xi;
//   if (i > n) {
//     xi = n-k+1;
//   } else if (i >= n && i <= n) {
//     xi = i - k + 1;
//   } else if (i < n) {
//     xi = 0;
//   }
//   let op1 = ((u - xi) * blendSpline(i, n-1, u)) / (xi + k - 1 - xi);
//   let op2 = ((xi + k - u) * blendSpline(i+1, k-1, u) / xi + k - xi + 1);
//   return op1 + op2;
// }

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function drawConvexHull(){
  setLineDash([5, 5]);
  line(points[0].x, points[0].y, points[1].x, points[1].y);
  line(points[1].x, points[1].y, points[2].x, points[2].y);
  line(points[2].x, points[2].y, points[3].x, points[3].y);
  line(points[3].x, points[3].y, points[0].x, points[0].y);
  setLineDash([0, 0]);
}
// const sqDist = (pointa, pointb) =>
//   (pointa.x - pointb.x) ** 2 + (pointa.y - pointb.y) ** 2;

function drawBasisFunctions(points) {
  let numPoints = points.length;
  let colors = [color(0, 100, 100), color(54, 100, 100), color(202, 100, 100), color(104, 100, 100), color(0, 255, 255)];
  for (let i = 0; i < numPoints; i++) {
    stroke(360 * i/points.length-1, 100, 100);
    strokeWeight(1);
    noFill();
    beginShape();
    for (let t = 0; t <= 1.0001; t += 0.01) {
      let basis = getBezierBasis(points.length-1, i, t);
      let x = width-100 + 100 * t;
      let y = height-100 + 100 * (1 - basis);
      vertex(x, y);
    }
    endShape();
  }
}

function draw() {
  colorMode(HSB);
  background(207, 44, 9.8);
  noFill();

  // if (t < 1.00001) {
  //   t += 0.004;
  // } else {
  //   t = 0;
  // }

  beginShape();
  for (t = 0; t < 1.0001; t += 0.01) {
  let x = 0,
    y = 0,
    basisFunction = 0;
  // beginShape();
  for (let p in points) {
    stroke(360 * p/points.length-1, 100, 100);
    points[p].draw();
    strokeWeight(2);
    // vertex(points[p].x, points[p].y);
    bSpline = getBezierBasis(points.length-1, parseInt(p), t);
    x += points[p].x * bSpline;
    y += points[p].y * bSpline;
  }
  // endShape();
  strokeWeight(2);
  stroke(255);
  vertex(x, y);
  }
  endShape();

  drawBasisFunctions(points);
}
