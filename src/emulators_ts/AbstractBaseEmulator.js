'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const asic = require("./ASIC");
const utilities = require("./Utilities");
const statefiles = require("./Statefiles");
var _0x5d8bc8;
(function (_0x34a562) {
	_0x34a562[_0x34a562.SEVERE = 0] = "SEVERE";
	_0x34a562[_0x34a562.WARNING = 0x1] = "WARNING";
	_0x34a562[_0x34a562.INFO = 0x2] = "INFO";
})(_0x5d8bc8 || (_0x5d8bc8 = {}));
class AbstractBaseEmulator {
	constructor(_0x166be7, _0x5665c2, _0x4e0265, _0x4262f4, _0x4471fe) {
		this.originalSizeW = 0;
		this.originalSizeH = 0;
		this.divID = "calculatorDiv";
		console.log("Starting " + _0x4471fe);
		if (_0x166be7 != null) {
			this.settings = _0x166be7;
			this.keypad = _0x5665c2;
			this.lcd = _0x4e0265;
			this.asic = _0x4262f4;
			this.calcModel = _0x4471fe;
			if (_0x166be7.elementId) {
				this.divID = _0x166be7.elementId;
			}
			_0x4262f4.addStateListener(this);
			const _0x177ae9 = [this.lcd.stop(), this.keypad.stop(), this.asic.stop()];
			Promise.all(_0x177ae9).then(() => {
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
	errorHandler(_0x35a85e, _0x18c735) {
		switch (_0x35a85e) {
			case _0x5d8bc8.SEVERE:
				console.error(_0x18c735);
				break;
			case _0x5d8bc8.WARNING:
				console.warn(_0x18c735);
				break;
			case _0x5d8bc8.INFO:
			default:
				console.log(_0x18c735);
		}
	}
	initializeFromDefaultArray() {
		return new Promise((_0x240c6d, _0x35a4a5) => {
			this.asic.initializeMCU(dolphinTestData);
			_0x240c6d();
		});
	}
	initializeFromStatefile(_0x5719f8) {
		return new Promise((_0x389fbf, _0x32c649) => {
			utilities.Utilities.loadROM(this.settings.ROMLocation).then(_0x51e3e6 => {
				this.statefile = _0x51e3e6;
				const _0x516f2c = new statefiles.StatefileManager();
				_0x516f2c.setState([this.asic, this.lcd], this.statefile).then(() => {
					_0x389fbf();
				})catch(_0x57eebb => {
					console.log("Could not load emulator state");
					_0x32c649();
				});
			});
		});
	}
	getOrSetStatefile() {
		return typeof dolphinTestData !== "undefined" ? this.initializeFromDefaultArray() : this.initializeFromStatefile();
	}
	asicStateChanged(_0x3f07e8) {
		this.asicState = _0x3f07e8;
	}
	isInstanceRunning() {
		return this.asicState !== asic.ASICState.STOPPED && this.asicState !== asic.ASICState.PAUSED;
	}
	getCalculatorDivElement() {
		return window.document.getElementById(this.divID);
	}
	resize(_0x25f9bc) {
		_0x25f9bc = _0x25f9bc.toLowerCase();
		_0x25f9bc = _0x25f9bc.replace(/\s/g, '');
		if (!/[^a-z\d]/i.test(_0x25f9bc)) {
			const _0x176836 = document.getElementById(this.divID);
			utilities.Utilities.removePrefixedClass(_0x176836, "ti_calcscale_");
			if (_0x25f9bc !== undefined && _0x25f9bc !== '') {
				utilities.Utilities.addClass(_0x176836, "ti_calcscale_" + _0x25f9bc);
			}
			this.lcd.align();
		}
	}
	resetEmuCallback() {
		return () => this.resetEmulator().then(() => console.log("Emulator restored."))catch(_0x118fb6 => console.log(_0x118fb6));
	}
	resetEmulator() {
		return new Promise((_0x379a11, _0x3c0d88) => {
			this.deleteKeyHistory();
			this.deleteKeyPressed();
			this.asic.stop().then(() => {
				this.getOrSetStatefile().then(() => {
					this.asic.start().then(() => {
						this.asic.onIdle().then(() => {
							this.lcd.start().then(() => {
								console.log("Reset emulator done.");
								_0x379a11();
							});
						});
					}, () => _0x3c0d88("Failed to reset emulator: init failed."));
				}, () => _0x3c0d88("Failed to reset emulator: bad state."));
			}, () => _0x3c0d88("Failed to stop Emulator during reset."));
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
	disableKeys(_0x282dd3) {
		return new Promise((_0x408f9f, _0x541ffd) => {
			_0x541ffd("disableKeys has not been implemented");
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
		let _0x44ef9f = false;
		const _0x4e6e99 = document.getElementById(this.divID);
		this.isInstanceRunning();
		if (_0x4e6e99) {
			if (_0x4e6e99.style.visibility !== "hidden") {
				_0x4e6e99.style.visibility = "hidden";
				this.zIndexValue = document.defaultView.getComputedStyle(_0x4e6e99, null).getPropertyValue("z-index");
				_0x4e6e99.style.zIndex = "-1000";
				_0x44ef9f = true;
			}
		}
		return _0x44ef9f;
	}
	showCalculator() {
		const _0x6424bc = document.getElementById(this.divID);
		this.isInstanceRunning();
		if (_0x6424bc) {
			if (_0x6424bc.style.visibility !== "visible") {
				_0x6424bc.style.visibility = "visible";
				_0x6424bc.style.zIndex = this.zIndexValue;
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
	switchFaceplate(_0x2c68e6) {}
	switchTheme(_0x27d151) {
		this.isInstanceRunning();
		this.keypad.switchTheme(_0x27d151, this.calcModel);
	}
	killInstance() {
		return new Promise((_0x288399, _0x4ec36b) => {
			const _0x4a7c68 = [this.lcd.stop(), this.keypad.stop(), this.asic.stop()];
			Promise.all(_0x4a7c68).then(() => {
				_0x288399();
			});
		});
	}
}
exports.AbstractBaseEmulator = AbstractBaseEmulator;
