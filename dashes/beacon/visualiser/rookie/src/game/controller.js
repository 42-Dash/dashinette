import BeaconsMapController from "./controllers/BeaconsMap.js";
import RenderQueueController from "./controllers/RenderQueue.js";
import BeaconController from "./controllers/Beacon.js";
import LeaderboardController from "./controllers/Leaderboard.js";

export default class GameController {
  constructor(gameData, ui) {
    this._ui = ui;
    this._gameData = gameData;
    this._mapController = new BeaconsMapController(
      gameData.getMap(),
      gameData.getBeacons(),
    );
    this._renderQueue = new RenderQueueController(ui.container);
    this._leaderboard = new LeaderboardController(gameData, ui.leaderboard);
    this._controllers = new Map();
  }

  nextLevel() {
    this._gameData.setLevel(this._gameData.getLevel() + 1);
    this._controllers.clear();
    this._leaderboard.hideCurrentPoints();
  }

  setLevel(level) {
    this._gameData.setLevel(level);
    this._controllers.clear();
    this._leaderboard.hideCurrentPoints();
  }

  loadAllBeaconControllers() {
    for (let i = 0; i < this._gameData.getGroupsCount(); i++) {
      this._renderQueue.addToRenderQueue(this.#getOrCreateControllerAt(i));
    }
  }

  resetAllBeaconControllers() {
    this._renderQueue.clear();
    this._renderQueue.resetRenderQueue();
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
        if (this._renderQueue.animationEnded()) {
          clearInterval(id);
          this._ui.toggleNextLevelButton();
          resolve();
        }
      }, 100);
    });
  }

  renderDefaultLeaderboard() {
    this._leaderboard.renderLeaderboard();
  }

  renderLeaderboard() {
    this._leaderboard.renderLeaderboard();
  }

  #getOrCreateControllerAt(groupIndex) {
    let controller;

    if (!this._controllers.has(groupIndex)) {
      controller = new BeaconController(
        this._gameData.getGroupOutput(groupIndex),
        this._mapController,
        this._gameData.getGroupColor(groupIndex),
      );
      this._controllers.set(groupIndex, controller);
    } else {
      controller = this._controllers.get(groupIndex);
    }
    return controller;
  }
}
