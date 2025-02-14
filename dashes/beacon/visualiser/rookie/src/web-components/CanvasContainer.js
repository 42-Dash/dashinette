/**
 * @class CanvasContainer
 * @extends HTMLElement
 * @description A custom HTML element that manages and resizes p5.js canvases inside it.
 *
 * This component:
 * - Automatically resizes all child `<canvas>` elements when resized.
 * - Redraws canvases when new ones are added.
 * - Uses `ResizeObserver` and `MutationObserver` to track changes.
 */
export default class CanvasContainer extends HTMLElement {
  constructor() {
    super();
    this._resizeObserver = null;
    this._mutationObserver = null;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(document.createElement("slot"));

    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        for (const element of entry.target.children) {
          if (typeof element.resizeCallback === "function") {
            element.resizeCallback(entries);
          }
        }
      }
    });

    this._mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const element of mutation.addedNodes) {
          if (typeof element.resizeCallback === "function") {
            element.resizeCallback();
          }
        }
      }
    });

    this._resizeObserver.observe(this);
    this._mutationObserver.observe(this, {
      childList: true,
      attributes: false,
      subtree: false,
    });
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
      this._mutationObserver = null;
    }
  }
}
