/**
 * @class CanvasController
 * @brief A base wrapper for p5.js, designed for use with the ResizableP5Canvas custom HTML element.
 *
 * This class should be **extended** by specific controllers, which must implement:
 * - `setup()`
 * - `draw()`
 * - `onRedraw()`
 */
export default class CanvasController {
  constructor() {
    this._canvasElement = null;
    this._p5Instance = null;
  }

  /**
   * Abstract method - must be implemented in subclasses.
   * This method initializes p5.js settings.
   */
  setup() {
    throw new Error("setup() must be implemented in a subclass.");
  }

  /**
   * Abstract method - must be implemented in subclasses.
   * This method contains the p5.js draw logic.
   */
  draw() {
    throw new Error("draw() must be implemented in a subclass.");
  }

  /**
   * Optional: Can be implemented in subclasses to handle redraw events.
   */
  onRedraw() {}

  /** @returns {number} The width of the canvas */
  get width() {
    return this._canvasElement?.clientWidth || 0;
  }

  /** @returns {number} The height of the canvas */
  get height() {
    return this._canvasElement?.clientHeight || 0;
  }

  /** Removes the p5 instance safely */
  removeP5Instance() {
    if (this._p5Instance) {
      this._p5Instance.remove();
    }
  }

  /** Resizes the canvas safely */
  resizeCanvas(width, height) {
    if (this._p5Instance) {
      this._p5Instance.resizeCanvas(width, height);
    }
  }

  /**
   * Sets the p5 instance.
   * @param {p5} p5Instance - The p5.js instance to use.
   */
  setP5Instance(p5Instance) {
    this._p5Instance = p5Instance;
  }

  /**
   * Assigns an HTML canvas element to this controller.
   * @param {HTMLCanvasElement} canvasElement - The canvas element.
   */
  setCanvasElement(canvasElement) {
    this._canvasElement = canvasElement;
  }

  /**
   * Registers a ResizableP5Canvas instance and attaches it to this controller.
   * @param resizableCanvas - The custom element managing the canvas.
   */
  registerCanvas(resizableCanvas) {
    this._canvasElement = resizableCanvas.canvas;
    resizableCanvas.setController(this);
  }

  /** @returns {boolean} Whether a canvas is registered */
  hasRegisteredCanvas() {
    return this._canvasElement !== null;
  }
}
