import CanvasController from "./Canvas.js";
import SingletonMapUtils from "./MapUtils.js";

/**
 * @class BeaconsMapController
 * @brief Manages and renders the game map and beacon animation.
 */
export default class BeaconsMapController extends CanvasController {
  static PULSE_SPEED = 15; // Frames per second
  static MAX_PULSE_SCALE = 2.5; // Max size multiplier for pulsing effect
  static STROKE_WEIGHT = 2; // Weight of map border

  constructor(mapArray, beaconSizes) {
    super();
    this._beaconSizes = beaconSizes;
    this._mapArray = mapArray;
    this._pulseScale = 1; // Controls the beacon pulsing effect
    this._mapUtils = new SingletonMapUtils();
  }

  updateBeacons(newBeacons) {
    this._beaconSizes = newBeacons;
  }

  getBeacons() {
    return this._beaconSizes;
  }

  updateJson(newMapArray) {
    this._mapArray = newMapArray;
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(BeaconsMapController.PULSE_SPEED);
  }

  draw() {
    this.#updatePulseEffects();
    this._p5Instance.clear();
    this._p5Instance.stroke([10, 10, 40]);
    this._p5Instance.noStroke();
    this._p5Instance.fill(0);
    this.#drawMap();
  }

  getBoardLimits() {
    return {
      left: this._mapUtils.getLeftPadding(),
      right:
        this._mapUtils.getLeftPadding() +
        this._mapUtils.getSquareSize() * this.#getColumnsCount(),
      top: this._mapUtils.getUpPadding(),
      bottom:
        this._mapUtils.getUpPadding() +
        this._mapUtils.getSquareSize() * this.#getRowsCount(),
    };
  }

  #getColumnsCount() {
    return this._mapArray[0].length;
  }

  #getRowsCount() {
    return this._mapArray.length;
  }

  #calcStrokeWeight() {
    return Math.min(this._mapUtils.getSquareSize() / 2, 10);
  }

  #pulse() {
    return this.#calcStrokeWeight() * this._pulseScale;
  }

  #drawBeacons(x, y) {
    this._p5Instance.stroke("white");
    this._p5Instance.point(x, y);

    this._p5Instance.noStroke();
    this._p5Instance.circle(x, y, this.#pulse());
  }

  #drawMap() {
    this._mapUtils.refresh(
      this.#getRowsCount(),
      this.#getColumnsCount(),
      this.width,
      this.height,
    );

    this._p5Instance.strokeWeight(BeaconsMapController.STROKE_WEIGHT);
    this._p5Instance.stroke("white");
    this._p5Instance.fill(1);

    let pos = this._mapUtils.squareCoordinates(0, 0);
    this._p5Instance.rect(
      pos.x,
      pos.y,
      this._mapUtils.getSquareSize() * this.#getColumnsCount(),
      this._mapUtils.getSquareSize() * this.#getRowsCount(),
    );

    let strokeWeight = this.#calcStrokeWeight();
    this._p5Instance.strokeWeight(strokeWeight);
    this._p5Instance.fill(
      255,
      255,
      255,
      255 * (BeaconsMapController.MAX_PULSE_SCALE - this._pulseScale),
    );

    for (let i = 0; i < this.#getRowsCount(); i++) {
      for (let j = 0; j < this.#getColumnsCount(); j++) {
        if (this._mapArray[i][j] === "*") {
          const { x, y } = this._mapUtils.squareCenterCoordinates(i, j);
          this.#drawBeacons(x, y, strokeWeight);
        }
      }
    }
  }

  #updatePulseEffects() {
    this._pulseScale += 0.1;
    if (this._pulseScale >= BeaconsMapController.MAX_PULSE_SCALE) {
      this._pulseScale = 1;
    }
  }
}
