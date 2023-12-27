'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const _0x8c5c97 = require("../../GenericKeypad");
class TI30XPrioKeypad extends _0x8c5c97.GenericKeypad {
	constructor(_0x3436fa, _0x44c937) {
		const _0x325a75 = {
			"svgUrl": _0x3436fa.FaceplateLocation,
			"keymapExtension": '',
			"SVGKeys": [{
				"SVGKey": "TI30XPRIO_KEY_2ND_NONE",
				"code": 0x8,
				"keyCode": [0x32],
				"shiftKey": [true],
				"keyGroup": 0x1,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_MODE_QUIT",
				"code": 0x20,
				"keyCode": [0x4d],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_DELETE_INSERT",
				"code": 0x28,
				"keyCode": [0x2e],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_LN-LOG_NONE",
				"code": 0x7,
				"keyCode": [0x4c],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_MATH_NONE",
				"code": 0x10,
				"keyCode": [0x52],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_DATA_STAT-REGDISTR",
				"code": 0x18,
				"keyCode": [0x44],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_LEFTARROW_NONE",
				"code": 0x2f,
				"keyCode": [0x25],
				"shiftKey": [false],
				"keyGroup": 0x6,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_UPARROW_NONE",
				"code": 0x30,
				"keyCode": [0x26],
				"shiftKey": [false],
				"keyGroup": 0x6,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_RIGHTARROW_NONE",
				"code": 0x2e,
				"keyCode": [0x27],
				"shiftKey": [false],
				"keyGroup": 0x6,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_DOWNARROW_NONE",
				"code": 0x2d,
				"keyCode": [0x28],
				"shiftKey": [false],
				"keyGroup": 0x6,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_ENTH-10NTH_NONE",
				"code": 0x6,
				"keyCode": [0x4e],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_EE_NONE",
				"code": 0xf,
				"keyCode": [0x46],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_NCR-NPR_RANDOM",
				"code": 0x17,
				"keyCode": [0xde],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_TABLE_EXPR-EVAL",
				"code": 0x1f,
				"keyCode": [0x41],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_CLEAR_NONE",
				"code": 0x27,
				"keyCode": [0x8],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_PI-E-I_COMPLEX",
				"code": 0x5,
				"keyCode": [0x50],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_SIN-SIN-1_NONE",
				"code": 0xe,
				"keyCode": [0x53],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_COS-COS-1_NONE",
				"code": 0x16,
				"keyCode": [0x43],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_TAN-TAN-1_NONE",
				"code": 0x1e,
				"keyCode": [0x54],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_DIVIDE_NONE",
				"code": 0x26,
				"keyCode": [0x6f, 0xbf],
				"shiftKey": [false, false],
				"keyGroup": 0x3,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_XNTH_NTHSQRT",
				"code": 0x4,
				"keyCode": [0x36],
				"shiftKey": [true],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_FRACTION_RECIPRICAL",
				"code": 0xd,
				"keyCode": [0x49],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_LEFTPAREN_CONSTANTS",
				"code": 0x15,
				"keyCode": [0x39],
				"shiftKey": [true],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_RIGHTPAREN_OP",
				"code": 0x1d,
				"keyCode": [0x30],
				"shiftKey": [true],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_MULTIPLY_SETOP",
				"code": 0x25,
				"keyCode": [0x6a, 0x38],
				"shiftKey": [false, true],
				"keyGroup": 0x3,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_X2_SQRT",
				"code": 0x3,
				"keyCode": [0x58],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_7_NONE",
				"code": 0xc,
				"keyCode": [0x67, 0x37],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_8_NONE",
				"code": 0x14,
				"keyCode": [0x68, 0x38],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_9_NONE",
				"code": 0x1c,
				"keyCode": [0x69, 0x39],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_SUBTRACT_CONTRASTDOWN",
				"code": 0x24,
				"keyCode": [0x6d, 0xbd],
				"shiftKey": [false, false],
				"keyGroup": 0x3,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_XVAR_CLEARVAR",
				"code": 0x2,
				"keyCode": [0x59],
				"shiftKey": [false],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_4_NONE",
				"code": 0xb,
				"keyCode": [0x64, 0x34],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_5_NONE",
				"code": 0x13,
				"keyCode": [0x65, 0x35],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_6_NONE",
				"code": 0x1b,
				"keyCode": [0x66, 0x36],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_ADD_CONTRASTUP",
				"code": 0x23,
				"keyCode": [0x6b, 0xbb],
				"shiftKey": [false, true],
				"keyGroup": 0x3,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_STO_RECALL",
				"code": 0x1,
				"keyCode": [0xba],
				"shiftKey": [true],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_1_NONE",
				"code": 0xa,
				"keyCode": [0x61, 0x31],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_2_NONE",
				"code": 0x12,
				"keyCode": [0x62, 0x32],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_3_NONE",
				"code": 0x1a,
				"keyCode": [0x63, 0x33],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_TOGGLE_FTOD",
				"code": 0x22,
				"keyCode": [0xc0],
				"shiftKey": [true],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_ON_OFF_RESET",
				"code": 0x29,
				"keyCode": [0xc0],
				"shiftKey": [true],
				"keyGroup": 0x5,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_0_NONE",
				"code": 0x9,
				"keyCode": [0x60, 0x30],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_DECIMAL_COMMA",
				"code": 0x11,
				"keyCode": [0x6e, 0xbe],
				"shiftKey": [false, false],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_NEGATIVE_ANS",
				"code": 0x19,
				"keyCode": [0xbd],
				"shiftKey": [true],
				"keyGroup": 0x4,
				"enabled": true
			}, {
				"SVGKey": "TI30XPRIO_KEY_ENTER_NONE",
				"code": 0x21,
				"keyCode": [0xd],
				"shiftKey": [false],
				"keyGroup": 0x4,
				"enabled": true
			}],
			"blockedKeyCommands": ["ON", "OFF"]
		};
		const _0x9f518e = _0x3436fa.elementId || "calculatorDiv";
		super(_0x9f518e, _0x325a75, _0x44c937);
	}
	["setKey"](_0x49bb04) {
		if (_0x49bb04 === 0x29 && this.asic.is2ndModeEnabled()) {
			if (this.resetEmuCallback !== undefined) {
				console.log("Trigger Reset Emulator");
				return this.resetEmuCallback();
			} else {
				console.log("Reset callback not available");
			}
		}
		return super.setKey(_0x49bb04);
	}
	["setResetEmuCallback"](_0x50bc22) {
		this.resetEmuCallback = _0x50bc22;
	}
}
exports.TI30XPrioKeypad = TI30XPrioKeypad;
