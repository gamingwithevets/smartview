'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const LapisASIC = require("../../../../src/emulators_ts/LapisASIC");
class LapisASICSmartView extends LapisASIC.LapisASIC {
	setUpUART() {
		return this.mcu.initUART();
	}
	setTABuffer(mem, val) {
		return this.mcu.setTestAutomationBuffer(mem, val);
	}
}
exports.LapisASICSmartView = LapisASICSmartView;
