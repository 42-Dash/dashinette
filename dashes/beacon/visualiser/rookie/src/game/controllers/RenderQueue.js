import { CANVAS_RENDER_ELEMENT } from "../../index.js";

export default class RenderQueueController {
  constructor(container) {
    this._renderQueue = [];
    this._currentIndex = 0;
    this._container = container;
  }

  /**
   * Add a path to the list of paths to be rendered.
   * @param {BeaconController} path
   */
  addToRenderQueue(path) {
    if (this._renderQueue[this._currentIndex] === undefined) {
      const pathElement = document.createElement(CANVAS_RENDER_ELEMENT);
      this._container.appendChild(pathElement);
      path.registerCanvas(pathElement);
      this._renderQueue[this._currentIndex] = {
        element: pathElement,
        controller: path,
        status: "requires-rendering",
      };
    } else {
      this._renderQueue[this._currentIndex].data = path;
      this._renderQueue[this._currentIndex].status = "requires-rendering";
    }
    this._currentIndex++;
  }

  async draw() {
    for (let [index, pathElement] of this._renderQueue.entries()) {
      new Promise((resolve) => {
        setTimeout(() => {
          switch (pathElement.status) {
            case "requires-rendering":
              pathElement.controller.start();
              break;
            case "rendered":
              pathElement.controller.clear();
              break;
          }
          pathElement.status = "rendered";
          resolve();
        }, 1500 * index);
      });
    }
  }

  resetRenderQueue() {
    this._currentIndex = 0;
  }

  clear() {
    this._renderQueue.forEach((pathElement) => {
      pathElement.element.remove();
    });

    this._renderQueue = [];
  }

  animationEnded() {
    for (const element of this._renderQueue) {
      if (element.controller.isStarted() === true) {
        return false;
      }
    }
    return true;
  }
}
