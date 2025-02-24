import GradientGenerator from "../../misc/GradientGenerator.js";
import SingletonMapUtils from "./MapUtils.js";

export default class SubMapController {
  static MAX_PULSE_SCALE = 2.5; // Max size multiplier for pulsing effect
  static PULSE_ANIMATION_SPEED = 0.02; // speed of beacons growth (step per iteration)

  constructor(terrainGrid) {
    this._p5Instance = null;
    this._mapUtils = new SingletonMapUtils();
    this._pulseScale = 1;

    this._terrainGrid = terrainGrid;
    this._strokeWeight = 0;
    this._mapPosition = { x: 0, y: 0 };

    this._gradient = new GradientGenerator();
  }

  setP5Instance(p5Instance) {
    this._p5Instance = p5Instance;
  }

  setTerrainGrid(terrainGrid) {
    this._terrainGrid = terrainGrid;
  }

  getTerrainGrid() {
    return this._terrainGrid;
  }

  getSize() {
    return {
      rows: this._terrainGrid.length,
      cols: this._terrainGrid[0].length,
    };
  }

  render(mapPosition) {
    this._mapPosition = mapPosition;
    this.#updatePulse();
    this.#renderTerrain();
    this.#renderBeacons();
    this.#renderGrid();
  }

  #renderTerrain() {
    this._p5Instance.strokeWeight(0);
    const { rows, cols } = this.getSize();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const color = this._gradient.get(this._terrainGrid[row][col]);
        this.#renderSquare(row, col, color, this._mapPosition);
      }
    }
  }

  #renderSquare(row, col, color) {
    const squareSize = this._mapUtils.getSquareSize();
    const x = this._mapPosition.x + squareSize * col;
    const y = this._mapPosition.y + squareSize * row;

    this._p5Instance.fill(color.r, color.g, color.b);
    this._p5Instance.rect(x, y, squareSize);
  }

  #renderBeacons() {
    this._strokeWeight = Math.min(this._mapUtils.getSquareSize() / 2, 10);

    this._p5Instance.strokeWeight(this._strokeWeight);
    this._p5Instance.fill(255, 255, 255, 255 * (2.5 - this._pulseScale));

    const { rows, cols } = this.getSize();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this._terrainGrid[row][col] === "*") {
          this.#renderBeacon(row, col, this._mapPosition);
        }
      }
    }
  }

  #renderBeacon(row, col) {
    const squareSize = this._mapUtils.getSquareSize();

    const x = this._mapPosition.x + squareSize * col + squareSize / 2;
    const y = this._mapPosition.y + squareSize * row + squareSize / 2;

    this._p5Instance.stroke("white");
    this._p5Instance.point(x, y);

    this._p5Instance.noStroke();
    this._p5Instance.circle(x, y, this._strokeWeight * this._pulseScale);
  }

  #renderGrid() {
    this._p5Instance.strokeWeight(1);
    this._p5Instance.stroke("white");

    const { rows, cols } = this.getSize();

    const height = this._mapUtils.getSquareSize() * rows;
    const width = this._mapUtils.getSquareSize() * cols;

    this._p5Instance.noFill();
    this._p5Instance.rect(
      this._mapPosition.x,
      this._mapPosition.y,
      width,
      height,
    );
  }

  #updatePulse() {
    this._pulseScale += SubMapController.PULSE_ANIMATION_SPEED;
    if (this._pulseScale >= SubMapController.MAX_PULSE_SCALE) {
      this._pulseScale = 1;
    }
  }
}
