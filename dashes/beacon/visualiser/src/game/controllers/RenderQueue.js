import { CANVAS_RENDER_ELEMENT } from "../../index.js";

export default class RenderQueueController {
  constructor(container) {
    this.renderQueue = [];
    this.currentIndex = 0;
    this.container = container;
  }

  /**
   * Add a path to the list of paths to be rendered.
   * @param {BeaconController} path
   */
  addToRenderQueue(path) {
    if (this.renderQueue[this.currentIndex] === undefined) {
      const pathElement = document.createElement(CANVAS_RENDER_ELEMENT);
      this.container.appendChild(pathElement);
      path.registerCanvas(pathElement);
      this.renderQueue[this.currentIndex] = {
        element: pathElement,
        controller: path,
        status: "requires-rendering",
      };
    } else {
      this.renderQueue[this.currentIndex].data = path;
      this.renderQueue[this.currentIndex].status = "requires-rendering";
    }
    this.currentIndex++;
  }

  async draw() {
    for (let [index, pathElement] of this.renderQueue.entries()) {
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
    this.currentIndex = 0;
  }

  clear() {
    this.renderQueue.forEach((pathElement) => {
      pathElement.element.remove();
    });

    this.renderQueue = [];
  }

  animationEnded() {
    for (const element of this.renderQueue) {
      if (element.controller.started === true) {
        return false;
      }
    }
    return true;
  }
}
