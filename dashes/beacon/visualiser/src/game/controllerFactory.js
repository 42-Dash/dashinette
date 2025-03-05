import RenderQueueOpen from "./controllers/render-queue/RenderQueueOpen.js";
import RenderQueueRookie from "./controllers/render-queue/RenderQueueRookie.js";
import MapOpenLeague from "./controllers/maps/MapOpenLeague.js";
import MapRookieLeague from "./controllers/maps/MapRookieLeague.js";
import BeaconOpenLeague from "./controllers/beacons/BeaconOpenLeague.js";
import BeaconRookieLeague from "./controllers/beacons/BeaconRookieLeague.js";
import { LEAGUES, currentLeague } from "../config.js";

export function createMapController(gameData) {
  return currentLeague === LEAGUES.OPEN
    ? new MapOpenLeague(gameData.getMaps(), gameData.getBeacons())
    : new MapRookieLeague(gameData.getMaps(), gameData.getBeacons());
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
        gameData.getGroupName(groupIndex),
      )
    : new BeaconRookieLeague(
        gameData.getGroupOutput(groupIndex),
        mapController,
        gameData.getGroupColor(groupIndex),
        gameData.getGroupName(groupIndex),
      );
}
