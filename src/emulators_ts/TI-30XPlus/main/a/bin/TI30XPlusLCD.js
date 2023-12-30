'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const generic_lcd = require("../../GenericScientificLCDForSmartview");
class TI30XPlusLCD extends generic_lcd.GenericScientificLCDForSmartview {
	constructor(calcDivId) {
		super("TI30XPLUS", calcDivId);
	}
}
exports.TI30XPlusLCD = TI30XPlusLCD;
