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
	addScreenListener(listener) {
		this.removeScreenListener(listener);
		this.screenListeners.push(listener);
	}
	removeScreenListener(listener) {
		this.screenListeners = this.screenListeners.filter(l => l !== listener);
	}
	notifyScreenListeners(screen) {
		for (const listener of this.screenListeners) {
			listener.screenChanged(screen);
		}
	}
	notifyTopIconScreenListeners(sbar) {
		for (const listener of this.screenListeners) {
			listener.topIconsChanged(sbar);
		}
	}
	addKeypadMetaStateListener(listener) {
		this.removeKeypadMetaStateListener(listener);
		this.keypadMetaStateListeners.push(listener);
	}
	removeKeypadMetaStateListener(listener) {
		this.keypadMetaStateListeners = this.keypadMetaStateListeners.filter(l => l !== listener);
	}
	notifyKeypadMetaStateListeners(state) {
		this.keypadMetaState = state;
		for (const listener of this.keypadMetaStateListeners) {
			listener.keypadMetaStateChanged(state);
		}
	}
	addStateListener(listener) {
		this.removeStateListener(listener);
		this.stateListeners.push(listener);
	}
	removeStateListener(listener) {
		this.stateListeners = this.stateListeners.filter(_0x2bde25 => _0x2bde25 !== listener);
	}
	notifyStateListeners(state) {
		this.state = state;
		for (const listener of this.stateListeners) {
			listener.asicStateChanged(state);
		}
	}
	getASICState() {
		return new Promise((resolve, reject) => {
			resolve(this.state);
		});
	}
	getKeypadMetaState() {
		return new Promise((resolve, reject) => {
			resolve(this.keypadMetaState);
		});
	}
}
exports.GenericASIC = GenericASIC;
