'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});

const generic_lcd = require("./GenericLCD");

const l1 = new Uint8Array([
0b1111111, // #######
0b1000001, // #     #
0b1011111, // # #####
0b1011111, // # #####
0b1111111, // #######
0b1111011, // #### ##
0b1000001, // #     #
0b1111111, // #######
]);

const second = new Uint8Array([
0b0111010, //  ### # 
0b0101010, //  # # # 
0b0101110, //  # ### 
0,
0b0111110, //  ##### 
0b0000100, //     #  
0b0001000, //    #   
0b0111110, //  ##### 
0,
0b0111110, //  ##### 
0b0100010, //  #   # 
0b0100010, //  #   # 
0b0011100, //   ###  
]);

const fix = new Uint8Array([
0b0111110, //  ##### 
0b0001010, //    # # 
0b0001010, //    # # 
0,
0b0111110, //  ##### 
0,
0b0110110, //  ## ## 
0b0001000, //    #   
0b0110110, //  ## ## 
]);

const h = new Uint8Array([
0b0111110, //  ##### 
0b0001000, //    #   
0b0001000, //    #   
0b0111110, //  ##### 
]);

const b = new Uint8Array([
0b0111110, //  ##### 
0b0101010, //  # # # 
0b0101010, //  # # # 
0b0010100, //   # #  
]);

const o = new Uint8Array([
0b0011100, //   ###  
0b0100010, //  #   # 
0b0100010, //  #   # 
0b0011100, //   ###  
]);

const l2 = new Uint8Array([
0b1111111, // #######
0b1000001, // #     #
0b1011111, // # #####
0b1011111, // # #####
0b1111111, // #######
0b1000101, // #   # #
0b1010101, // # # # #
0b1010001, // # #   #
0b1111111, // #######
]);

const sci = new Uint8Array([
0b0101110, //  # ### 
0b0101010, //  # # # 
0b0111010, //  ### # 
0,
0b0111110, //  ##### 
0b0100010, //  #   # 
0b0100010, //  #   # 
0,
0b0111110, //  ##### 
]);

const eng = new Uint8Array([
0b0111110, //  ##### 
0b0101010, //  # # # 
0b0101010, //  # # # 
0,
0b0111110, //  ##### 
0b0000100, //     #  
0b0001000, //    #   
0b0111110, //  ##### 
0,
0b0011100, //   ###  
0b0100010, //  #   # 
0b0101010, //  # # # 
0b0111010, //  ### # 
]);

const de = new Uint8Array([
0b0111110, //  ##### 
0b0100010, //  #   # 
0b0100010, //  #   # 
0b0011100, //   ###  
0,
0b0111110, //  ##### 
0b0101010, //  # # # 
0b0101010, //  # # # 
]);

const g = new Uint8Array([
0b0011100, //   ###  
0b0100010, //  #   # 
0b0101010, //  # # # 
0b0111010, //  ### # 
]);

const rad = new Uint8Array([
0b0111110, //  ##### 
0b0001010, //    # # 
0b0011010, //   ## # 
0b0101110, //  # ### 
0,
0b0111100, //  ####  
0b0001010, //    # # 
0b0001010, //    # # 
0b0111100, //  ####  
0,
0b0111110, //  ##### 
0b0100010, //  #   # 
0b0100010, //  #   # 
0b0011100, //   ###  
]);

const l3 = new Uint8Array([
0b1111111, // #######
0b1000001, // #     #
0b1011111, // # #####
0b1011111, // # #####
0b1111111, // #######
0b1010101, // # # # #
0b1010101, // # # # #
0b1000001, // #     #
0b1111111, // #######
]);

const battery = new Uint8Array([
0b0011100, //   ###  
0b0110110, //  ## ## 
0b0100010, //  #   # 
0b0100010, //  #   # 
0b0100010, //  #   # 
0b0101010, //  # # # 
0b0101010, //  # # # 
0b0100010, //  #   # 
0b0111110, //  ##### 
]);

const busy = new Uint8Array([
0b1100011, // ##   ##
0b1010101, // # # # #
0b1101001, // ## #  #
0b1010101, // # # # #
0b1100011, // ##   ##
]);

