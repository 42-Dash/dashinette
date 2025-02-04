import DashMapController from "./controllers/DashMap.js";
import DashPathsQueueController from "./controllers/DashPathsQueue.js";
import DashPathController from "./controllers/DashPath.js";
import DashLeaderboard from "./controllers/DashLeaderboard.js";

export default class GameController {
  constructor(gameData, ui) {
    this.ui = ui;
    this.gameData = gameData;
    this.dashMapController = new DashMapController(
      gameData.map,
      gameData.beacons,
    );
    this.dashPathsQueue = new DashPathsQueueController(ui.container);
    this.dashLeaderboard = new DashLeaderboard(gameData, ui.leaderboard);
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
    console.log("loadAllPaths ------------------------");
    for (let i = 0; i < this.gameData.groupCount; i++) {
      this.dashPathsQueue.addToRenderQueue(this.#dashPathControllerAt(i));
    }
  }

  resetAllPaths() {
    this.dashPathsQueue.clear();
    this.dashPathsQueue.resetRenderQueue();
    console.log(this.dashPathsQueue.renderQueue, "==============");
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
      // console.log(
      //   "this.gameData.output(groupIndex)",
      //   this.gameData.output(groupIndex),
      // );
      dashPath = new DashPathController(
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
