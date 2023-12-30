'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const lapis_asic = require("../../../../src/emulators_ts/LapisASIC");
class LapisASICSmartView extends lapis_asic.LapisASIC {
	setUpUART() {
		return this.mcu.initUART();
	}
	setTABuffer(mem, val) {
		return this.mcu.setTestAutomationBuffer(mem, val);
	}
}
exports.LapisASICSmartView = LapisASICSmartView;
