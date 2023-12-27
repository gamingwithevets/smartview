'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const _0x3c108d = require("./ASIC");
const _0x117d99 = require("./GenericASIC");
const _0x1e77c1 = require("../asics/nxu16/nxu16_exports");
class LapisASIC extends _0x117d99.GenericASIC {
	start() {
		return new Promise((_0x5c768c, _0x37f899) => {
			if (this.state === _0x3c108d.ASICState.STOPPED || this.state === _0x3c108d.ASICState.INITIALIZING) {
				this.notifyStateListeners(_0x3c108d.ASICState.BUSY);
				this.exports.dataMemory.start();
				this.startMCU();
				_0x5c768c();
			} else {
				console.log("asic is not stopped!, state=" + this.state);
				_0x37f899("asic is not stopped!, state=" + this.state);
			}
		});
	}
	stop() {
		return new Promise((_0x54d9f6, _0x3f0dd2) => {
			if (this.state !== _0x3c108d.ASICState.PAUSED && this.state !== _0x3c108d.ASICState.STOPPED) {
				clearInterval(this.exportsInterval);
				this.exports.dataMemory.stop();
				this.notifyStateListeners(_0x3c108d.ASICState.STOPPED);
				_0x54d9f6();
			} else {
				_0x3f0dd2();
			}
		});
	}
	pause() {
		return new Promise((_0x1c11c7, _0x356bbf) => {
			if (this.state !== _0x3c108d.ASICState.PAUSED) {
				this.notifyStateListeners(_0x3c108d.ASICState.PAUSED);
				_0x1c11c7();
			} else {
				_0x356bbf();
			}
		});
	}
	resume() {
		return new Promise((_0x4e1bad, _0x1553be) => {
			_0x4e1bad();
		});
	}
	reset() {
		return new Promise((_0x129e23, _0x130090) => {
			_0x129e23();
		});
	}
	onIdle() {
		return new Promise((_0x1a9eb5, _0x533515) => {
			const _0x47ac6b = setInterval(() => {
				if (this.state === _0x3c108d.ASICState.IDLE) {
					clearInterval(_0x47ac6b);
					_0x1a9eb5();
				}
			}, 0);
		});
	}
	getState() {
		const _0x3f5e2f = this.exports.getState();
		return _0x3f5e2f;
	}
	setState(_0x3c31ef) {
		this.exports.setState(_0x3c31ef);
	}
	keyDown(_0x231122) {
		return new Promise((_0x25a8a1, _0x4d2ba7) => {
			this.exports.setLastKeyPressed(_0x231122);
			_0x25a8a1();
		});
	}
	keyUp(_0x4b38af) {
		return new Promise((_0x33c3ab, _0x1ac36f) => {
			this.exports.setLastKeyReleased(_0x4b38af);
			_0x33c3ab();
		});
	}
	keyPress(_0x32ec9b) {
		return new Promise((_0x9df070, _0x4575fa) => {
			_0x9df070();
		});
	}
	startMCU() {
		let _0x1f9083 = undefined;
		this.exportsInterval = setInterval(() => {
			this.exports.run();
			if ((_0x1f9083 === undefined || _0x1f9083) && this.exports.isBusy === false) {
				this.notifyStateListeners(_0x3c108d.ASICState.IDLE);
			} else if ((_0x1f9083 === undefined || !_0x1f9083) && this.exports.isBusy) {
				this.notifyStateListeners(_0x3c108d.ASICState.BUSY);
			}
			_0x1f9083 = this.exports.isBusy;
		}, 0);
	}
	initializeMCU(_0x435de4) {
		this.exports.initialize(_0x435de4);
	}
	is2ndModeEnabled() {
		return this.exports.is2ndMode;
	}
	constructor(_0x52c56b) {
		super();
		const _0x312c32 = this;
		this.settings = _0x52c56b;
		this.exports = new _0x1e77c1.NXU16_MCU({
			"parent": _0x312c32
		});
	}
}
exports.LapisASIC = LapisASIC;
