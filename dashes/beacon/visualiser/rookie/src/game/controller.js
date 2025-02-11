import BeaconsMapController from "./controllers/BeaconsMap.js";
import RenderQueueController from "./controllers/RenderQueue.js";
import BeaconController from "./controllers/Beacon.js";
import LeaderboardController from "./controllers/Leaderboard.js";

export default class GameController {
  constructor(gameData, ui) {
    this.ui = ui;
    this.gameData = gameData;
    this.mapController = new BeaconsMapController(
      gameData.getMap(),
      gameData.getBeacons(),
    );
    this.renderQueue = new RenderQueueController(ui.container);
    this.leaderboard = new LeaderboardController(gameData, ui.leaderboard);
    this.controllers = new Map();
  }

  nextLevel() {
    this.gameData.setLevel(this.gameData.getLevel() + 1);
    this.controllers.clear();
    this.leaderboard.hideCurrentPoints();
  }

  setLevel(level) {
    this.gameData.setLevel(level);
    this.controllers.clear();
    this.leaderboard.hideCurrentPoints();
  }

  loadAllBeaconControllers() {
    for (let i = 0; i < this.gameData.getGroupsCount(); i++) {
      this.renderQueue.addToRenderQueue(this.#getOrCreateControllerAt(i));
    }
  }

  resetAllBeaconControllers() {
    this.renderQueue.clear();
    this.renderQueue.resetRenderQueue();
  }

  async renderAllPaths() {
    this.ui.toggleNextLevelButton();
    await this.renderQueue.draw();
    return await new Promise((resolve) => {
      const id = setInterval(() => {
        if (this.renderQueue.animationEnded()) {
          clearInterval(id);
          this.ui.toggleNextLevelButton();
          resolve();
        }
      }, 100);
    });
  }

  #getOrCreateControllerAt(groupIndex) {
    let controller;

    if (!this.controllers.has(groupIndex)) {
      controller = new BeaconController(
        this.gameData.getGroupOutput(groupIndex),
        this.mapController,
        this.gameData.getGroupColor(groupIndex),
      );
      this.controllers.set(groupIndex, controller);
    } else {
      controller = this.controllers.get(groupIndex);
    }
    return controller;
  }
}
