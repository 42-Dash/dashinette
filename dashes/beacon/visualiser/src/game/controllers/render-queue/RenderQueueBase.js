import { CANVAS_RENDER_ELEMENT } from "../../../index.js";

/**
 * @class RenderQueueController
 * Base class for managing the rendering queue of beacon animations
 */
export default class RenderQueueBase {
  static STATUS = {
    REQUIRES_RENDERING: "requires-rendering",
    RENDERED: "rendered",
  };

  constructor(container) {
    this._renderQueue = [];
    this._currentIndex = 0;
    this._container = container;
  }

  addToRenderQueue(beaconController) {
    const existingEntry = this._renderQueue[this._currentIndex];

    if (existingEntry) {
      existingEntry.data = beaconController;
      existingEntry.status = RenderQueueBase.STATUS.REQUIRES_RENDERING;
    } else {
      const beaconElement = document.createElement(CANVAS_RENDER_ELEMENT);
      this._container.appendChild(beaconElement);
      beaconController.registerCanvas(beaconElement);
      this._renderQueue[this._currentIndex] = {
        element: beaconElement,
        controller: beaconController,
        status: RenderQueueBase.STATUS.REQUIRES_RENDERING,
      };
    }

    this._currentIndex++;
  }

  // this function must be implemented by subclasses!
  async draw() {
    throw new Error("draw() must be implemented in subclasses");
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
