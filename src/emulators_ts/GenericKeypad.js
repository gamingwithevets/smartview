'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const error_strings = require("./ErrorStrings");
const asic = require("./ASIC");
const utilities = require("./Utilities");
const _0x4195f0 = -1;
class GenericKeypad {
	constructor(_0x12b039, _0x287137, _0xed76d6) {
		this.hasAKeyBeenPressed = false;
		this.keyHistoryPointer = 0;
		this.keyHistBufferMaxLength = 0;
		this.hasBeenInitialized = false;
		this.isOutOfFocus = false;
		this.isSVGKeyPressed = false;
		this.defaultNoStrokeColor = "none";
		this.defaultNoFillColor = "none";
		this.defaultTrFillColor = "transparent";
		this.ErrorMessages = {
			"BUTTON_LACKS_FILL": "Button has no Fill Attribute",
			"BUTTON_LACKS_STROKE_OR_IS_TR": "Button has no Stroke Attribute or its Fill is Transparent"
		};
		this.allKeys = [];
		this.allPrimaryKeyCodes = [];
		this.allAltKeyCodes = [];
		this.allCodes = [];
		this.highlightClass = "ti_highlight_keys";
		this.disableClass = "ti_disabled_keys";
		this.currentDisabledKeys = [];
		this.disabledKeys = [];
		this.disabled2ndKeys = [];
		this.disabledAlphaKeys = [];
		this.calcMode = asic.KeypadMetaState.NORMAL;
		this.shouldAcceptInput = false;
		this.useScancodes = false;
		this.keyHistoryBuffer = [];
		this.DOMKeys = [];
		this.divId = _0x12b039;
		this.settings = _0x287137;
		this.asic = _0xed76d6;
	}
	["start"]() {
		const _0x2a346b = document.getElementById(this.divId);
		return utilities.Utilities.loadSVG(this.settings.svgUrl).then(_0x13cecf => {
			this.svg = _0x13cecf;
			_0x2a346b.appendChild(_0x13cecf);
			this.initKeysFromDOM();
			this.acceptInput(true);
		});
	}
	["stop"]() {
		return new Promise((_0xd9ffeb, _0x17719c) => {
			_0xd9ffeb();
		});
	}
	["reset"]() {
		return new Promise((_0x492b84, _0x57755d) => {
			_0x492b84();
		});
	}
	["getState"]() {
		return null;
	}
	["setState"](_0x239788) {}
	["updateKeyPressHistory"](_0x4ea522) {
		if (this.keyHistBufferMaxLength > 0) {
			this.keyHistoryBuffer[this.keyHistoryPointer] = _0x4ea522;
			this.keyHistoryPointer = (this.keyHistoryPointer + 0x1) % this.keyHistBufferMaxLength;
		}
	}
	["deleteKeyPressHistory"]() {
		this.keyHistoryBuffer.length = 0;
		this.keyHistoryPointer = 0;
	}
	["getKeyPressHistory"]() {
		const _0x524054 = [];
		if (this.keyHistoryBuffer.length === this.keyHistBufferMaxLength && this.keyHistoryPointer !== 0) {
			const _0x269db4 = this.keyHistoryPointer;
			const _0x4efc5c = this.keyHistoryBuffer.slice(0, _0x269db4);
			const _0x438cbb = this.keyHistoryBuffer.slice(_0x269db4);
			return _0x524054.concat(_0x438cbb, _0x4efc5c);
		}
		return this.keyHistoryBuffer;
	}
	["mouseDownHandler"](_0x103e3c) {
		if (this.shouldAcceptInput) {
			if (_0x103e3c.currentTarget instanceof Element) {
				const _0x158e7e = _0x103e3c.currentTarget;
				if (_0x103e3c instanceof TouchEvent || _0x103e3c.buttons === 0x1 || _0x103e3c.button === 0) {
					if (!this.isSVGKeyPressed && this.isKeyEnabled(_0x158e7e.id)) {
						this.div.focus();
						_0x103e3c.stopPropagation();
						_0x103e3c.preventDefault();
						this.lastButtonPressed = _0x158e7e;
						this.hasAKeyBeenPressed = true;
						this.isSVGKeyPressed = true;
						utilities.Utilities.addClass(_0x158e7e, this.highlightClass);
						const _0x95fecb = this.allKeys.indexOf(_0x158e7e.id);
						this.setKey(this.allCodes[_0x95fecb]);
						this.updateKeyPressHistory(_0x158e7e.id);
					}
				}
			}
		}
	}
	["mouseUpHandler"](_0x5a609d) {
		if (_0x5a609d.currentTarget instanceof Element) {
			const _0x568360 = _0x5a609d.currentTarget;
			if (this.isSVGKeyPressed && this.lastButtonPressed === _0x568360) {
				_0x5a609d.preventDefault();
				const _0x28ca34 = this.allKeys.indexOf(_0x568360.id);
				this.releaseKey(this.allCodes[_0x28ca34]);
				utilities.Utilities.removeClass(_0x568360, this.highlightClass);
				this.lastPressedKey = undefined;
				this.isSVGKeyPressed = false;
				this.updateDisabledKeys();
			}
		}
	}
	["mouseOutHandler"](_0x70c9c9) {
		const _0x301b13 = _0x70c9c9.currentTarget || _0x70c9c9.target || _0x70c9c9.srcElement;
		if (this.isSVGKeyPressed && this.lastButtonPressed === _0x301b13) {
			this.mouseUpHandler(_0x70c9c9);
		}
	}
	["mouseLeaveHandler"](_0x565ff1) {
		const _0x15aab5 = _0x565ff1.currentTarget || _0x565ff1.target || _0x565ff1.srcElement;
		if (this.isSVGKeyPressed && this.lastButtonPressed === _0x15aab5) {
			this.mouseUpHandler(_0x565ff1);
		}
	}
	["toggleEnableKeyButtons"](_0x2f364a, _0x265a20) {
		let _0x3d99fc = -0x1;
		let _0xd0d695 = function (_0x226b47) {
			return _0x2f364a.indexOf(_0x226b47) === _0x4195f0;
		};
		let _0x19b820 = function (_0x22d1af) {
			utilities.Utilities.addClass(document.getElementById(_0x22d1af), this.disableClass);
			if (this.isSVGKeyPressed) {
				utilities.Utilities.removeClass(document.getElementById(_0x22d1af), this.highlightClass);
				this.userOnBlurHandler();
			}
			return true;
		};
		let _0x5f2bb9 = function (_0x33f205) {
			utilities.Utilities.removeClass(document.getElementById(_0x33f205), this.disableClass);
			return true;
		};
		if (_0x2f364a) {
			if (_0x265a20) {
				_0x2f364a.forEach(_0x5f2bb9, this);
				this.currentDisabledKeys = this.currentDisabledKeys.filter(_0xd0d695, this);
			} else {
				_0x2f364a.forEach(_0x19b820, this);
				this.currentDisabledKeys = _0x2f364a;
			}
			_0x3d99fc = _0x2f364a.length;
		}
		_0xd0d695 = undefined;
		_0x19b820 = undefined;
		_0x5f2bb9 = undefined;
		return _0x3d99fc;
	}
	["initKeysFromDOM"]() {
		const _0x611873 = this;
		let _0x364253 = false;
		let _0x4fe4ae = false;
		let _0x446b48;
		if (this.hasBeenInitialized) {
			this.finalize();
		}
		this.keyHistoryBuffer = [];
		this.DOMKeys = [];
		this.allKeys = this.settings.SVGKeys.map(function (_0x3430d2) {
			return _0x3430d2.SVGKey;
		});
		this.allPrimaryKeyCodes = this.settings.SVGKeys.map(function (_0x1bdb70) {
			return _0x1bdb70.keyCode[0];
		});
		this.allAltKeyCodes = this.settings.SVGKeys.map(function (_0x15922a) {
			return _0x15922a.keyCode[0x1];
		});
		this.allCodes = this.settings.SVGKeys.map(function (_0x597dca) {
			return _0x597dca.code;
		});
		if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Windows Phone/i) || "ontouchstart" in window || navigator.msMaxTouchPoints > 0) {
			let _0x4edafe = window.orientation;
			_0x446b48 = function () {
				if (window.orientation !== _0x4edafe) {
					_0x4edafe = window.orientation;
					_0x611873.userOnBlurHandler();
				}
			};
			window.addEventListener("resize", _0x446b48, false);
			window.addEventListener("orientationchange", _0x446b48, false);
		}
		this.div = document.getElementById(this.divId);
		this.div.onkeydown = function (_0x6f320d) {
			_0x6f320d.preventDefault();
			_0x611873.userKeyDownHandler(_0x6f320d);
		};
		this.div.onkeyup = function (_0x488732) {
			_0x488732.preventDefault();
			_0x611873.userKeyUpHandler(_0x488732);
		};
		this.div.onmousedown = function (_0x3c457e) {
			_0x3c457e.preventDefault();
			_0x611873.div.focus();
		};
		this.div.onblur = function (_0x5ee9f5) {
			_0x611873.userOnBlurHandler();
		};
		this.div.oncontextmenu = function (_0x406e39) {
			_0x406e39.preventDefault();
		};
		const _0x39acef = function (_0x518490) {
			_0x611873.mouseDownHandler(_0x518490);
		};
		const _0x1bd832 = function (_0x3ad28e) {
			_0x611873.mouseUpHandler(_0x3ad28e);
		};
		const _0x386c71 = function (_0x2868d7) {
			_0x2868d7.preventDefault();
		};
		const _0x28c144 = function (_0x4ab09a) {
			_0x611873.mouseOutHandler(_0x4ab09a);
		};
		const _0x3294f8 = function (_0x40ccef) {
			_0x611873.mouseLeaveHandler(_0x40ccef);
		};
		const _0x433f85 = function (_0x296fc3) {
			if (_0x296fc3.targetTouches.length === 0x1) {
				_0x296fc3.preventDefault();
			}
		};
		const _0x76cb75 = this.getInputPlatform();
		if (_0x76cb75 === 0x1) {
			if ("ontouchleave" in window) {
				_0x364253 = true;
			}
			_0x4fe4ae = true;
		}
		const _0x5be541 = this.allKeys.length;
		for (let _0x2332f6 = 0; _0x2332f6 < _0x5be541; _0x2332f6 += 0x1) {
			this.DOMKeys.push(document.getElementById(this.allKeys[_0x2332f6]));
			if (!this.DOMKeys[_0x2332f6]) {
				throw new Error("SVG is missing Key " + this.settings.SVGKeys[_0x2332f6].SVGKey);
			}
			switch (_0x76cb75) {
				case 0:
					this.DOMKeys[_0x2332f6].addEventListener("MSPointerDown", _0x39acef);
					this.DOMKeys[_0x2332f6].addEventListener("MSPointerUp", _0x1bd832);
					this.DOMKeys[_0x2332f6].addEventListener("MSPointerOut", _0x28c144);
					break;
				case 0x1:
					this.DOMKeys[_0x2332f6].addEventListener("touchstart", _0x39acef);
					this.DOMKeys[_0x2332f6].addEventListener("touchmove", _0x433f85);
					this.DOMKeys[_0x2332f6].addEventListener("contextmenu", _0x386c71);
					this.DOMKeys[_0x2332f6].addEventListener("touchend", _0x1bd832);
					if (_0x364253) {
						this.DOMKeys[_0x2332f6].addEventListener("touchleave", _0x28c144);
					}
					if (!_0x4fe4ae) {
						break;
					}
				default:
					this.DOMKeys[_0x2332f6].onmousedown = _0x39acef;
					this.DOMKeys[_0x2332f6].onmouseup = _0x1bd832;
					if (navigator.userAgent.indexOf("Edge") !== -0x1) {
						this.DOMKeys[_0x2332f6].onmouseout = _0x28c144;
					} else {
						const _0x54f6f7 = this.DOMKeys[_0x2332f6];
						_0x54f6f7.onmouseleave = _0x3294f8;
					}
					break;
			}
		}
		this.hasBeenInitialized = true;
	}
	["getInputPlatform"]() {
		let _0x3ca515;
		if (window.navigator.msPointerEnabled) {
			_0x3ca515 = 0;
		} else if ("ontouchstart" in window) {
			_0x3ca515 = 0x1;
		} else {
			_0x3ca515 = 0x2;
		}
		return _0x3ca515;
	}
	["finalize"]() {
		this.allKeys.length = 0;
		this.allPrimaryKeyCodes.length = 0;
		this.allAltKeyCodes.length = 0;
		this.allCodes.length = 0;
		this.DOMKeys.length = 0;
		this.currentDisabledKeys.length = 0;
		this.lastPressedKey = undefined;
		this.isSVGKeyPressed = false;
		this.hasBeenInitialized = false;
		this.calcMode = asic.KeypadMetaState.NORMAL;
	}
	["userOnBlurHandler"]() {
		let _0x2560bc = 0;
		let _0x5cc66a = 0;
		let _0x5a6812 = 0;
		let _0x2f4442 = false;
		let _0x7e157f;
		document.onhelp = function () {
			return true;
		};
		this.isOutOfFocus = true;
		if (this.lastPressedKey === undefined) {
			this.isOutOfFocus = false;
		}
		if ((this.lastButtonPressed || this.lastPressedKey) && this.isSVGKeyPressed) {
			if (this.lastButtonPressed) {
				_0x7e157f = this.lastButtonPressed.id;
				_0x2560bc = this.allKeys.indexOf(_0x7e157f);
				this.releaseKey(this.allCodes[_0x2560bc]);
				utilities.Utilities.removeClass(document.getElementById(_0x7e157f), this.highlightClass);
				this.lastButtonPressed = undefined;
				this.isSVGKeyPressed = false;
				this.updateDisabledKeys();
			}
			if (this.lastPressedKey) {
				const _0x2d9f6a = this.lastPressedKey;
				while (!_0x2f4442 && _0x2560bc !== _0x4195f0) {
					_0x2560bc = this.allPrimaryKeyCodes.indexOf(_0x2d9f6a.keyboardCode, _0x5cc66a);
					if (_0x2560bc !== _0x4195f0 && this.settings.SVGKeys[_0x2560bc].shiftKey[0] === _0x2d9f6a.shiftKey) {
						_0x7e157f = this.allKeys[_0x2560bc];
						_0x2f4442 = true;
						break;
					}
					if (_0x2560bc === this.allPrimaryKeyCodes.length - 0x1) {
						_0x2560bc = _0x4195f0;
						break;
					}
					_0x5cc66a = _0x2560bc + 0x1;
				}
				if (!_0x2f4442) {
					_0x5a6812 = 0x1;
					_0x5cc66a = 0;
					_0x2560bc = 0;
				}
				while (!_0x2f4442 && _0x2560bc !== _0x4195f0) {
					_0x2560bc = this.allAltKeyCodes.indexOf(_0x2d9f6a.keyboardCode, _0x5cc66a);
					if (_0x2560bc !== _0x4195f0 && this.settings.SVGKeys[_0x2560bc].shiftKey[_0x5a6812] === _0x2d9f6a.shiftKey) {
						_0x7e157f = this.allKeys[_0x2560bc];
						_0x2f4442 = true;
						break;
					}
					if (_0x2560bc === this.allPrimaryKeyCodes.length - 0x1) {
						_0x2560bc = _0x4195f0;
						break;
					}
					_0x5cc66a = _0x2560bc + 0x1;
				}
				if (_0x2560bc !== _0x4195f0 && _0x2f4442) {
					this.releaseKey(this.allCodes[_0x2560bc]);
					utilities.Utilities.removeClass(document.getElementById(_0x7e157f), this.highlightClass);
					this.lastPressedKey = undefined;
					this.isSVGKeyPressed = false;
					this.updateDisabledKeys();
				}
			}
		}
	}
	["userKeyUpHandler"](_0x5ca3e5) {
		this.isOutOfFocus = false;
		if (!this.isHidden() && this.isSVGKeyPressed && _0x5ca3e5.keyCode !== 0x9) {
			let _0x5e36f0;
			let _0x2e5aa9 = false;
			let _0x32bdd8 = 0;
			let _0xa9ceaa = 0;
			let _0x8cd434 = this.browserKeymapping(_0x5ca3e5);
			if (_0x8cd434.keyboardCode === 0x12 || _0x8cd434.keyboardCode === 0x5b || _0x8cd434.keyboardCode === 0x10) {
				_0x8cd434 = this.lastPressedKey;
			}
			let _0x46ec59 = 0;
			while (!_0x2e5aa9 && _0x46ec59 !== _0x4195f0) {
				_0x46ec59 = this.allPrimaryKeyCodes.indexOf(_0x8cd434.keyboardCode, _0xa9ceaa);
				if (_0x46ec59 !== _0x4195f0 && this.settings.SVGKeys[_0x46ec59].shiftKey[0] === _0x8cd434.shiftKey) {
					_0x5e36f0 = this.allKeys[_0x46ec59];
					_0x2e5aa9 = true;
					break;
				}
				if (_0x46ec59 === this.allPrimaryKeyCodes.length - 0x1) {
					_0x46ec59 = _0x4195f0;
					break;
				}
				_0xa9ceaa = _0x46ec59 + 0x1;
			}
			if (!_0x2e5aa9) {
				_0x32bdd8 = 0x1;
				_0xa9ceaa = 0;
				_0x46ec59 = 0;
			}
			while (!_0x2e5aa9 && _0x46ec59 !== _0x4195f0) {
				_0x46ec59 = this.allAltKeyCodes.indexOf(_0x8cd434.keyboardCode, _0xa9ceaa);
				if (_0x46ec59 !== _0x4195f0 && this.settings.SVGKeys[_0x46ec59].shiftKey[_0x32bdd8] === _0x8cd434.shiftKey) {
					_0x5e36f0 = this.allKeys[_0x46ec59];
					_0x2e5aa9 = true;
					break;
				}
				if (_0x46ec59 === this.allPrimaryKeyCodes.length - 0x1) {
					_0x46ec59 = _0x4195f0;
					break;
				}
				_0xa9ceaa = _0x46ec59 + 0x1;
			}
			if (_0x2e5aa9 && this.lastPressedKey.hasOwnProperty("keyboardCode") && this.lastPressedKey.keyboardCode === _0x8cd434.keyboardCode && this.lastPressedKey.hasOwnProperty("shiftKey") && this.lastPressedKey.shiftKey === _0x8cd434.shiftKey && this.isKeyEnabled(_0x5e36f0)) {
				_0x5ca3e5.preventDefault();
				this.releaseKey(this.allCodes[_0x46ec59]);
				utilities.Utilities.removeClass(document.getElementById(_0x5e36f0), this.highlightClass);
				this.lastPressedKey = undefined;
				this.isSVGKeyPressed = false;
				this.updateDisabledKeys();
			}
		}
	}
	["userKeyDownHandler"](_0x5b768f) {
		if (this.shouldAcceptInput && !this.isOutOfFocus) {
			let _0x27804b = -0x2;
			let _0x366806 = 0;
			let _0x117c6b = 0;
			let _0x15153b = false;
			const _0x29e3a = this.browserKeymapping(_0x5b768f);
			while (!_0x15153b && _0x27804b !== _0x4195f0) {
				_0x27804b = this.allPrimaryKeyCodes.indexOf(_0x29e3a.keyboardCode, _0x117c6b);
				if (_0x27804b !== _0x4195f0 && this.settings.SVGKeys[_0x27804b].shiftKey[_0x366806] === _0x29e3a.shiftKey && this.isKeyEnabled(this.allKeys[_0x27804b])) {
					_0x5b768f.preventDefault();
					document.onhelp = function () {
						return false;
					};
					if (!this.isSVGKeyPressed && !this.isHidden()) {
						if (_0x5b768f.keyCode !== 0x10 && _0x5b768f.keyCode !== 0x9) {
							this.lastPressedKey = _0x29e3a;
							utilities.Utilities.addClass(document.getElementById(this.allKeys[_0x27804b]), this.highlightClass);
							this.setKey(this.allCodes[_0x27804b]);
							this.updateKeyPressHistory(this.allKeys[_0x27804b]);
							this.isSVGKeyPressed = true;
							this.hasAKeyBeenPressed = true;
							_0x15153b = true;
						}
					}
				}
				if (_0x27804b === this.allPrimaryKeyCodes.length - 0x1) {
					_0x27804b = -0x1;
				} else {
					_0x117c6b = _0x27804b + 0x1;
				}
			}
			if (!_0x15153b) {
				_0x117c6b = 0;
				_0x27804b = -0x2;
				_0x366806 = 0x1;
			}
			while (!_0x15153b && _0x27804b !== _0x4195f0) {
				_0x27804b = this.allAltKeyCodes.indexOf(_0x29e3a.keyboardCode, _0x117c6b);
				if (_0x27804b !== _0x4195f0 && this.settings.SVGKeys[_0x27804b].shiftKey[_0x366806] === _0x29e3a.shiftKey && this.isKeyEnabled(this.allKeys[_0x27804b])) {
					_0x5b768f.preventDefault();
					document.onhelp = function () {
						return false;
					};
					if (!this.isSVGKeyPressed && !this.isHidden()) {
						if (_0x5b768f.keyCode !== 0x10 && _0x5b768f.keyCode !== 0x9) {
							this.lastPressedKey = _0x29e3a;
							utilities.Utilities.addClass(document.getElementById(this.allKeys[_0x27804b]), this.highlightClass);
							this.setKey(this.allCodes[_0x27804b]);
							this.updateKeyPressHistory(this.allKeys[_0x27804b]);
							this.isSVGKeyPressed = true;
							this.hasAKeyBeenPressed = true;
						}
					}
				}
				if (_0x27804b === this.allPrimaryKeyCodes.length - 0x1) {
					_0x27804b = -0x1;
				} else {
					_0x117c6b = _0x27804b + 0x1;
				}
			}
		}
	}
	["browserKeymapping"](event) {
		let keycode = event.keyCode;
		let shift_key = event.shiftKey;
		const key = event.key;
		const location = event.location;
		switch (keycode) {
			case 0x3b:
				keycode = 0xba;
				break;
			case 0x3d:
				keycode = 0xbb;
				if (location === 3) {
					shift_key = false;
				}
				break;
			case 0x60:
				keycode = 0x30;
				break;
			case 0x61:
				keycode = 0x31;
				break;
			case 0x62:
				keycode = 0x32;
				break;
			case 0x63:
				keycode = 0x33;
				break;
			case 0x64:
				keycode = 0x34;
				break;
			case 0x65:
				keycode = 0x35;
				break;
			case 0x66:
				keycode = 0x36;
				break;
			case 0x67:
				keycode = 0x37;
				break;
			case 0x68:
				keycode = 0x38;
				break;
			case 0x69:
				keycode = 0x39;
				break;
			case 0x6a:
				keycode = 0x38;
				shift_key = true;
				break;
			case 0x6b:
				keycode = 0xbb;
				shift_key = true;
				break;
			case 0x6d:
				keycode = 0xbd;
				break;
			case 0x6e:
				keycode = 0xbe;
				break;
			case 0x6f:
				keycode = 0xbf;
				break;
			case 0xad:
				keycode = 0xbd;
				break;
			case 0xbb:
				if (location === 3) {
					if (key === "U+002B") {
						shift_key = true;
					} else {
						shift_key = false;
					}
				}
				break;
			case 0xe0:
				keycode = 0x5b;
				break;
			default:
				break;
		}
		return {
			"keyboardCode": keycode,
			"shiftKey": shift_key
		};
	}
	["isKeyEnabled"](_0x14db77) {
		return _0x14db77.includes("_KEY_") && (this.currentDisabledKeys.length === 0 || this.currentDisabledKeys.toString().indexOf(_0x14db77) === _0x4195f0);
	}
	["getCodeIndex"](_0x5514ed) {
		return this.allCodes.indexOf(_0x5514ed);
	}
	["setKeyMapping"]() {
		let _0x16472c = [];
		let _0x2fbd9c = this;
		if (!this.keyMappingFile) {
			throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
		}
		if (this.keyMappingFile.split(".").pop() === this.keyMappingFileExtension) {
			const _0x461daf = new XMLHttpRequest();
			let _0x1f4742 = false;
			const _0x25f99d = setTimeout(function () {
				_0x1f4742 = true;
				_0x461daf.abort();
				throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
			}, 0x1388);
			_0x461daf.open("GET", this.keyMappingFile, true);
			_0x461daf.onreadystatechange = function () {
				if (_0x461daf.readyState !== 0x4) {
					return false;
				}
				if (_0x1f4742) {
					return false;
				}
				clearTimeout(_0x25f99d);
				if (_0x461daf.status === 0xc8) {
					try {
						_0x16472c = JSON.parse(_0x461daf.responseText);
					} catch (_0x39db80) {
						throw new Error(error_strings.ERROR_KEY_MAPPING_DAMAGED);
					}
					if (_0x16472c.length > 0) {
						_0x16472c.forEach(function (_0x491fc7) {
							const _0x1b6567 = this.getCodeIndex(_0x491fc7.code);
							if (_0x1b6567 !== -0x1) {
								for (let _0x4e70f9 = 0; _0x4e70f9 < 0x2; _0x4e70f9 += 0x1) {
									let _0x32acf3 = this.allPrimaryKeyCodes.indexOf(_0x491fc7.keyCode[_0x4e70f9]);
									if (_0x32acf3 !== -0x1 && this.settings.SVGKeys[_0x32acf3].shiftKey[0] === _0x491fc7.shiftKey[0]) {
										delete this.allPrimaryKeyCodes[_0x32acf3];
										delete this.settings.SVGKeys[_0x32acf3].keyCode[0];
										delete this.settings.SVGKeys[_0x32acf3].shiftKey[0];
									}
									_0x32acf3 = this.allAltKeyCodes.indexOf(_0x491fc7.keyCode[_0x4e70f9]);
									if (_0x32acf3 !== -0x1 && this.settings.SVGKeys[_0x32acf3].shiftKey[0x1] === _0x491fc7.shiftKey[0x1]) {
										delete this.allAltKeyCodes[_0x32acf3];
										delete this.settings.SVGKeys[_0x32acf3].keyCode[0x1];
										delete this.settings.SVGKeys[_0x32acf3].shiftKey[0x1];
									}
								}
								this.settings.SVGKeys[_0x1b6567].keyCode = _0x491fc7.keyCode;
								this.allPrimaryKeyCodes[_0x1b6567] = _0x491fc7.keyCode[0];
								this.allAltKeyCodes[_0x1b6567] = _0x491fc7.keyCode[0x1];
								this.settings.SVGKeys[_0x1b6567].shiftKey = _0x491fc7.shiftKey;
							}
						}, _0x2fbd9c);
						_0x2fbd9c.settings.SVGKeys.forEach(function (_0x42fd18) {
							if (!_0x42fd18.keyCode[0] && !_0x42fd18.keyCode[0x1]) {
								throw new Error("The key " + _0x42fd18.SVGKey + " doesn't have a keyboard code associated.");
							}
						});
					}
				} else {
					_0x2fbd9c = undefined;
					if (_0x461daf.status === 0x194) {
						throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
					}
				}
				_0x16472c = undefined;
				_0x2fbd9c = undefined;
			};
			try {
				_0x461daf.send(undefined);
			} catch (_0x443646) {
				throw new Error(_0x443646.message);
			}
		} else {
			throw new Error(error_strings.ERROR_EXT_FOR_KEYMAPPING + this.keyMappingFileExtension);
		}
		return true;
	}
	["disableKeys"](_0x391553) {
		return new Promise((_0x138b81, _0x342f1b) => {
			const _0x34633e = typeof _0x391553;
			if (!this.isHidden()) {
				if (_0x34633e === "string") {
					this.readDisableKeyFile(_0x391553).then(() => {
						_0x138b81();
					}, () => {
						_0x342f1b();
					});
				} else if (_0x34633e === "object") {
					this.disableKeysAPI(_0x391553);
					_0x138b81();
				} else {
					_0x342f1b();
				}
			} else {
				throw new Error(error_strings.ERROR_EMU_HIDDEN_KEYS_DISABLED);
			}
		});
	}
	["disableKeysAPI"](_0x338cb8) {
		if (_0x338cb8.keys && _0x338cb8.hasOwnProperty("secondKeys") && _0x338cb8.hasOwnProperty("alphaKeys") && _0x338cb8.keys instanceof Array && _0x338cb8.secondKeys instanceof Array && _0x338cb8.alphaKeys instanceof Array) {
			const _0xcb9b9 = function (_0x49e89a) {
				const _0x53ab39 = this.getCodeIndex(_0x49e89a);
				if (_0x53ab39 !== _0x4195f0) {
					return this.allKeys[_0x53ab39];
				}
				throw new Error(error_strings.ERROR_INVALID_KEY_CONFIGURATION_FILE);
			};
			this.disabledKeys = _0x338cb8.keys.map(_0xcb9b9, this);
			this.disabled2ndKeys = _0x338cb8.secondKeys.map(_0xcb9b9, this);
			this.disabledAlphaKeys = _0x338cb8.alphaKeys.map(_0xcb9b9, this);
			this.toggleEnableKeyButtons(this.allKeys, true);
			if (this.calcMode !== asic.KeypadMetaState.SECOND && this.calcMode !== asic.KeypadMetaState.ALPHA) {
				this.toggleEnableKeyButtons(this.disabledKeys, false);
			}
			if (this.calcMode === asic.KeypadMetaState.SECOND) {
				this.toggleEnableKeyButtons(this.disabled2ndKeys, false);
			}
			if (this.calcMode === asic.KeypadMetaState.ALPHA) {
				this.toggleEnableKeyButtons(this.disabledAlphaKeys, false);
			}
		}
	}
	["readDisableKeyFile"](_0x5bbe0b) {
		return new Promise((_0x4f3047, _0x358be9) => {
			_0x5bbe0b = _0x5bbe0b.trim();
			const _0x4930ff = window.location.host;
			const _0xc9bf6d = _0x5bbe0b.split("/");
			if (_0x5bbe0b.indexOf("http://") === 0 || _0x5bbe0b.indexOf("https://") === 0) {
				if (_0x5bbe0b.split(".").pop() === "json") {
					if (_0xc9bf6d[0x2] === _0x4930ff) {
						const _0x1771a2 = new XMLHttpRequest();
						let _0x179f5f = this;
						_0x1771a2.addEventListener("load", function () {
							if (_0x1771a2.status === 0xc8) {
								try {
									const _0x508078 = JSON.parse(_0x1771a2.responseText);
									_0x179f5f.disableKeysAPI(_0x508078);
								} catch (_0x3f935c) {
									_0x179f5f.enableAllKeys();
									_0x179f5f = undefined;
									throw new Error(error_strings.ERROR_INVALID_KEY_CONFIGURATION_FILE);
								}
								_0x179f5f = undefined;
								_0x4f3047();
							} else {
								_0x179f5f = undefined;
								throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
							}
						});
						_0x1771a2.open("GET", _0x5bbe0b + "?r=" + Math.random(), false);
						_0x1771a2.send();
					} else {
						throw new Error(error_strings.ERROR_FILE_NA_IN_SERVER);
					}
				} else {
					throw new Error(error_strings.ERROR_FILE_EXT_JSON);
				}
			} else {
				throw new Error(error_strings.ERROR_NOT_VALID_KEY_CONFIGURATION_URL);
			}
		});
	}
	["enableAllKeys"]() {
		if (!this.isHidden()) {
			this.disabledKeys.length = 0;
			this.disabled2ndKeys.length = 0;
			this.disabledAlphaKeys.length = 0;
			this.toggleEnableKeyButtons(this.allKeys, true);
		} else {
			throw new Error(error_strings.ERROR_EMU_HIDDEN_KEYS_ENABLED);
		}
	}
	["disableAllKeys"]() {
		if (!this.isHidden()) {
			this.toggleEnableKeyButtons(this.allKeys, false);
		} else {
			throw new Error(error_strings.ERROR_EMU_HIDDEN_KEYS_DISABLED);
		}
	}
	["getMetaState"]() {
		return this.asic.getKeypadMetaState();
	}
	["updateDisabledKeys"]() {
		this.getMetaState().then(_0x26ccbd => {
			if (!this.isHidden()) {
				if (this.calcMode !== _0x26ccbd) {
					this.toggleEnableKeyButtons(this.currentDisabledKeys, true);
					if (_0x26ccbd === asic.KeypadMetaState.SECOND) {
						this.toggleEnableKeyButtons(this.disabled2ndKeys, false);
					} else if (_0x26ccbd === asic.KeypadMetaState.ALPHA) {
						this.toggleEnableKeyButtons(this.disabledAlphaKeys, false);
					} else {
						this.toggleEnableKeyButtons(this.disabledKeys, false);
					}
					this.calcMode = _0x26ccbd;
				}
			}
		});
	}
	["setKey"](_0x1bb147) {
		return this.asic.keyDown(_0x1bb147);
	}
	["setKeySVG"](_0x493495) {
		let _0x6df6ab = 0;
		_0x6df6ab = this.allCodes[this.allKeys.indexOf(_0x493495)];
		return this.setKey(_0x6df6ab);
	}
	["releaseKey"](_0x2755e9) {
		return this.asic.keyUp(_0x2755e9);
	}
	["acceptInput"](_0x43adb4) {
		this.shouldAcceptInput = _0x43adb4;
	}
	["getAcceptInput"]() {
		return this.shouldAcceptInput;
	}
	["switchTheme"](_0x507f1f, _0x1f8126) {
		if (!/[^a-z\d]/i.test(_0x507f1f)) {
			const _0x2b8ed9 = document.getElementById(_0x1f8126);
			const _0x3e17dc = document.getElementById("display");
			utilities.Utilities.removePrefixedClass(_0x3e17dc, "ti_theme_");
			utilities.Utilities.removePrefixedClass(_0x2b8ed9, "ti_theme_");
			if (_0x507f1f !== undefined && _0x507f1f !== '') {
				_0x507f1f = "ti_theme_" + _0x507f1f;
				utilities.Utilities.addClass(_0x2b8ed9, _0x507f1f);
				utilities.Utilities.addClass(_0x3e17dc, _0x507f1f);
			}
		}
	}
	["isHidden"]() {
		let _0x32e0c7 = true;
		const _0x157645 = document.getElementById(this.divId);
		const _0x49f1bb = window.getComputedStyle(_0x157645);
		if (_0x49f1bb.display !== "none") {
			if (_0x49f1bb.visibility !== "hidden") {
				_0x32e0c7 = false;
			}
		}
		return _0x32e0c7;
	}
}
exports.GenericKeypad = GenericKeypad;
var _0x112407;
(function (_0x339e48) {
	_0x339e48[_0x339e48.KeyDown = 0] = "KeyDown";
	_0x339e48[_0x339e48.KeyUp   = 1] = "KeyUp";
})(_0x112407 || (_0x112407 = {}));
class _0x420e5a {
	constructor(_0x1d1804, _0x54c7bb) {
		this.eventType = _0x1d1804;
		this.keyCode = _0x54c7bb;
	}
	["getEventType"]() {
		return this.eventType;
	}
	["getKeyCode"]() {
		return this.keyCode;
	}
}
class KeyEventProcessor {
	constructor() {
		this.keyCurrentlyHeldDown = 0;
		this.potentialAutoRepeatKeyCode = 0;
		this.autoRepeatTimer = -0x1;
		this.autoRepeatInterval = 0x1f4;
		this.clearQueue();
	}
	["clearQueue"]() {
		this.keyEvents = [];
	}
	["isQueueEmpty"]() {
		return this.keyEvents.length === 0;
	}
	["isPotentialAutoRepeat"]() {
		return this.potentialAutoRepeatKeyCode !== 0;
	}
	["addKeyDown"](_0x15324d) {
		this.keyEvents.push(new _0x420e5a(_0x112407.KeyDown, _0x15324d));
	}
	["addKeyUp"](_0xbb3a99) {
		this.keyEvents.push(new _0x420e5a(_0x112407.KeyUp, _0xbb3a99));
	}
	["getNextKeyCode"]() {
		let _0x4e4d3c = this.keyEvents.shift();
		let _0x154320 = 0;
		if (_0x4e4d3c !== undefined) {
			_0x154320 = _0x4e4d3c.getKeyCode();
			if (_0x4e4d3c.getEventType() === _0x112407.KeyUp) {
				this.keyCurrentlyHeldDown = 0;
				this.autoRepeatInterval = 0x1f4;
				_0x4e4d3c = this.keyEvents.shift();
				_0x154320 = 0;
				if (_0x4e4d3c !== undefined) {
					if (_0x4e4d3c.getEventType() !== _0x112407.KeyDown) {
						console.log("ERROR: Why is there a keyUp after a keyUp!");
					} else {
						_0x154320 = _0x4e4d3c.getKeyCode();
					}
					if (_0x154320 !== 0) {
						this.keyCurrentlyHeldDown = _0x154320;
					}
				}
			} else if (_0x154320 !== 0) {
				this.keyCurrentlyHeldDown = _0x154320;
			}
		}
		return _0x154320;
	}
	["notifyKeyCanRepeat"]() {
		if (this.keyCurrentlyHeldDown !== 0) {
			this.potentialAutoRepeatKeyCode = this.keyCurrentlyHeldDown;
			if (this.autoRepeatTimer !== -0x1) {
				window.clearTimeout(this.autoRepeatTimer);
			}
			this.autoRepeatTimer = window.setTimeout(() => {
				if (this.keyCurrentlyHeldDown === this.potentialAutoRepeatKeyCode && !this.isKeyUpInQueue()) {
					this.addKeyDown(this.keyCurrentlyHeldDown);
				}
				this.potentialAutoRepeatKeyCode = 0;
			}, this.autoRepeatInterval);
			this.autoRepeatInterval = 0x7d;
		}
	}
	["isKeyUpInQueue"]() {
		if (this.keyEvents.length === 0) {
			return false;
		} else {
			for (const _0x27ff01 of this.keyEvents) {
				if (_0x27ff01.getEventType() === _0x112407.KeyUp) {
					return true;
				}
			}
		}
		return false;
	}
}
exports.KeyEventProcessor = KeyEventProcessor;
