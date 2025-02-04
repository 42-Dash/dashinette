import { CANVAS_ELEMENT } from "../../index.js";

export default class DashPathsQueueController {
  constructor(container) {
    this.renderQueue = [];
    this.currentIndex = 0;
    this.container = container;
  }

  /**
   * Add a path to the list of paths to be rendered.
   * @param {DashPathController} path
   */
  addToRenderQueue(path) {
    console.log();
    if (this.renderQueue[this.currentIndex] === undefined) {
      const pathElement = document.createElement(CANVAS_ELEMENT);
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

  draw(interval = 500, additional_interval = 100) {
    let promise = Promise.resolve();

    this.renderQueue.forEach((pathElement, index) => {
      promise = promise.then(() => {
        switch (pathElement.status) {
          case "requires-rendering":
            pathElement.controller.start();
            break;
          case "rendered":
            pathElement.controller.clear();
            break;
          default:
            break;
        }
        pathElement.status = "rendered";
        return new Promise(function (resolve) {
          setTimeout(resolve, interval + index * additional_interval);
        });
      });
    });
    return promise;
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

  removeRenderedPaths() {
    this.renderQueue.reduceRight((_, pathElement, index) => {
      if (pathElement.status === "rendered") {
        this.renderQueue.splice(index, 1);
        this.container.removeChild(pathElement.element);
      }
    });
  }
}
