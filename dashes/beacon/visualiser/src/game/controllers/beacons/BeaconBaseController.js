import CanvasController from "../CanvasBase.js";
import SingletonMapUtils from "../maps/MapUtils.js";

/**
 * @class BeaconBaseController
 * @brief Manages the animation of beacons expanding on a map.
 */
export default class BeaconBaseController extends CanvasController {
  static GROWTH_SPEED = 30; // steps of beacons expansion
  static MIN_BEACON_CORE_DIAMETER = 10;
  static MIN_STROKE_WEIGHT = 5;
  static RECT_CORNER_RADIUS = 2;

  constructor(mapController, color) {
    super();
    this._mapController = mapController;
    this._color = color;
    this._mapUtils = new SingletonMapUtils();
    this._isStarted = false;

    this._circleCoordinates = [];
    this._targetSizes = [];
    this._beaconRadii = [];
  }

  init(circleCoordinates, targetSizes) {
    this._circleCoordinates = circleCoordinates;
    this._targetSizes = targetSizes;
    this._beaconRadii = new Array(this._circleCoordinates.length).fill(1);
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
    this.reset();
    this._p5Instance.noLoop();
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(30);
    this._p5Instance.noLoop();
  }

  onRedraw() {
    this.reset();
    this._p5Instance.loop();
  }

  reset() {
    this._p5Instance.clear();
    this._beaconRadii = new Array(this._circleCoordinates.length).fill(1);
  }

  draw() {
    if (!this._isStarted) return;

    this._p5Instance.clear();
    this._p5Instance.stroke(this._color.r, this._color.g, this._color.b);

    this.#drawBeacons();

    if (!this.#isAnyBeaconGrowing()) {
      this._p5Instance.noLoop();
      this._isStarted = false;
    }
  }

  #drawBeacons() {
    const targetRadii = this.#calculateTargetRadii();
    const strokeWeight = this.#calculateStrokeWeight();

    this._circleCoordinates.forEach((circle, index) => {
      this.#drawBeacon(circle, index, targetRadii[index], strokeWeight);
    });
  }

  #drawBeacon(circle, index, targetRadius, strokeWeight) {
    const pos = this._mapUtils.squareCenterCoordinates(circle.x, circle.y);
    const rad = this._beaconRadii[index] + this._mapUtils.getSquareSize() / 2;

    this._p5Instance.fill(this._color.r, this._color.g, this._color.b, 50);

    const [left, top, right, bottom] = this.#calculateBoundaries(pos, rad);
    this._p5Instance.strokeWeight(strokeWeight / 4);
    this._p5Instance.rect(
      left,
      top,
      right - left,
      bottom - top,
      BeaconBaseController.RECT_CORNER_RADIUS,
    );

    this._p5Instance.strokeWeight(this.#calculateBeaconCoreDiameter());
    this._p5Instance.circle(pos.x, pos.y, 1);

    this.#updateBeaconSize(index, targetRadius);
  }

  #updateBeaconSize(index, targetRadius) {
    if (this._beaconRadii[index] < targetRadius) {
      this._beaconRadii[index] +=
        targetRadius / BeaconBaseController.GROWTH_SPEED;
    }
  }

  #calculateTargetRadii() {
    return this._targetSizes.map(
      (element) => element * this._mapUtils.getSquareSize(),
    );
  }

  #isAnyBeaconGrowing() {
    const targetRadii = this.#calculateTargetRadii();
    if (this._beaconRadii.length !== targetRadii.length) return false;
    return this._beaconRadii.some((size, i) => size < targetRadii[i]);
  }

  #calculateStrokeWeight() {
    return Math.max(
      this._mapUtils.getSquareSize() / 10,
      BeaconBaseController.MIN_STROKE_WEIGHT,
    );
  }

  #calculateBeaconCoreDiameter() {
    return Math.min(
      this._mapUtils.getSquareSize() / 2,
      BeaconBaseController.MIN_BEACON_CORE_DIAMETER,
    );
  }

  #calculateBoundaries(pos, radius) {
    const { left, right, top, bottom } = this._mapController.getBoardLimits();

    return [
      Math.max(pos.x - radius, left),
      Math.max(pos.y - radius, top),
      Math.min(pos.x + radius, right),
      Math.min(pos.y + radius, bottom),
    ];
  }
}
