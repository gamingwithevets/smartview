'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const keypad = require("../../../../../../src/emulators_ts/TI-30XPlus/main/TI30XPlusKeypad");
const svg = require("./TI30XPlusSVG");
const utilities = require("../../../../../../src/emulators_ts/Utilities");
class TI30XPlusSmartviewKeypad extends keypad.TI30XPlusKeypad {
	start() {
		return new Promise((resolve, reject) => {
			let docelement;
			let viewbox;
			const domparser = new DOMParser();
			const parsedxml = domparser.parseFromString(svg.TI30XPlusSVG, "text/xml");
			docelement = parsedxml.documentElement;
			docelement = document.importNode(docelement, true);
			viewbox = docelement.getAttribute("viewBox");
			if (viewbox == null || viewbox == "undefined") {
				this.svgSizeW = 254;
				this.svgSizeH = 556;
			} else {
				viewbox = viewbox.split(/\s+|,/);
				this.svgSizeW = parseInt(viewbox[2]);
				this.svgSizeH = parseInt(viewbox[3]);
			}
			this.calculatorDiv = document.getElementById("calculatorDiv");
			this.calculatorDiv.style.width = this.svgSizeW + "px";
			this.calculatorDiv.style.height = this.svgSizeH + "px";
			this.calculatorDiv.appendChild(docelement);
			this.svg = docelement;
			this.initKeysFromDOM();
			this.acceptInput(true);
			resolve();
		});
	}
	zoom() {
		const innerHeight = window.innerHeight;
		const innerWidth = window.innerWidth;
		let ratio = innerHeight / this.svgSizeH;
		if (ratio * this.svgSizeW > innerWidth) {
			ratio = innerWidth / this.svgSizeW;
		}
		this.calculatorDiv.style.zoom = '' + ratio;
	}
	mouseDownHandler(evt) {
		if (!this.isSVGKeyPressed) {
			if (typeof this.lastButtonPressed !== "undefined") {
				utilities.Utilities.removeClass(this.lastButtonPressed, this.highlightClass);
			}
			this.svTimePressed = new Date().getTime();
			super.mouseDownHandler(evt);
			this.lastKey = this.lastButtonPressed;
		}
	}
	mouseUpHandler(evt) {
		if (evt.currentTarget instanceof Element) {
			const target = evt.currentTarget;
			if (target === this.lastButtonPressed && typeof this.lastKey !== "undefined") {
				super.mouseUpHandler(evt);
				utilities.Utilities.addClass(target, this.highlightClass);
				this.lastKey = undefined;
				const apptype = typeof app;
				if (apptype !== "undefined" && typeof app.keyPressed !== "undefined") {
					app.keyPressed(target.id, new Date().getTime() - this.svTimePressed);
				}
			}
		}
	}
	keyDownEvent(id) {
		let success = false;
		if (!this.isSVGKeyPressed) {
			const element = document.getElementById(id);
			if (typeof element !== "undefined" && element instanceof Element && typeof this.lastKey === "undefined") {
				element.dispatchEvent(new MouseEvent("mousedown"));
				success = true;
			}
		}
		return success;
	}
	keyUpEvent() {
		let success = false;
		if (typeof this.lastKey !== "undefined") {
			this.lastKey.dispatchEvent(new MouseEvent("mouseup"));
			success = true;
		}
		return success;
	}
	reset() {
		return new Promise((resolve, reject) => {
			if (typeof this.lastButtonPressed !== "undefined") {
				utilities.Utilities.removeClass(this.lastButtonPressed, this.highlightClass);
			}
			this.deleteKeyPressHistory();
			this.lastPressedKey = undefined;
			this.lastKey = undefined;
			this.lastButtonPressed = undefined;
			resolve();
		});
	}
}
exports.TI30XPlusSmartviewKeypad = TI30XPlusSmartviewKeypad;
