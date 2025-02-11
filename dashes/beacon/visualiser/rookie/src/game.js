import GameUI from "./game/ui.js";
import GameData from "./game/data.js";
import GameController from "./game/controller.js";

export default class Game {
  constructor(jsonData, ui) {
    this._gameData = new GameData(jsonData);
    this._gameUi = new GameUI(ui);
    this._gameController = new GameController(this._gameData, this._gameUi);
    this.#drawMap();
    this._gameController.leaderboard.renderDefaultLeaderboard();
  }

  getLevel() {
    return this._gameData.level;
  }

  startAnimation() {
    this._gameUi.hideBlockingScreen();
    this._gameController.resetAllBeaconControllers();
    this._gameController.leaderboard.hideCurrentPoints();
    this.#drawBeacons();
  }

  refresh() {
    this._gameController.resetAllBeaconControllers();
    this._gameController.leaderboard.hideCurrentPoints();
    this.#drawMap();
  }

  setLevel(level) {
    this._gameController.setLevel(level);
    this.#changeLevel();
  }

  nextLevel() {
    this._gameController.nextLevel();
    this.#changeLevel();
  }

  #changeLevel() {
    if (this._gameData.isLastLevel()) {
      this._gameUi.nextLevelButton.textContent = "Restart";
    } else {
      this._gameUi.nextLevelButton.textContent = "Next Level";
      if (this._gameData.isFirstLevel()) {
        this._gameController.leaderboard.renderDefaultLeaderboard();
      }
    }
    window.location.hash = `#${this._gameData.level}`;
    this.refresh();
  }

  coverMap() {
    const screen = this._gameUi.blockingScreen;
    if (this._gameData.level === 0) {
      this._gameUi.showBlockingScreen();
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
      this._gameUi.hideBlockingScreen();
    }
  }

  #drawMap() {
    if (!this._gameController.mapController.hasRegisteredCanvas()) {
      this._gameUi.createMap(this._gameController.mapController);
    } else {
      this._gameController.mapController.updateJson(this._gameData.map);
      this._gameController.mapController.updateBeacons(this._gameData.beacons);
      this._gameController.mapController.draw();
    }
    this._gameUi.refreshLevelLabel(this._gameData);
  }

  #drawBeacons() {
    this._gameController.loadAllBeaconControllers();
    this._gameController
      .renderAllPaths()
      .then(() => this._gameController.leaderboard.renderLeaderboard());
  }
}
