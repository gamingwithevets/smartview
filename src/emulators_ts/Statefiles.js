'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const _0xdb72f2 = require("./Utilities");
const _0x3d0513 = require("ts-md5/dist/md5");
class _0x4768b1 {
	["toCommands"]() {
		const _0xaad225 = {
			"statefileversion": this.statefileversion,
			"osversion": this.osversion,
			"statefiletype": this.statefiletype,
			"checksum": this.checksum,
			"compatibility": String(this.compatibility),
			"productflavor": this.productflavor
		};
		return _0xaad225;
	}
	constructor() {
		this.statefileversion = "1";
		this.osversion = "1.0.0";
		this.statefiletype = "SV_OS";
		this.checksum = '';
		this.compatibility = 0x1;
		this.productflavor = "MathPrint";
	}
}
exports.StatefileInfo = _0x4768b1;
class _0x277b59 {}
exports.Statefile = _0x277b59;
class _0x438abb {}
exports.StatefileManagerSettings = _0x438abb;
class StatefileManager {
	["getCurrentStatefileInfo"]() {
		return this.currentStatefileInfo;
	}
	["getMd5String"](_0x255e72) {
		const _0x34954a = new _0x3d0513.Md5();
		for (const _0x24f8b6 of _0x255e72.data) {
			_0x34954a.appendStr(_0x24f8b6);
		}
		_0x34954a.appendStr(_0x255e72.info.compatibility.toString());
		_0x34954a.appendStr(_0x255e72.info.osversion);
		_0x34954a.appendStr(_0x255e72.info.productflavor);
		_0x34954a.appendStr(_0x255e72.info.statefiletype);
		_0x34954a.appendStr(_0x255e72.info.statefileversion);
		return _0x34954a.end();
	}
	["getState"](_0x5dace3, _0x4a802a) {
		return new Promise((_0x5706a9, _0xd65266) => {
			const _0x28ddb7 = [];
			const _0x20cad2 = new _0x277b59();
			for (const _0x24800e of _0x5dace3) {
				const _0x3e45c9 = _0x24800e.getState();
				const _0x35e24c = _0xdb72f2.Utilities.arrayToRLEPlusString(_0x3e45c9);
				_0x28ddb7.push(_0x35e24c);
			}
			_0x20cad2.data = _0x28ddb7;
			_0x20cad2.info = new _0x4768b1();
			_0x20cad2.info.statefiletype = _0x4a802a.statefiletype;
			_0x20cad2.info.osversion = _0x4a802a.osversion;
			_0x20cad2.info.statefileversion = "2.1.0";
			_0x20cad2.info.compatibility = 0x1;
			_0x20cad2.info.productflavor = _0x4a802a.productflavor;
			_0x20cad2.info.checksum = this.getMd5String(_0x20cad2);
			_0x5706a9(JSON.stringify(_0x20cad2));
		});
	}
	["setStateFromStatefile"](_0x4fd540, _0x4063a6) {
		return new Promise((_0x5de777, _0x55de0e) => {
			const _0x112649 = this.getMd5String(_0x4063a6);
			if (_0x4063a6.info.checksum !== _0x112649) {
				_0x55de0e("Invalid checksum.");
			}
			for (let _0x5ac96b = 0; _0x5ac96b < _0x4063a6.data.length; _0x5ac96b++) {
				const _0x4b89f8 = _0x4063a6.data[_0x5ac96b];
				const _0xe53ffe = _0xdb72f2.Utilities.rlePlusStringToArray(_0x4b89f8);
				_0x4fd540[_0x5ac96b].setState(_0xe53ffe);
			}
			this.currentStatefileInfo = _0x4063a6.info;
			_0x5de777();
		});
	}
	["setState"](_0x414bfa, _0x1e880e) {
		return new Promise((_0x334980, _0x4457f2) => {
			let _0x1fc83a = new _0x277b59();
			try {
				_0x1fc83a = JSON.parse(_0x1e880e);
			} catch (_0x489ef7) {
				_0x4457f2(_0x489ef7);
			}
			this.setStateFromStatefile(_0x414bfa, _0x1fc83a).then(() => {
				_0x334980();
			});
		});
	}
}
exports.StatefileManager = StatefileManager;
