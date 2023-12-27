'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
var KeypadMetaState;
(function (kp_state) {
	kp_state[kp_state.NORMAL = 0] = "NORMAL";
	kp_state[kp_state.SECOND = 1] = "SECOND";
	kp_state[kp_state.ALPHA =  2] = "ALPHA";
})(KeypadMetaState = exports.KeypadMetaState || (exports.KeypadMetaState = {}));
var ASICState;
(function (state) {
	state[state.STOPPED = 0] = "STOPPED";
	state[state.INITIALIZING = 0x1] = "INITIALIZING";
	state[state.BUSY = 0x2] = "BUSY";
	state[state.IDLE = 0x3] = "IDLE";
	state[state.PAUSED = 0x4] = "PAUSED";
})(ASICState = exports.ASICState || (exports.ASICState = {}));
