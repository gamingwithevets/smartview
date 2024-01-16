'use strict';

var _0xea1af0 = this && this.__awaiter || function (_0x3a408c, _0x17450f, _0x27ea69) {
	return new (Promise || Promise)(function (_0x537b92, _0x549755) {
		function _0x410cf1(_0x1d5ddd) {
			try {
				_0x54325b(_0x27ea69.next(_0x1d5ddd));
			} catch (e) {
				_0x549755(e);
			}
		}
		function _0x40bde6(_0x5d9170) {
			try {
				_0x54325b(_0x27ea69.throw(_0x5d9170));
			} catch (e) {
				_0x549755(e);
			}
		}
		function _0x54325b(_0x354f1e) {
			if (_0x354f1e.done) {
				_0x537b92(_0x354f1e.value);
			} else {
				new Promise(function (_0x33d2be) {
					_0x33d2be(_0x354f1e.value);
				}).then(_0x410cf1, _0x40bde6);
			}
		}
		_0x54325b((_0x27ea69 = _0x27ea69.apply(_0x3a408c, _0x17450f || [])).next());
	});
};

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const ASIC = require("../../../../src/emulators_ts/ASIC");
const AbstractBaseEmulator = require("../../../../src/emulators_ts/AbstractBaseEmulator");
const Statefiles = require("../../../../src/emulators_ts/Statefiles");
class AbstractSmartviewEmulator extends AbstractBaseEmulator.AbstractBaseEmulator {
	constructor(calcModel) {
		super(null, null, null, null, calcModel);
		this.currentMetadata = new Statefiles.StatefileInfo();
		this.stateString = null;
	}
	set defaultState(_0x336e9c) {
		this._defaultState = _0x336e9c;
	}
	get defaultState() {
		return this._defaultState;
	}
	svErrorHandler(_0x2a0e26, _0x11aa5b) {
		const apptype = typeof app;
		if (apptype !== "undefined" && typeof app.logFromJS !== "undefined") {
			app.logFromJS(_0x2a0e26, _0x11aa5b);
		}
	}
	getScreenCapture() {
		return AbstractBaseEmulator.AbstractBaseEmulator.prototype.getScreen();
	}
	relSVGKey() {
		return this.keypad.keyUpEvent();
	}
	sendSVGKey(key) {
		return this.keypad.keyDownEvent(key);
	}
	sendAndReleaseSVGKey(key) {
		let success = true;
		success = success && this.sendSVGKey(key);
		success = success && this.relSVGKey();
		return success;
	}
	getStateData(_0x38c5f0) {
		const manager = new Statefiles.StatefileManager();
		manager.getState([this.asic, this.lcd], {
			"osversion": this.currentMetadata.osversion,
			"statefiletype": this.currentMetadata.statefiletype,
			"productflavor": this.currentMetadata.productflavor
		}).then(stateString => {
			this.stateString = stateString;
		});
		return this.stateString;
	}
	parseStateData(_0xa1769f) {
		console.log("//TODO: parseStateData Implement me!");
	}
	setStateData(_0x11df9a) {
		console.log("//TODO: setStateData Implement me!");
		return false;
	}
	clearHighlightedKey() {
		this.keypad.reset();
		return false;
	}
	resetEmulator() {
		return new Promise((resolve, reject) => {
			if (this.resetSVEmulator()) {
				resolve();
			} else {
				reject("Failed to reset emulator.");
			}
		});
	}
	resetSVEmulator() {
		console.log("Resetting...");
		this.asic.stop().then(() => {
			this.initializeFromStatefile(this.defaultState).then(() => {
				this.asic.start().then(() => {
					this.asic.onIdle().then(() => {
						this.lcd.start().then(() => {
							console.log("Reset emulator done.");
						});
					});
				}).catch(() => {
					console.log("Failed to reset emulator: init failed.");
				});
			}).catch(() => {
				console.log("Failed to reset emulator: bad state. ");
			});
		}).catch(() => {
			console.log("Failed to stop Emulator during reset. ");
		});
		return true;
	}
	launchEmulator(_0xfdc906, _0x4c3e6e, _0x5c4702, _0x22c08a) {
		console.log("//TODO: Implement AbstractSmartviewEmulator.launchEmulator!");
	}
	modifyInsertSVG(_0x215b80, theme) {
		let calcModel = null;
		let display = null;
		let item;
		let newclass;
		let i;
		calcModel = document.getElementById(this.calcModel);
		display = document.getElementById("display");
		for (i = calcModel.classList.length - 1; i >= 0; i--) {
			item = calcModel.classList.item(i);
			if (item && (item.indexOf("ti_theme_") === 0 || item.indexOf("ti_layout_") === 0)) {
				calcModel.classList.remove(item);
				display.classList.remove(item);
			}
		}
		if (theme) {
			newclass = "ti_theme_" + theme;
			calcModel.classList.add(newclass);
			display.classList.add(newclass);
		}
		newclass = "ti_layout_smallcaps";
		calcModel.classList.add(newclass);
		display.classList.add(newclass);
	}
	zoom() {
		this.keypad.zoom();
	}
	initializeFromStatefile(statefile) {
		return new Promise((resolve, reject) => {
			const manager = new Statefiles.StatefileManager();
			console.log("initializeFromStatefile calling setStateFomStatefile");
			manager.setStateFromStatefile([this.asic, this.lcd], statefile).then(() => {
				this.currentMetadata = statefile.info;
				resolve();
			}).catch(e => {
				console.log("Could not load emulator state");
				reject();
			});
		});
	}
	boot(_0x2c1e86) {
		console.log("//TODO: boot Implement me!");
	}
	releaseKey(key) {
		this.keypad.releaseKey(key);
	}
	sendKey(key) {
		this.keypad.releaseKey(key);
	}
	isSafeToClose() {
		console.log("//TODO: isSafeToClose Implement me!");
		return true;
	}
	commStart() {
		console.log("//TODO: commStart Implement me!");
	}
	commEnd() {
		console.log("//TODO: commEnd Implement me!");
	}
	commTrnsStart() {
		console.log("//TODO: commTrnsStart Implement me!");
	}
	commTrnsEnd() {
		console.log("//TODO: commTrnsEnd Implement me!");
	}
	updateDelayValue() {
		console.log("//TODO: updateDelayValue Implement me!");
	}
	sendOnKey() {
		return true;
	}
	isInitializing() {
		this.asic.getASICState().then(function (idle) {
			return idle === ASIC.ASICState.IDLE;
		}).catch(function () {
			return true;
		});
		return false;
	}
	isReadyForKey() {
		console.log("//TODO: isReadyForKey Implement me!");
		return true;
	}
	getEmulatorSVGKeyPrefix() {
		return this.calcModel;
	}
	switchTheme(theme) {
		super.switchTheme(theme);
		return true;
	}
	setMetadataInfo(info) {
		try {
			info.split(";").forEach(function (string) {
				const str_split = string.split(":");
				if (str_split[1] != null) {
					this.currentMetadata[str_split[0]] = str_split[1];
				}
			}, this);
		} catch (e) {
			console.log("Could not parse metadata");
		}
	}
	verifyChecksumAndGetMetaInfo(data) {
		let info = data.info;
		if (typeof info !== "undefined") {
			const manager = new Statefiles.StatefileManager();
			const md5 = manager.getMd5String(data);
			if (md5 !== info.checksum) {
				console.log("incorrect checksum found in statefile!" + info.checksum);
				info = undefined;
			}
		} else {
			console.log("No metadata!");
		}
		return info;
	}
	getCurrentMetaInfo() {
		return this.currentMetadata;
	}
	ta_sendCommand() {
		return _0xea1af0(this, undefined, undefined, function* () {
			if (typeof this.taCommand !== "undefined") {
				console.log("TACommand received.");
				const arry = this.taCommand.getTABuffer().split(",").map(Number);
				const mem = Uint8Array.from(arry);
				const val = this.taCommand.getLengthDesignation();
				yield this.isUARTReady();
				let response;
				if (val > 0) {
					response = yield this.asic.setTABuffer(mem, val);
				} else {
					response = yield this.asic.setTABuffer(mem);
				}
				this.taCommand.setResponse(response);
			} else {
				console.log("TACommand not found!");
			}
			console.log("TACommand processed.");
		});
	}
	isUARTReady() {
		return this.uartReadyPromise;
	}
}
exports.AbstractSmartviewEmulator = AbstractSmartviewEmulator;
