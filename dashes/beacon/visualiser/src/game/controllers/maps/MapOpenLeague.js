import CanvasController from "../CanvasBase.js";
import SingletonMapUtils from "./MapUtils.js";
import SubMapController from "./SubMapOpenLeague.js";

/**
 * @class BeaconsMapOpenLeagueController
 * @brief Manages and renders the game map and beacon animation.
 */
export default class BeaconsMapOpenLeagueController extends CanvasController {
  static ANIMATION_SPEED = 50; // Frames per second
  static MAP_ANIMATION_SPEED = 0.03; // speed of maps movement (step per iteration)

  constructor(mapArray, beaconSizes) {
    super();
    this._beaconSizes = beaconSizes;
    this._mapUtils = new SingletonMapUtils();
    this._mapArray = mapArray.map((field) => new SubMapController(field));

    this._mapsOrder = [0, 1, 2, 3];
    this._oldMapOrder = [0, 1, 2, 3];
    this._mapAnimationProgress = 0;

    this._mapPositions = this.#calculateMapPositions();
    this._animationPaths = this.#calculateMovePaths();
  }

  updateMapsOrder(mapsOrder) {
    if (this.#arraysEqual(this._mapsOrder, mapsOrder)) return;

    this._oldMapOrder = [...this._mapsOrder];
    this._mapsOrder = mapsOrder;

    this._mapAnimationProgress = 0;
    this._mapPositions = this.#calculateMapPositions();
    this._animationPaths = this.#calculateMovePaths();
  }

  isMapAnimationInProgress() {
    return this._mapAnimationProgress < 1;
  }

  updateLevel(newMapArray, newBeacons) {
    this._beaconSizes = newBeacons;
    newMapArray.forEach((terrainGrid, index) =>
      this._mapArray[index].setTerrainGrid(terrainGrid),
    );
  }

  getBeacons() {
    return this._beaconSizes;
  }

  getMaps() {
    return this._mapArray.map((subMap) => subMap.getTerrainGrid());
  }

  setup() {
    this._p5Instance.createCanvas(this.width, this.height, this._canvasElement);
    this._p5Instance.frameRate(BeaconsMapOpenLeagueController.ANIMATION_SPEED);
    this._mapArray.forEach((subMap) => subMap.setP5Instance(this._p5Instance));
  }

  draw() {
    this._p5Instance.clear();
    const { rows, cols } = this._mapArray[0].getSize();
    this._mapUtils.refresh(rows * 2, cols * 2, this.width, this.height);

    this._mapArray.forEach((subMap, index) => {
      const { startPos, endPos } = this._animationPaths[index];

      const offset = {
        x: this.#lerp(startPos.x, endPos.x),
        y: this.#lerp(startPos.y, endPos.y),
      };

      this._mapArray[this._mapsOrder[index]].render(offset);
    });

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

  #calculateMovePaths() {
    return this._mapsOrder.map((newIndex, iter) => ({
      endPos: this._mapPositions[iter],
      startPos: this._mapPositions[this._oldMapOrder.indexOf(newIndex)],
    }));
  }

  #calculateMapPositions() {
    const { rows, cols } = this._mapArray[0].getSize();

    return [
      this._mapUtils.squareCoordinates(0, 0),
      this._mapUtils.squareCoordinates(0, cols),
      this._mapUtils.squareCoordinates(rows, 0),
      this._mapUtils.squareCoordinates(rows, cols),
    ];
  }

  #updateMapAnimation() {
    this._mapAnimationProgress +=
      BeaconsMapOpenLeagueController.MAP_ANIMATION_SPEED;
    if (this._mapAnimationProgress >= 1) {
      this._mapAnimationProgress = 1;
    }
  }

  #lerp(start, end) {
    return start + (end - start) * this._mapAnimationProgress;
  }

  #arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
  }
}
