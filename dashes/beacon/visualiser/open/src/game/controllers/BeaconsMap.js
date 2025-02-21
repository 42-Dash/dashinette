import CanvasController from "./Canvas.js";
import MapUtils from "./MapUtils.js";
import SubMapController from "./SubMap.js";

/**
 * @class BeaconsMapController
 * @brief Manages and renders the game map and beacon animation.
 */
export default class BeaconsMapController extends CanvasController {
  static ANIMATION_SPEED = 50; // Frames per second
  static STROKE_WEIGHT = 1; // Weight of map border
  static MAP_ANIMATION_SPEED = 0.03; // speed of maps movement (step per iteration)

  constructor(mapArray, beaconSizes) {
    super();
    this._beaconSizes = beaconSizes;
    this._mapUtils = new MapUtils();
    this._mapArray = mapArray.map(
      (field) => new SubMapController(field, this._mapUtils),
    );

    this._mapsOrder = [0, 1, 2, 3];
    this._mapAnimationProgress = 0;
    this._offsets = this.#getOffsets();
    this._trajectories = this.#calcTrajectories();
  }

  updateMapsOrder(mapsOrder) {
    if (this.#arraysEqual(this._mapsOrder, mapsOrder)) return;

    this._mapsOrder = mapsOrder;
    this._mapAnimationProgress = 0;
    this._offsets = this.#getOffsets();
    this._trajectories = this.#calcTrajectories();
  }

  #calcTrajectories() {
    return this._offsets.map((offset, index) => ({
      dest: offset,
      source: this._offsets[this._mapsOrder[index]],
    }));
  }

  isMapAnimationInProgress() {
    return this._mapAnimationProgress === 1;
  }

  updateLevel(newMapArray, newBeacons) {
    this._beaconSizes = newBeacons;
    newMapArray.forEach((field, index) =>
      this._mapArray[index].setField(field),
    );
  }

  getBeacons() {
    return this._beaconSizes;
  }

  get mapUtils() {
    return this._mapUtils;
  }

  getMaps() {
    return this._mapArray.map((subMap) => subMap.getField());
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(BeaconsMapController.ANIMATION_SPEED);
    this._mapArray.forEach((subMap) => subMap.setP5Instance(this._p5Instance));
  }

  draw() {
    this._p5Instance.clear();
    const { rows, cols } = this._mapArray[0].getSize();
    this._mapUtils.refresh(rows * 2, cols * 2, this.width, this.height);

    for (let iter = 0; iter < 4; ++iter) {
      const { source, dest } = this._trajectories[iter];

      const offset = {
        x: source.x + (dest.x - source.x) * this._mapAnimationProgress,
        y: source.y + (dest.y - source.y) * this._mapAnimationProgress,
      };

      this._mapArray[this._mapsOrder[iter]].draw(offset);
    }

    this.#updateMapAnimation();
  }

  getBoardLimits() {
    const { rows, cols } = this._mapArray[0].getSize();

    return {
      left: this._mapUtils.getLeftPadding(),
      right:
        this._mapUtils.getLeftPadding() +
        this._mapUtils.getSquareSize() * cols * 2,
      top: this._mapUtils.getUpPadding(),
      bottom:
        this._mapUtils.getUpPadding() +
        this._mapUtils.getSquareSize() * rows * 2,
    };
  }

  #getOffsets() {
    const { rows, cols } = this._mapArray[0].getSize();

    return [
      this._mapUtils.squareCoordinates(0, 0),
      this._mapUtils.squareCoordinates(0, cols),
      this._mapUtils.squareCoordinates(rows, 0),
      this._mapUtils.squareCoordinates(rows, cols),
    ];
  }

  #updateMapAnimation() {
    this._mapAnimationProgress += BeaconsMapController.MAP_ANIMATION_SPEED;
    if (this._mapAnimationProgress >= 1) {
      this._mapAnimationProgress = 1;
    }
  }

  #arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
  }
}
