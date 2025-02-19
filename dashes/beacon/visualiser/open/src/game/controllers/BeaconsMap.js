import CanvasController from "./Canvas.js";
import MapUtils from "./MapUtils.js";

/**
 * @class BeaconsMapController
 * @brief Manages and renders the game map and beacon animation.
 */
export default class BeaconsMapController extends CanvasController {
  static PULSE_SPEED = 15; // Frames per second
  static MAX_PULSE_SCALE = 2.5; // Max size multiplier for pulsing effect
  static STROKE_WEIGHT = 1; // Weight of map border

  constructor(mapArray, beaconSizes) {
    super();
    this._beaconSizes = beaconSizes;
    this._mapArray = mapArray;
    this._pulseScale = 1; // Controls the beacon pulsing effect
    this._mapUtils = new MapUtils();
    this._mapsOrder = [0, 1, 2, 3];
  }

  setMapsOrder(mapsOrder) {
    this._mapsOrder = mapsOrder;
  }

  updateBeacons(newBeacons) {
    this._beaconSizes = newBeacons;
  }

  getBeacons() {
    return this._beaconSizes;
  }

  get mapUtils() {
    return this._mapUtils;
  }

  updateMaps(newMapArray) {
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
    return this._mapArray[0][0].length * 2;
  }

  #getRowsCount() {
    return this._mapArray[0].length * 2;
  }

  #calcStrokeWeight() {
    return Math.min(this._mapUtils.getSquareSize() / 2, 10);
  }

  #drawMap(order = this._mapsOrder) {
    this._mapUtils.refresh(
      this.#getRowsCount(),
      this.#getColumnsCount(),
      this.width,
      this.height,
    );

    const shuffledMaps = this.mergeShuffledMaps(order);

    this.#drawTerrains(shuffledMaps);
    this.#drawBeacons(shuffledMaps);
    this.#drawGrid();
  }

  #drawGrid() {
    this._p5Instance.strokeWeight(BeaconsMapController.STROKE_WEIGHT);
    this._p5Instance.stroke("white");

    const { x: left, y: upper } = this._mapUtils.squareCoordinates(0, 0);
    const { x: right, y: lower } = this._mapUtils.squareCoordinates(
      this.#getRowsCount(),
      this.#getColumnsCount(),
    );

    const lines = [
      // horizontal lines
      [left, upper, right, upper],
      [left, (lower + upper) / 2, right, (lower + upper) / 2],
      [left, lower, right, lower],
      // vertical lines
      [left, upper, left, lower],
      [(left + right) / 2, upper, (left + right) / 2, lower],
      [right, upper, right, lower],
    ];

    for (const [x, y, xx, yy] of lines) {
      this._p5Instance.line(x, y, xx, yy);
    }
  }

  #drawBeacons(surface) {
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
        if (surface[i][j] === "*") {
          const { x, y } = this._mapUtils.squareCenterCoordinates(i, j);
          this.#drawBeacon(x, y, strokeWeight);
        }
      }
    }
  }

  #drawBeacon(x, y) {
    this._p5Instance.stroke("white");
    this._p5Instance.point(x, y);

    this._p5Instance.noStroke();
    this._p5Instance.circle(x, y, this.#pulse());
  }

  #pulse() {
    return this.#calcStrokeWeight() * this._pulseScale;
  }

  #drawTerrains(shuffledMaps) {
    this._p5Instance.strokeWeight(0);

    for (let i = 0; i < this.#getRowsCount(); i++) {
      for (let j = 0; j < this.#getColumnsCount(); j++) {
        const color = this._mapUtils.getTerrainColor(shuffledMaps[i][j]);
        this.#drawTerrain(i, j, color);
      }
    }
  }

  #drawTerrain(row, col, color) {
    const { x, y } = this._mapUtils.squareCoordinates(row, col);
    const squareSize = this._mapUtils.getSquareSize();

    this._p5Instance.fill(color.r, color.g, color.b);
    this._p5Instance.rect(x, y, squareSize);
  }

  mergeShuffledMaps(order) {
    let resultMap = [];

    for (let row = 0; row < this.#getRowsCount() / 2; row++) {
      resultMap.push(
        this._mapArray[order[0]][row] + this._mapArray[order[1]][row],
      );
    }

    for (let row = 0; row < this.#getRowsCount() / 2; row++) {
      resultMap.push(
        this._mapArray[order[2]][row] + this._mapArray[order[3]][row],
      );
    }

    return resultMap;
  }

  #updatePulseEffects() {
    this._pulseScale += 0.1;
    if (this._pulseScale >= BeaconsMapController.MAX_PULSE_SCALE) {
      this._pulseScale = 1;
    }
  }
}
