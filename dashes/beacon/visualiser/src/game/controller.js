import BeaconsMapController from "./controllers/BeaconsMap.js";
import RenderQueueController from "./controllers/RenderQueue.js";
import BeaconController from "./controllers/Beacon.js";
import LeaderboardController from "./controllers/Leaderboard.js";

export default class GameController {
  constructor(gameData, ui) {
    this.ui = ui;
    this.gameData = gameData;
    this.mapController = new BeaconsMapController(
      gameData.map,
      gameData.beacons,
    );
    this.renderQueue = new RenderQueueController(ui.container);
    this.leaderboard = new LeaderboardController(gameData, ui.leaderboard);
    this.controllers = new Map();
  }

  nextLevel() {
    this.gameData.level = this.gameData.level + 1;
    this.controllers.clear();
    this.leaderboard.hideCurrentPoints();
  }

  setLevel(level) {
    this.gameData.level = level;
    this.controllers.clear();
    this.leaderboard.hideCurrentPoints();
  }

  loadAllPaths() {
    for (let i = 0; i < this.gameData.groupCount; i++) {
      this.renderQueue.addToRenderQueue(this.#getOrCreateControllerAt(i));
    }
  }

  resetAllPaths() {
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
    let dashPath;

    if (!this.controllers.has(groupIndex)) {
      dashPath = new BeaconController(
        this.gameData.output(groupIndex),
        this.mapController,
        this.gameData.color(groupIndex),
      );
      this.controllers.set(groupIndex, dashPath);
    } else {
      dashPath = this.controllers.get(groupIndex);
    }
    return dashPath;
  }
}
