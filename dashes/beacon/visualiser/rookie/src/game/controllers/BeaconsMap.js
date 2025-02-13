import CanvasController from "./Canvas.js";
import MapUtils from "./MapUtils.js";

/**
 * @class This class is responsible for rendering the map.
 */
export default class BeaconsMapController extends CanvasController {
  constructor(mapArray, beaconSizes) {
    super();
    this._beaconSizes = beaconSizes;
    this._mapArray = mapArray;
    this._pulse = 15;
    this._max = 2.5;
    this._size = 1;
    this._mapUtils = new MapUtils();
  }

  get mapUtils() {
    return this._mapUtils;
  }

  updateJson(newMapArray) {
    this._mapArray = newMapArray;
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(this._pulse);
  }

  draw() {
    this._size += 0.1;
    if (this._size >= this._max) {
      this._size = 1;
    }

    this._p5Instance.clear();
    this._p5Instance.stroke([10, 10, 40]);
    this._p5Instance.noStroke();

    this._p5Instance.fill(0);
    this.#drawMap();
  }

  get mapColumnsCount() {
    return this._mapArray[0].length;
  }

  get mapRowsCount() {
    return this._mapArray.length;
  }

  updateBeacons(newBeacons) {
    this._beaconSizes = newBeacons;
  }

  getBeacons() {
    return this._beaconSizes;
  }

  #calcStrokeWeight() {
    return Math.min(this._mapUtils.getSquareSize() / 2, 10);
  }

  #pulse() {
    return this.#calcStrokeWeight() * this._size;
  }

  #drawBeacons(x, y) {
    this._p5Instance.stroke("white");
    this._p5Instance.point(x, y);

    this._p5Instance.noStroke();
    this._p5Instance.circle(x, y, this.#pulse());
  }

  #drawMap() {
    this._mapUtils.refresh(
      this.mapRowsCount,
      this.mapColumnsCount,
      this.width,
      this.height,
    );

    this._p5Instance.strokeWeight(this._mapUtils.getFrameSize());
    this._p5Instance.stroke("white");
    this._p5Instance.fill(1);

    let pos = this._mapUtils.squareCoordinates(0, 0);
    this._p5Instance.rect(
      pos.x,
      pos.y,
      this._mapUtils.getSquareSize() * this.mapColumnsCount,
      this._mapUtils.getSquareSize() * this.mapRowsCount,
    );

    let strokeWeight = this.#calcStrokeWeight();
    this._p5Instance.strokeWeight(strokeWeight);
    this._p5Instance.fill(255, 255, 255, 255 * (this._max - this._size));

    for (let i = 0; i < this.mapRowsCount; i++) {
      for (let j = 0; j < this.mapColumnsCount; j++) {
        const value = this._mapArray[i][j];
        if (value === "*") {
          const { x, y } = this._mapUtils.squareCenterCoordinates(i, j);
          this.#drawBeacons(x, y, strokeWeight);
        }
      }
    }
  }

  boardLimits() {
    return {
      left: this._mapUtils.getLeftPadding(),
      right:
        this._mapUtils.getLeftPadding() +
        this._mapUtils.getSquareSize() * this.mapColumnsCount,
      top: this._mapUtils.getUpPadding(),
      bottom:
        this._mapUtils.getUpPadding() +
        this._mapUtils.getSquareSize() * this.mapRowsCount,
    };
  }
}
