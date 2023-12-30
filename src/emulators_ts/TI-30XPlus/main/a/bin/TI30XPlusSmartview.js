'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const LapisASICSmartView = require("../../LapisASICSmartView");
const AbstractSmartviewEmulator = require("../../AbstractSmartviewEmulator");
const TI30XPlusLCD = require("./TI30XPlusLCD");
const TI30XPlusSmartviewKeypad = require("./TI30XPlusSmartviewKeypad");
const dolphin = require("./dolphin");
class TI30XPlusSmartview extends AbstractSmartviewEmulator.AbstractSmartviewEmulator {
	constructor(calcModel) {
		super("TI30XPLUS");
		this.defaultState = dolphin.dolphinStatefile;
		const log = console.log;
		const this_ = this;
		console.log = function (string) {
			log(string);
			this_.svErrorHandler("INFO", string);
		};
		console.warn = function (string) {
			this_.svErrorHandler("WARNING", string);
		};
		console.error = function (string) {
			this_.svErrorHandler("SEVERE", string);
		};
		console.trace = function (string) {
			this_.svErrorHandler("FINE", string);
		};
	}
	launchEmulator(statefile, _0x1cc082, _0x3fd2d9, theme) {
		const settings = {
			"elementId": "calculatorDiv",
			"ROMLocation": "bin/ti30mv.h84state",
			"FaceplateLocation": "images/TI30XPLUS_touch.svg",
			"KeyMappingFile": '',
			"KeyHistBufferLength": 10,
			"DisplayMode": "MATHPRINT",
			"AngleMode": "DEG"
		};
		const lcd = new TI30XPlusLCD.TI30XPlusLCD("calculatorDiv");
		this.settings = settings;
		this.asic = new LapisASICSmartView.LapisASICSmartView(settings);
		this.lcd = lcd;
		this.keypad = new TI30XPlusSmartviewKeypad.TI30XPlusSmartviewKeypad(this.settings, this.asic);
		this.calcModel = "TI30XPLUS";
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
					this.modifyInsertSVG(_0x1cc082, theme);
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
		const apptype = typeof app;
		if (apptype !== "undefined" && typeof app.createDisplaySettings !== "undefined") {
			app.createDisplaySettings(9, 192, 2, "#000000", "#FFFFFF", 4);
		}
	}
}
exports.TI30XPlusSmartview = TI30XPlusSmartview;
