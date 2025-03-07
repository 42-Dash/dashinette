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
    this.setCanvasHeader("");
    this._renderQueue.forEach((beacon) => beacon.element.remove());
    this._renderQueue = [];
  }

  isQueueFinished() {
    return this._renderQueue.every((beacon) => !beacon.controller.isStarted());
  }

  initHeader(place, queueItem) {
    const { r, g, b } = queueItem.controller.getColor();
    const displayTitle = `${queueItem.controller.getName()} - ${RenderQueueBase.toOrdinalNotation(place)} place`;
    this.setCanvasHeader(displayTitle, `rgb(${r}, ${g}, ${b})`);
  }

  setCanvasHeader(groupName, color = "") {
    const container = document.getElementById("dynamic-header");

    container.textContent = groupName;
    container.style.color = color;
  }

  static toOrdinalNotation(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
      return `${number}st`;
    } else if (number % 10 === 2 && number % 100 !== 12) {
      return `${number}nd`;
    } else if (number % 10 === 3 && number % 100 !== 13) {
      return `${number}rd`;
    } else {
      return `${number}th`;
    }
  }
}
