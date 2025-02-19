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

  getMaps() {
    return this._mapArray;
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
        this._mapUtils.getSquareSize() * this.#getColsCount(),
      top: this._mapUtils.getUpPadding(),
      bottom:
        this._mapUtils.getUpPadding() +
        this._mapUtils.getSquareSize() * this.#getRowsCount(),
    };
  }

  #getColsCount() {
    return this._mapArray[0][0].length * 2;
  }

  #getRowsCount() {
    return this._mapArray[0].length * 2;
  }

  #calcStrokeWeight() {
    return Math.min(this._mapUtils.getSquareSize() / 2, 10);
  }

  #getOffsets() {
    const rows = this.#getRowsCount() / 2;
    const cols = this.#getColsCount() / 2;

    return [
      this._mapUtils.squareCoordinates(0, 0),
      this._mapUtils.squareCoordinates(0, cols),
      this._mapUtils.squareCoordinates(rows, 0),
      this._mapUtils.squareCoordinates(rows, cols),
    ];
  }

  #drawMap(order = this._mapsOrder) {
    this._mapUtils.refresh(
      this.#getRowsCount(),
      this.#getColsCount(),
      this.width,
      this.height,
    );

    const offsets = this.#getOffsets();

    for (let iter = 0; iter < 4; ++iter) {
      this.#drawTerrains(this._mapArray[order[iter]], offsets[iter]);
      this.#drawBeacons(this._mapArray[order[iter]], offsets[iter]);
      this.#drawGrid(offsets[iter]);
    }

    for (const offset of offsets) {
      this._p5Instance.ellipse(offset.x, offset.y, 10);
    }
  }

  #drawGrid(offset) {
    this._p5Instance.strokeWeight(BeaconsMapController.STROKE_WEIGHT);
    this._p5Instance.stroke("white");

    const width = (this._mapUtils.getSquareSize() * this.#getColsCount()) / 2;
    const height = (this._mapUtils.getSquareSize() * this.#getRowsCount()) / 2;

    const left = offset.x;
    const top = offset.y;
    const right = offset.x + width;
    const bottom = offset.y + height;

    const lines = [
      // horizontal lines
      [left, top, right, top],
      [left, bottom, right, bottom],
      // vertical lines
      [left, top, left, bottom],
      [right, top, right, bottom],
    ];

    for (const [x, y, xx, yy] of lines) {
      this._p5Instance.line(x, y, xx, yy);
    }
  }

  #drawBeacons(surface, offset) {
    let strokeWeight = this.#calcStrokeWeight();
    this._p5Instance.strokeWeight(strokeWeight);
    this._p5Instance.fill(
      255,
      255,
      255,
      255 * (BeaconsMapController.MAX_PULSE_SCALE - this._pulseScale),
    );

    for (let i = 0; i < this.#getRowsCount() / 2; i++) {
      for (let j = 0; j < this.#getColsCount() / 2; j++) {
        if (surface[i][j] === "*") {
          this.#drawBeacon(i, j, offset);
        }
      }
    }
  }

  #drawBeacon(row, col, offset) {
    const squareSize = this._mapUtils.getSquareSize();

    const x = offset.x + squareSize * col + squareSize / 2;
    const y = offset.y + squareSize * row + squareSize / 2;

    this._p5Instance.stroke("white");
    this._p5Instance.point(x, y);

    this._p5Instance.noStroke();
    this._p5Instance.circle(x, y, this.#pulse());
  }

  #pulse() {
    return this.#calcStrokeWeight() * this._pulseScale;
  }

  #drawTerrains(field, offset) {
    this._p5Instance.strokeWeight(0);

    for (let i = 0; i < this.#getRowsCount() / 2; i++) {
      for (let j = 0; j < this.#getColsCount() / 2; j++) {
        const color = this._mapUtils.getTerrainColor(field[i][j]);
        this.#drawTerrain(i, j, color, offset);
      }
    }
  }

  #drawTerrain(row, col, color, offset) {
    const squareSize = this._mapUtils.getSquareSize();

    const x = offset.x + squareSize * col;
    const y = offset.y + squareSize * row;

    this._p5Instance.fill(color.r, color.g, color.b);
    this._p5Instance.rect(x, y, squareSize);
  }

  #updatePulseEffects() {
    this._pulseScale += 0.1;
    if (this._pulseScale >= BeaconsMapController.MAX_PULSE_SCALE) {
      this._pulseScale = 1;
    }
  }
}
