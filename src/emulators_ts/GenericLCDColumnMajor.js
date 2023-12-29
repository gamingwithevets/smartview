'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});

const generic_lcd = require("./GenericLCD");
const x_l1 = new Uint8Array([0x7f, 0x41, 0x5f, 0x5f, 0x7f, 0x7b, 0x41, 0x7f]);
const x_2nd = new Uint8Array([0x3a, 0x2a, 0x2e, 0, 0x3e, 0x4, 0x8, 0x3e, 0, 0x3e, 0x22, 0x22, 0x1c]);
const x_fix = new Uint8Array([0x3e, 0xa, 0xa, 0, 0x3e, 0, 0x36, 0x8, 0x36]);
const x_h = new Uint8Array([0x3e, 0x8, 0x8, 0x3e]);
const x_b = new Uint8Array([0x3e, 0x2a, 0x2a, 0x14]);
const x_o = new Uint8Array([0x1c, 0x22, 0x22, 0x1c]);
const x_l2 = new Uint8Array([0x7f, 0x41, 0x5f, 0x5f, 0x7f, 0x45, 0x55, 0x51, 0x7f]);
const x_sci = new Uint8Array([0x2e, 0x2a, 0x3a, 0, 0x3e, 0x22, 0x22, 0, 0x3e]);
const x_eng = new Uint8Array([0x3e, 0x2a, 0x2a, 0, 0x3e, 0x4, 0x8, 0x3e, 0, 0x1c, 0x22, 0x2a, 0x3a]);
const x_de = new Uint8Array([0x3e, 0x22, 0x22, 0x1c, 0, 0x3e, 0x2a, 0x2a]);
const x_g = new Uint8Array([0x1c, 0x22, 0x2a, 0x3a]);
const x_rad = new Uint8Array([0x3e, 0xa, 0x1a, 0x2e, 0, 0x3c, 0xa, 0xa, 0x3c, 0, 0x3e, 0x22, 0x22, 0x1c]);
const x_l3 = new Uint8Array([0x7f, 0x41, 0x5f, 0x5f, 0x7f, 0x55, 0x55, 0x41, 0x7f]);
const x_battery = new Uint8Array([0x1c, 0x36, 0x22, 0x22, 0x22, 0x2a, 0x2a, 0x22, 0x3e]);
const x_busy = new Uint8Array([0x63, 0x55, 0x69, 0x55, 0x63]);
const x_left_arrow = new Uint8Array([0x8, 0x1c, 0x3e]);
const x_up_arrow = new Uint8Array([0x8, 0xc, 0xe, 0xc, 0x8]);
const x_down_arrow = new Uint8Array([0x8, 0x18, 0x38, 0x18, 0x8]);
const x_right_arrow = new Uint8Array([0x3e, 0x1c, 0x8]);

