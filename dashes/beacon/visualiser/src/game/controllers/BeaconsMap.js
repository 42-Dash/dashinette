import CanvasController from "./Canvas.js";

/**
 * @class This class encapsulate all the location information that a map holds.
 */
class MapInformation {
  constructor() {
    /** @property {number} squareSize The size of a square in the map in pixel. */
    this.squareSize = 0;
    /** @property {number} squaresDistance The distance between two squares in the map as pixel. */
    this.squaresDistance = 0;
    /** @property {number} offsetPercentage The percentage of the square size that is used as offset. */
    this.offsetPercentage = 0.0;
    /** @property {number} leftPadding The left padding of the map in pixel */
    this.leftPadding = 0;
    /** @property {number} UpPadding The up padding of the map in pixel */
    this.UpPadding = 0;
  }

  /**
   * @brief Refreshes the information of the map.
   */
  refresh(mapRowsCount, mapColumnsCount, mapWidth, mapHeight) {
    // When the aspect ratio is > 1, it is landscape, otherwise it is portrait.
    const mapAspectRatio = mapColumnsCount / mapRowsCount;
    const screenAspectRatio = mapWidth / mapHeight;
    this.leftPadding = 0;
    this.UpPadding = 0;
    if (mapAspectRatio < screenAspectRatio) {
      // Landscape, the height of the map stays the same.
      this.squareSize = mapHeight / mapRowsCount;
      this.leftPadding = (mapWidth - mapColumnsCount * this.squareSize) / 2;
    } else {
      // Portrait, the width of the map stays the same.
      this.squareSize = mapWidth / mapColumnsCount;
      this.UpPadding = (mapHeight - mapRowsCount * this.squareSize) / 2;
    }
    this.squaresDistance = this.squareSize * (1 + this.offsetPercentage);
  }

  /**
   * Calculates the coordinates of a square given its row and column index.
   * @param {number} i the row index of the square.
   * @param {number} j the column index of the square.
   * @returns An object containing the coordinates of the square.
   */
  squareCoordinates(i, j) {
    const offsetPercentagePlusOne = 1 + this.offsetPercentage;
    return {
      x: j * offsetPercentagePlusOne * this.squareSize + this.leftPadding,
      y: i * offsetPercentagePlusOne * this.squareSize + this.UpPadding,
    };
  }

  /**
   * Calculates the coordinates of the center of a square given its row and column index.
   * @param {number} i the row index of the square.
   * @param {number} j the column index of the square.
   * @returns An object containing the coordinates of the center of the square.
   */
  squareCenterCoordinates(i, j) {
    const squareCoordinates = this.squareCoordinates(i, j);
    return {
      x: squareCoordinates.x + this.squareSize / 2,
      y: squareCoordinates.y + this.squareSize / 2,
    };
  }
}

/**
 * @class This class is responsible for rendering the map.
 */
export default class BeaconsMapController extends CanvasController {
  constructor(mapArray, beacon_sizes) {
    super(beacon_sizes);
    this.mapArray = mapArray;
    this.pulse = 15;
    this.max = 2.5;
    this.size = 1;
    this.information = new MapInformation();
    this.routerCount = this.calcRouter();
  }

  calcRouter() {
    // wrong this.json in setup
    let starCount = 0;
    for (let row of this.mapArray) {
      starCount += row.split("*").length - 1;
    }
    return starCount;
  }

  updateJson(newMapArray) {
    this.mapArray = newMapArray;
    this.routerCount = this.calcRouter();
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
    this.#drawRookieMap(this.offsetPercentage);
  }

  get mapColumnsCount() {
    return this.mapArray[0].length;
  }

  get mapRowsCount() {
    return this.mapArray.length;
  }

  get beacons() {
    return this.beacon_sizes;
  }

  /**
   * @param {number} value The percentage of the square size that is used as offset.
   */
  set offsetPercentage(value) {
    this.information.offsetPercentage = value;
  }

  #calcStrokeWeight() {
    return this.information.squareSize / 2 > 10
      ? 10
      : this.information.squareSize / 2;
  }

  #pulse() {
    return this.#calcStrokeWeight() * this.size;
  }

  #drawBeacons(x, y, strokeWeight) {
    this.p5.stroke("white");
    this.p5.strokeWeight(strokeWeight);
    this.p5.point(x, y);
    if (this.routerCount < 50) {
      this.p5.noStroke();
      this.p5.circle(x, y, this.#pulse());
    }
  }

  #drawRookieMap() {
    this.information.refresh(
      this.mapRowsCount,
      this.mapColumnsCount,
      this.width,
      this.height,
    );

    let pos = this.information.squareCoordinates(0, 0);
    this.p5.rect(
      pos.x,
      pos.y,
      this.information.squareSize * this.mapColumnsCount,
      this.information.squareSize * this.mapRowsCount,
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
}
