import P5Canvas from "./web-components/P5Canvas.js";
import P5CanvasContainer from "./web-components/P5CanvasContainer.js";
import DashLogo from "./web-components/DashLogo.js";
import DashLeaderboard from "./web-components/DashLeaderboard.js";
import Game from "./game.js";

// load the json file
async function loadJSON(filename) {
  return fetch(filename).then((response) => response.json());
}

function main(jsonData) {
  const game = new Game(jsonData, {
    container: document.getElementById("canvases"),
    leaderboard: document.getElementById("ranking"),
    levelLabelElement: document.getElementById("level-text"),
    nextLevelButton: document.getElementById("next-level-btn"),
    blockingScreen: document.getElementById("blocking-screen"),
  });

  if (refreshHashLevel(game, window.location.hash) == 0) {
    game.coverMap();
  }

  document
    .getElementById("next-level-btn")
    .addEventListener("click", () => game.nextLevel());
  document
    .getElementById("start-btn")
    .addEventListener("click", () => game.start());

  window.addEventListener("hashchange", () => {
    if (refreshHashLevel(game, window.location.hash) == 0) {
      game.coverMap();
    }
  });
}

// sets the level of the game based on the hash of the URL and gets the level, wtf
function refreshHashLevel(game, hash) {
  const level = parseInt(hash.substring(1));
  if (!isNaN(level)) {
    game.setLevel(level);
    return game.data.level;
  }
  return game.data.level;
}

// register the custom element
customElements.define("p5-canvas", P5Canvas);
customElements.define("p5-canvas-container", P5CanvasContainer);
customElements.define("dash-logo", DashLogo);
customElements.define("dash-leaderboard", DashLeaderboard);
// load the json file and start the main function when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  loadJSON("results_open.json")
    .then(main)
    .catch((error) => console.error(error));
});
