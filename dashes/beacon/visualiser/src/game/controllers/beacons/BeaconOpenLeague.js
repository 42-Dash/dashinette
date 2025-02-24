import CanvasController from "../CanvasBase.js";
import BeaconsMapOpenLeagueController from "../maps/MapOpenLeague.js";
import SingletonMapUtils from "../maps/MapUtils.js";

/**
 * @class BeaconOpenLeagueController
 * @brief Manages the animation of beacons expanding on a map.
 */
export default class BeaconOpenLeagueController extends CanvasController {
  static GROWTH_SPEED = 50; // speed of beacons expansion
  static MIN_BEACON_DIAMETER = 10;
  static MIN_STROKE_WEIGHT = 5;

  constructor(output, mapController, color) {
    super();
    this._mapController = mapController;
    this._color = color;
    this._mapUtils = new SingletonMapUtils();
    this._circleCoordinates = [];
    this._isStarted = false;
    this._mapOrder = [];

    this.#parseOutput(output);
    this._circleSizes = new Array(this._circleCoordinates.length).fill(1);
  }

  getMapOrder() {
    return this._mapOrder;
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

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(30);
    this._p5Instance.noLoop();
  }

  onRedraw() {
    this.#reset();
    this._p5Instance.loop();
  }

  draw() {
    if (!this._isStarted) {
      return;
    }

    this._p5Instance.clear();
    this._p5Instance.stroke(this._color.r, this._color.g, this._color.b);
    const targetSizes = this.#getBeaconTargetSizes();
    const strokeWeight = this.#calcStrokeWeight();

    this._circleCoordinates.forEach((circle, index) => {
      let pos = this._mapUtils.squareCenterCoordinates(circle.x, circle.y);
      this._p5Instance.fill(this._color.r, this._color.g, this._color.b, 50);

      const radius =
        this._circleSizes[index] + this._mapUtils.getSquareSize() / 2;
      const [left, top, right, bottom] = this.#calculateBoundaries(pos, radius);
      this._p5Instance.strokeWeight(strokeWeight / 4);
      this._p5Instance.rect(
        left,
        top,
        right - left,
        bottom - top,
        BeaconsMapOpenLeagueController.STROKE_WEIGHT,
      );

      this._p5Instance.strokeWeight(this.#calculateBeaconDiameter());
      this._p5Instance.circle(pos.x, pos.y, 1);

      if (this._circleSizes[index] < targetSizes[index]) {
        this._circleSizes[index] +=
          targetSizes[index] / BeaconOpenLeagueController.GROWTH_SPEED;
      }
    });

    if (!this.#hasGrowingBeacons()) {
      this._p5Instance.noLoop();
      this._isStarted = false;
    }
  }

  #getBeaconTargetSizes() {
    const gameMap = this._mapUtils.mergeShuffledMaps(
      this._mapController.getMaps(),
      this._mapOrder,
    );

    const terrains = this._circleCoordinates.map((point) =>
      Number(gameMap[point.x][point.y]),
    );

    const targetSizes = this._mapController
      .getBeacons()
      .map((element, index) => terrains[index] + element);

    return targetSizes.map(
      (element) => element * this._mapUtils.getSquareSize(),
    );
  }

  #hasGrowingBeacons() {
    const targetSizes = this.#getBeaconTargetSizes();

    if (this._circleSizes.length !== targetSizes.length) {
      return false;
    }

    return this._circleSizes.some((size, i) => size < targetSizes[i]);
  }

  #calcStrokeWeight() {
    return Math.max(
      this._mapUtils.getSquareSize() / 10,
      BeaconOpenLeagueController.MIN_STROKE_WEIGHT,
    );
  }

  #calculateBeaconDiameter() {
    return Math.min(
      this._mapUtils.getSquareSize() / 2,
      BeaconOpenLeagueController.MIN_BEACON_DIAMETER,
    );
  }

  #calculateBoundaries(pos, radius) {
    const {
      left: screenLeftBorder,
      right: screenRightBorder,
      top: screenTopBorder,
      bottom: screenBottomBorder,
    } = this._mapController.getBoardLimits();

    return [
      Math.max(pos.x - radius, screenLeftBorder),
      Math.max(pos.y - radius, screenTopBorder),
      Math.min(pos.x + radius, screenRightBorder),
      Math.min(pos.y + radius, screenBottomBorder),
    ];
  }

  #getSquaresDistance() {
    return this._mapUtils.getSquareSize();
  }

  #reset() {
    this._p5Instance.clear();
    this._circleSizes = new Array(this._circleCoordinates.length).fill(1);
  }

  #parseOutput(output) {
    const mapOrder = output.substring(0, 4);
    const beaconCoordinates = output.substring(5, output.length);

    this._mapOrder = mapOrder.split("").map((chr) => Number(chr) - 1);
    this._circleCoordinates = beaconCoordinates
      .replace(/\|$/, "")
      .split("|")
      .map((pair) => {
        const [x, y] = pair.split(",").map(Number);
        return { x, y };
      });
  }
}
