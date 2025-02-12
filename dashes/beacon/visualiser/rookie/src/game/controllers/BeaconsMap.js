import CanvasController from "./Canvas.js";

class MapInformation {
  constructor() {
    // The size of a square in the map in pixel.
    this._squareSize = 0;
    // The distance between two squares in the map as pixel.
    this._squaresDistance = 0;
    // The percentage of the square size that is used as offset.
    this._offsetPercentage = 0.0;
    // The left padding of the map in pixel
    this._leftPadding = 0;
    // The up padding of the map in pixel
    this._upPadding = 0;
    this._frameSize = 2;
  }

  refresh(mapRowsCount, mapColumnsCount, mapWidth, mapHeight) {
    // When the aspect ratio is > 1, it is landscape, otherwise it is portrait.
    const mapAspectRatio = mapColumnsCount / mapRowsCount;
    const screenAspectRatio = mapWidth / mapHeight;
    this._leftPadding = 0;
    this._upPadding = 0;
    if (mapAspectRatio < screenAspectRatio) {
      // Landscape, the height of the map stays the same.
      this._squareSize = mapHeight / mapRowsCount;
      this._leftPadding = (mapWidth - mapColumnsCount * this._squareSize) / 2;
    } else {
      // Portrait, the width of the map stays the same.
      this._squareSize = mapWidth / mapColumnsCount;
      this._upPadding = (mapHeight - mapRowsCount * this._squareSize) / 2;
    }
    this._squaresDistance = this._squareSize * (1 + this._offsetPercentage);
  }

  /**
   * Calculates the coordinates of a square given its row and column index.
   * @param {number} row the row index of the square.
   * @param {number} col the column index of the square.
   * @returns An object containing the coordinates of the square.
   */
  squareCoordinates(row, col) {
    const offsetPercentagePlusOne = 1 + this._offsetPercentage;
    return {
      x: col * offsetPercentagePlusOne * this._squareSize + this._leftPadding,
      y: row * offsetPercentagePlusOne * this._squareSize + this._upPadding,
    };
  }

  /**
   * Calculates the coordinates of the center of a square given its row and column index.
   * @param {number} row the row index of the square.
   * @param {number} col the column index of the square.
   * @returns An object containing the coordinates of the center of the square.
   */
  squareCenterCoordinates(row, col) {
    const squareCoordinates = this.squareCoordinates(row, col);
    return {
      x: squareCoordinates.x + this._squareSize / 2,
      y: squareCoordinates.y + this._squareSize / 2,
    };
  }
}

/**
 * @class This class is responsible for rendering the map.
 */
export default class BeaconsMapController extends CanvasController {
  constructor(mapArray, beaconSizes) {
    super(beaconSizes);
    this.mapArray = mapArray;
    this.pulse = 15;
    this.max = 2.5;
    this.size = 1;
    this.information = new MapInformation();
  }

  updateJson(newMapArray) {
    this.mapArray = newMapArray;
  }

  setup() {
    this.p5.createCanvas(this.width, this.height, this.p5Canvas);
    this.p5.frameRate(this.pulse);
  }

  draw() {
    this.size += 0.1;
    if (this.size >= this.max) {
      this.size = 1;
    }

    this.p5.clear();
    this.p5.stroke([10, 10, 40]);
    this.p5.noStroke();

    this.p5.fill(0);
    this.#drawMap();
  }

  get mapColumnsCount() {
    return this.mapArray[0].length;
  }

  get mapRowsCount() {
    return this.mapArray.length;
  }

  get beacons() {
    return this.beaconSizes;
  }

  /**
   * @param {number} value The percentage of the square size that is used as offset.
   */
  set offsetPercentage(value) {
    this.information._offsetPercentage = value;
  }

  #calcStrokeWeight() {
    return Math.min(this.information._squareSize / 2, 10);
  }

  #pulse() {
    return this.#calcStrokeWeight() * this.size;
  }

  #drawBeacons(x, y) {
    this.p5.stroke("white");
    this.p5.point(x, y);

    this.p5.noStroke();
    this.p5.circle(x, y, this.#pulse());
  }

  #drawMap() {
    this.information.refresh(
      this.mapRowsCount,
      this.mapColumnsCount,
      this.width,
      this.height,
    );

    this.p5.strokeWeight(this.information._frameSize);
    this.p5.stroke("white");
    this.p5.fill(1);

    let pos = this.information.squareCoordinates(0, 0);
    this.p5.rect(
      pos.x,
      pos.y,
      this.information._squareSize * this.mapColumnsCount,
      this.information._squareSize * this.mapRowsCount,
    );

    let strokeWeight = this.#calcStrokeWeight();
    this.p5.strokeWeight(strokeWeight);
    this.p5.fill(255, 255, 255, 255 * (this.max - this.size));

    for (let i = 0; i < this.mapRowsCount; i++) {
      for (let j = 0; j < this.mapColumnsCount; j++) {
        const value = this.mapArray[i][j];
        if (value === "*") {
          const { x, y } = this.information.squareCenterCoordinates(i, j);
          this.#drawBeacons(x, y, strokeWeight);
        }
      }
    }
  }

  boardLimits() {
    return {
      left: this.information._leftPadding,
      right:
        this.information._leftPadding +
        this.information._squareSize * this.mapColumnsCount,
      top: this.information._upPadding,
      bottom:
        this.information._upPadding +
        this.information._squareSize * this.mapRowsCount,
    };
  }
}
