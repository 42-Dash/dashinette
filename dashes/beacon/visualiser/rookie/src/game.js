import GameUI from "./game/ui.js";
import GameData from "./game/data.js";
import GameController from "./game/controller.js";

export default class Game {
  constructor(jsonData, ui) {
    this._gameData = new GameData(jsonData);
    this._ui = new GameUI(ui);
    this._controller = new GameController(this._gameData, this._ui);
    this.#drawMap();
    this._controller.renderDefaultLeaderboard();
  }

  getLevel() {
    return this._gameData.getLevel();
  }

  startAnimation() {
    this._ui.hideBlockingScreen();
    this._controller.resetAllBeaconControllers();
    this._controller._leaderboard.hideCurrentPoints();
    this.#drawBeacons();
  }

  refresh() {
    this._controller.resetAllBeaconControllers();
    this._controller._leaderboard.hideCurrentPoints();
    this.#drawMap();
  }

  setLevel(level) {
    this._controller.setLevel(level);
    this.#changeLevel();
  }

  nextLevel() {
    this._controller.nextLevel();
    this.#changeLevel();
  }

  #changeLevel() {
    if (this._gameData.isLastLevel()) {
      this._ui.nextLevelButton.textContent = "Restart";
    } else {
      this._ui.nextLevelButton.textContent = "Next Level";
      if (this._gameData.isFirstLevel()) {
        this._controller._leaderboard.renderDefaultLeaderboard();
      }
    }
    window.location.hash = `#${this._gameData.getLevel()}`;
    this.refresh();
  }

  coverMap() {
    const screen = this._ui.blockingScreen;

    if (this._gameData.isFirstLevel()) {
      this._ui.showBlockingScreen();
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
      this._ui.hideBlockingScreen();
    }
  }

  #drawMap() {
    this._controller.setupMap();
    this._ui.refreshLevelLabel(this._gameData);
  }

  #drawBeacons() {
    this._controller.loadAllBeaconControllers();
    this._controller
      .renderAllBeacons()
      .then(() => this._controller.renderLeaderboard());
  }
}
