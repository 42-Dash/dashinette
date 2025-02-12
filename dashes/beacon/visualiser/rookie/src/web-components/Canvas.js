/**
 * @class This is a custom HTML element that contains a resizable p5 canvas
 */
export default class Canvas extends HTMLElement {
  constructor() {
    super();
    this._canvas = null;
    this._controller = null;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });
    // This custom HTML element contains a canvas, which will be later initialized
    // as a p5 canvas by the renderWith() method/
    this._canvas = document.createElement("canvas");
    const cssSheet = new CSSStyleSheet();
    cssSheet.replaceSync(`
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    `);
    shadowRoot.adoptedStyleSheets = [cssSheet];
    shadowRoot.appendChild(this._canvas);
  }

  resizeCallback() {
    if (this._controller == null) {
      return;
    }
    this._controller.onRedraw();
    this._controller.p5.resizeCanvas(this.clientWidth, this.clientHeight);
  }

  setController(controller) {
    if (controller === this._controller) {
      return;
    }
    if (this._controller != null) {
      this._controller.p5.remove();
    }
    this._controller = controller;
    controller.p5Canvas = this._canvas;
    const renderFunction = (p5) => {
      controller.p5 = p5;
      p5.draw = controller.draw.bind(controller);
      p5.setup = controller.setup.bind(controller);
    };
    new p5(renderFunction.bind(controller));
  }
}
