export default class MapUtils {
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

  getSquareSize() {
    return this._squareSize;
  }

  getSquaresDistance() {
    return this._squaresDistance;
  }

  getLeftPadding() {
    return this._leftPadding;
  }

  getUpPadding() {
    return this._upPadding;
  }

  getFrameSize() {
    return this._frameSize;
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
