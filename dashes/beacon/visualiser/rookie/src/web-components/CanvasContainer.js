/**
 * @class This is a custom HTML element that contains a resizable p5 canvas
 */
export default class CanvasContainer extends HTMLElement {
  constructor() {
    super();
    this._resizeObserver = null;
    this._mutationObserver = null;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    // This custom HTML element contains a canvas, which will be later initialized
    // as a p5 canvas by the renderWith() method/
    const canvasesSlot = document.createElement("slot");
    shadowRoot.appendChild(canvasesSlot);
    // This resizes the canvases within when this custom HTML element is resized.
    this._resizeObserver = new ResizeObserver((entries) => {
      entries[0].target.children.forEach((element) => element.resizeCallback());
    });
    // This redraws the canvases within when new canvases are added.
    this._mutationObserver = new MutationObserver((mutations) => {
      mutations[0].target.children.forEach((element) =>
        element.resizeCallback(),
      );
    });
    this._resizeObserver.observe(this);
    this._mutationObserver.observe(this, {
      attributes: false,
      childList: true,
      subtree: false,
    });
  }

  disconnectedCallback() {
    this._resizeObserver.disconnect();
    this._mutationObserver.disconnect();
  }
}
