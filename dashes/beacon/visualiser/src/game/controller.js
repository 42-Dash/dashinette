import RenderQueueOpenLeagueController from "./controllers/render-queue/RenderQueueOpenLeague.js";
import RenderQueueRookieLeagueController from "./controllers/render-queue/RenderQueueRookieLeague.js";
import BeaconOpenLeagueController from "./controllers/beacons/BeaconOpenLeague.js";
import BeaconRookieLeagueController from "./controllers/beacons/BeaconRookieLeague.js";
import LeaderboardController from "./controllers/leaderboard/Leaderboard.js";
import BeaconsMapRookieLeagueController from "./controllers/maps/MapRookieLeague.js";
import BeaconsMapOpenLeagueController from "./controllers/maps/MapOpenLeague.js";
import { LEAGUES, currentLeague } from "../config.js";

/**
 * @class GameController
 * @brief Manages the overall game state, rendering, and beacon animations.
 *
 * The GameController acts as the central hub of the game, handling level progression,
 * leaderboard updates, beacon rendering, and interactions between various components.
 */
export default class GameController {
  constructor(gameData, ui) {
    this._ui = ui;
    this._gameData = gameData;

    if (currentLeague === LEAGUES.OPEN) {
      this._mapController = new BeaconsMapOpenLeagueController(
        gameData.getMaps(),
        gameData.getBeacons(),
      );
      this._renderQueue = new RenderQueueOpenLeagueController(
        ui.getContainer(),
        this._mapController,
      );
    } else if (currentLeague === LEAGUES.ROOKIE) {
      this._mapController = new BeaconsMapRookieLeagueController(
        gameData.getMap(),
        gameData.getBeacons(),
      );
      this._renderQueue = new RenderQueueRookieLeagueController(
        ui.getContainer(),
      );
    }

    this._leaderboard = new LeaderboardController(
      gameData,
      ui.getLeaderboard(),
    );
    this._controllers = new Map();
  }

  nextLevel() {
    this.setLevel(this._gameData.getLevel() + 1);
  }

  setLevel(level) {
    this._gameData.setLevel(level);
    this._controllers.clear();
    this._leaderboard.hideCurrentPoints();
  }

  loadAllBeaconControllers() {
    for (let group = 0; group < this._gameData.getGroupsCount(); group++) {
      if (!this._gameData.isValidGroupStatus(group)) {
        continue;
      }
      this._renderQueue.addToRenderQueue(this.#getOrCreateControllerAt(group));
    }
  }

  resetGameState() {
    this._renderQueue.clear();
    this._renderQueue.resetRenderQueue();
    this._leaderboard.hideCurrentPoints();
  }

  setupMap() {
    if (!this._mapController.hasRegisteredCanvas()) {
      this._ui.createMap(this._mapController);
    } else {
      if (currentLeague === LEAGUES.OPEN) {
        this._mapController.updateLevel(
          this._gameData.getMaps(),
          this._gameData.getBeacons(),
        );
      } else if (currentLeague === LEAGUES.ROOKIE) {
        this._mapController.updateLevel(
          this._gameData.getMap(),
          this._gameData.getBeacons(),
        );
      }
      this._mapController.draw();
    }
  }

  async renderAllBeacons() {
    this._ui.toggleNextLevelButton();
    await this._renderQueue.draw();

    return await new Promise((resolve) => {
      const id = setInterval(() => {
        if (this._renderQueue.isQueueFinished()) {
          clearInterval(id);
          this._ui.toggleNextLevelButton();
          resolve();
        }
      }, 100);
    });
  }

  renderDefaultLeaderboard() {
    this._leaderboard.renderDefaultLeaderboard();
  }

  renderLeaderboard() {
    this._leaderboard.renderLeaderboard();
  }

  #getOrCreateControllerAt(groupIndex) {
    if (!this._controllers.has(groupIndex)) {
      if (currentLeague === LEAGUES.OPEN) {
        this._controllers.set(
          groupIndex,
          new BeaconOpenLeagueController(
            this._gameData.getGroupOutput(groupIndex),
            this._mapController,
            this._gameData.getGroupColor(groupIndex),
          ),
        );
      } else if (currentLeague === LEAGUES.ROOKIE) {
        this._controllers.set(
          groupIndex,
          new BeaconRookieLeagueController(
            this._gameData.getGroupOutput(groupIndex),
            this._mapController,
            this._gameData.getGroupColor(groupIndex),
          ),
        );
      }
    }
    return this._controllers.get(groupIndex);
  }
}
