'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const keypad = require("../../../../../../src/emulators_ts/TI-30XPrio/main/TI30XPrioKeypad");
const svg = require("./TI30XPrioSVG");
const utilities = require("../../../../../../src/emulators_ts/Utilities");
class TI30XPrioSmartviewKeypad extends keypad.TI30XPrioKeypad {
	start() {
		return new Promise((_0x5259d2, _0x1502da) => {
			let _0x32544f;
			let _0x1d10f6;
			const _0x28c627 = new DOMParser();
			const _0x5139b6 = _0x28c627.parseFromString(svg.TI30XPrioSVG, "text/xml");
			_0x32544f = _0x5139b6.documentElement;
			_0x32544f = document.importNode(_0x32544f, true);
			_0x1d10f6 = _0x32544f.getAttribute("viewBox");
			if (_0x1d10f6 == null || _0x1d10f6 == "undefined") {
				this.svgSizeW = 254;
				this.svgSizeH = 556;
			} else {
				_0x1d10f6 = _0x1d10f6.split(/\s+|,/);
				this.svgSizeW = parseInt(_0x1d10f6[2]);
				this.svgSizeH = parseInt(_0x1d10f6[3]);
			}
			this.calculatorDiv = document.getElementById("calculatorDiv");
			this.calculatorDiv.style.width = this.svgSizeW + "px";
			this.calculatorDiv.style.height = this.svgSizeH + "px";
			this.calculatorDiv.appendChild(_0x32544f);
			this.svg = _0x32544f;
			this.initKeysFromDOM();
			this.acceptInput(true);
			_0x5259d2();
		});
	}
	zoom() {
		const inner_height = window.innerHeight;
		const inner_width = window.innerWidth;
		let hi_ratio = inner_height / this.svgSizeH;
		if (hi_ratio * this.svgSizeW > inner_width) {
			hi_ratio = inner_width / this.svgSizeW;
		}
		this.calculatorDiv.style.zoom = '' + hi_ratio;
	}
	mouseDownHandler(_0x9c8371) {
		if (!this.isSVGKeyPressed) {
			if (typeof this.lastButtonPressed !== "undefined") {
				utilities.Utilities.removeClass(this.lastButtonPressed, this.highlightClass);
			}
			this.svTimePressed = new Date().getTime();
			super.mouseDownHandler(_0x9c8371);
			this.lastKey = this.lastButtonPressed;
		}
	}
	mouseUpHandler(_0x4373bc) {
		if (_0x4373bc.currentTarget instanceof Element) {
			const _0x356be5 = _0x4373bc.currentTarget;
			if (_0x356be5 === this.lastButtonPressed && typeof this.lastKey !== "undefined") {
				super.mouseUpHandler(_0x4373bc);
				utilities.Utilities.addClass(_0x356be5, this.highlightClass);
				this.lastKey = undefined;
				const _0xa11b93 = typeof app;
				if (_0xa11b93 !== "undefined" && typeof app.keyPressed !== "undefined") {
					app.keyPressed(_0x356be5.id, new Date().getTime() - this.svTimePressed);
				}
			}
		}
	}
	keyDownEvent(_0x27af55) {
		let _0x87e25e = false;
		if (!this.isSVGKeyPressed) {
			const _0xec213b = document.getElementById(_0x27af55);
			if (typeof _0xec213b !== "undefined" && _0xec213b instanceof Element && typeof this.lastKey === "undefined") {
				_0xec213b.dispatchEvent(new MouseEvent("mousedown"));
				_0x87e25e = true;
			}
		}
		return _0x87e25e;
	}
	keyUpEvent() {
		let _0x2fadc7 = false;
		if (typeof this.lastKey !== "undefined") {
			this.lastKey.dispatchEvent(new MouseEvent("mouseup"));
			_0x2fadc7 = true;
		}
		return _0x2fadc7;
	}
	reset() {
		return new Promise((_0xcb5ca3, _0x3d2223) => {
			if (typeof this.lastButtonPressed !== "undefined") {
				utilities.Utilities.removeClass(this.lastButtonPressed, this.highlightClass);
			}
			this.deleteKeyPressHistory();
			this.lastPressedKey = undefined;
			this.lastKey = undefined;
			this.lastButtonPressed = undefined;
			_0xcb5ca3();
		});
	}
}
exports.TI30XPrioSmartviewKeypad = TI30XPrioSmartviewKeypad;
