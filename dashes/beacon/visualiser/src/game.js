import GameUI from "./game/ui.js";
import GameData from "./game/data.js";
import GameController from "./game/controller.js";

export default class Game {
  constructor(jsonData, ui) {
    this.gameData = new GameData(jsonData);
    this.gameUi = new GameUI(ui);
    this.gameController = new GameController(this.gameData, this.gameUi);
    this.#drawMap();
    this.gameController.dashLeaderboard.renderDefaultLeaderboard();
  }

  startAnimation() {
    this.gameUi.hideBlockingScreen();
    this.gameController.resetAllPaths();
    this.gameController.dashLeaderboard.hideCurrentPoints();
    this.#drawPaths();
  }

  refresh() {
    this.gameController.resetAllPaths();
    this.gameController.dashLeaderboard.hideCurrentPoints();
    this.#drawMap();
  }

  setLevel(level) {
    this.gameController.setLevel(level);
    this.#changeLevel();
  }

  nextLevel() {
    this.gameController.nextLevel();
    this.#changeLevel();
  }

  #changeLevel() {
    if (this.gameData.isLastLevel()) {
      this.gameUi.nextLevelButton.textContent = "Restart";
    } else {
      this.gameUi.nextLevelButton.textContent = "Next Level";
      if (this.gameData.isFirstLevel()) {
        this.gameController.dashLeaderboard.renderDefaultLeaderboard();
      }
    }
    window.location.hash = `#${this.gameData.level}`;
    this.refresh();
  }

  coverMap() {
    const screen = this.gameUi.blockingScreen;
    if (this.gameData.level === 0) {
      this.gameUi.showBlockingScreen();
      let i = 1;
      setInterval(() => {
        const r = (122 * i) % 255;
        const g = (138 / i) % 255;
        const b = (153 * i) % 255;
        screen.setAttribute("left-color", `rgb(${r},${g},${b})`);
        i++;
        if (i >= 100) {
          clearInterval(1);
        }
      }, 5000);
    } else {
      this.gameUi.hideBlockingScreen();
    }
  }

  #drawMap() {
    if (!this.gameController.dashMapController.hasRegisteredCanvas()) {
      this.gameUi.createMap(this.gameController.dashMapController);
    } else {
      this.gameController.dashMapController.updateJson(this.gameData.map);
      this.gameController.dashMapController.updateBeacons(
        this.gameData.beacons,
      );
      this.gameController.dashMapController.draw();
    }
    this.gameUi.refreshLevelLabel(this.gameData);
  }

  // marvin is over, its is not about the paths anymore
  #drawPaths() {
    this.gameController.loadAllPaths();
    this.gameController.renderAllPaths().then(() => {
      this.gameController.dashLeaderboard.renderLeaderboard();
    });
  }
}
