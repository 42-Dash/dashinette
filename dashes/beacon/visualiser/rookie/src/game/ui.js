import { CANVAS_RENDER_ELEMENT } from "../index.js";

export default class GameUI {
  constructor({
    container,
    leaderboard,
    levelLabelElement,
    nextLevelButton,
    blockingScreen,
  }) {
    this._container = container;
    this._leaderboard = leaderboard;
    this._mapElement = null;
    this._levelLabelElement = levelLabelElement;
    this._nextLevelButton = nextLevelButton;
    this._blockingScreen = blockingScreen;
  }

  getContainer() {
    return this._container;
  }

  getLeaderboard() {
    return this._leaderboard;
  }

  setLogoLeftColor(color) {
    this._blockingScreen.setAttribute("left-color", color);
  }

  setContentNextLevelButton(content) {
    this._nextLevelButton.textContent = content;
  }

  createMap(controller) {
    this._mapElement = document.createElement(CANVAS_RENDER_ELEMENT);
    this._mapElement.setAttribute("id", "map-canvas");
    this._container.appendChild(this._mapElement);
    controller.registerCanvas(this._mapElement);
  }

  refreshLevelLabel(gameData) {
    this._levelLabelElement.textContent = `${gameData.getLevelTitle()}`;
  }

  toggleNextLevelButton() {
    if (this._nextLevelButton.hasAttribute("disabled")) {
      this._nextLevelButton.removeAttribute("disabled");
    } else {
      this._nextLevelButton.setAttribute("disabled", "");
    }
  }

  showBlockingScreen() {
    this._blockingScreen.style.opacity = 1;
  }

  hideBlockingScreen() {
    this._blockingScreen.style.opacity = 0;
  }
}
