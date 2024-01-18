'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const wdt = require("./nxu16_watchdog");
const timer = require("./nxu16_timer");
const constants = require("../../emulators_ts/Constants");
class NXU16_DataMemory {
	constructor(size) {
		this.SEGMENT_SHIFT_AMOUNT = 0x10;
		this.DEVICE_ADDRESS_FCON0 = 0xf002;
		this.DEVICE_ADDRESS_FCON1 = 0xf003;
		this.DEVICE_ADDRESS_FCON2 = 0xf004;
		this.DEVICE_ADDRESS_FCON3 = 0xf005;
		this.DEVICE_ADDRESS_FSTAT = 0xf00a;
		this.DEVICE_ADDRESS_WDTCON = 0xf00e;
		this.DEVICE_ADDRESS_WDTMOD = 0xf00f;
		this.DEVICE_ADDRESS_LTBINTL = 0xf064;
		this.DEVICE_ADDRESS_LTBINTH = 0xf065;
		this.DEVICE_ADDRESS_VLSCONL = 0xf900;
		this.DEVICE_ADDRESS_VLSCONH = 0xf901;
		this.INTERRUPT_IE01 = 0xf010;
		this.INTERRUPT_IE0 = 0xf010;
		this.INTERRUPT_IRQ0 = 0xf018;
		this.INTERRUPT_IRQ7 = 0xf01f;
		this.LTBR_COUNTER = 0xf060;
		this.INTERRUPT_QWDT_IRQ0_0_ADDRESS = 8;
		var this_ = this;
		this.mem = new Uint8Array(size);
		this.mem.fill(0xff, 0);
		this.watchdog = new wdt.NXU16_Watchdog(function () {
			this_.mem[this_.INTERRUPT_IE0] = 1;
		});
		this.timers = [];
		this.timers[0] = new timer.NXU16_Timer(function () {
			this_.mem[this_.INTERRUPT_IRQ7] |= 1;
		});
		this.timers[1] = new timer.NXU16_Timer(function () {
			this_.mem[this_.INTERRUPT_IRQ7] |= 2;
		});
		this.timers[2] = new timer.NXU16_Timer(function () {
			this_.mem[this_.INTERRUPT_IRQ7] |= 4;
		});
	}
	setData(mem) {
		this.mem.fill(0xff, 0);
		for (var addr in mem) {
			this.mem[addr] = mem[addr];
		}
	}
	getLength() {
		return this.mem.length;
	}
	getNumOfTimers() {
		return this.timers.length;
	}
	clear() {
		this.mem = new Uint8Array(this.mem);
		this.mem.fill(0xff, 0);
	}
	resetRegisters() {
		for (let i = 0xf000; i < 0xffff; i++) {
			this.mem[i] = 0xff;
		}
		this.mem[this.DEVICE_ADDRESS_FCON0] = 0x13;
		this.mem[this.DEVICE_ADDRESS_FCON1] = 0x3;
		this.mem[this.DEVICE_ADDRESS_FCON2] = 0x2;
		this.mem[this.DEVICE_ADDRESS_FCON3] = 0x40;
		this.mem[this.DEVICE_ADDRESS_FSTAT] = 0x3;
		this.mem[this.DEVICE_ADDRESS_WDTCON] = 0;
		this.mem[this.DEVICE_ADDRESS_WDTMOD] = 0x82;
		this.mem[this.DEVICE_ADDRESS_LTBINTH] = 0x6;
		this.mem[this.DEVICE_ADDRESS_LTBINTL] = 0x30;
		for (let i = this.INTERRUPT_IE01; i < 0xf04f; i++) {
			this.mem[i] = 0;
		}
	}
	set8(seg, val, addr) {
		if (constants.Constants.DEBUG_PORT_ADDRESSES && addr > constants.Constants.PORT_BEGIN_ADDRESS && addr < constants.Constants.PORT_END_ADDRESS) {
			console.log("wrote 0x" + val.toString(0x10) + " to port 0x" + addr.toString(0x10));
		}
		if (constants.Constants.DEBUG_MEMORY_ADDRESSES && addr > 0xffff) {
			debugger;
		}
		addr = seg << this.SEGMENT_SHIFT_AMOUNT | addr;
		if ((addr & 0xf000) !== 0) {
			switch (addr) {
				case this.DEVICE_ADDRESS_WDTCON:
					if (val === 0x5a) {
						this.mem[addr] = 1;
					} else {
						this.mem[addr] = 0;
					}
					break;
				case this.DEVICE_ADDRESS_WDTMOD:
					this.watchdog.setMode(val & 0x3);
					break;
				case this.DEVICE_ADDRESS_LTBINTL:
					const _0x34f666 = val & 0xf;
					const _0x2b8c95 = val >> 4 & 0xf;
					this.timers[0].setMode(_0x34f666);
					this.timers[1].setMode(_0x2b8c95);
					break;
				case this.DEVICE_ADDRESS_VLSCONL:
					this.mem[addr] = 0x34;
					break;
				case this.DEVICE_ADDRESS_VLSCONH:
					if (val === 0) {
						this.mem[addr] = 1;
					} else {
						this.mem[addr] = 0;
					}
					break;
				default:
					this.mem[addr] = val;
			}
		} else {
			this.mem[addr] = val;
		}
	}
	get8(seg, addr) {
		addr = seg << this.SEGMENT_SHIFT_AMOUNT | addr;
		return this.mem[addr];
	}
	set16(seg, val, addr) {
		if (constants.Constants.DEBUG_PORT_ADDRESSES && addr > constants.Constants.PORT_BEGIN_ADDRESS && addr < constants.Constants.PORT_END_ADDRESS) {
			console.log("wrote 0x" + val.toString(16) + " to port 0x" + addr.toString(16));
		}
		if (constants.Constants.DEBUG_MEMORY_ADDRESSES && addr > 0xffff) {
			debugger;
		}
		addr = seg << this.SEGMENT_SHIFT_AMOUNT | addr;
		this.mem[addr] = val & 0xff;
		this.mem[addr + 1] = val >> 8 & 0xff;
	}
	get16(seg, addr) {
		if (constants.Constants.DEBUG_MEMORY_ADDRESSES && addr > 0xffff) {
			debugger;
		}
		addr = seg << this.SEGMENT_SHIFT_AMOUNT | addr;
		let val = this.mem[addr];
		val |= this.mem[addr + 1] << 8;
		return val;
	}
	get32(seg, addr) {
		if (constants.Constants.DEBUG_MEMORY_ADDRESSES && addr > 0xffff) {
			debugger;
		}
		addr = seg << this.SEGMENT_SHIFT_AMOUNT | addr;
		let val = this.mem[addr];
		val |= this.mem[addr + 0x1] << 8;
		val |= this.mem[addr + 0x2] << 16;
		val |= this.mem[addr + 0x3] << 24;
		return val;
	}
	get64(seg, addr) {
		let val = [];
		if (constants.Constants.DEBUG_MEMORY_ADDRESSES && addr > 0xffff) {
			debugger;
		}
		addr = seg << this.SEGMENT_SHIFT_AMOUNT | addr;
		val[0] = this.mem[addr];
		val[0] |= this.mem[addr + 0x1] << 8;
		val[0] |= this.mem[addr + 0x2] << 16;
		val[0] |= this.mem[addr + 0x3] << 24;
		val[1] = this.mem[addr + 0x4];
		val[1] |= this.mem[addr + 0x5] << 8;
		val[1] |= this.mem[addr + 0x6] << 16;
		val[1] |= this.mem[addr + 0x7] << 24;
		return val;
	}
	getSubArray(start, end) {
		return this.mem.subarray(start, end);
	}
	getState() {
		let state = new Uint8Array(this.getLength() + this.timers.length);
		state.set(this.mem);
		for (let timer in this.timers) {
			state.set(this.timers[timer].getState(), this.getLength() + parseInt(timer, 10));
		}
		return state;
	}
	setState(state) {
		this.setData(state.subarray(0, this.getLength()));
		for (let i = 0; i < this.timers.length; i++) {
			this.timers[i].setState(Uint8Array.from([state[this.getLength() + i]]));
		}
	}
	start() {
		for (let timer of this.timers) {
			timer.start();
		}
		return;
	}
	reset() {
		for (let timer of this.timers) {
			timer.reset();
		}
		return;
	}
	stop() {
		for (let timer of this.timers) {
			timer.stop();
		}
		return;
	}
}
exports.NXU16_DataMemory = NXU16_DataMemory;
