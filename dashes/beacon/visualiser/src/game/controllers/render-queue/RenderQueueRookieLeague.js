import { CANVAS_RENDER_ELEMENT } from "../../../index.js";

const STATUS = {
  REQUIRES_RENDERING: "requires-rendering",
  RENDERED: "rendered",
};

/**
 * @class RenderQueueController
 * @brief Manages the rendering queue of beacon animations.
 *
 * This class handles the queue of animation paths to be rendered sequentially.
 * It ensures that each beacon animation starts at the correct time and
 * provides methods to manage and reset the rendering queue.
 */
export default class RenderQueueRookieLeagueController {
  constructor(container) {
    this._renderQueue = [];
    this._currentIndex = 0;
    this._container = container;
  }

  addToRenderQueue(beaconController) {
    const existingEntry = this._renderQueue[this._currentIndex];

    if (existingEntry) {
      existingEntry.data = beaconController;
      existingEntry.status = STATUS.REQUIRES_RENDERING;
    } else {
      const beaconElement = document.createElement(CANVAS_RENDER_ELEMENT);
      this._container.appendChild(beaconElement);
      beaconController.registerCanvas(beaconElement);
      this._renderQueue[this._currentIndex] = {
        element: beaconElement,
        controller: beaconController,
        status: STATUS.REQUIRES_RENDERING,
      };
    }

    this._currentIndex++;
  }

  async draw() {
    for (let [index, beaconElement] of this._renderQueue.entries()) {
      new Promise((resolve) => {
        setTimeout(() => {
          if (beaconElement.status === STATUS.REQUIRES_RENDERING) {
            beaconElement.controller.start();
          } else if (beaconElement.status === STATUS.RENDERED) {
            beaconElement.controller.clear();
          }
          beaconElement.status = STATUS.RENDERED;
          resolve();
        }, 1500 * index);
      });
    }
  }

  resetRenderQueue() {
    this._currentIndex = 0;
  }

  clear() {
    this._renderQueue.forEach((beacon) => beacon.element.remove());
    this._renderQueue = [];
  }

  isQueueFinished() {
    return this._renderQueue.every((beacon) => !beacon.controller.isStarted());
  }
}
