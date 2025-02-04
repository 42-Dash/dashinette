import CanvasContainer from "./web-components/CanvasContainer.js";
import DashLogo from "./web-components/DashLogo.js";
import DashLeaderboard from "./web-components/DashLeaderboard.js";
import Game from "./game.js";
import Canvas from "./web-components/Canvas.js";

// load the json file
async function loadJSON(filename) {
  return fetch(filename).then((response) => response.json());
}

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
    return game.gameData.level;
  }
  return game.gameData.level;
}

// register the custom element
customElements.define("canvas-test", Canvas);
customElements.define("canvas-container", CanvasContainer);
customElements.define("dash-logo", DashLogo);
customElements.define("dash-leaderboard", DashLeaderboard);

// load the json file and start the main function when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadJSON("results.json")
    .then(main)
    .catch((error) => console.error(error));
});
