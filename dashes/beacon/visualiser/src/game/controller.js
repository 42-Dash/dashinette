import BeaconsMapController from "./controllers/BeaconsMap.js";
import RenderQueueController from "./controllers/RenderQueue.js";
import BeaconController from "./controllers/Beacon.js";
import LeaderboardController from "./controllers/Leaderboard.js";

export default class GameController {
  constructor(gameData, ui) {
    this.ui = ui;
    this.gameData = gameData;
    this.dashMapController = new BeaconsMapController(
      gameData.map,
      gameData.beacons,
    );
    this.dashPathsQueue = new RenderQueueController(ui.container);
    this.dashLeaderboard = new LeaderboardController(gameData, ui.leaderboard);
    this.dashPathControllers = new Map();
  }

  nextLevel() {
    this.gameData.level = this.gameData.level + 1;
    this.dashPathControllers.clear();
    this.dashLeaderboard.hideCurrentPoints();
  }

  setLevel(level) {
    this.gameData.level = level;
    this.dashPathControllers.clear();
    this.dashLeaderboard.hideCurrentPoints();
  }

  loadAllPaths() {
    for (let i = 0; i < this.gameData.groupCount; i++) {
      this.dashPathsQueue.addToRenderQueue(this.#dashPathControllerAt(i));
    }
  }

  resetAllPaths() {
    this.dashPathsQueue.clear();
    this.dashPathsQueue.resetRenderQueue();
  }

  async renderAllPaths() {
    this.ui.toggleNextLevelButton();
    await this.dashPathsQueue.draw(100);
    return await new Promise((resolve) => {
      const id = setInterval(() => {
        if (this.dashPathsQueue.animationEnded()) {
          clearInterval(id);
          this.ui.toggleNextLevelButton();
          resolve();
        }
      }, 100);
    });
  }

  #dashPathControllerAt(groupIndex) {
    let dashPath;

    if (!this.dashPathControllers.has(groupIndex)) {
      dashPath = new BeaconController(
        this.gameData.output(groupIndex),
        this.dashMapController,
        this.gameData.color(groupIndex),
      );
      this.dashPathControllers.set(groupIndex, dashPath);
    } else {
      dashPath = this.dashPathControllers.get(groupIndex);
    }
    return dashPath;
  }
}
