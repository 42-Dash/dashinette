export default class ColorGenerator {
  constructor() {
    this._index = 0;
    this._colores = [
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
    if (this._index >= this._colores.length) {
      this._colores.push(this.#randomColor());
    }
    return this._colores[this._index++];
  }

  #randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return { r, g, b };
  }
}
