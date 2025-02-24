import RenderQueueBase from "./RenderQueueBase.js";

/**
 * @class RenderQueueController
 * @brief Manages the rendering queue of beacon animations.
 *
 * This class handles the queue of animation paths to be rendered sequentially.
 * It ensures that each beacon animation starts at the correct time and
 * provides methods to manage and reset the rendering queue.
 */
export default class RenderQueueOpen extends RenderQueueBase {
  constructor(container, mapController) {
    super(container);
    this._mapController = mapController;
  }

  async draw() {
    for (let queueItem of this._renderQueue) {
      this._mapController.updateMapsOrder(queueItem.controller.getMapOrder());
      await this.#awaitMapAnimation();

      queueItem.controller.start();
      queueItem.status = RenderQueueBase.STATUS.RENDERED;
      await new Promise((resolve) => setTimeout(resolve, 3000));
      queueItem.element.remove();
    }
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
