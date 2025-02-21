import GradientGenerator from "../misc/GradientGenerator.js";
import SingletonMapUtils from "./MapUtils.js";

export default class SubMapController {
  static MAX_PULSE_SCALE = 2.5; // Max size multiplier for pulsing effect
  static PULSE_ANIMATION_SPEED = 0.02; // speed of beacons growth (step per iteration)

  constructor(field) {
    this._p5Instance = null;
    this._mapUtils = new SingletonMapUtils();
    this._pulseScale = 1;

    this._field = field;
    this._strokeWeight = 0;

    this._gradient = new GradientGenerator();
  }

  setP5Instance(p5Instance) {
    this._p5Instance = p5Instance;
  }

  setField(field) {
    this._field = field;
  }

  getField() {
    return this._field;
  }

  getSize() {
    return {
      rows: this._field.length,
      cols: this._field[0].length,
    };
  }

  draw(offset) {
    this.#updatePulse();
    this.#drawTerrains(offset);
    this.#drawBeacons(offset);
    this.#drawGrid(offset);
  }

  #drawTerrains(offset) {
    this._p5Instance.strokeWeight(0);
    const { rows, cols } = this.getSize();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const color = this._gradient.get(this._field[row][col]);
        this.#drawTerrain(row, col, color, offset);
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

  #drawBeacons(offset) {
    this._strokeWeight = Math.min(this._mapUtils.getSquareSize() / 2, 10);

    this._p5Instance.strokeWeight(this._strokeWeight);
    this._p5Instance.fill(255, 255, 255, 255 * (2.5 - this._pulseScale));

    const { rows, cols } = this.getSize();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (this._field[row][col] === "*") {
          this.#drawBeacon(row, col, offset);
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
    this._p5Instance.circle(x, y, this._strokeWeight * this._pulseScale);
  }

  #drawGrid(offset) {
    this._p5Instance.strokeWeight(1);
    this._p5Instance.stroke("white");

    const { rows, cols } = this.getSize();

    const height = this._mapUtils.getSquareSize() * rows;
    const width = this._mapUtils.getSquareSize() * cols;

    this._p5Instance.noFill();
    this._p5Instance.rect(offset.x, offset.y, width, height);
  }

  #updatePulse() {
    this._pulseScale += SubMapController.PULSE_ANIMATION_SPEED;
    if (this._pulseScale >= SubMapController.MAX_PULSE_SCALE) {
      this._pulseScale = 1;
    }
  }
}
