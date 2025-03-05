import GradientGenerator from "../../misc/GradientGenerator.js";
import SingletonMapUtils from "./MapUtils.js";

export default class SubMapController {
  constructor(terrainGrid) {
    this._p5Instance = null;
    this._mapUtils = new SingletonMapUtils();
    this._strokeWeight = 0;
    this._gradient = new GradientGenerator();

    this._terrainGrid = terrainGrid;
    this._cols = this._terrainGrid[0].length;
    this._rows = this._terrainGrid.length;

    this._bufferedMap = null;
  }

  getSize() {
    return {
      rows: this._rows,
      cols: this._cols,
    };
  }

  setup(p5Instance) {
    this._p5Instance = p5Instance;
    this._bufferedMap = this._p5Instance.createGraphics(0, 0);

    this.#preRenderStaticMap();
  }

  updateLevel(terrainGrid) {
    this._terrainGrid = terrainGrid;
    this._cols = this._terrainGrid[0].length;
    this._rows = this._terrainGrid.length;

    this.#preRenderStaticMap();
  }

  getTerrainGrid() {
    return this._terrainGrid;
  }

  render(mapPosition) {
    const bufferWidth = this._mapUtils.getSquareSize() * this._cols;
    const bufferHeight = this._mapUtils.getSquareSize() * this._rows;

    if (
      this._bufferedMap.width !== bufferWidth ||
      this._bufferedMap.height !== bufferHeight
    ) {
      this.#preRenderStaticMap();
    }

    this._p5Instance.image(this._bufferedMap, mapPosition.x, mapPosition.y);
  }

  #preRenderStaticMap() {
    const bufferWidth = this._mapUtils.getSquareSize() * this._cols;
    const bufferHeight = this._mapUtils.getSquareSize() * this._rows;

    this._bufferedMap.resizeCanvas(bufferWidth, bufferHeight);
    this._bufferedMap.clear();

    this.#renderTerrain();
    this.#renderBeacons();
    this.#renderGrid();
  }

  #renderTerrain() {
    this._bufferedMap.strokeWeight(0);

    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        const color = this._gradient.get(this._terrainGrid[row][col]);
        this.#renderSquare(row, col, color);
      }
    }
  }

  #renderSquare(row, col, color) {
    const squareSize = this._mapUtils.getSquareSize();
    const x = squareSize * col;
    const y = squareSize * row;

    this._bufferedMap.fill(color.r, color.g, color.b);
    this._bufferedMap.rect(x, y, squareSize);
  }

  #renderBeacons() {
    this._strokeWeight = Math.min(this._mapUtils.getSquareSize() / 2, 10);
    this._bufferedMap.strokeWeight(this._strokeWeight);
    this._bufferedMap.fill(255, 255, 255);

    for (let row = 0; row < this._rows; row++) {
      for (let col = 0; col < this._cols; col++) {
        if (this._terrainGrid[row][col] === "*") {
          this.#renderBeacon(this._bufferedMap, row, col);
        }
      }
    }
  }

  #renderBeacon(buffer, row, col) {
    const squareSize = this._mapUtils.getSquareSize();
    const x = squareSize * col + squareSize / 2;
    const y = squareSize * row + squareSize / 2;

    buffer.stroke("white");
    buffer.point(x, y);

    buffer.noStroke();
    buffer.circle(x, y, this._strokeWeight);
  }

  #renderGrid() {
    this._bufferedMap.strokeWeight(1);
    this._bufferedMap.stroke("white");

    const height = this._mapUtils.getSquareSize() * this._rows;
    const width = this._mapUtils.getSquareSize() * this._cols;

    this._bufferedMap.noFill();
    this._bufferedMap.rect(0, 0, width, height);
  }
}
