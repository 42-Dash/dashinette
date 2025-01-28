export default class DashLogo extends HTMLElement
{
  static observedAttributes = ["left-color", "right-color"];

  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({mode: 'closed'});
    const cssSheet = new CSSStyleSheet();
    cssSheet.replaceSync(`
      :host > svg {
        object-fit: contain;
        width: 100%;
        heihgt: 100%;
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
    fetch("./images/DASH.svg")
      .then(response => response.text())
      .then(text => {
        return (new DOMParser()).parseFromString(text, "image/svg+xml").childNodes[0];
      })
      .then(svg => {
        shadowRoot.appendChild(svg);
      });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "left-color":
      case "right-color":
        this.style.setProperty(`--${name}`, newValue);
        break;
      default:
        break;
    }
  }
}
