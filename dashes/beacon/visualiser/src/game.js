import GameUI from "./game/ui.js";
import GameData from "./game/data.js";
import GameController from "./game/controller.js";

export default class Game {
  constructor(jsonData, ui) {
    this.data = new GameData(jsonData);
    /**
     * Contains an object that stores a reference to each
     * HTMLelement that is needed to render the game.
     */
    this.ui = new GameUI(ui);
    this.controller = new GameController(this.data, this.ui);
    this.#drawMap();
    this.controller.dashLeaderboard.renderDefaultLeaderboard();
  }

  start() {
    this.ui.hideBlockingScreen();
    this.controller.resetAllPaths();
    this.controller.dashLeaderboard.hideCurrentPoints();
    this.#drawPaths();
  }

  refresh() {
    this.controller.resetAllPaths();
    this.controller.dashLeaderboard.hideCurrentPoints();
    this.#drawMap();
  }

  setLevel(level) {
    this.controller.setLevel(level);
    this.#changeLevel();
  }

  nextLevel() {
    this.controller.nextLevel();
    this.#changeLevel();
  }

  #changeLevel() {
    if (this.data.isLastLevel()) {
      this.ui.nextLevelButton.textContent = "Restart";
    } else {
      this.ui.nextLevelButton.textContent = "Next Level";
      if (this.data.isFirstLevel()) {
        this.controller.dashLeaderboard.renderDefaultLeaderboard();
      }
    }
    window.location.hash = `#${this.data.level}`;
    this.refresh();
  }

  coverMap() {
    const screen = this.ui.blockingScreen;
    if (this.data.level == 0) {
      this.ui.showBlockingScreen();
      let i = 1;
      setInterval(() => {
        const r = (122 * i) % 255;
        const g = (138 / i) % 255;
        const b = (153 * i) % 255;
        screen.setAttribute("left-color", `rgb(${r},${g},${b})`);
        i++;
        if (i >= 100) clearInterval();
      }, 5000);
    } else {
      this.ui.hideBlockingScreen();
    }
  }

  #drawMap() {
    if (!this.controller.dashMapController.hasRegisteredCanvas()) {
      this.ui.createMap(this.controller.dashMapController);
    } else {
      this.controller.dashMapController.updateJson(this.data.map);
      this.controller.dashMapController.updateBeacons(this.data.beacons);
      this.controller.dashMapController.draw();
    }
    this.ui.refreshLevelLabel(this.data);
  }

  // marvin is over, its is not about the paths anymore
  #drawPaths() {
    this.controller.loadAllPaths();
    this.controller.renderAllPaths().then(() => {
      this.controller.dashLeaderboard.renderLeaderboard();
    });
  }
}
