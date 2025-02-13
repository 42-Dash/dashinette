import CanvasController from "./Canvas.js";

export default class BeaconController extends CanvasController {
  constructor(path, mapController, color) {
    super();
    this._mapController = mapController;
    this._color = color;
    this._growthSpeed = 50;
    this._circles = [];
    this._isStarted = false;
    this.#initPoints(path);
    this._circleSizes = new Array(this._circles.length).fill(1);
  }

  #initPoints(path) {
    path
      .replace(/\|$/, "")
      .split("|")
      .forEach((pair) => {
        const [x, y] = pair.split(",").map(Number);
        this._circles.push({ x: x, y: y });
      });
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(30);
    this._p5Instance.noLoop();
  }

  calcStrokeWeight() {
    return Math.max(this._mapController.mapUtils.getSquareSize() / 10, 5);
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
    if (!this._isStarted) {
      return;
    }

    this._p5Instance.clear();
    this._p5Instance.stroke(this._color.r, this._color.g, this._color.b);

    let strokeWeight = this.calcStrokeWeight();
    this._circles.forEach((circle, index) => {
      let pos = this._mapController.mapUtils.squareCenterCoordinates(
        circle.x,
        circle.y,
      );
      this._p5Instance.fill(this._color.r, this._color.g, this._color.b, 50);

      const radius = this._circleSizes[index] + this.#getSquaresDistance() / 2;
      const [left, top, right, bottom] = this.#calculateBoundaries(pos, radius);
      this._p5Instance.strokeWeight(strokeWeight / 4);
      this._p5Instance.rect(
        left,
        top,
        right - left,
        bottom - top,
        this._mapController.mapUtils.getFrameSize(),
      );

      this._p5Instance.strokeWeight(this.#calculateBeaconDiameter());
      this._p5Instance.circle(pos.x, pos.y, 1);

      if (this._circleSizes[index] < this.beacons[index]) {
        this._circleSizes[index] += this.beacons[index] / this._growthSpeed;
      }
    });

    if (!this.isSmaller(this._circleSizes, this.beacons)) {
      this._p5Instance.noLoop();
      this._isStarted = false;
    }
  }

  #calculateBeaconDiameter() {
    return Math.min(this._mapController.mapUtils.getSquareSize() / 2, 10);
  }

  #calculateBoundaries(pos, radius) {
    const {
      left: screenLeftBorder,
      right: screenRightBorder,
      top: screenTopBorder,
      bottom: screenBottomBorder,
    } = this._mapController.boardLimits();

    const left = Math.max(pos.x - radius, screenLeftBorder);
    const top = Math.max(pos.y - radius, screenTopBorder);
    const right = Math.min(pos.x + radius, screenRightBorder);
    const bottom = Math.min(pos.y + radius, screenBottomBorder);
    return [left, top, right, bottom];
  }

  onRedraw() {
    this.#reset();
    this._p5Instance.loop();
  }

  get beacons() {
    return this._mapController
      .getBeacons()
      .map((element) => element * this._mapController.mapUtils.getSquareSize());
  }

  #getSquaresDistance() {
    return this._mapController.mapUtils.getSquaresDistance();
  }

  isStarted() {
    return this._isStarted;
  }

  start() {
    this._isStarted = true;
    this._p5Instance.loop();
  }

  clear() {
    this._isStarted = false;
    this.#reset();
    this._p5Instance.noLoop();
  }

  #reset() {
    this._p5Instance.clear();
    this._circleSizes = new Array(this._circles.length).fill(1);
  }
}
