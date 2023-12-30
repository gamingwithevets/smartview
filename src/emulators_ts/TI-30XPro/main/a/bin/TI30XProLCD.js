'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const generic_lcd = require("../../GenericScientificLCDForSmartview");
class TI30XProLCD extends generic_lcd.GenericScientificLCDForSmartview {
	constructor(calcDivId) {
		super("TI30XPRO", calcDivId);
	}
}
exports.TI30XProLCD = TI30XProLCD;
