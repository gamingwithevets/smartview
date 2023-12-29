'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
class lcd {
	constructor(calcModel, calcDivId, width, height) {
		this.created = false;
		this.SCREEN_SIZE = 1536;
		this.INDICARTORS_STATUS_LENGTH = 3;
		this.calcModel = calcModel;
		this.calcDivId = calcDivId;
		this.width = width;
		this.height = height;
		this.lastScreenData = new Uint8Array(this.SCREEN_SIZE);
		this.topIconsStatus = 0;
	}
	saveScreenData(screen_data) {
		this.lastScreenData = screen_data;
	}
	saveTopIconsData(status_bar) {
		this.topIconsStatus = status_bar;
	}
	getScreen() {
		return document.getElementById("display").toDataURL();
	}
	start() {
		return new Promise((resolve, reject) => {
			this.create();
			if (this.created) {
				this.screenChanged(this.lastScreenData);
				this.topIconsChanged(this.topIconsStatus);
			}
			resolve();
		});
	}
	stop() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	reset() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	getState() {
		let scr_size = this.SCREEN_SIZE;
		const size = scr_size + this.INDICARTORS_STATUS_LENGTH;
		const arr = new Uint8Array(size);
		if (typeof this.lastScreenData === "undefined") {
			this.lastScreenData = new Uint8Array(this.SCREEN_SIZE);
		}
		arr.set(this.lastScreenData);
		arr[scr_size++] = this.topIconsStatus & 0xff;
		arr[scr_size++] = this.topIconsStatus >> 8 & 0xff;
		arr[scr_size] = this.topIconsStatus >> 16 & 0xff;
		return arr;
	}
	setState(state) {
		if (typeof state !== "undefined") {
			this.lastScreenData = state.subarray(0, state.length - this.INDICARTORS_STATUS_LENGTH);
		}
	}
	create() {
		if (!this.created) {
			const div = document.createElement("div");
			const canvas = document.createElement("canvas");
			const calc_model = document.getElementById(this.calcModel);
			const calc_div_id = document.getElementById(this.calcDivId);
			const screen = document.querySelectorAll("*[id^=\"" + this.calcModel + "_CALCSCREEN\"");
			if (calc_model !== null && screen.length > 0 && calc_div_id !== null) {
				while (calc_div_id.firstChild) {
					calc_div_id.removeChild(calc_div_id.firstChild);
				}
				calc_div_id.insertBefore(calc_model, calc_div_id.firstChild);
				calc_div_id.className = "calculatorDiv";
				calc_div_id.tabIndex = 0;
				div.id = "displayDiv";
				div.className = "displayDiv";
				calc_div_id.appendChild(div);
				canvas.id = "display";
				canvas.className = "display";
				canvas.width = this.width;
				canvas.height = this.height;
				div.appendChild(canvas);
				this.canvasContext = canvas.getContext("2d");
				this.align();
				this.created = true;
			}
		}
	}
	align() {
		if (this.created) {
			const calc_model = document.getElementById(this.calcModel);
			const display_div = document.getElementById("displayDiv");
			const screen = document.querySelectorAll("*[id^=\"" + this.calcModel + "_CALCSCREEN\ rect");
			if (calc_model !== null && screen.length > 0) {
				const screen_0 = screen[0];
				const viewbox = calc_model.getAttribute("viewBox").split(/\s*,\s*|\s+/);
				const viewbox0 = parseFloat(viewbox[0]);
				const viewbox1 = parseFloat(viewbox[1]);
				const viewbox2 = parseFloat(viewbox[2]);
				const viewbox3 = parseFloat(viewbox[3]);
				const baseval_x = screen_0.x.baseVal.value + 2;
				const baseval_y = screen_0.y.baseVal.value + 2;
				const baseval_w = screen_0.width.baseVal.value - 4;
				const baseval_h = screen_0.height.baseVal.value - 4;
				display_div.style.left = (baseval_x - viewbox0) / viewbox2 * 100 + "%";
				display_div.style.top = (baseval_y - viewbox1) / viewbox3 * 100 + "%";
				display_div.style.width = baseval_w / viewbox2 * 100 + "%";
				display_div.style.height = baseval_h / viewbox3 * 100 + "%";
			}
		}
	}
}
exports.GenericLCD = lcd;
