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
    for (let [index, beaconElement] of this._renderQueue.entries()) {
      new Promise((resolve) => {
        setTimeout(() => {
          if (
            beaconElement.status === RenderQueueBase.STATUS.REQUIRES_RENDERING
          ) {
            beaconElement.controller.start();
          } else if (beaconElement.status === RenderQueueBase.STATUS.RENDERED) {
            beaconElement.controller.clear();
          }
          beaconElement.status = RenderQueueBase.STATUS.RENDERED;
          resolve();
        }, 1000 * index);
      });
    }
  }
}
