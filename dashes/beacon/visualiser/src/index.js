import CanvasContainer from "./web-components/CanvasContainer.js";
import Logo from "./web-components/Logo.js";
import Leaderboard from "./web-components/Leaderboard.js";
import Game from "./game.js";
import Canvas from "./web-components/Canvas.js";
import { loadGameData } from "./config.js";

export const CANVAS_RENDER_ELEMENT = "render-canvas";

function main(jsonData) {
  const game = new Game(jsonData, {
    container: document.getElementById("canvas-container"),
    leaderboard: document.getElementById("ranking"),
    levelLabelElement: document.getElementById("level-text"),
    nextLevelButton: document.getElementById("next-level-btn"),
    blockingScreen: document.getElementById("blocking-screen"),
  });

  if (refreshHashLevel(game, window.location.hash) === 0) {
    game.coverMap();
  }

  document
    .getElementById("next-level-btn")
    .addEventListener("click", () => game.nextLevel());
  document
    .getElementById("start-btn")
    .addEventListener("click", () => game.startAnimation());

  window.addEventListener("hashchange", () => {
    if (refreshHashLevel(game, window.location.hash) === 0) {
      game.coverMap();
    }
  });
}

// sets the level of the game based on the hash of the URL and gets the level
function refreshHashLevel(game, hash) {
  const level = parseInt(hash.substring(1));

  if (!isNaN(level)) {
    game.setLevel(level);
  }
  return game.getLevel();
}

// register the custom element
customElements.define(CANVAS_RENDER_ELEMENT, Canvas);
customElements.define("canvas-container", CanvasContainer);
customElements.define("dash-logo", Logo);
customElements.define("dash-leaderboard", Leaderboard);

// load the json file and start the main function when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadGameData("results.json")
    .then(main)
    .catch(() => console.log("Cant find results.json"));
});
