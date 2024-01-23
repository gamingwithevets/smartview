'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});

var buffer = require("buffer");

class Utilities {
	static hasClass(obj, element) {
		let hasclass = false;
		if (obj instanceof SVGElement) {
			if (obj.className.baseVal !== undefined) {
				hasclass = obj.className.baseVal.indexOf(element) > -1;
			}
		} else if (obj.className !== undefined && obj.className !== '') {
			hasclass = obj.className.indexOf(element) > -1;
		}
		return hasclass;
	}
	static addClass(obj, ekenebt) {
		if (!Utilities.hasClass(obj, ekenebt)) {
			if (obj.classList !== undefined) {
				obj.classList.add(ekenebt);
			} else if (obj instanceof SVGElement) {
				obj.className.baseVal += " " + ekenebt;
			} else {
				obj.className += " " + ekenebt;
			}
		}
	}
	static removeClass(obj, element) {
		if (this.hasClass(obj, element)) {
			const _0x42e763 = new RegExp("(\\s|^)" + element + "(\\s|$)");
			if (obj.classList !== undefined) {
				obj.classList.remove(element);
			} else {
				if (obj instanceof SVGElement) {
					obj.className.baseVal = obj.className.baseVal.replace(_0x42e763, " ");
				} else if (obj.className !== undefined && obj.className !== '') {
					obj.className = obj.className.replace(_0x42e763, " ");
				}
			}
		}
	}
	static removePrefixedClass(obj, element) {
		let objs;
		if (obj instanceof SVGElement) {
			objs = obj.className.baseVal.split(" ");
		} else if (obj.className !== undefined) {
			objs = obj.className.split(" ");
		}
		for (let i = objs.length - 1; i >= 0; i--) {
			if (objs[i] && objs[i].indexOf(element) === 0) {
				this.removeClass(obj, objs[i]);
			}
		}
	}
	static loadSVG(url) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.onerror = function (evt) {
				reject(evt instanceof ErrorEvent ? evt.error : "Error on load SVG");
			};
			request.onload = function (evt) {
				if (request.status === 200) {
					const response = request.responseXML;
					const element = response.documentElement;
					const node = document.importNode(element, true);
					let resptype = typeof response;
					if (resptype === "undefined" || response === null) {
						reject("SVG was undefined or null");
					}
					resptype = typeof node;
					if (resptype === "undefined" || node === null) {
						reject("SVG (after importNode) was undefined or null");
					}
					if (node.getAttribute("viewBox") === undefined) {
						reject("SVG viewBox attribute not found!");
					}
					resolve(node);
				} else {
					console.log("agghhh");
					reject();
				}
			};
			request.open("GET", url, true);
			request.responseType = "document";
			request.send();
		});
	}
	static loadROM(url) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			let response;
			request.timeout = this.DEFAULT_TIMEOUT;
			request.responseType = '';
			request.ontimeout = () => {
				reject(request.statusText);
			};
			request.onerror = () => {
				reject(request.statusText);
			};
			request.onload = () => {
				if (request.status === 200) {
					response = request.responseText;
					resolve(response);
				} else {
					reject(request.statusText);
				}
			};
			request.open("GET", url, true);
			request.send();
		});
	}
	static pixelDataToString(data) {
		return data === 0 ? String.fromCharCode(0x100) : String.fromCharCode(data);
	}
	static arrayToRLEPlusString(arr, i, len) {
		let itype = typeof i;
		let len_type = typeof len;
		let val2 = 1;
		let rle_array = [];
		let val;
		let valtype;
		let rle_str;
		if (typeof arr === "undefined" || arr === null) {
			return '';
		}
		if (itype === "undefined") {
			i = 0;
		}
		if (len_type === "undefined") {
			len = arr.length;
		}
		val = arr[i++];
		for (i; i < len; i += 1) {
			if (val !== arr[i]) {
				valtype = typeof val;
				if (valtype === "undefined") {
					debugger;
				}
				if (val === 35) {
					rle_array.push("#");
					rle_array.push("#");
				} else {
					rle_array.push(String.fromCharCode(val));
				}
				if (val2 > 1) {
					rle_array.push("#");
					rle_array.push(val2);
					rle_array.push("#");
				}
				val = arr[i];
				val2 = 1;
			} else {
				val2++;
			}
		}
		if (val === 35) {
			rle_array.push("#");
			rle_array.push("#");
		} else {
			rle_array.push(String.fromCharCode(val));
		}
		if (val2 > 1) {
			rle_array.push("#");
			rle_array.push(val2);
			rle_array.push("#");
		}
		const obj = rle_array.join('');
		try {
			rle_str = "RLE_NUMERIC" + buffer.Buffer.from(obj).toString("base64");
		} catch (e) {
			console.log("EXCEPTION in arrayToRLEPlusString: " + e + " name:" + e.name + " message:" + e.message);
			rle_str = '';
		}
		return rle_str;
	}
	static rlePlusStringToArray(string, size) {
		const hash_char = "#".charAt(0);
		const hash_charcode = "#".charCodeAt(0);
		let val;
		let ret_array;
		let str_char = 0;
		let int_parsed = 0;
		let i = 0;
		let strlen = 0;
		let index = 0;
		let j = 0;
		let idx = 0;
		let chr;
		let parsed_int = 1;
		if (typeof string === "undefined" || string == null) {
			return new Uint8Array(0);
		}
		strlen = string.length;
		if (size) {
			ret_array = new Array(size);
		} else {
			ret_array = [];
		}
		if (string.substring(0, "RLE_NUMERIC".length) === "RLE_NUMERIC") {
			string = buffer.Buffer.from(string.substring("RLE_NUMERIC".length), "base64").toString();
			strlen = string.length;
			chr = string.charCodeAt(idx);
			if (chr === hash_charcode && string.charAt(idx) === hash_char) {
				idx++;
			}
			idx++;
			if (string.charAt(idx) === "#" && string.charAt(idx + 1) !== "#") {
				idx++;
				parsed_int = parseInt(string.substring(idx, string.indexOf("#", idx)), 10);
				idx = string.indexOf("#", idx) + 1;
			}
			while (idx < strlen || parsed_int > 0) {
				if (parsed_int <= 0) {
					chr = string.charCodeAt(idx);
					idx++;
					if (chr === hash_charcode && string.charAt(idx) === "#") {
						idx++;
					}
					if (idx >= strlen) {
						if (size) {
							ret_array[index++] = chr;
						} else {
							ret_array.push(chr);
						}
						continue;
					}
					if (string.charAt(idx) === "#" && string.charAt(idx + 1) !== "#") {
						idx++;
						parsed_int = parseInt(string.substring(idx, string.indexOf("#", idx)), 10);
						idx = string.indexOf("#", idx) + 1;
					}
				}
				if (size) {
					ret_array[index++] = chr;
				} else {
					ret_array.push(chr);
				}
				parsed_int--;
			}
			return Uint8Array.from(ret_array);
		}
		for (i; i < strlen; i += 2) {
			if (string[i] === "#") {
				str_char = string.indexOf("#", i + 1);
				int_parsed = parseInt(string.substring(i + 1, str_char), 10);
				for (j = 1; j < int_parsed; j++) {
					if (size) {
						ret_array[index++] = val;
					} else {
						ret_array.push(val);
					}
				}
				i = str_char + 1;
			}
			if (i < strlen) {
				val = parseInt(string.substring(i, i + 2), 16);
				if (size) {
					ret_array[index++] = val;
				} else {
					ret_array.push(val);
				}
			}
		}
		return Uint8Array.from(ret_array);
	}
}
Utilities.DEFAULT_TIMEOUT = 60000;
exports.Utilities = Utilities;
