'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const utilities = require("./Utilities");
const md5 = require("./ts-md5/dist/md5");
class StatefileInfo {
	toCommands() {
		const info = {
			"statefileversion": this.statefileversion,
			"osversion": this.osversion,
			"statefiletype": this.statefiletype,
			"checksum": this.checksum,
			"compatibility": String(this.compatibility),
			"productflavor": this.productflavor
		};
		return info;
	}
	constructor() {
		this.statefileversion = "1";
		this.osversion = "1.0.0";
		this.statefiletype = "SV_OS";
		this.checksum = '';
		this.compatibility = 1;
		this.productflavor = "MathPrint";
	}
}
exports.StatefileInfo = StatefileInfo;

class Statefile {}
exports.Statefile = Statefile;

class StatefileManagerSettings {}
exports.StatefileManagerSettings = StatefileManagerSettings;

class StatefileManager {
	getCurrentStatefileInfo() {
		return this.currentStatefileInfo;
	}
	getMd5String(statefile) {
		const md5_str = new md5.Md5();
		for (const data of statefile.data) {
			md5_str.appendStr(data);
		}
		md5_str.appendStr(statefile.info.compatibility.toString());
		md5_str.appendStr(statefile.info.osversion);
		md5_str.appendStr(statefile.info.productflavor);
		md5_str.appendStr(statefile.info.statefiletype);
		md5_str.appendStr(statefile.info.statefileversion);
		return md5_str.end();
	}
	getState(_0x5dace3, _0x4a802a) {
		return new Promise((resolve, reject) => {
			const _0x28ddb7 = [];
			const statefile = new Statefile();
			for (const _0x24800e of _0x5dace3) {
				const _0x3e45c9 = _0x24800e.getState();
				const _0x35e24c = utilities.Utilities.arrayToRLEPlusString(_0x3e45c9);
				_0x28ddb7.push(_0x35e24c);
			}
			statefile.data = _0x28ddb7;
			statefile.info = new StatefileInfo();
			statefile.info.statefiletype = _0x4a802a.statefiletype;
			statefile.info.osversion = _0x4a802a.osversion;
			statefile.info.statefileversion = "2.1.0";
			statefile.info.compatibility = 0x1;
			statefile.info.productflavor = _0x4a802a.productflavor;
			statefile.info.checksum = this.getMd5String(statefile);
			resolve(JSON.stringify(statefile));
		});
	}
	setStateFromStatefile(state, statefile) {
		return new Promise((resolve, reject) => {
			const cs = this.getMd5String(statefile);
			if (statefile.info.checksum !== cs) {
				reject("Invalid checksum.");
			}
			for (let i = 0; i < statefile.data.length; i++) {
				const data = statefile.data[i];
				const arr = utilities.Utilities.rlePlusStringToArray(data);
				state[i].setState(arr);
			}
			this.currentStatefileInfo = statefile.info;
			resolve();
		});
	}
	setState(_0x414bfa, state) {
		return new Promise((resolve, reject) => {
			let statefile = new Statefile();
			try {
				statefile = JSON.parse(state);
			} catch (e) {
				reject(e);
			}
			this.setStateFromStatefile(_0x414bfa, statefile).then(() => {
				resolve();
			});
		});
	}
}
exports.StatefileManager = StatefileManager;
