import BeaconsMapController from "./controllers/BeaconsMap.js";
import RenderQueueController from "./controllers/RenderQueue.js";
import BeaconController from "./controllers/Beacon.js";
import LeaderboardController from "./controllers/Leaderboard.js";

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
    this._mapController = new BeaconsMapController(
      gameData.getMap(),
      gameData.getBeacons(),
    );
    this._renderQueue = new RenderQueueController(ui.getContainer());
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
      this._mapController.updateJson(this._gameData.getMap());
      this._mapController.updateBeacons(this._gameData.getBeacons());
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
      this._controllers.set(
        groupIndex,
        new BeaconController(
          this._gameData.getGroupOutput(groupIndex),
          this._mapController,
          this._gameData.getGroupColor(groupIndex),
        ),
      );
    }
    return this._controllers.get(groupIndex);
  }
}