class GenericLCDColumnMajor extends generic_lcd.GenericLCD {
	constructor(calcModel, calcDivId) {
		super(calcModel, calcDivId, 384, 144);
		this.cachedIconsStatus = 0;
		this.x_l1 = 0;
		this.x_2nd = this.x_l1 + (x_l1.length + 3) * 2;
		this.x_fix = this.x_2nd + (x_2nd.length + 4) * 2;
		this.x_h = this.x_fix + (x_fix.length + 4) * 2;
		this.x_b = this.x_h + (x_h.length + 1) * 2;
		this.x_o = this.x_b + (x_b.length + 1) * 2;
		this.x_l2 = this.x_o + (x_o.length + 8) * 2;
		this.x_sci = this.x_l2 + (x_l2.length + 2) * 2;
		this.x_eng = this.x_sci + (x_sci.length + 1) * 2;
		this.x_de = this.x_eng + (x_eng.length + 3) * 2;
		this.x_g = this.x_de + (x_de.length + 1) * 2;
		this.x_rad = this.x_g + (x_g.length + 1) * 2;
		this.x_l3 = this.x_rad + (x_rad.length + 2) * 2;
		this.x_battery = this.x_l3 + (x_l3.length + 8) * 2;
		this.x_busy = this.x_battery + (x_battery.length + 5) * 2;
		this.x_left_arrow = this.x_busy + (x_busy.length + 4) * 2;
		this.x_up_arrow = this.x_left_arrow + (x_left_arrow.length + 2) * 2;
		this.x_down_arrow = this.x_up_arrow + (x_up_arrow.length + 2) * 2;
		this.x_right_arrow = this.x_down_arrow + (x_down_arrow.length + 2) * 2;
	}
	screenChanged(data) {
		super.saveScreenData(data);
		this.canvasContext.fillStyle = "white";
		this.canvasContext.fillRect(0, 16, this.width, this.height);
		this.canvasContext.fillStyle = "#000000";
		let x = 0;
		let y = 16;
		for (let j = 0; j < 1536; j++) {
			const dat = data[j];
			for (let i = 0; i < 8; i++) {
				const on = dat >> i & 1;
				if (on === 1) {
					this.canvasContext.fillRect(x, y, 2, 2);
				}
				y += 2;
				if (y >= this.height) {
					y = 16;
					x += 2;
				}
			}
		}
	}
	topIconsChanged(data) {
		super.saveTopIconsData(data);
		const changed = data ^ this.cachedIconsStatus;
		if (changed !== 0) {
			for (let i = 0; i < 19; i++) {
				if ((changed >> i & 1) === 1) {
					this.updateIcon(i, !!((data >> i & 1) === 1));
				}
			}
			this.cachedIconsStatus = data;
		}
	}
	updateIcon(idx, visible) {
		switch (idx) {
			case 0:
				this.drawIcon(this.x_l1, 0, x_l1, visible);
				break;
			case 1:
				this.drawIcon(this.x_2nd, 0, x_2nd, visible);
				break;
			case 2:
				this.drawIcon(this.x_fix, 0, x_fix, visible);
				break;
			case 3:
				this.drawIcon(this.x_h, 0, x_h, visible);
				break;
			case 4:
				this.drawIcon(this.x_b, 0, x_b, visible);
				break;
			case 5:
				this.drawIcon(this.x_o, 0, x_o, visible);
				break;
			case 6:
				this.drawIcon(this.x_l2, 0, x_l2, visible);
				break;
			case 7:
				this.drawIcon(this.x_sci, 0, x_sci, visible);
				break;
			case 8:
				this.drawIcon(this.x_eng, 0, x_eng, visible);
				break;
			case 9:
				this.drawIcon(this.x_de, 0, x_de, visible);
				break;
			case 10:
				this.drawIcon(this.x_g, 0, x_g, visible);
				break;
			case 11:
				this.drawIcon(this.x_rad, 0, x_rad, visible);
				break;
			case 12:
				this.drawIcon(this.x_l3, 0, x_l3, visible);
				break;
			case 13:
				this.drawIcon(this.x_battery, 0, x_battery, visible);
				break;
			case 14:
				this.drawIcon(this.x_busy, 0, x_busy, visible);
				break;
			case 15:
				this.drawIcon(this.x_left_arrow, 0, x_left_arrow, visible);
				break;
			case 16:
				this.drawIcon(this.x_up_arrow, 0, x_up_arrow, visible);
				break;
			case 17:
				this.drawIcon(this.x_down_arrow, 0, x_down_arrow, visible);
				break;
			case 18:
				this.drawIcon(this.x_right_arrow, 0, x_right_arrow, visible);
				break;
			default:
				console.log("ERROR idx index does Not exists! idx=" + idx);
				break;
		}
	}
    drawIcon(base_x, base_y, data, visible) {
        if (visible) {
            this.canvasContext.fillStyle = '#000000';
            let saved_y = base_y;
            for (let id_x = 0; id_x < data.length; id_x++) {
                let column = data[id_x];
                if (column !== 0) {
                    base_y = saved_y;
                    for (let id_y = 0; id_y < 8; id_y++) {
                        let pixel = column >> id_y & 1;
                        if (pixel !== 0) {
                            this.canvasContext.fillRect(base_x, base_y, 2, 2);
                        }
                        base_y += 2;
                    }
                }
                base_x += 2;
            }
        } else {
            this.canvasContext.fillStyle = 'white', this.canvasContext.fillRect(base_x, base_y, data.length * 2, 16);
        }
    }
}
exports.GenericLCDColumnMajor = GenericLCDColumnMajor;
