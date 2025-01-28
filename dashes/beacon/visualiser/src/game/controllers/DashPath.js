import P5CanvasController from "./p5Canvas.js";

export default class DashPathController extends P5CanvasController {
  constructor(jsonPath, dashMap, color) {
    super(jsonPath);
    this.dashMap = dashMap;
    this.color = color;

    this.growthSpeed = 20;
    this.circles = [];
    this.started = false;

    let trimmed = this.json.replace(/\|$/, "");
    const coordinatePairs = trimmed.split("|");
    coordinatePairs.forEach((pair) => {
      const [x, y] = pair.split(",").map(Number);
      this.circles.push({
        x: x,
        y: y,
      });
    });

    this.circle_sizes = new Array(this.circles.length).fill(1);
  }

  setup() {
    this.p5.createCanvas(this.width, this.height, this.p5Canvas);
    this.p5.frameRate(30);
    this.p5.noLoop();
  }

  calcStrokeWeight() {
    let strokeWeight = this.dashMap.information.squareSize / 10;
    if (strokeWeight < 5) {
      strokeWeight = 5;
    }
    return strokeWeight;
  }

  isSmaller(array1, array2) {
    if (array1.length != array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] < array2[i]) {
        return true;
      }
    }
    return false;
  }

  draw() {
    if (!this.started) {
      return;
    }

    this.p5.clear();
    this.p5.stroke(this.color.r, this.color.g, this.color.b);

    let strokeWeight = this.calcStrokeWeight();
    this.circles.forEach((out, index) => {
      let pos = this.dashMap.information.squareCenterCoordinates(out.x, out.y);
      this.p5.fill(this.color.r, this.color.g, this.color.b, 50);
      this.p5.strokeWeight(strokeWeight / 4);
      this.p5.circle(pos.x, pos.y, this.circle_sizes[index]);
      this.p5.strokeWeight(strokeWeight);
      this.p5.circle(pos.x, pos.y, 5);
      if (this.circle_sizes[index] < this.beacons[index]) {
        this.circle_sizes[index] += this.beacons[index] / this.growthSpeed;
      }
    });

    if (!this.isSmaller(this.circle_sizes, this.beacons)) {
      this.p5.noLoop();
      this.started = false;
    }
  }

  onRedraw() {
    this.#reset();
    this.p5.loop();
  }

  get beacons() {
    return this.dashMap.beacons.map(
      (element) => element * this.dashMap.information.squareSize
    );
  }
  get squaresDistance() {
    return this.dashMap.information.squaresDistance;
  }

  start() {
    this.started = true;
    this.p5.loop();
  }

  clear() {
    this.started = false;
    this.#reset();
    this.p5.noLoop();
  }

  #reset() {
    this.p5.clear();
    this.circle_sizes = new Array(this.circles.length).fill(1);
  }
}
