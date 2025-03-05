import RenderQueueBase from "./RenderQueueBase.js";

/**
 * @class RenderQueueController
 * @brief Manages the rendering queue of beacon animations.
 *
 * This class handles the queue of animation paths to be rendered sequentially.
 * It ensures that each beacon animation starts at the correct time and
 * provides methods to manage and reset the rendering queue.
 */
export default class RenderQueueRookie extends RenderQueueBase {
  constructor(container) {
    super(container);
  }

  async draw() {
    const totalElements = this._renderQueue.length;

    for (let [index, beaconElement] of this._renderQueue.entries()) {
      this.initHeader(totalElements - index, beaconElement);

      if (beaconElement.status === RenderQueueBase.STATUS.REQUIRES_RENDERING) {
        beaconElement.controller.clear();
        beaconElement.controller.start();
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}
