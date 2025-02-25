export default class GradientGenerator {
  static PURPLE_GRADIENT = {
    "*": { r: 195, g: 55, b: 99 },
    1: { r: 183, g: 47, b: 105 },
    2: { r: 170, g: 41, b: 111 },
    3: { r: 155, g: 38, b: 115 },
    4: { r: 138, g: 37, b: 119 },
    5: { r: 120, g: 37, b: 121 },
    6: { r: 101, g: 38, b: 122 },
    7: { r: 80, g: 38, b: 121 },
    8: { r: 58, g: 39, b: 118 },
    9: { r: 29, g: 38, b: 114 },
  };
  static GRADIENTS = [GradientGenerator.PURPLE_GRADIENT];
  static _prevId = 0;

  constructor() {
    this._id = GradientGenerator._prevId;
    GradientGenerator._prevId++;
    GradientGenerator._prevId %= GradientGenerator.GRADIENTS.length;
  }

  get(key) {
    return GradientGenerator.GRADIENTS[this._id][key];
  }
}
