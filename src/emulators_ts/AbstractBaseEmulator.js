'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});

const asic = require("./ASIC");
const utilities = require("./Utilities");
const statefiles = require("./Statefiles");

var ASICState;
(function (state) {
	state[state.SEVERE =  0] = "SEVERE";
	state[state.WARNING = 1] = "WARNING";
	state[state.INFO =    2] = "INFO";
})(ASICState || (ASICState = {}));
class AbstractBaseEmulator {
	constructor(settings, keypad, lcd, asic, calcModel) {
		this.originalSizeW = 0;
		this.originalSizeH = 0;
		this.divID = "calculatorDiv";
		console.log("Starting " + calcModel);
		if (settings != null) {
			this.settings = settings;
			this.keypad = keypad;
			this.lcd = lcd;
			this.asic = asic;
			this.calcModel = calcModel;
			if (settings.elementId) {
				this.divID = settings.elementId;
			}
			asic.addStateListener(this);
			const stops = [this.lcd.stop(), this.keypad.stop(), this.asic.stop()];
			Promise.all(stops).then(() => {
				this.getOrSetStatefile().then(() => {
					this.keypad.start().then(() => {
						this.lcd.start().then(() => {
							this.resize("medium");
							this.initPromise = this.asic.start().then(() => {
								this.asic.onIdle().then(() => {});
							});
						});
					});
				});
			});
		}
	}
	errorHandler(err, string) {
		switch (err) {
			case ASICState.SEVERE:
				console.error(string);
				break;
			case ASICState.WARNING:
				console.warn(string);
				break;
			case ASICState.INFO:
			default:
				console.log(string);
		}
	}
	initializeFromDefaultArray() {
		return new Promise((resolve, reject) => {
			this.asic.initializeMCU(dolphinTestData);
			resolve();
		});
	}
	initializeFromStatefile(statefile) {
		return new Promise((resolve, reject) => {
			utilities.Utilities.loadROM(this.settings.ROMLocation).then(state_file => {
				this.statefile = state_file;
				const manager = new statefiles.StatefileManager();
				manager.setState([this.asic, this.lcd], this.statefile).then(() => {
					resolve();
				})catch(e => {
					console.log("Could not load emulator state");
					reject();
				});
			});
		});
	}
	getOrSetStatefile() {
		return typeof dolphinTestData !== "undefined" ? this.initializeFromDefaultArray() : this.initializeFromStatefile();
	}
	asicStateChanged(state) {
		this.asicState = state;
	}
	isInstanceRunning() {
		return this.asicState !== asic.ASICState.STOPPED && this.asicState !== asic.ASICState.PAUSED;
	}
	getCalculatorDivElement() {
		return window.document.getElementById(this.divID);
	}
	resize(string) {
		string = string.toLowerCase();
		string = string.replace(/\s/g, '');
		if (!/[^a-z\d]/i.test(string)) {
			const element = document.getElementById(this.divID);
			utilities.Utilities.removePrefixedClass(element, "ti_calcscale_");
			if (string !== undefined && string !== '') {
				utilities.Utilities.addClass(element, "ti_calcscale_" + string);
			}
			this.lcd.align();
		}
	}
	resetEmuCallback() {
		return () => this.resetEmulator().then(() => console.log("Emulator restored."))catch(e => console.log(e));
	}
	resetEmulator() {
		return new Promise((resolve, reject) => {
			this.deleteKeyHistory();
			this.deleteKeyPressed();
			this.asic.stop().then(() => {
				this.getOrSetStatefile().then(() => {
					this.asic.start().then(() => {
						this.asic.onIdle().then(() => {
							this.lcd.start().then(() => {
								console.log("Reset emulator done.");
								resolve();
							});
						});
					}, () => reject("Failed to reset emulator: init failed."));
				}, () => reject("Failed to reset emulator: bad state."));
			}, () => reject("Failed to stop Emulator during reset."));
		});
	}
	disableAllKeys() {
		this.isInstanceRunning();
		this.keypad.disableAllKeys();
	}
	enableAllKeys() {
		this.isInstanceRunning();
		this.keypad.enableAllKeys();
	}
	disableKeys(keys) {
		return new Promise((resolve, reject) => {
			reject("disableKeys has not been implemented");
		});
	}
	getKeyHistory() {
		return this.keypad.getKeyPressHistory();
	}
	hasBeenUsed() {
		return this.keypad.getKeyPressHistory().length > 0;
	}
	deleteKeyPressed() {
		this.keypad.deleteKeyPressHistory();
		return true;
	}
	deleteKeyHistory() {
		this.keypad.deleteKeyPressHistory();
	}
	hideCalculator() {
		let success = false;
		const element = document.getElementById(this.divID);
		this.isInstanceRunning();
		if (element) {
			if (element.style.visibility !== "hidden") {
				element.style.visibility = "hidden";
				this.zIndexValue = document.defaultView.getComputedStyle(element, null).getPropertyValue("z-index");
				element.style.zIndex = "-1000";
				success = true;
			}
		}
		return success;
	}
	showCalculator() {
		const element = document.getElementById(this.divID);
		this.isInstanceRunning();
		if (element) {
			if (element.style.visibility !== "visible") {
				element.style.visibility = "visible";
				element.style.zIndex = this.zIndexValue;
			}
		}
	}
	isInitialized() {
		return this.asicState !== asic.ASICState.STOPPED && this.asicState !== asic.ASICState.PAUSED;
	}
	isBusy() {
		return this.asicState !== asic.ASICState.IDLE;
	}
	isInitializing() {
		return this.asicState === asic.ASICState.INITIALIZING;
	}
	getScreen() {
		return this.lcd.getScreen();
	}
	getFullPrecisionAnswer() {
		return '';
	}
	getDisplayedAnswer() {
		return '';
	}
	switchFaceplate(faceplate) {}
	switchTheme(theme) {
		this.isInstanceRunning();
		this.keypad.switchTheme(theme, this.calcModel);
	}
	killInstance() {
		return new Promise((resolve, reject) => {
			const stops = [this.lcd.stop(), this.keypad.stop(), this.asic.stop()];
			Promise.all(stops).then(() => {
				resolve();
			});
		});
	}
}
exports.AbstractBaseEmulator = AbstractBaseEmulator;
