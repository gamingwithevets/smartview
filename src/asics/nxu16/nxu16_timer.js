'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
class NXU16_Timer {
	constructor(callback) {
		this.initialized = false;
		this.callback = callback;
		this.mode = 6;
	}
	setMode(mode) {
		this.initialized = true;
		this.mode = mode;
		this.reset();
	}
	start() {
		var interval = 100000;
		switch (this.mode) {
			case 0:
				interval = 8;
				break;
			case 1:
				interval = 16;
				break;
			case 2:
				interval = 31;
				break;
			case 3:
				interval = 63;
				break;
			case 4:
				interval = 125;
				break;
			case 5:
				interval = 250;
				break;
			case 6:
				interval = 500;
				break;
			case 7:
				interval = 1000;
				break;
		}
		this.intervalReference = setInterval(this.callback, interval);
		return;
	}
	stop() {
		clearInterval(this.intervalReference);
		return;
	}
	reset() {
		this.stop();
		this.start();
		return;
	}
	setState(state) {
		this.mode = state[0];
	}
	getState() {
		return Uint8Array.from([this.mode]);
	}
}
exports.NXU16_Timer = NXU16_Timer;
