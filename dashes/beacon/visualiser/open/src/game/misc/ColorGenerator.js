export default class ColorGenerator {
  constructor() {
    this._index = 0;
    this._colors = [
      { r: 255, g: 40, b: 40 },
      { r: 255, g: 255, b: 40 },
      { r: 255, g: 40, b: 255 },
      { r: 40, g: 255, b: 40 },
      { r: 128, g: 128, b: 255 },
      { r: 255, g: 128, b: 40 },
      { r: 40, g: 255, b: 128 },
      { r: 40, g: 255, b: 255 },
      { r: 255, g: 128, b: 128 },
      { r: 255, g: 128, b: 255 },
    ];
  }

  next() {
    if (this._index >= this._colors.length) {
      this._colors.push(this.#randomColor());
    }
    return this._colors[this._index++];
  }

  #randomColor() {
    return {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256),
    };
  }
}
