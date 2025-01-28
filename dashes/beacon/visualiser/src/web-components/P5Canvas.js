/**
 * @class This is an custom HTML element that contains a resizable p5 canvas
 */
export default class P5Canvas extends HTMLElement
{
  constructor() {
    super();
    this.canvas = null;
    this.controller = null;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'closed'});
    // This custom HTML element contains a canvas, which will be later initialized
    // as a p5 canvas by the renderWith() method/
    this.canvas = document.createElement('canvas');
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
    shadowRoot.appendChild(this.canvas);
  }

  resizeCallback() {
    if (this.controller == null) return;
    this.controller.onRedraw();
	  this.controller.p5.resizeCanvas(this.clientWidth, this.clientHeight);
  }

  setController(controller) {
    if (controller == this.controller) return;
    if (this.controller != null) {
      this.controller.p5.remove();
    }
    this.controller = controller;
    controller.p5Canvas = this.canvas;
    const renderFunction = p5 => {
      controller.p5 = p5;
      p5.draw  = controller.draw.bind(controller);
      p5.setup = controller.setup.bind(controller);
    };
    new p5(renderFunction.bind(controller));
  }
}
