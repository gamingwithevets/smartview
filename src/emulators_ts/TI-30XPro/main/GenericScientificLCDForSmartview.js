'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const GenericLCDColumnMajor = require("../../../../src/emulators_ts/GenericLCDColumnMajor");
class GenericScientificLCDForSmartview extends GenericLCDColumnMajor.GenericLCDColumnMajor {
	constructor(calcModel, calcDivId) {
		super(calcModel, calcDivId);
		this.lastPartialScreenDataBuffer = new Uint8Array(new ArrayBuffer(1536));
		this.lastPartialTopIconsBuffer = new Uint8Array(new ArrayBuffer(192));
		this.completeScreenBuffer = new Uint8Array(new ArrayBuffer(1728));
		this.refreshTimerInterval = 42;
		this.displayOFF = false;
	}
	create() {
		if (!this.created) {
			const calculatorDiv = document.getElementById("calculatorDiv");
			console.log("Called create() from GenericScientificLCDForSmartview");
			const div = document.createElement("div");
			div.id = "displayDiv";
			div.className = "displayDiv";
			div.style.display = this.displayOFF ? "none" : "block";
			calculatorDiv.appendChild(div);
			const canvas = document.createElement("canvas");
			canvas.id = "display";
			canvas.className = "display";
			canvas.width = 384;
			canvas.height = 144;
			div.appendChild(canvas);
			this.canvasContext = canvas.getContext("2d");
			this.created = true;
			canvas.onmousedown = function (_0x3a7728) {
				const apptype = typeof app;
				if (apptype !== "undefined") {
					app.LCDClickEvent();
				} else {
					console.log("app is Undefined, we were not able to init the LCDClickEvent handler!");
				}
			};
		}
	}
	start() {
		return new Promise((resolve, reject) => {
			if (!this.created) {
				this.create();
				this.refreshTimerID = window.setInterval(() => {
					if (this.lastCompleteDataString) {
						const apptype = typeof app;
						if (apptype !== "undefined" && typeof app.setScreenUnidimentionalDataStrComp !== "undefined") {
							app.setScreenUnidimentionalDataStrComp(this.lastCompleteDataString);
						} else {
							console.log("Method not found");
						}
					}
				}, this.refreshTimerInterval);
			}
			this.screenChanged(this.lastPartialScreenDataBuffer);
			this.topIconsChanged(this.topIconsStatus);
			resolve();
		});
	}
	setState(state) {
		if (typeof state !== "undefined") {
			let statelen = state.length - this.INDICARTORS_STATUS_LENGTH;
			const data = state[statelen++] | state[statelen++] << 8 | state[statelen] << 16;
			const buffer_size = state.length - this.INDICARTORS_STATUS_LENGTH;
			this.lastPartialScreenDataBuffer = state.subarray(0, buffer_size);
			super.saveScreenData(this.lastPartialScreenDataBuffer);
			super.saveTopIconsData(data);
			this.buildAllScreenBufferColumnMajor();
		}
	}
	screenChanged(screen) {
		super.screenChanged(screen);
		this.lastPartialScreenDataBuffer = screen;
		this.buildAllScreenBufferColumnMajor();
	}
	topIconsChanged(sbar) {
		super.topIconsChanged(sbar);
		this.buildAllScreenBufferColumnMajor();
	}
	buildAllScreenBufferColumnMajor() {
		const sbar_buffer = this.lastPartialTopIconsBuffer;
		const screen_buffer = this.lastPartialScreenDataBuffer;
		if (sbar_buffer && screen_buffer) {
			let j = 0;
			let k = 0;
			this.completeScreenBuffer[0] = sbar_buffer[j++];
			for (let i = 1; i < 1728; i++) {
				if (i % 9 === 0) {
					this.completeScreenBuffer[i] = sbar_buffer[j++];
				} else {
					this.completeScreenBuffer[i] = screen_buffer[k++];
				}
			}
			this.lastCompleteDataString = this.uint8ToStr(this.completeScreenBuffer);
		} else {
			console.log("ErRor! Couln't build the complete screen buffer, invalid params!!");
		}
	}
	drawIcon(icon, y, data, visible) {
		super.drawIcon(icon, y, data, visible);
		const _0x430548 = icon > 0 ? icon / 0x2 : 0;
		if (visible) {
			this.lastPartialTopIconsBuffer.set(data, _0x430548);
		} else {
			this.lastPartialTopIconsBuffer.fill(0, _0x430548, _0x430548 + data.length);
		}
	}
	uint8ToStr(num) {
		if (num !== null && num.length > 0) {
			const arr = [];
			let h = 0;
			let i = 0;
			let k = num[i];
			let j;
			while (i < num.length) {
				if (k !== (j = num[i++])) {
					arr.push(k === 0 ? String.fromCharCode(0x100) : String.fromCharCode(k));
					if (h > 0x1) {
						arr.push(String.fromCharCode(0x101));
						arr.push(h);
						arr.push(String.fromCharCode(0x101));
					}
					h = 0;
					k = j;
				}
				h++;
			}
			arr.push(k === 0 ? String.fromCharCode(0x100) : String.fromCharCode(k));
			if (h > 1) {
				arr.push(String.fromCharCode(0x101));
				arr.push(h);
				arr.push(String.fromCharCode(0x101));
			}
			const string = arr.join('');
			return string;
		} else {
			console.log("unit2ToStr with invalid parameter!");
			return null;
		}
	}
}
exports.GenericScientificLCDForSmartview = GenericScientificLCDForSmartview;
