'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const smartview = require("../../AbstractSmartviewEmulator");
const lcd = require("./TI30XPrioLCD");
const keypad = require("./TI30XPrioSmartviewKeypad");
const dolphin = require("./dolphin");
const asic = require("../../LapisASICSmartView");
class TI30XPrioSmartview extends smartview.AbstractSmartviewEmulator {
	constructor(_0x457ba7) {
		super("TI30XPRIO");
		this.defaultState = dolphin.dolphinStatefile;
		const log = console.log;
		const emu = this;
		console.log = function (string) {
			log(string);
			emu.svErrorHandler("INFO", string);
		};
		console.warn = function (string) {
			emu.svErrorHandler("WARNING", string);
		};
		console.error = function (string) {
			emu.svErrorHandler("SEVERE", string);
		};
		console.trace = function (string) {
			emu.svErrorHandler("FINE", string);
		};
	}
	launchEmulator(statefile, _0x55398a, _0x591ecb, _0x27dfc6) {
		const settings = {
			"elementId": "calculatorDiv",
			"ROMLocation": "bin/ti30mv.h84state",
			"FaceplateLocation": "images/TI30XPRIO_touch.svg",
			"KeyMappingFile": '',
			"KeyHistBufferLength": 10,
			"DisplayMode": "MATHPRINT",
			"AngleMode": "DEG"
		};
		const lcd = new lcd.TI30XPrioLCD("calculatorDiv");
		this.settings = settings;
		this.asic = new asic.LapisASICSmartView(settings);
		this.lcd = lcd;
		this.keypad = new keypad.TI30XPrioSmartviewKeypad(this.settings, this.asic);
		this.keypad.setResetEmuCallback(this.resetEmuCallback());
		this.calcModel = "TI30XPRIO";
		this.divID = "calculatorDiv";
		this.asic.addStateListener(this);
		this.asic.addScreenListener(lcd);
		let state;
		if (typeof statefile !== "undefined" && statefile != null) {
			state = this.initializeFromStatefile(statefile);
		} else {
			state = this.initializeFromStatefile(this.defaultState);
		}
		this.uartReadyPromise = this.asic.setUpUART();
		state.then(() => {
			this.keypad.start().then(() => {
				this.lcd.start().then(() => {
					this.modifyInsertSVG(_0x55398a, _0x27dfc6);
					this.initPromise = this.asic.start().then(() => {
						this.asic.onIdle().then(() => {
							this.lcd.align();
							this.zoom();
						});
					});
				});
			});
		});
	}
	getVersion() {
		return "1.0.0.0";
	}
	getDisplaySettings() {
		const _0x1ddc67 = typeof app;
		if (_0x1ddc67 !== "undefined" && typeof app.createDisplaySettings !== "undefined") {
			app.createDisplaySettings(9, 192, 2, "#000000", "#FFFFFF", 4);
		}
	}
}
exports.TI30XPrioSmartview = TI30XPrioSmartview;
