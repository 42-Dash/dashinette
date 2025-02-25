import { CANVAS_RENDER_ELEMENT } from "../index.js";

/**
 * @class GameUI
 * @brief Manages the game's user interface components.
 *
 * This class handles UI interactions, including rendering the game map,
 * updating the level label, managing the leaderboard, and controlling visibility
 * of UI elements like the next level button and blocking screen.
 */
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
    this._blockingScreen.setAttribute(
      "left-color",
      `rgb(${color.r},${color.g},${color.b})`,
    );
  }

  setContentNextLevelButton(content) {
    this._nextLevelButton.textContent = content;
  }

  createMap(controller) {
    this._mapElement = document.createElement(CANVAS_RENDER_ELEMENT);
    this._mapElement.id = "map-canvas";
    this._container.appendChild(this._mapElement);
    controller.registerCanvas(this._mapElement);
  }

  refreshLevelLabel(gameData) {
    this._levelLabelElement.textContent = gameData.getLevelTitle();
  }

  toggleNextLevelButton() {
    this._nextLevelButton.toggleAttribute("disabled");
  }

  showBlockingScreen() {
    this._blockingScreen.style.opacity = 1;
  }

  hideBlockingScreen() {
    this._blockingScreen.style.opacity = 0;
  }
}
