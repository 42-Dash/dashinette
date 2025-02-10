/**
 * @brief This class is a wrapper for p5.js so that it can be used to pass to
 * the ResizableP5Canvas custom HTML element. To use this class, simply extend
 * it and implement the setup() and draw() methods. Example can be found in
 * the visualizer/src/renderer folder.
 */
export default class CanvasController {
  constructor(beaconSizes) {
    this.p5Canvas = null;
    this.p5 = null;
    this.beaconSizes = beaconSizes;
  }

  get width() {
    return this.p5Canvas.clientWidth;
  }

  get height() {
    return this.p5Canvas.clientHeight;
  }

  updateBeacons(newBeacons) {
    this.beaconSizes = newBeacons;
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
