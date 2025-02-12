import CanvasController from "./Canvas.js";
import MapUtils from "./MapUtils.js";

/**
 * @class This class is responsible for rendering the map.
 */
export default class BeaconsMapController extends CanvasController {
  constructor(mapArray, beaconSizes) {
    super(beaconSizes);
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
    this.p5.createCanvas(this.width, this.height, this.p5Canvas);
    this.p5.frameRate(this._pulse);
  }

  draw() {
    this._size += 0.1;
    if (this._size >= this._max) {
      this._size = 1;
    }

    this.p5.clear();
    this.p5.stroke([10, 10, 40]);
    this.p5.noStroke();

    this.p5.fill(0);
    this.#drawMap();
  }

  get mapColumnsCount() {
    return this._mapArray[0].length;
  }

  get mapRowsCount() {
    return this._mapArray.length;
  }

  getBeacons() {
    return this.beaconSizes;
  }

  #calcStrokeWeight() {
    return Math.min(this._mapUtils.getSquareSize() / 2, 10);
  }

  #pulse() {
    return this.#calcStrokeWeight() * this._size;
  }

  #drawBeacons(x, y) {
    this.p5.stroke("white");
    this.p5.point(x, y);

    this.p5.noStroke();
    this.p5.circle(x, y, this.#pulse());
  }

  #drawMap() {
    this._mapUtils.refresh(
      this.mapRowsCount,
      this.mapColumnsCount,
      this.width,
      this.height,
    );

    this.p5.strokeWeight(this._mapUtils.getFrameSize());
    this.p5.stroke("white");
    this.p5.fill(1);

    let pos = this._mapUtils.squareCoordinates(0, 0);
    this.p5.rect(
      pos.x,
      pos.y,
      this._mapUtils.getSquareSize() * this.mapColumnsCount,
      this._mapUtils.getSquareSize() * this.mapRowsCount,
    );

    let strokeWeight = this.#calcStrokeWeight();
    this.p5.strokeWeight(strokeWeight);
    this.p5.fill(255, 255, 255, 255 * (this._max - this._size));

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
