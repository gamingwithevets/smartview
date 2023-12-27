'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
class lcd {
	constructor(calcModel, calcDivId, width, height) {
		this.created = false;
		this.SCREEN_SIZE = 0x600;
		this.INDICARTORS_STATUS_LENGTH = 0x3;
		this.calcModel = calcModel;
		this.calcDivId = calcDivId;
		this.width = width;
		this.height = height;
		this.lastScreenData = new Uint8Array(this.SCREEN_SIZE);
		this.topIconsStatus = 0;
	}
	saveScreenData(_0x4463bc) {
		this.lastScreenData = _0x4463bc;
	}
	saveTopIconsData(_0x289218) {
		this.topIconsStatus = _0x289218;
	}
	getScreen() {
		return document.getElementById("display").toDataURL();
	}
	start() {
		return new Promise((_0x5668fd, _0x1afd3f) => {
			this.create();
			if (this.created) {
				this.screenChanged(this.lastScreenData);
				this.topIconsChanged(this.topIconsStatus);
			}
			_0x5668fd();
		});
	}
	stop() {
		return new Promise((_0x1b0ea1, _0x574971) => {
			_0x1b0ea1();
		});
	}
	reset() {
		return new Promise((_0x28fbee, _0x4dcddf) => {
			_0x28fbee();
		});
	}
	getState() {
		let _0x58f209 = this.SCREEN_SIZE;
		const _0x2994e5 = _0x58f209 + this.INDICARTORS_STATUS_LENGTH;
		const _0x39b91d = new Uint8Array(_0x2994e5);
		if (typeof this.lastScreenData === "undefined") {
			this.lastScreenData = new Uint8Array(this.SCREEN_SIZE);
		}
		_0x39b91d.set(this.lastScreenData);
		_0x39b91d[_0x58f209++] = this.topIconsStatus & 0xff;
		_0x39b91d[_0x58f209++] = this.topIconsStatus >> 8 & 0xff;
		_0x39b91d[_0x58f209] = this.topIconsStatus >> 16 & 0xff;
		return _0x39b91d;
	}
	setState(_0x1b71c5) {
		if (typeof _0x1b71c5 !== "undefined") {
			this.lastScreenData = _0x1b71c5.subarray(0, _0x1b71c5.length - this.INDICARTORS_STATUS_LENGTH);
		}
	}
	create() {
		if (!this.created) {
			const _0x3625fb = document.createElement("div");
			const _0x354f6a = document.createElement("canvas");
			const _0x3a2976 = document.getElementById(this.calcModel);
			const _0x5a61b2 = document.getElementById(this.calcDivId);
			const _0x2a79d1 = document.querySelectorAll("*[id^=\"" + this.calcModel + "_CALCSCREEN\");
			if (_0x3a2976 !== null && _0x2a79d1.length > 0 && _0x5a61b2 !== null) {
				while (_0x5a61b2.firstChild) {
					_0x5a61b2.removeChild(_0x5a61b2.firstChild);
				}
				_0x5a61b2.insertBefore(_0x3a2976, _0x5a61b2.firstChild);
				_0x5a61b2.className = "calculatorDiv";
				_0x5a61b2.tabIndex = 0;
				_0x3625fb.id = "displayDiv";
				_0x3625fb.className = "displayDiv";
				_0x5a61b2.appendChild(_0x3625fb);
				_0x354f6a.id = "display";
				_0x354f6a.className = "display";
				_0x354f6a.width = this.width;
				_0x354f6a.height = this.height;
				_0x3625fb.appendChild(_0x354f6a);
				this.canvasContext = _0x354f6a.getContext("2d");
				this.align();
				this.created = true;
			}
		}
	}
	align() {
		if (this.created) {
			const _0x29dd69 = document.getElementById(this.calcModel);
			const _0x52f189 = document.getElementById("displayDiv");
			const _0x5dae71 = document.querySelectorAll("*[id^=\"" + this.calcModel + "_CALCSCREEN\ rect");
			if (_0x29dd69 !== null && _0x5dae71.length > 0) {
				const _0x25df8e = _0x5dae71[0];
				const _0x4a8906 = _0x29dd69.getAttribute("viewBox").split(/\s*,\s*|\s+/);
				const _0x55bee5 = parseFloat(_0x4a8906[0]);
				const _0x34f4c6 = parseFloat(_0x4a8906[0x1]);
				const _0x44dbba = parseFloat(_0x4a8906[0x2]);
				const _0x423294 = parseFloat(_0x4a8906[0x3]);
				const _0x3ae209 = _0x25df8e.x.baseVal.value + 0x2;
				const _0x4356d0 = _0x25df8e.y.baseVal.value + 0x2;
				const _0x1358c8 = _0x25df8e.width.baseVal.value - 0x4;
				const _0x29934c = _0x25df8e.height.baseVal.value - 0x4;
				_0x52f189.style.left = (_0x3ae209 - _0x55bee5) / _0x44dbba * 0x64 + "%";
				_0x52f189.style.top = (_0x4356d0 - _0x34f4c6) / _0x423294 * 0x64 + "%";
				_0x52f189.style.width = _0x1358c8 / _0x44dbba * 0x64 + "%";
				_0x52f189.style.height = _0x29934c / _0x423294 * 0x64 + "%";
			}
		}
	}
}
exports.GenericLCD = lcd;