const left_arrow = new Uint8Array([
0b0001000, //    #   
0b0011100, //   ###  
0b0111110, //  ##### 
]);

const up_arrow = new Uint8Array([
0b0001000, //    #   
0b0001100, //    ##  
0b0001110, //    ### 
0b0001100, //    ##  
0b0001000, //    #   
]);

const down_arrow = new Uint8Array([
0b0001000, //    #   
0b0011000, //   ##   
0b0111000, //  ###   
0b0011000, //   ##   
0b0001000, //    #   
]);

const right_arrow = new Uint8Array([
0b0111110, //  ##### 
0b0011100, //   ###  
0b0001000, //    #   
]);

class GenericLCDColumnMajor extends generic_lcd.GenericLCD {
	constructor(calcModel, calcDivId) {
		super(calcModel, calcDivId, 384, 144);
		this.cachedIconsStatus = 0;
		this.x_l1 = 0;
		this.x_2nd = this.x_l1 + (l1.length + 3) * 2;
		this.x_fix = this.x_2nd + (second.length + 4) * 2;
		this.x_h = this.x_fix + (fix.length + 4) * 2;
		this.x_b = this.x_h + (h.length + 1) * 2;
		this.x_o = this.x_b + (b.length + 1) * 2;
		this.x_l2 = this.x_o + (o.length + 8) * 2;
		this.x_sci = this.x_l2 + (l2.length + 2) * 2;
		this.x_eng = this.x_sci + (sci.length + 1) * 2;
		this.x_de = this.x_eng + (eng.length + 3) * 2;
		this.x_g = this.x_de + (de.length + 1) * 2;
		this.x_rad = this.x_g + (g.length + 1) * 2;
		this.x_l3 = this.x_rad + (rad.length + 2) * 2;
		this.x_battery = this.x_l3 + (l3.length + 8) * 2;
		this.x_busy = this.x_battery + (battery.length + 5) * 2;
		this.x_left_arrow = this.x_busy + (busy.length + 4) * 2;
		this.x_up_arrow = this.x_left_arrow + (left_arrow.length + 2) * 2;
		this.x_down_arrow = this.x_up_arrow + (up_arrow.length + 2) * 2;
		this.x_right_arrow = this.x_down_arrow + (down_arrow.length + 2) * 2;
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
				this.drawIcon(this.x_l1, 0, l1, visible);
				break;
			case 1:
				this.drawIcon(this.x_2nd, 0, second, visible);
				break;
			case 2:
				this.drawIcon(this.x_fix, 0, fix, visible);
				break;
			case 3:
				this.drawIcon(this.x_h, 0, h, visible);
				break;
			case 4:
				this.drawIcon(this.x_b, 0, b, visible);
				break;
			case 5:
				this.drawIcon(this.x_o, 0, o, visible);
				break;
			case 6:
				this.drawIcon(this.x_l2, 0, l2, visible);
				break;
			case 7:
				this.drawIcon(this.x_sci, 0, sci, visible);
				break;
			case 8:
				this.drawIcon(this.x_eng, 0, eng, visible);
				break;
			case 9:
				this.drawIcon(this.x_de, 0, de, visible);
				break;
			case 10:
				this.drawIcon(this.x_g, 0, g, visible);
				break;
			case 11:
				this.drawIcon(this.x_rad, 0, rad, visible);
				break;
			case 12:
				this.drawIcon(this.x_l3, 0, l3, visible);
				break;
			case 13:
				this.drawIcon(this.x_battery, 0, battery, visible);
				break;
			case 14:
				this.drawIcon(this.x_busy, 0, busy, visible);
				break;
			case 15:
				this.drawIcon(this.x_left_arrow, 0, left_arrow, visible);
				break;
			case 16:
				this.drawIcon(this.x_up_arrow, 0, up_arrow, visible);
				break;
			case 17:
				this.drawIcon(this.x_down_arrow, 0, down_arrow, visible);
				break;
			case 18:
				this.drawIcon(this.x_right_arrow, 0, right_arrow, visible);
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
