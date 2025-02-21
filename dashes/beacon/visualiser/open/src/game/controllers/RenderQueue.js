import { CANVAS_RENDER_ELEMENT } from "../../index.js";

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
export default class RenderQueueController {
  constructor(container, mapController) {
    this._renderQueue = [];
    this._currentIndex = 0;
    this._container = container;
    this._mapController = mapController;
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
    for (let queueItem of this._renderQueue) {
      this._mapController.updateMapsOrder(queueItem.controller.getMapOrder());
      await this.#awaitMapAnimation();

      queueItem.controller.start();
      queueItem.status = STATUS.RENDERED;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      queueItem.element.remove();
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

  async #awaitMapAnimation() {
    return new Promise((resolve) => {
      const checkStage = () => {
        if (!this._mapController.isMapAnimationInProgress()) {
          clearInterval(interval);
          resolve();
        }
      };

      const interval = setInterval(checkStage, 100);
    });
  }
}
