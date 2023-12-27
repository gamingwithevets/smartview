'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
class Utilities {
	static ["hasClass"](_0x2df6f8, _0x199146) {
		let _0x15b3dd = false;
		if (_0x2df6f8 instanceof SVGElement) {
			if (_0x2df6f8.className.baseVal !== undefined) {
				_0x15b3dd = _0x2df6f8.className.baseVal.indexOf(_0x199146) > -1;
			}
		} else if (_0x2df6f8.className !== undefined && _0x2df6f8.className !== '') {
			_0x15b3dd = _0x2df6f8.className.indexOf(_0x199146) > -1;
		}
		return _0x15b3dd;
	}
	static ["addClass"](_0x517f52, _0x579ac5) {
		if (!Utilities.hasClass(_0x517f52, _0x579ac5)) {
			if (_0x517f52.classList !== undefined) {
				_0x517f52.classList.add(_0x579ac5);
			} else if (_0x517f52 instanceof SVGElement) {
				_0x517f52.className.baseVal += " " + _0x579ac5;
			} else {
				_0x517f52.className += " " + _0x579ac5;
			}
		}
	}
	static ["removeClass"](_0x58b66d, _0x1b8328) {
		if (this.hasClass(_0x58b66d, _0x1b8328)) {
			const _0x42e763 = new RegExp("(\\s|^)" + _0x1b8328 + "(\\s|$)");
			if (_0x58b66d.classList !== undefined) {
				_0x58b66d.classList.remove(_0x1b8328);
			} else {
				if (_0x58b66d instanceof SVGElement) {
					_0x58b66d.className.baseVal = _0x58b66d.className.baseVal.replace(_0x42e763, " ");
				} else if (_0x58b66d.className !== undefined && _0x58b66d.className !== '') {
					_0x58b66d.className = _0x58b66d.className.replace(_0x42e763, " ");
				}
			}
		}
	}
	static ["removePrefixedClass"](_0x692990, _0x14036f) {
		let _0x16c288;
		if (_0x692990 instanceof SVGElement) {
			_0x16c288 = _0x692990.className.baseVal.split(" ");
		} else if (_0x692990.className !== undefined) {
			_0x16c288 = _0x692990.className.split(" ");
		}
		for (let _0x634db8 = _0x16c288.length - 1; _0x634db8 >= 0; _0x634db8--) {
			if (_0x16c288[_0x634db8] && _0x16c288[_0x634db8].indexOf(_0x14036f) === 0) {
				this.removeClass(_0x692990, _0x16c288[_0x634db8]);
			}
		}
	}
	static ["loadSVG"](_0x4b5454) {
		return new Promise((_0x5cfdec, _0x6bafe8) => {
			const _0x3a49ab = new XMLHttpRequest();
			_0x3a49ab.onerror = function (_0x20d7cd) {
				_0x6bafe8(_0x20d7cd instanceof ErrorEvent ? _0x20d7cd.error : "Error on load SVG");
			};
			_0x3a49ab.onload = function (_0x1c031f) {
				if (_0x3a49ab.status === 200) {
					const _0x1460b2 = _0x3a49ab.responseXML;
					const _0x39f0f4 = _0x1460b2.documentElement;
					const _0x368266 = document.importNode(_0x39f0f4, true);
					let _0x3e5726 = typeof _0x1460b2;
					if (_0x3e5726 === "undefined" || _0x1460b2 === null) {
						_0x6bafe8("SVG was undefined or null");
					}
					_0x3e5726 = typeof _0x368266;
					if (_0x3e5726 === "undefined" || _0x368266 === null) {
						_0x6bafe8("SVG (after importNode) was undefined or null");
					}
					if (_0x368266.getAttribute("viewBox") === undefined) {
						_0x6bafe8("SVG viewBox attribute not found!");
					}
					_0x5cfdec(_0x368266);
				} else {
					console.log("agghhh");
					_0x6bafe8();
				}
			};
			_0x3a49ab.open("GET", _0x4b5454, true);
			_0x3a49ab.responseType = "document";
			_0x3a49ab.send();
		});
	}
	static ["loadROM"](_0x5a40df) {
		return new Promise((_0x3a30b6, _0x1f6bef) => {
			const _0x503a21 = new XMLHttpRequest();
			let _0x587180;
			_0x503a21.timeout = this.DEFAULT_TIMEOUT;
			_0x503a21.responseType = '';
			_0x503a21.ontimeout = () => {
				_0x1f6bef(_0x503a21.statusText);
			};
			_0x503a21.onerror = () => {
				_0x1f6bef(_0x503a21.statusText);
			};
			_0x503a21.onload = () => {
				if (_0x503a21.status === 200) {
					_0x587180 = _0x503a21.responseText;
					_0x3a30b6(_0x587180);
				} else {
					_0x1f6bef(_0x503a21.statusText);
				}
			};
			_0x503a21.open("GET", _0x5a40df, true);
			_0x503a21.send();
		});
	}
	static ["pixelDataToString"](_0x5650fe) {
		return _0x5650fe === 0 ? String.fromCharCode(0x100) : String.fromCharCode(_0x5650fe);
	}
	static ["arrayToRLEPlusString"](_0x40c360, _0x2167e4, _0x2f8252) {
		let _0x1336d7 = typeof _0x2167e4;
		let _0x414a6a = typeof _0x2f8252;
		let _0xa6d1af = 1;
		let _0x5f285a = [];
		let _0x3e14ba;
		let _0x566db8;
		let _0x33a73d;
		if (typeof _0x40c360 === "undefined" || _0x40c360 === null) {
			return '';
		}
		if (_0x1336d7 === "undefined") {
			_0x2167e4 = 0;
		}
		if (_0x414a6a === "undefined") {
			_0x2f8252 = _0x40c360.length;
		}
		_0x3e14ba = _0x40c360[_0x2167e4++];
		for (_0x2167e4; _0x2167e4 < _0x2f8252; _0x2167e4 += 1) {
			if (_0x3e14ba !== _0x40c360[_0x2167e4]) {
				_0x566db8 = typeof _0x3e14ba;
				if (_0x566db8 === "undefined") {
					debugger;
				}
				if (_0x3e14ba === 35) {
					_0x5f285a.push("#");
					_0x5f285a.push("#");
				} else {
					_0x5f285a.push(String.fromCharCode(_0x3e14ba));
				}
				if (_0xa6d1af > 1) {
					_0x5f285a.push("#");
					_0x5f285a.push(_0xa6d1af);
					_0x5f285a.push("#");
				}
				_0x3e14ba = _0x40c360[_0x2167e4];
				_0xa6d1af = 1;
			} else {
				_0xa6d1af++;
			}
		}
		if (_0x3e14ba === 35) {
			_0x5f285a.push("#");
			_0x5f285a.push("#");
		} else {
			_0x5f285a.push(String.fromCharCode(_0x3e14ba));
		}
		if (_0xa6d1af > 1) {
			_0x5f285a.push("#");
			_0x5f285a.push(_0xa6d1af);
			_0x5f285a.push("#");
		}
		const _0x158eb6 = _0x5f285a.join('');
		try {
			_0x33a73d = "RLE_NUMERIC" + _0x270ad9.from(_0x158eb6).toString("base64");
		} catch (_0xff8f1d) {
			console.log("EXCEPTION in arrayToRLEPlusString: " + _0xff8f1d + " name:" + _0xff8f1d.name + " message:" + _0xff8f1d.message);
			_0x33a73d = '';
		}
		return _0x33a73d;
	}
	static ["rlePlusStringToArray"](_0x390034, _0x28741a) {
		const _0x1e395b = "#".charAt(0);
		const _0x2dbbf2 = "#".charCodeAt(0);
		let _0x1a4e36;
		let _0x3beb2a;
		let _0x158081 = 0;
		let _0x50b8ed = 0;
		let _0x2171e7 = 0;
		let _0x420e89 = 0;
		let _0x21f834 = 0;
		let _0x261450 = 0;
		let _0x2222be = 0;
		let _0x594ece;
		let _0x593d6b = 1;
		if (typeof _0x390034 === "undefined" || _0x390034 == null) {
			return new Uint8Array(0);
		}
		_0x420e89 = _0x390034.length;
		if (_0x28741a) {
			_0x3beb2a = new Array(_0x28741a);
		} else {
			_0x3beb2a = [];
		}
		if (_0x390034.substring(0, "RLE_NUMERIC".length) === "RLE_NUMERIC") {
			_0x390034 = _0x270ad9.from(_0x390034.substring("RLE_NUMERIC".length), "base64").toString();
			_0x420e89 = _0x390034.length;
			_0x594ece = _0x390034.charCodeAt(_0x2222be);
			if (_0x594ece === _0x2dbbf2 && _0x390034.charAt(_0x2222be) === _0x1e395b) {
				_0x2222be++;
			}
			_0x2222be++;
			if (_0x390034.charAt(_0x2222be) === "#" && _0x390034.charAt(_0x2222be + 1) !== "#") {
				_0x2222be++;
				_0x593d6b = parseInt(_0x390034.substring(_0x2222be, _0x390034.indexOf("#", _0x2222be)), 10);
				_0x2222be = _0x390034.indexOf("#", _0x2222be) + 1;
			}
			while (_0x2222be < _0x420e89 || _0x593d6b > 0) {
				if (_0x593d6b <= 0) {
					_0x594ece = _0x390034.charCodeAt(_0x2222be);
					_0x2222be++;
					if (_0x594ece === _0x2dbbf2 && _0x390034.charAt(_0x2222be) === "#") {
						_0x2222be++;
					}
					if (_0x2222be >= _0x420e89) {
						if (_0x28741a) {
							_0x3beb2a[_0x21f834++] = _0x594ece;
						} else {
							_0x3beb2a.push(_0x594ece);
						}
						continue;
					}
					if (_0x390034.charAt(_0x2222be) === "#" && _0x390034.charAt(_0x2222be + 1) !== "#") {
						_0x2222be++;
						_0x593d6b = parseInt(_0x390034.substring(_0x2222be, _0x390034.indexOf("#", _0x2222be)), 10);
						_0x2222be = _0x390034.indexOf("#", _0x2222be) + 1;
					}
				}
				if (_0x28741a) {
					_0x3beb2a[_0x21f834++] = _0x594ece;
				} else {
					_0x3beb2a.push(_0x594ece);
				}
				_0x593d6b--;
			}
			return Uint8Array.from(_0x3beb2a);
		}
		for (_0x2171e7; _0x2171e7 < _0x420e89; _0x2171e7 += 2) {
			if (_0x390034[_0x2171e7] === "#") {
				_0x158081 = _0x390034.indexOf("#", _0x2171e7 + 1);
				_0x50b8ed = parseInt(_0x390034.substring(_0x2171e7 + 1, _0x158081), 10);
				for (_0x261450 = 1; _0x261450 < _0x50b8ed; _0x261450++) {
					if (_0x28741a) {
						_0x3beb2a[_0x21f834++] = _0x1a4e36;
					} else {
						_0x3beb2a.push(_0x1a4e36);
					}
				}
				_0x2171e7 = _0x158081 + 1;
			}
			if (_0x2171e7 < _0x420e89) {
				_0x1a4e36 = parseInt(_0x390034.substring(_0x2171e7, _0x2171e7 + 2), 16);
				if (_0x28741a) {
					_0x3beb2a[_0x21f834++] = _0x1a4e36;
				} else {
					_0x3beb2a.push(_0x1a4e36);
				}
			}
		}
		return Uint8Array.from(_0x3beb2a);
	}
}
Utilities.DEFAULT_TIMEOUT = 60000;
exports.Utilities = Utilities;
