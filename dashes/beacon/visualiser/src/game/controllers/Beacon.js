import CanvasController from "./Canvas.js";

export default class BeaconController extends CanvasController {
  constructor(path, dashMap, color) {
    super();
    this.dashMap = dashMap;
    this.color = color;
    this.growthSpeed = 50;
    this.circles = [];
    this.started = false;
    this.#initPoints(path);
    this.circle_sizes = new Array(this.circles.length).fill(1);
  }

  #initPoints(path) {
    path
      .replace(/\|$/, "")
      .split("|")
      .forEach((pair) => {
        const [x, y] = pair.split(",").map(Number);
        this.circles.push({ x: x, y: y });
      });
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
    if (array1.length !== array2.length) {
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
    this.circles.forEach((circle, index) => {
      let pos = this.dashMap.information.squareCenterCoordinates(
        circle.x,
        circle.y,
      );
      this.p5.fill(this.color.r, this.color.g, this.color.b, 50);

      const radius = this.circle_sizes[index] + this.squaresDistance / 2;
      const [left, top, right, bottom] = this.#calculateBoundaries(pos, radius);
      this.p5.strokeWeight(strokeWeight / 4);
      this.p5.rect(
        left,
        top,
        right - left,
        bottom - top,
        this.dashMap.information.frameSize,
      );

      this.p5.strokeWeight(this.#calculateBeaconDiameter());
      this.p5.circle(pos.x, pos.y, 1);

      if (this.circle_sizes[index] < this.beacons[index]) {
        this.circle_sizes[index] += this.beacons[index] / this.growthSpeed;
      }
    });

    if (!this.isSmaller(this.circle_sizes, this.beacons)) {
      this.p5.noLoop();
      this.started = false;
    }
  }

  #calculateBeaconDiameter() {
    return Math.min(this.dashMap.information.squareSize / 2, 10);
  }

  #calculateBoundaries(pos, radius) {
    const {
      left: screenLeftBorder,
      right: screenRightBorder,
      top: screenTopBorder,
      bottom: screenBottomBorder,
    } = this.dashMap.boardLimits();

    const left = Math.max(pos.x - radius, screenLeftBorder);
    const top = Math.max(pos.y - radius, screenTopBorder);
    const right = Math.min(pos.x + radius, screenRightBorder);
    const bottom = Math.min(pos.y + radius, screenBottomBorder);
    return [left, top, right, bottom];
  }

  onRedraw() {
    this.#reset();
    this.p5.loop();
  }

  get beacons() {
    return this.dashMap.beacons.map(
      (element) => element * this.dashMap.information.squareSize,
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
