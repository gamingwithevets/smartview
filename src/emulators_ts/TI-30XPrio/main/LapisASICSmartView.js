'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const _0x4ebe8f = require("../../../../src/emulators_ts/LapisASIC");
class _0x3ffed9 extends _0x4ebe8f.LapisASIC {
	["setUpUART"]() {
		return this.mcu.initUART();
	}
	["setTABuffer"](_0x4ca892, _0x1dd640) {
		return this.exports.setTestAutomationBuffer(_0x4ca892, _0x1dd640);
	}
}
exports.LapisASICSmartView = _0x3ffed9;
