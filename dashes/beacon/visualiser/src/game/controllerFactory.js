import RenderQueueOpen from "./controllers/render-queue/RenderQueueOpen.js";
import RenderQueueRookie from "./controllers/render-queue/RenderQueueRookie.js";
import BeaconsMapOpenLeague from "./controllers/maps/MapOpenLeague.js";
import BeaconsMapRookieLeague from "./controllers/maps/MapRookieLeague.js";
import BeaconOpenLeague from "./controllers/beacons/BeaconOpenLeague.js";
import BeaconRookieLeague from "./controllers/beacons/BeaconRookieLeague.js";
import { LEAGUES, currentLeague } from "../config.js";

export function createMapController(gameData) {
  return currentLeague === LEAGUES.OPEN
    ? new BeaconsMapOpenLeague(gameData.getMaps(), gameData.getBeacons())
    : new BeaconsMapRookieLeague(gameData.getMaps(), gameData.getBeacons());
}

export function createRenderQueue(container, mapController) {
  return currentLeague === LEAGUES.OPEN
    ? new RenderQueueOpen(container, mapController)
    : new RenderQueueRookie(container);
}

export function createBeaconController(groupIndex, gameData, mapController) {
  return currentLeague === LEAGUES.OPEN
    ? new BeaconOpenLeague(
        gameData.getGroupOutput(groupIndex),
        mapController,
        gameData.getGroupColor(groupIndex),
      )
    : new BeaconRookieLeague(
        gameData.getGroupOutput(groupIndex),
        mapController,
        gameData.getGroupColor(groupIndex),
      );
}
