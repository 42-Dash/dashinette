import GameUI from "./game/ui.js";
import GameData from "./game/data.js";
import GameController from "./game/controller.js";

/**
 * Manages the game flow, UI, and data.
 *
 * Responsibilities:
 * - Initializes game data, UI, and controller.
 * - Handles level changes and game state updates.
 * - Manages animations and UI interactions.
 */
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
    this._controller.resetGameState();
    this.#drawBeacons();
  }

  setLevel(level) {
    this._controller.setLevel(level);
    this.#updateLevel();
  }

  nextLevel() {
    this._controller.nextLevel();
    this.#updateLevel();
  }

  coverMap() {
    if (!this._gameData.isFirstLevel()) {
      this._ui.hideBlockingScreen();
      return;
    }

    this._ui.showBlockingScreen();
    let i = 1;
    const intervalId = setInterval(() => {
      this._ui.setLogoLeftColor({
        r: (122 * i) % 255,
        g: (138 / i) % 255,
        b: (153 * i) % 255,
      });

      if (i++ >= 100) {
        clearInterval(intervalId);
      }
    }, 5000);
  }

  #updateLevel() {
    const buttonText = this._gameData.isLastLevel() ? "Restart" : "Next level";
    this._ui.setContentNextLevelButton(buttonText);

    if (this._gameData.isFirstLevel()) {
      this._controller.renderDefaultLeaderboard();
    }

    window.location.hash = `#${this._gameData.getLevel()}`;
    this.#refresh();
  }

  #refresh() {
    this._controller.resetGameState();
    this.#drawMap();
  }

  #drawMap() {
    this._controller.setupMap();
    this._ui.refreshLevelLabel(this._gameData);
  }

  #drawBeacons() {
    this._controller.loadAllBeaconControllers();
    this._controller.renderAllBeacons().then(() => {
      this._controller.renderLeaderboard();
    });
  }
}
