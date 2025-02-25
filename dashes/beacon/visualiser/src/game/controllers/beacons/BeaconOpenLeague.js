import BeaconBaseController from "./BeaconBaseController.js";

/**
 * @class BeaconOpenLeagueController
 * @brief Manages the animation of beacons expanding on a map.
 */
export default class BeaconOpenLeagueController extends BeaconBaseController {
  constructor(output, mapController, color) {
    super(mapController, color);

    this._mapOrder = this.#parseMapOrder(output.substring(0, 4));
    this._circleCoordinates = this.#parseOutput(output.substring(5));
    this._targetSizes = this.#getBeaconTargetSizes();

    super.init(this._circleCoordinates, this._targetSizes);
  }

  getMapOrder() {
    return this._mapOrder;
  }

  #getBeaconTargetSizes() {
    const gameMap = this._mapUtils.mergeShuffledMaps(
      this._mapController.getMaps(),
      this._mapOrder,
    );

    const terrains = this._circleCoordinates.map((point) =>
      Number(gameMap[point.x][point.y]),
    );

    return this._mapController
      .getBeacons()
      .map((element, index) => terrains[index] + element);
  }

  #parseMapOrder(output) {
    return output.split("").map((chr) => Number(chr) - 1);
  }

  #parseOutput(output) {
    return output
      .replace(/\|$/, "")
      .split("|")
      .map((pair) => {
        const [x, y] = pair.split(",").map(Number);
        return { x, y };
      });
  }
}
