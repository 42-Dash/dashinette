/**
 * @class This is an custom HTML element that contains a resizable p5 canvas
 */
export default class P5CanvasContainer extends HTMLElement
{
  constructor() {
    super();
    this.resizeObserver = null;
    this.mutationObserver = null;
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'open'});
    // This custom HTML element contains a canvas, which will be later initialized
    // as a p5 canvas by the renderWith() method/
    const canvasesSlot = document.createElement('slot');
    shadowRoot.appendChild(canvasesSlot);
    // This resizes the canvases within when this custom HTML element is resized.
    this.resizeObserver = new ResizeObserver(entries => {
      entries[0].target.children.forEach(element => element.resizeCallback());
    });
    // This redraws the canvases within when new canvases are added.
    this.mutationObserver = new MutationObserver(mutations => {
      mutations[0].target.children.forEach(element => element.resizeCallback());
    });
    this.resizeObserver.observe(this);
    this.mutationObserver.observe(this, {attributes: false, childList: true, subtree: false});
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    this.mutationObserver.disconnect();
  }
}
