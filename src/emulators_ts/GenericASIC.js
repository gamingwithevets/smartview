'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const asic = require("./ASIC");
class GenericASIC {
	constructor() {
		this.screenListeners = [];
		this.keypadMetaStateListeners = [];
		this.stateListeners = [];
		this.state = asic.ASICState.INITIALIZING;
	}
	addScreenListener(_0x36f800) {
		this.removeScreenListener(_0x36f800);
		this.screenListeners.push(_0x36f800);
	}
	removeScreenListener(_0x245650) {
		this.screenListeners = this.screenListeners.filter(_0x347fa1 => _0x347fa1 !== _0x245650);
	}
	notifyScreenListeners(_0x360dd5) {
		for (const _0x18e72a of this.screenListeners) {
			_0x18e72a.screenChanged(_0x360dd5);
		}
	}
	notifyTopIconScreenListeners(_0x2247e6) {
		for (const _0xcc1303 of this.screenListeners) {
			_0xcc1303.topIconsChanged(_0x2247e6);
		}
	}
	addKeypadMetaStateListener(_0x8fe42d) {
		this.removeKeypadMetaStateListener(_0x8fe42d);
		this.keypadMetaStateListeners.push(_0x8fe42d);
	}
	removeKeypadMetaStateListener(_0x42a00e) {
		this.keypadMetaStateListeners = this.keypadMetaStateListeners.filter(_0x37d06f => _0x37d06f !== _0x42a00e);
	}
	notifyKeypadMetaStateListeners(_0x17f71e) {
		this.keypadMetaState = _0x17f71e;
		for (const _0x1109c4 of this.keypadMetaStateListeners) {
			_0x1109c4.keypadMetaStateChanged(_0x17f71e);
		}
	}
	addStateListener(_0x5b918b) {
		this.removeStateListener(_0x5b918b);
		this.stateListeners.push(_0x5b918b);
	}
	removeStateListener(_0x47e2bc) {
		this.stateListeners = this.stateListeners.filter(_0x2bde25 => _0x2bde25 !== _0x47e2bc);
	}
	notifyStateListeners(_0x45cd65) {
		this.state = _0x45cd65;
		for (const _0x3f8d21 of this.stateListeners) {
			_0x3f8d21.asicStateChanged(_0x45cd65);
		}
	}
	getASICState() {
		return new Promise((_0x1fab14, _0x1a9315) => {
			_0x1fab14(this.state);
		});
	}
	getKeypadMetaState() {
		return new Promise((_0x4e9b3d, _0x8d6958) => {
			_0x4e9b3d(this.keypadMetaState);
		});
	}
}
exports.GenericASIC = GenericASIC;
