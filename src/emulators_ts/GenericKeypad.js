'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const error_strings = require("./ErrorStrings");
const asic = require("./ASIC");
const utilities = require("./Utilities");

class GenericKeypad {
	constructor(divId, settings, asic_instance) {
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
		this.divId = divId;
		this.settings = settings;
		this.asic = asic_instance;
	}
	start() {
		const _0x2a346b = document.getElementById(this.divId);
		return utilities.Utilities.loadSVG(this.settings.svgUrl).then(_0x13cecf => {
			this.svg = _0x13cecf;
			_0x2a346b.appendChild(_0x13cecf);
			this.initKeysFromDOM();
			this.acceptInput(true);
		});
	}
	stop() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	reset() {
		return new Promise((resolve, reject) => {
			resolve();
		});
	}
	getState() {
		return null;
	}
	setState(state) {}
	updateKeyPressHistory(buffer) {
		if (this.keyHistBufferMaxLength > 0) {
			this.keyHistoryBuffer[this.keyHistoryPointer] = buffer;
			this.keyHistoryPointer = (this.keyHistoryPointer + 1) % this.keyHistBufferMaxLength;
		}
	}
	deleteKeyPressHistory() {
		this.keyHistoryBuffer.length = 0;
		this.keyHistoryPointer = 0;
	}
	getKeyPressHistory() {
		const _0x524054 = [];
		if (this.keyHistoryBuffer.length === this.keyHistBufferMaxLength && this.keyHistoryPointer !== 0) {
			const _0x269db4 = this.keyHistoryPointer;
			const _0x4efc5c = this.keyHistoryBuffer.slice(0, _0x269db4);
			const _0x438cbb = this.keyHistoryBuffer.slice(_0x269db4);
			return _0x524054.concat(_0x438cbb, _0x4efc5c);
		}
		return this.keyHistoryBuffer;
	}
	mouseDownHandler(_0x103e3c) {
		if (this.shouldAcceptInput) {
			if (_0x103e3c.currentTarget instanceof Element) {
				const _0x158e7e = _0x103e3c.currentTarget;
				if (_0x103e3c instanceof TouchEvent || _0x103e3c.buttons === 1 || _0x103e3c.button === 0) {
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
	mouseUpHandler(_0x5a609d) {
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
	mouseOutHandler(_0x70c9c9) {
		const _0x301b13 = _0x70c9c9.currentTarget || _0x70c9c9.target || _0x70c9c9.srcElement;
		if (this.isSVGKeyPressed && this.lastButtonPressed === _0x301b13) {
			this.mouseUpHandler(_0x70c9c9);
		}
	}
	mouseLeaveHandler(_0x565ff1) {
		const _0x15aab5 = _0x565ff1.currentTarget || _0x565ff1.target || _0x565ff1.srcElement;
		if (this.isSVGKeyPressed && this.lastButtonPressed === _0x15aab5) {
			this.mouseUpHandler(_0x565ff1);
		}
	}
	toggleEnableKeyButtons(_0x2f364a, _0x265a20) {
		let _0x3d99fc = -1;
		let _0xd0d695 = function (_0x226b47) {
			return _0x2f364a.indexOf(_0x226b47) === -1;
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
	initKeysFromDOM() {
		const this_ = this;
		let _0x364253 = false;
		let _0x4fe4ae = false;
		let resize;
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
			return _0x15922a.keyCode[1];
		});
		this.allCodes = this.settings.SVGKeys.map(function (_0x597dca) {
			return _0x597dca.code;
		});
		if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Windows Phone/i) || "ontouchstart" in window || navigator.msMaxTouchPoints > 0) {
			let orientation = window.orientation;
			resize = function () {
				if (window.orientation !== orientation) {
					orientation = window.orientation;
					this_.userOnBlurHandler();
				}
			};
			window.addEventListener("resize", resize, false);
			window.addEventListener("orientationchange", resize, false);
		}
		this.div = document.getElementById(this.divId);
		this.div.onkeydown = function (event) {
			event.preventDefault();
			this_.userKeyDownHandler(event);
		};
		this.div.onkeyup = function (event) {
			event.preventDefault();
			this_.userKeyUpHandler(event);
		};
		this.div.onmousedown = function (event) {
			event.preventDefault();
			this_.div.focus();
		};
		this.div.onblur = function (event) {
			this_.userOnBlurHandler();
		};
		this.div.oncontextmenu = function (event) {
			event.preventDefault();
		};
		const MSPointerDown = function (event) {
			this_.mouseDownHandler(event);
		};
		const MSPointerUp = function (event) {
			this_.mouseUpHandler(event);
		};
		const contextmenu = function (event) {
			event.preventDefault();
		};
		const MSPointerOut = function (event) {
			this_.mouseOutHandler(event);
		};
		const MSPointerLeave = function (event) {
			this_.mouseLeaveHandler(event);
		};
		const touchmove = function (event) {
			if (event.targetTouches.length === 0x1) {
				event.preventDefault();
			}
		};
		const input_platform = this.getInputPlatform();
		if (input_platform === 1) {
			if ("ontouchleave" in window) {
				_0x364253 = true;
			}
			_0x4fe4ae = true;
		}
		const numkeys = this.allKeys.length;
		for (let i = 0; i < numkeys; i += 0x1) {
			this.DOMKeys.push(document.getElementById(this.allKeys[i]));
			if (!this.DOMKeys[i]) {
				throw new Error("SVG is missing Key " + this.settings.SVGKeys[i].SVGKey);
			}
			switch (input_platform) {
				case 0:
					this.DOMKeys[i].addEventListener("MSPointerDown", MSPointerDown);
					this.DOMKeys[i].addEventListener("MSPointerUp", MSPointerUp);
					this.DOMKeys[i].addEventListener("MSPointerOut", MSPointerOut);
					break;
				case 1:
					this.DOMKeys[i].addEventListener("touchstart", MSPointerDown);
					this.DOMKeys[i].addEventListener("touchmove", touchmove);
					this.DOMKeys[i].addEventListener("contextmenu", contextmenu);
					this.DOMKeys[i].addEventListener("touchend", MSPointerUp);
					if (_0x364253) {
						this.DOMKeys[i].addEventListener("touchleave", MSPointerOut);
					}
					if (!_0x4fe4ae) {
						break;
					}
				default:
					this.DOMKeys[i].onmousedown = MSPointerDown;
					this.DOMKeys[i].onmouseup = MSPointerUp;
					if (navigator.userAgent.indexOf("Edge") !== -1) {
						this.DOMKeys[i].onmouseout = MSPointerOut;
					} else {
						const evnt = this.DOMKeys[i];
						evnt.onmouseleave = MSPointerLeave;
					}
					break;
			}
		}
		this.hasBeenInitialized = true;
	}
	getInputPlatform() {
		let platform;
		if (window.navigator.msPointerEnabled) {
			platform = 0;
		} else if ("ontouchstart" in window) {
			platform = 1;
		} else {
			platform = 2;
		}
		return platform;
	}
	finalize() {
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
	userOnBlurHandler() {
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
				while (!_0x2f4442 && _0x2560bc !== -1) {
					_0x2560bc = this.allPrimaryKeyCodes.indexOf(_0x2d9f6a.keyboardCode, _0x5cc66a);
					if (_0x2560bc !== -1 && this.settings.SVGKeys[_0x2560bc].shiftKey[0] === _0x2d9f6a.shiftKey) {
						_0x7e157f = this.allKeys[_0x2560bc];
						_0x2f4442 = true;
						break;
					}
					if (_0x2560bc === this.allPrimaryKeyCodes.length - 1) {
						_0x2560bc = -1;
						break;
					}
					_0x5cc66a = _0x2560bc + 1;
				}
				if (!_0x2f4442) {
					_0x5a6812 = 0x1;
					_0x5cc66a = 0;
					_0x2560bc = 0;
				}
				while (!_0x2f4442 && _0x2560bc !== -1) {
					_0x2560bc = this.allAltKeyCodes.indexOf(_0x2d9f6a.keyboardCode, _0x5cc66a);
					if (_0x2560bc !== -1 && this.settings.SVGKeys[_0x2560bc].shiftKey[_0x5a6812] === _0x2d9f6a.shiftKey) {
						_0x7e157f = this.allKeys[_0x2560bc];
						_0x2f4442 = true;
						break;
					}
					if (_0x2560bc === this.allPrimaryKeyCodes.length - 1) {
						_0x2560bc = -1;
						break;
					}
					_0x5cc66a = _0x2560bc + 0x1;
				}
				if (_0x2560bc !== -1 && _0x2f4442) {
					this.releaseKey(this.allCodes[_0x2560bc]);
					utilities.Utilities.removeClass(document.getElementById(_0x7e157f), this.highlightClass);
					this.lastPressedKey = undefined;
					this.isSVGKeyPressed = false;
					this.updateDisabledKeys();
				}
			}
		}
	}
	userKeyUpHandler(_0x5ca3e5) {
		this.isOutOfFocus = false;
		if (!this.isHidden() && this.isSVGKeyPressed && _0x5ca3e5.keyCode !== 9) {
			let _0x5e36f0;
			let _0x2e5aa9 = false;
			let _0x32bdd8 = 0;
			let _0xa9ceaa = 0;
			let _0x8cd434 = this.browserKeymapping(_0x5ca3e5);
			if (_0x8cd434.keyboardCode === 0x12 || _0x8cd434.keyboardCode === 0x5b || _0x8cd434.keyboardCode === 0x10) {
				_0x8cd434 = this.lastPressedKey;
			}
			let _0x46ec59 = 0;
			while (!_0x2e5aa9 && _0x46ec59 !== -1) {
				_0x46ec59 = this.allPrimaryKeyCodes.indexOf(_0x8cd434.keyboardCode, _0xa9ceaa);
				if (_0x46ec59 !== -1 && this.settings.SVGKeys[_0x46ec59].shiftKey[0] === _0x8cd434.shiftKey) {
					_0x5e36f0 = this.allKeys[_0x46ec59];
					_0x2e5aa9 = true;
					break;
				}
				if (_0x46ec59 === this.allPrimaryKeyCodes.length - 1) {
					_0x46ec59 = -1;
					break;
				}
				_0xa9ceaa = _0x46ec59 + 1;
			}
			if (!_0x2e5aa9) {
				_0x32bdd8 = 1;
				_0xa9ceaa = 0;
				_0x46ec59 = 0;
			}
			while (!_0x2e5aa9 && _0x46ec59 !== -1) {
				_0x46ec59 = this.allAltKeyCodes.indexOf(_0x8cd434.keyboardCode, _0xa9ceaa);
				if (_0x46ec59 !== -1 && this.settings.SVGKeys[_0x46ec59].shiftKey[_0x32bdd8] === _0x8cd434.shiftKey) {
					_0x5e36f0 = this.allKeys[_0x46ec59];
					_0x2e5aa9 = true;
					break;
				}
				if (_0x46ec59 === this.allPrimaryKeyCodes.length - 1) {
					_0x46ec59 = -1;
					break;
				}
				_0xa9ceaa = _0x46ec59 + 1;
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
	userKeyDownHandler(_0x5b768f) {
		if (this.shouldAcceptInput && !this.isOutOfFocus) {
			let _0x27804b = -2;
			let _0x366806 = 0;
			let _0x117c6b = 0;
			let _0x15153b = false;
			const _0x29e3a = this.browserKeymapping(_0x5b768f);
			while (!_0x15153b && _0x27804b !== -1) {
				_0x27804b = this.allPrimaryKeyCodes.indexOf(_0x29e3a.keyboardCode, _0x117c6b);
				if (_0x27804b !== -1 && this.settings.SVGKeys[_0x27804b].shiftKey[_0x366806] === _0x29e3a.shiftKey && this.isKeyEnabled(this.allKeys[_0x27804b])) {
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
				if (_0x27804b === this.allPrimaryKeyCodes.length - 1) {
					_0x27804b = -1;
				} else {
					_0x117c6b = _0x27804b + 1;
				}
			}
			if (!_0x15153b) {
				_0x117c6b = 0;
				_0x27804b = -2;
				_0x366806 = 1;
			}
			while (!_0x15153b && _0x27804b !== -1) {
				_0x27804b = this.allAltKeyCodes.indexOf(_0x29e3a.keyboardCode, _0x117c6b);
				if (_0x27804b !== -1 && this.settings.SVGKeys[_0x27804b].shiftKey[_0x366806] === _0x29e3a.shiftKey && this.isKeyEnabled(this.allKeys[_0x27804b])) {
					_0x5b768f.preventDefault();
					document.onhelp = function () {
						return false;
					};
					if (!this.isSVGKeyPressed && !this.isHidden()) {
						if (_0x5b768f.keyCode !== 0x10 && _0x5b768f.keyCode !== 9) {
							this.lastPressedKey = _0x29e3a;
							utilities.Utilities.addClass(document.getElementById(this.allKeys[_0x27804b]), this.highlightClass);
							this.setKey(this.allCodes[_0x27804b]);
							this.updateKeyPressHistory(this.allKeys[_0x27804b]);
							this.isSVGKeyPressed = true;
							this.hasAKeyBeenPressed = true;
						}
					}
				}
				if (_0x27804b === this.allPrimaryKeyCodes.length - 1) {
					_0x27804b = -1;
				} else {
					_0x117c6b = _0x27804b + 1;
				}
			}
		}
	}
	browserKeymapping(event) {
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
	isKeyEnabled(key) {
		return key.includes("_KEY_") && (this.currentDisabledKeys.length === 0 || this.currentDisabledKeys.toString().indexOf(key) === -1);
	}
	getCodeIndex(_0x5514ed) {
		return this.allCodes.indexOf(_0x5514ed);
	}
	setKeyMapping() {
		let json = [];
		let svgkeys = this;
		if (!this.keyMappingFile) {
			throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
		}
		if (this.keyMappingFile.split(".").pop() === this.keyMappingFileExtension) {
			const request = new XMLHttpRequest();
			let timed_out = false;
			const _0x25f99d = setTimeout(function () {
				timed_out = true;
				request.abort();
				throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
			}, 5000);
			request.open("GET", this.keyMappingFile, true);
			request.onreadystatechange = function () {
				if (request.readyState !== 4) {
					return false;
				}
				if (timed_out) {
					return false;
				}
				clearTimeout(_0x25f99d);
				if (request.status === 200) {
					try {
						json = JSON.parse(request.responseText);
					} catch (e) {
						throw new Error(error_strings.ERROR_KEY_MAPPING_DAMAGED);
					}
					if (json.length > 0) {
						json.forEach(function (key) {
							const idx = this.getCodeIndex(key.code);
							if (idx !== -1) {
								for (let i = 0; i < 2; i += 1) {
									let idx_alt = this.allPrimaryKeyCodes.indexOf(key.keyCode[i]);
									if (idx_alt !== -1 && this.settings.SVGKeys[idx_alt].shiftKey[0] === key.shiftKey[0]) {
										delete this.allPrimaryKeyCodes[idx_alt];
										delete this.settings.SVGKeys[idx_alt].keyCode[0];
										delete this.settings.SVGKeys[idx_alt].shiftKey[0];
									}
									idx_alt = this.allAltKeyCodes.indexOf(key.keyCode[i]);
									if (idx_alt !== -1 && this.settings.SVGKeys[idx_alt].shiftKey[1] === key.shiftKey[1]) {
										delete this.allAltKeyCodes[idx_alt];
										delete this.settings.SVGKeys[idx_alt].keyCode[1];
										delete this.settings.SVGKeys[idx_alt].shiftKey[1];
									}
								}
								this.settings.SVGKeys[idx].keyCode = key.keyCode;
								this.allPrimaryKeyCodes[idx] = key.keyCode[0];
								this.allAltKeyCodes[idx] = key.keyCode[1];
								this.settings.SVGKeys[idx].shiftKey = key.shiftKey;
							}
						}, svgkeys);
						svgkeys.settings.SVGKeys.forEach(function (key) {
							if (!key.keyCode[0] && !key.keyCode[1]) {
								throw new Error("The key " + key.SVGKey + " doesn't have a keyboard code associated.");
							}
						});
					}
				} else {
					svgkeys = undefined;
					if (request.status === 404) {
						throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
					}
				}
				json = undefined;
				svgkeys = undefined;
			};
			try {
				request.send(undefined);
			} catch (e) {
				throw new Error(e.message);
			}
		} else {
			throw new Error(error_strings.ERROR_EXT_FOR_KEYMAPPING + this.keyMappingFileExtension);
		}
		return true;
	}
	disableKeys(key_arr) {
		return new Promise((resolve, reject) => {
			const arr_type = typeof key_arr;
			if (!this.isHidden()) {
				if (arr_type === "string") {
					this.readDisableKeyFile(key_arr).then(() => {
						resolve();
					}, () => {
						reject();
					});
				} else if (arr_type === "object") {
					this.disableKeysAPI(key_arr);
					resolve();
				} else {
					reject();
				}
			} else {
				throw new Error(error_strings.ERROR_EMU_HIDDEN_KEYS_DISABLED);
			}
		});
	}
	disableKeysAPI(key_arr) {
		if (key_arr.keys && key_arr.hasOwnProperty("secondKeys") && key_arr.hasOwnProperty("alphaKeys") && key_arr.keys instanceof Array && key_arr.secondKeys instanceof Array && key_arr.alphaKeys instanceof Array) {
			const get_keycode = function (keycode) {
				const idx = this.getCodeIndex(keycode);
				if (idx !== -1) {
					return this.allKeys[idx];
				}
				throw new Error(error_strings.ERROR_INVALID_KEY_CONFIGURATION_FILE);
			};
			this.disabledKeys = key_arr.keys.map(get_keycode, this);
			this.disabled2ndKeys = key_arr.secondKeys.map(get_keycode, this);
			this.disabledAlphaKeys = key_arr.alphaKeys.map(get_keycode, this);
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
	readDisableKeyFile(url) {
		return new Promise((resolve, reject) => {
			url = url.trim();
			const host = window.location.host;
			const url_s = url.split("/");
			if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) {
				if (url.split(".").pop() === "json") {
					if (url_s[2] === host) {
						const request = new XMLHttpRequest();
						let this_ = this;
						request.addEventListener("load", function () {
							if (request.status === 200) {
								try {
									const json = JSON.parse(request.responseText);
									this_.disableKeysAPI(json);
								} catch (e) {
									this_.enableAllKeys();
									this_ = undefined;
									throw new Error(error_strings.ERROR_INVALID_KEY_CONFIGURATION_FILE);
								}
								this_ = undefined;
								resolve();
							} else {
								this_ = undefined;
								throw new Error(error_strings.ERROR_SERVER_CONNECTION_OR_KEY_MAPPING_NA);
							}
						});
						request.open("GET", url + "?r=" + Math.random(), false);
						request.send();
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
	enableAllKeys() {
		if (!this.isHidden()) {
			this.disabledKeys.length = 0;
			this.disabled2ndKeys.length = 0;
			this.disabledAlphaKeys.length = 0;
			this.toggleEnableKeyButtons(this.allKeys, true);
		} else {
			throw new Error(error_strings.ERROR_EMU_HIDDEN_KEYS_ENABLED);
		}
	}
	disableAllKeys() {
		if (!this.isHidden()) {
			this.toggleEnableKeyButtons(this.allKeys, false);
		} else {
			throw new Error(error_strings.ERROR_EMU_HIDDEN_KEYS_DISABLED);
		}
	}
	getMetaState() {
		return this.asic.getKeypadMetaState();
	}
	updateDisabledKeys() {
		this.getMetaState().then(mode => {
			if (!this.isHidden()) {
				if (this.calcMode !== mode) {
					this.toggleEnableKeyButtons(this.currentDisabledKeys, true);
					if (mode === asic.KeypadMetaState.SECOND) {
						this.toggleEnableKeyButtons(this.disabled2ndKeys, false);
					} else if (mode === asic.KeypadMetaState.ALPHA) {
						this.toggleEnableKeyButtons(this.disabledAlphaKeys, false);
					} else {
						this.toggleEnableKeyButtons(this.disabledKeys, false);
					}
					this.calcMode = mode;
				}
			}
		});
	}
	setKey(key) {
		return this.asic.keyDown(key);
	}
	setKeySVG(key) {
		let keycode = 0;
		keycode = this.allCodes[this.allKeys.indexOf(key)];
		return this.setKey(keycode);
	}
	releaseKey(key) {
		return this.asic.keyUp(key);
	}
	acceptInput(on) {
		this.shouldAcceptInput = on;
	}
	getAcceptInput() {
		return this.shouldAcceptInput;
	}
	switchTheme(theme, id) {
		if (!/[^a-z\d]/i.test(theme)) {
			const element = document.getElementById(id);
			const display = document.getElementById("display");
			utilities.Utilities.removePrefixedClass(display, "ti_theme_");
			utilities.Utilities.removePrefixedClass(element, "ti_theme_");
			if (theme !== undefined && theme !== '') {
				theme = "ti_theme_" + theme;
				utilities.Utilities.addClass(element, theme);
				utilities.Utilities.addClass(display, theme);
			}
		}
	}
	isHidden() {
		let hidden = true;
		const element = document.getElementById(this.divId);
		const style = window.getComputedStyle(element);
		if (style.display !== "none") {
			if (style.visibility !== "hidden") {
				hidden = false;
			}
		}
		return hidden;
	}
}
exports.GenericKeypad = GenericKeypad;

var a;
(function (key) {
	key[key.KeyDown = 0] = "KeyDown";
	key[key.KeyUp   = 1] = "KeyUp";
})(a || (a = {}));
class keyevent {
	constructor(type, keycode) {
		this.eventType = type;
		this.keyCode = keycode;
	}
	getEventType() {
		return this.eventType;
	}
	getKeyCode() {
		return this.keyCode;
	}
}

class KeyEventProcessor {
	constructor() {
		this.keyCurrentlyHeldDown = 0;
		this.potentialAutoRepeatKeyCode = 0;
		this.autoRepeatTimer = -1;
		this.autoRepeatInterval = 500;
		this.clearQueue();
	}
	clearQueue() {
		this.keyEvents = [];
	}
	isQueueEmpty() {
		return this.keyEvents.length === 0;
	}
	isPotentialAutoRepeat() {
		return this.potentialAutoRepeatKeyCode !== 0;
	}
	addKeyDown(keycode) {
		this.keyEvents.push(new keyevent(a.KeyDown, keycode));
	}
	addKeyUp(keycode) {
		this.keyEvents.push(new keyevent(a.KeyUp, keycode));
	}
	getNextKeyCode() {
		let keyevent = this.keyEvents.shift();
		let keycode = 0;
		if (keyevent !== undefined) {
			keycode = keyevent.getKeyCode();
			if (keyevent.getEventType() === a.KeyUp) {
				this.keyCurrentlyHeldDown = 0;
				this.autoRepeatInterval = 500;
				keyevent = this.keyEvents.shift();
				keycode = 0;
				if (keyevent !== undefined) {
					if (keyevent.getEventType() !== a.KeyDown) {
						console.log("ERROR: Why is there a keyUp after a keyUp!");
					} else {
						keycode = keyevent.getKeyCode();
					}
					if (keycode !== 0) {
						this.keyCurrentlyHeldDown = keycode;
					}
				}
			} else if (keycode !== 0) {
				this.keyCurrentlyHeldDown = keycode;
			}
		}
		return keycode;
	}
	notifyKeyCanRepeat() {
		if (this.keyCurrentlyHeldDown !== 0) {
			this.potentialAutoRepeatKeyCode = this.keyCurrentlyHeldDown;
			if (this.autoRepeatTimer !== -1) {
				window.clearTimeout(this.autoRepeatTimer);
			}
			this.autoRepeatTimer = window.setTimeout(() => {
				if (this.keyCurrentlyHeldDown === this.potentialAutoRepeatKeyCode && !this.isKeyUpInQueue()) {
					this.addKeyDown(this.keyCurrentlyHeldDown);
				}
				this.potentialAutoRepeatKeyCode = 0;
			}, this.autoRepeatInterval);
			this.autoRepeatInterval = 125;
		}
	}
	isKeyUpInQueue() {
		if (this.keyEvents.length === 0) {
			return false;
		} else {
			for (const keyevent of this.keyEvents) {
				if (keyevent.getEventType() === a.KeyUp) {
					return true;
				}
			}
		}
		return false;
	}
}
exports.KeyEventProcessor = KeyEventProcessor;
