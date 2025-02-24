export default class Logo extends HTMLElement {
  static observedAttributes = ["left-color", "right-color"];

  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });

    const cssSheet = new CSSStyleSheet();
    cssSheet.replaceSync(`
      :host > svg {
        object-fit: contain;
        width: 100%;
        height: 100%;
      }

      .borders {
        display: none;
      }

      .left {
        fill: var(--left-color, rgb(190,138,255));
        transition: fill 10s;
      }

      .right{
        fill: var(--right-color, #fff);
        transition: fill 10s;
      }
      `);
    shadowRoot.adoptedStyleSheets = [cssSheet];

    fetch("../shared/images/DASH.svg")
      .then((response) => response.text())
      .then(
        (text) =>
          new DOMParser().parseFromString(text, "image/svg+xml").firstChild,
      )
      .then((svg) => shadowRoot.appendChild(svg))
      .catch((error) => console.error(error));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "left-color" || name === "right-color") {
      this.style.setProperty(`--${name}`, newValue);
    }
  }
}
