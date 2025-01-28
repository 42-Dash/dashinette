export default class GameUI {
  constructor({container, leaderboard, levelLabelElement, nextLevelButton, blockingScreen})
  {
    this.container = container;
    this.leaderboard = leaderboard;
    this.mapElement = null;
    this.levelLabelElement = levelLabelElement;
    this.nextLevelButton = nextLevelButton;
    this.blockingScreen = blockingScreen;
  }
  
  createMap(controller) {
    this.mapElement = document.createElement("p5-canvas");
    this.mapElement.setAttribute("id", "map-canvas");
    this.container.appendChild(this.mapElement);
    controller.registerCanvas(this.mapElement);
  }

  refreshLevelLabel(gameData) {
    this.levelLabelElement.textContent = `${gameData.levelTitle}`;
  }

  toggleNextLevelButton() {
    if (this.nextLevelButton.hasAttribute("disabled"))
      this.nextLevelButton.removeAttribute("disabled");
    else
      this.nextLevelButton.setAttribute("disabled", "");
  }

  showBlockingScreen() {
    this.blockingScreen.style.opacity = 1;
  }

  hideBlockingScreen() {
    this.blockingScreen.style.opacity = 0;
  }
}
