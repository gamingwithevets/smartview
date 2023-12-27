'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const asic = require("./ASIC");
const generic_asic = require("./GenericASIC");
const mcu = require("../asics/nxu16/nxu16_exports");
class LapisASIC extends generic_asic.GenericASIC {
	start() {
		return new Promise((resolve, reject) => {
			if (this.state === asic.ASICState.STOPPED || this.state === asic.ASICState.INITIALIZING) {
				this.notifyStateListeners(asic.ASICState.BUSY);
				this.mcu.dataMemory.start();
				this.startMCU();
				resolve();
			} else {
				console.log("asic is not stopped!, state=" + this.state);
				reject("asic is not stopped!, state=" + this.state);
			}
		});
	}
	stop() {
		return new Promise((resolve, reject) => {
			if (this.state !== asic.ASICState.PAUSED && this.state !== asic.ASICState.STOPPED) {
				clearInterval(this.mcuInterval);
				this.mcu.dataMemory.stop();
				this.notifyStateListeners(asic.ASICState.STOPPED);
				resolve();
			} else {
				reject();
			}
		});
	}
	pause() {
		return new Promise((resolve, reject) => {
			if (this.state !== asic.ASICState.PAUSED) {
				this.notifyStateListeners(asic.ASICState.PAUSED);
				resolve();
			} else {
				reject();
			}
		});
	}
	resume() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	reset() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	onIdle() {
		return new Promise((resolve, reject) => {
			const interval = setInterval(() => {
				if (this.state === asic.ASICState.IDLE) {
					clearInterval(interval);
					resolve();
				}
			}, 0);
		});
	}
	getState() {
		const state = this.mcu.getState();
		return state;
	}
	setState(state) {
		this.mcu.setState(state);
	}
	keyDown(key) {
		return new Promise((resolve, reject) => {
			this.mcu.setLastKeyPressed(key);
			resolve();
		});
	}
	keyUp(key) {
		return new Promise((resolve, reject) => {
			this.mcu.setLastKeyReleased(key);
			resolve();
		});
	}
	keyPress(key) {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	startMCU() {
		let busy = undefined;
		this.mcuInterval = setInterval(() => {
			this.mcu.run();
			if ((busy === undefined || busy) && this.mcu.isBusy === false) {
				this.notifyStateListeners(asic.ASICState.IDLE);
			} else if ((busy === undefined || !busy) && this.mcu.isBusy) {
				this.notifyStateListeners(asic.ASICState.BUSY);
			}
			busy = this.mcu.isBusy;
		}, 0);
	}
	initializeMCU(size) {
		this.mcu.initialize(size);
	}
	is2ndModeEnabled() {
		return this.mcu.is2ndMode;
	}
	constructor(settings) {
		super();
		const this_ = this;
		this.settings = settings;
		this.mcu = new mcu.NXU16_MCU({
			"parent": this_
		});
	}
}
exports.LapisASIC = LapisASIC;
