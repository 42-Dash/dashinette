/**
 * @brief This class is a wrapper for p5.js so that it can be used to pass to
 * the ResizableP5Canvas custom HTML element. To use this class, simply extend
 * it and implement the setup() and draw() methods. Example can be found in
 * the visualizer/src/renderer folder.
 */
export default class P5CanvasController {
  constructor(jsonData, beacon_sizes) {
    this.p5Canvas = null;
    this.p5 = null;
    this.json = jsonData;
    this.beacon_sizes = beacon_sizes;
    this.unit = 1;
    this.routerCount = this.calcRouter();
  }

  get width() {
    return this.p5Canvas.clientWidth;
  }
  get height() {
    return this.p5Canvas.clientHeight;
  }

  calcRouter() {
    // wrong this.json in setup
    let starCount = 0;
    console.log("this.json", this.json);
    for (let row of this.json) {
      starCount += row.split("*").length - 1;
    }
    return starCount;
  }

  updateJson(newJsonData) {
    // wrong data is passed, the bug is here
    console.log("newJsonData", newJsonData);
    this.json = newJsonData;
    this.routerCount = this.calcRouter();
  }

  updateBeacons(newBeacons) {
    this.beacon_sizes = newBeacons;
  }

  registerCanvas(resizableCanvas) {
    this.p5Canvas = resizableCanvas.canvas;
    resizableCanvas.setController(this);
  }

  hasRegisteredCanvas() {
    return this.p5Canvas != null;
  }

  onRedraw() {}
}
