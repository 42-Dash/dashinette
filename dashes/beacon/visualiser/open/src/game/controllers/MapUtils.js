/**
 * @class MapUtils
 * @brief Handles map-related calculations, including square sizes, distances, and positions.
 */
export default class MapUtils {
  static TERRAIN_GRADIENT = {
    "*": { r: 195, g: 55, b: 99 },
    1: { r: 183, g: 47, b: 105 },
    2: { r: 170, g: 41, b: 111 },
    3: { r: 155, g: 38, b: 115 },
    4: { r: 138, g: 37, b: 119 },
    5: { r: 120, g: 37, b: 121 },
    6: { r: 101, g: 38, b: 122 },
    7: { r: 80, g: 38, b: 121 },
    8: { r: 58, g: 39, b: 118 },
    9: { r: 29, g: 38, b: 114 },
  };

  constructor() {
    this._squareSize = 0;
    this._leftPadding = 0;
    this._upPadding = 0;
  }

  getTerrainColor(terrain) {
    return MapUtils.TERRAIN_GRADIENT[terrain];
  }

  getSquareSize() {
    return this._squareSize;
  }

  getLeftPadding() {
    return this._leftPadding;
  }

  getUpPadding() {
    return this._upPadding;
  }

  refresh(mapRowsCount, mapColumnsCount, mapWidth, mapHeight) {
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
  }

  /**
   * Calculates the coordinates of a square given its row and column index.
   * @param {number} row the row index of the square.
   * @param {number} col the column index of the square.
   * @returns An object containing the coordinates of the square.
   */
  squareCoordinates(row, col) {
    return {
      x: col * this._squareSize + this._leftPadding,
      y: row * this._squareSize + this._upPadding,
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
