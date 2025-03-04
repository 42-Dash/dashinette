import CanvasController from "../CanvasBase.js";
import SingletonMapUtils from "./MapUtils.js";

/**
 * @class MapRookieLeague
 * @brief Manages and renders the game map and beacon animation.
 */
export default class MapRookieLeague extends CanvasController {
  static PULSE_SPEED = 15; // Frames per second
  static MAX_PULSE_SCALE = 2.5; // Max size multiplier for pulsing effect
  static STROKE_WEIGHT = 2; // Weight of map border

  constructor(mapArray, beaconSizes) {
    super();
    this._mapArray = mapArray;
    this._beaconSizes = beaconSizes;
    this._pulseScale = 1; // Controls the beacon pulsing effect
    this._mapUtils = new SingletonMapUtils();

    this._rows = this.#getRowsCount();
    this._cols = this.#getColumnsCount();
    this._beaconPulse = this._rows + this._cols < 100;
    this._bufferedMap = null;
  }

  getBeacons() {
    return this._beaconSizes;
  }

  updateLevel(newMapArray, newBeacons) {
    this._mapArray = newMapArray;
    this._beaconSizes = newBeacons;

    this._rows = this.#getRowsCount();
    this._cols = this.#getColumnsCount();
    this._beaconPulse = this._rows + this._cols < 100;

    this.#preRenderStaticMap();
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(MapRookieLeague.PULSE_SPEED);
    this._bufferedMap = this._p5Instance.createGraphics(
      this.width,
      this.height
    );
  }

  draw() {
    this.#updatePulseEffects();
    this._p5Instance.clear();
    this._mapUtils.refresh(this._rows, this._cols, this.width, this.height);

    if (
      this._bufferedMap.width !== this.width ||
      this._bufferedMap.height !== this.height
    ) {
      this.#preRenderStaticMap();
    }

    this._p5Instance.image(this._bufferedMap, 0, 0);

    if (this._beaconPulse) {
      this.#drawPulsingBeacons();
    }
  }

  getBoardLimits() {
    return {
      left: this._mapUtils.getLeftPadding(),
      right:
        this._mapUtils.getLeftPadding() +
        this._mapUtils.getSquareSize() * this._cols,
      top: this._mapUtils.getUpPadding(),
      bottom:
        this._mapUtils.getUpPadding() +
        this._mapUtils.getSquareSize() * this._rows,
    };
  }

  #drawPulsingBeacons() {
    this._p5Instance.fill(
      255,
      255,
      255,
      255 * (MapRookieLeague.MAX_PULSE_SCALE - this._pulseScale)
    );
    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        if (this._mapArray[row][col] === "*") {
          const { x, y } = this._mapUtils.squareCenterCoordinates(row, col);
          this.#drawBeacon(this._p5Instance, x, y, this.#pulse());
        }
      }
    }
  }

  #preRenderStaticMap() {
    this._bufferedMap.resizeCanvas(this.width, this.height);
    const pos = this._mapUtils.squareCoordinates(0, 0);

    this._bufferedMap.stroke("white");
    this._bufferedMap.fill(1);
    this._bufferedMap.rect(
      pos.x,
      pos.y,
      this._mapUtils.getSquareSize() * this._cols,
      this._mapUtils.getSquareSize() * this._rows
    );

    this._bufferedMap.strokeWeight(MapRookieLeague.STROKE_WEIGHT);
    this._bufferedMap.fill(255);

    const strokeWeight = this.#calcStrokeWeight();

    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        if (this._mapArray[row][col] === "*") {
          const { x, y } = this._mapUtils.squareCenterCoordinates(row, col);
          this.#drawBeacon(this._bufferedMap, x, y, strokeWeight);
        }
      }
    }
  }

  #drawBeacon(buffer, x, y, strokeWeight) {
    buffer.stroke("white");
    buffer.point(x, y);

    buffer.noStroke();
    buffer.circle(x, y, strokeWeight);
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

  #updatePulseEffects() {
    this._pulseScale += 0.1;
    if (this._pulseScale >= MapRookieLeague.MAX_PULSE_SCALE) {
      this._pulseScale = 1;
    }
  }
}
