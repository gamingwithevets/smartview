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
			const _0xa199b = document.getElementById("calculatorDiv");
			console.log("Called create() from GenericScientificLCDForSmartview");
			const _0x591702 = document.createElement("div");
			_0x591702.id = "displayDiv";
			_0x591702.className = "displayDiv";
			_0x591702.style.display = this.displayOFF ? "none" : "block";
			_0xa199b.appendChild(_0x591702);
			const _0x504724 = document.createElement("canvas");
			_0x504724.id = "display";
			_0x504724.className = "display";
			_0x504724.width = 384;
			_0x504724.height = 144;
			_0x591702.appendChild(_0x504724);
			this.canvasContext = _0x504724.getContext("2d");
			this.created = true;
			_0x504724.onmousedown = function (_0x3a7728) {
				const _0x59e640 = typeof app;
				if (_0x59e640 !== "undefined") {
					app.LCDClickEvent();
				} else {
					console.log("app is Undefined, we were not able to init the LCDClickEvent handler!");
				}
			};
		}
	}
	start() {
		return new Promise((_0x6b1d30, _0x136cfb) => {
			if (!this.created) {
				this.create();
				this.refreshTimerID = window.setInterval(() => {
					if (this.lastCompleteDataString) {
						const _0x593769 = typeof app;
						if (_0x593769 !== "undefined" && typeof app.setScreenUnidimentionalDataStrComp !== "undefined") {
							app.setScreenUnidimentionalDataStrComp(this.lastCompleteDataString);
						} else {
							console.log("Method not found");
						}
					}
				}, this.refreshTimerInterval);
			}
			this.screenChanged(this.lastPartialScreenDataBuffer);
			this.topIconsChanged(this.topIconsStatus);
			_0x6b1d30();
		});
	}
	setState(_0x25e8f) {
		if (typeof _0x25e8f !== "undefined") {
			let _0x380829 = _0x25e8f.length - this.INDICARTORS_STATUS_LENGTH;
			const _0x178243 = _0x25e8f[_0x380829++] | _0x25e8f[_0x380829++] << 8 | _0x25e8f[_0x380829] << 16;
			const _0x3cfb30 = _0x25e8f.length - this.INDICARTORS_STATUS_LENGTH;
			this.lastPartialScreenDataBuffer = _0x25e8f.subarray(0, _0x3cfb30);
			super.saveScreenData(this.lastPartialScreenDataBuffer);
			super.saveTopIconsData(_0x178243);
			this.buildAllScreenBufferColumnMajor();
		}
	}
	screenChanged(_0x77e24) {
		super.screenChanged(_0x77e24);
		this.lastPartialScreenDataBuffer = _0x77e24;
		this.buildAllScreenBufferColumnMajor();
	}
	topIconsChanged(_0x2a74d9) {
		super.topIconsChanged(_0x2a74d9);
		this.buildAllScreenBufferColumnMajor();
	}
	buildAllScreenBufferColumnMajor() {
		const _0x8dc01f = this.lastPartialTopIconsBuffer;
		const _0x1ce525 = this.lastPartialScreenDataBuffer;
		if (_0x8dc01f && _0x1ce525) {
			let _0x526b78 = 0;
			let _0x46e9a5 = 0;
			this.completeScreenBuffer[0] = _0x8dc01f[_0x526b78++];
			for (let _0x17eb0d = 1; _0x17eb0d < 1728; _0x17eb0d++) {
				if (_0x17eb0d % 9 === 0) {
					this.completeScreenBuffer[_0x17eb0d] = _0x8dc01f[_0x526b78++];
				} else {
					this.completeScreenBuffer[_0x17eb0d] = _0x1ce525[_0x46e9a5++];
				}
			}
			this.lastCompleteDataString = this.uint8ToStr(this.completeScreenBuffer);
		} else {
			console.log("ErRor! Couln't build the complete screen buffer, invalid params!!");
		}
	}
	drawIcon(_0x2a3d5a, _0x41ace3, _0xfc6cde, _0x27d059) {
		super.drawIcon(_0x2a3d5a, _0x41ace3, _0xfc6cde, _0x27d059);
		const _0x430548 = _0x2a3d5a > 0 ? _0x2a3d5a / 0x2 : 0;
		if (_0x27d059) {
			this.lastPartialTopIconsBuffer.set(_0xfc6cde, _0x430548);
		} else {
			this.lastPartialTopIconsBuffer.fill(0, _0x430548, _0x430548 + _0xfc6cde.length);
		}
	}
	uint8ToStr(_0x414501) {
		if (_0x414501 !== null && _0x414501.length > 0) {
			const _0x679df4 = [];
			let _0x475503 = 0;
			let _0x46bc21 = 0;
			let _0x2695ca = _0x414501[_0x46bc21];
			let _0x59b926;
			while (_0x46bc21 < _0x414501.length) {
				if (_0x2695ca !== (_0x59b926 = _0x414501[_0x46bc21++])) {
					_0x679df4.push(_0x2695ca === 0 ? String.fromCharCode(0x100) : String.fromCharCode(_0x2695ca));
					if (_0x475503 > 0x1) {
						_0x679df4.push(String.fromCharCode(0x101));
						_0x679df4.push(_0x475503);
						_0x679df4.push(String.fromCharCode(0x101));
					}
					_0x475503 = 0;
					_0x2695ca = _0x59b926;
				}
				_0x475503++;
			}
			_0x679df4.push(_0x2695ca === 0 ? String.fromCharCode(0x100) : String.fromCharCode(_0x2695ca));
			if (_0x475503 > 0x1) {
				_0x679df4.push(String.fromCharCode(0x101));
				_0x679df4.push(_0x475503);
				_0x679df4.push(String.fromCharCode(0x101));
			}
			const _0x17df5f = _0x679df4.join('');
			return _0x17df5f;
		} else {
			console.log("unit2ToStr with invalid parameter!");
			return null;
		}
	}
}
exports.GenericScientificLCDForSmartview = GenericScientificLCDForSmartview;