'use strict';

var _0xea1af0 = this && this.__awaiter || function (_0x3a408c, _0x17450f, _0x27ea69) {
	return new (Promise || Promise)(function (_0x537b92, _0x549755) {
		function _0x410cf1(_0x1d5ddd) {
			try {
				_0x54325b(_0x27ea69.next(_0x1d5ddd));
			} catch (_0x137809) {
				_0x549755(_0x137809);
			}
		}
		function _0x40bde6(_0x5d9170) {
			try {
				_0x54325b(_0x27ea69["throw"](_0x5d9170));
			} catch (_0x456c6b) {
				_0x549755(_0x456c6b);
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
const _0x197ded = require("../../../../src/emulators_ts/ASIC");
const _0x20471f = require("../../../../src/emulators_ts/AbstractBaseEmulator");
const _0x2b198c = require("../../../../src/emulators_ts/Statefiles");
class AbstractSmartviewEmulator extends _0x20471f.AbstractBaseEmulator {
	constructor(_0x967fb4) {
		super(null, null, null, null, _0x967fb4);
		this.currentMetadata = new _0x2b198c.StatefileInfo();
		this.stateString = null;
	}
	set ["defaultState"](_0x336e9c) {
		this._defaultState = _0x336e9c;
	}
	get ["defaultState"]() {
		return this._defaultState;
	}
	["svErrorHandler"](_0x2a0e26, _0x11aa5b) {
		const _0x10d411 = typeof app;
		if (_0x10d411 !== "undefined" && typeof app.logFromJS !== "undefined") {
			app.logFromJS(_0x2a0e26, _0x11aa5b);
		}
	}
	["getScreenCapture"]() {
		return _0x20471f.AbstractBaseEmulator.prototype.getScreen();
	}
	["relSVGKey"]() {
		return this.keypad.keyUpEvent();
	}
	["sendSVGKey"](_0x5a8a50) {
		return this.keypad.keyDownEvent(_0x5a8a50);
	}
	["sendAndReleaseSVGKey"](_0x3005c8) {
		let _0xd61923 = true;
		_0xd61923 = _0xd61923 && this.sendSVGKey(_0x3005c8);
		_0xd61923 = _0xd61923 && this.relSVGKey();
		return _0xd61923;
	}
	["getStateData"](_0x38c5f0) {
		const _0x5b4762 = new _0x2b198c.StatefileManager();
		_0x5b4762.getState([this.asic, this.lcd], {
			"osversion": this.currentMetadata.osversion,
			"statefiletype": this.currentMetadata.statefiletype,
			"productflavor": this.currentMetadata.productflavor
		}).then(_0x2e8819 => {
			this.stateString = _0x2e8819;
		});
		return this.stateString;
	}
	["parseStateData"](_0xa1769f) {
		console.log("//TODO: parseStateData Implement me!");
	}
	["setStateData"](_0x11df9a) {
		console.log("//TODO: setStateData Implement me!");
		return false;
	}
	["clearHighlightedKey"]() {
		this.keypad.reset();
		return false;
	}
	["resetEmulator"]() {
		return new Promise((_0x328868, _0x51636c) => {
			if (this.resetSVEmulator()) {
				_0x328868();
			} else {
				_0x51636c("Failed to reset emulator.");
			}
		});
	}
	["resetSVEmulator"]() {
		console.log("Resetting...");
		this.asic.stop().then(() => {
			this.initializeFromStatefile(this.defaultState).then(() => {
				this.asic.start().then(() => {
					this.asic.onIdle().then(() => {
						this.lcd.start().then(() => {
							console.log("Reset emulator done.");
						});
					});
				})["catch"](() => {
					console.log("Failed to reset emulator: init failed.");
				});
			})["catch"](() => {
				console.log("Failed to reset emulator: bad state. ");
			});
		})["catch"](() => {
			console.log("Failed to stop Emulator during reset. ");
		});
		return true;
	}
	["launchEmulator"](_0xfdc906, _0x4c3e6e, _0x5c4702, _0x22c08a) {
		console.log("//TODO: Implement AbstractSmartviewEmulator.launchEmulator!");
	}
	["modifyInsertSVG"](_0x215b80, _0x37fa75) {
		let _0x58a8d8 = null;
		let _0x3ee291 = null;
		let _0x6d12fe;
		let _0x1d724d;
		let _0x3e07ec;
		_0x58a8d8 = document.getElementById(this.calcModel);
		_0x3ee291 = document.getElementById("display");
		for (_0x3e07ec = _0x58a8d8.classList.length - 0x1; _0x3e07ec >= 0; _0x3e07ec--) {
			_0x6d12fe = _0x58a8d8.classList.item(_0x3e07ec);
			if (_0x6d12fe && (_0x6d12fe.indexOf("ti_theme_") === 0 || _0x6d12fe.indexOf("ti_layout_") === 0)) {
				_0x58a8d8.classList.remove(_0x6d12fe);
				_0x3ee291.classList.remove(_0x6d12fe);
			}
		}
		if (_0x37fa75) {
			_0x1d724d = "ti_theme_" + _0x37fa75;
			_0x58a8d8.classList.add(_0x1d724d);
			_0x3ee291.classList.add(_0x1d724d);
		}
		_0x1d724d = "ti_layout_smallcaps";
		_0x58a8d8.classList.add(_0x1d724d);
		_0x3ee291.classList.add(_0x1d724d);
	}
	["zoom"]() {
		this.keypad.zoom();
	}
	["initializeFromStatefile"](_0x43f3d6) {
		return new Promise((_0x1e7866, _0x20bac0) => {
			const _0x44f9a3 = new _0x2b198c.StatefileManager();
			console.log("initializeFromStatefile calling setStateFomStatefile");
			_0x44f9a3.setStateFromStatefile([this.asic, this.lcd], _0x43f3d6).then(() => {
				this.currentMetadata = _0x43f3d6.info;
				_0x1e7866();
			})["catch"](_0x22a773 => {
				console.log("Could not load emulator state");
				_0x20bac0();
			});
		});
	}
	["boot"](_0x2c1e86) {
		console.log("//TODO: boot Implement me!");
	}
	["releaseKey"](_0x128891) {
		this.keypad.releaseKey(_0x128891);
	}
	["sendKey"](_0x19fba5) {
		this.keypad.releaseKey(_0x19fba5);
	}
	["isSafeToClose"]() {
		console.log("//TODO: isSafeToClose Implement me!");
		return true;
	}
	["commStart"]() {
		console.log("//TODO: commStart Implement me!");
	}
	["commEnd"]() {
		console.log("//TODO: commEnd Implement me!");
	}
	["commTrnsStart"]() {
		console.log("//TODO: commTrnsStart Implement me!");
	}
	["commTrnsEnd"]() {
		console.log("//TODO: commTrnsEnd Implement me!");
	}
	["updateDelayValue"]() {
		console.log("//TODO: updateDelayValue Implement me!");
	}
	["sendOnKey"]() {
		return true;
	}
	["isInitializing"]() {
		this.asic.getASICState().then(function (_0x4b76e1) {
			return _0x4b76e1 === _0x197ded.ASICState.IDLE;
		})["catch"](function () {
			return true;
		});
		return false;
	}
	["isReadyForKey"]() {
		console.log("//TODO: isReadyForKey Implement me!");
		return true;
	}
	["getEmulatorSVGKeyPrefix"]() {
		return this.calcModel;
	}
	["switchTheme"](_0x43ab47) {
		super.switchTheme(_0x43ab47);
		return true;
	}
	["setMetadataInfo"](_0x4290f8) {
		try {
			_0x4290f8.split(";").forEach(function (_0x5e3a6c) {
				const _0x1f2941 = _0x5e3a6c.split(":");
				if (_0x1f2941[1] != null) {
					this.currentMetadata[_0x1f2941[0]] = _0x1f2941[1];
				}
			}, this);
		} catch (_0x1e6cc1) {
			console.log("Could not parse metadata");
		}
	}
	["verifyChecksumAndGetMetaInfo"](_0x1617bf) {
		let _0x56e43c = _0x1617bf.info;
		if (typeof _0x56e43c !== "undefined") {
			const _0x263433 = new _0x2b198c.StatefileManager();
			const _0x321191 = _0x263433.getMd5String(_0x1617bf);
			if (_0x321191 !== _0x56e43c.checksum) {
				console.log("incorrect checksum found in statefile!" + _0x56e43c.checksum);
				_0x56e43c = undefined;
			}
		} else {
			console.log("No metadata!");
		}
		return _0x56e43c;
	}
	["getCurrentMetaInfo"]() {
		return this.currentMetadata;
	}
	["ta_sendCommand"]() {
		return _0xea1af0(this, undefined, undefined, function* () {
			if (typeof this.taCommand !== "undefined") {
				console.log("TACommand received.");
				const _0x313a8a = this.taCommand.getTABuffer().split(",").map(Number);
				const _0x565b7d = Uint8Array.from(_0x313a8a);
				const _0x44d6b3 = this.taCommand.getLengthDesignation();
				yield this.isUARTReady();
				let _0x226739;
				if (_0x44d6b3 > 0) {
					_0x226739 = yield this.asic.setTABuffer(_0x565b7d, _0x44d6b3);
				} else {
					_0x226739 = yield this.asic.setTABuffer(_0x565b7d);
				}
				this.taCommand.setResponse(_0x226739);
			} else {
				console.log("TACommand not found!");
			}
			console.log("TACommand processed.");
		});
	}
	["isUARTReady"]() {
		return this.uartReadyPromise;
	}
}
exports.AbstractSmartviewEmulator = AbstractSmartviewEmulator;
