/**
 * @brief This class is a wrapper for p5.js so that it can be used to pass to
 * the ResizableP5Canvas custom HTML element. To use this class, simply extend
 * it and implement the setup() and draw() methods. Examlpe can be found in 
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

	get width() { return this.p5Canvas.clientWidth; }
	get height() { return this.p5Canvas.clientHeight; }

	calcRouter() {
		let starCount = 0;
		for (let row of this.json) {
			starCount += row.split('*').length - 1;
		}
		return starCount;
	}

	updateJson(newJsonData) {
		this.json = newJsonData;
		this.routerCount = this.calcRouter();
	}

	updateBeacons(newBeacons) { this.beacon_sizes = newBeacons; }
	registerCanvas(resizablep5Canvas) {
		this.p5Canvas = resizablep5Canvas.canvas;
		resizablep5Canvas.setController(this);
	}
	hasRegisteredCanvas() { return this.p5Canvas != null; }
	onRedraw() { }
}
