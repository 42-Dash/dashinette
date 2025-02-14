/**
 * @class Canvas
 * @extends HTMLElement
 * @description A custom HTML element that contains a resizable p5.js canvas.
 *
 * This web component:
 * - Creates a shadow DOM with an internal `<canvas>` element.
 * - Supports dynamic resizing via `resizeCallback()`.
 * - Integrates with a p5.js controller for rendering.
 */
export default class Canvas extends HTMLElement {
  constructor() {
    super();
    this._canvas = null;
    this._controller = null;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });

    // Create and style the internal <canvas> element
    this._canvas = document.createElement("canvas");

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this._canvas);
  }

  disconnectedCallback() {
    if (this._controller !== null) {
      this._controller.removeP5Instance();
      this._controller = null;
    }
  }

  resizeCallback() {
    if (this._controller === null) return;

    this._controller.resizeCanvas(this.clientWidth, this.clientHeight);
    this._controller.onRedraw();
  }

  setController(controller) {
    if (controller === this._controller) return;

    if (this._controller !== null) {
      this._controller.removeP5Instance();
    }

    this._controller = controller;
    controller.setCanvasElement(this._canvas);

    new p5((p5Instance) => {
      controller.setP5Instance(p5Instance);
      p5Instance.setup = controller.setup.bind(controller);
      p5Instance.draw = controller.draw.bind(controller);
    });
  }
}
