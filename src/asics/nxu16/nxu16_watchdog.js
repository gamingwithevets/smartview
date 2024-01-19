'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
class NXU16_Watchdog {
	constructor(callback) {
		this.STATE_INITIALIZED = 0;
		this.STATE_RESET_STEP_1 = 1;
		this.STATE_RESET_STEP_2 = 2;
		this.STATE_DONE = 3;
		this.state = this.STATE_INITIALIZED;
		this.callback = callback;
		this.mode = 3;
	}
	setMode(mode) {
		this.mode = mode;
	}
	start() {
		var interval = 100000;
		switch (this.mode) {
			case 0:
				interval = 125;
				break;
			case 1:
				interval = 500;
				break;
			case 2:
				interval = 2000;
				break;
			case 3:
				interval = 8000;
				break;
		}
		this.intervalReference = setInterval(this.callback, interval);
	}
	stop() {
		clearInterval(this.intervalReference);
	}
}
exports.NXU16_Watchdog = NXU16_Watchdog;
