import BeaconBaseController from "./BeaconBaseController.js";

/**
 * @class BeaconRookieLeagueController
 * @brief Manages the animation of beacons expanding on a map.
 */
export default class BeaconRookieLeagueController extends BeaconBaseController {
  constructor(output, mapController, color, name) {
    super(mapController, color, name);

    this._circleCoordinates = this.#parseOutput(output);
    this._targetSizes = this._mapController.getBeacons();

    super.init(this._circleCoordinates, this._targetSizes);
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
