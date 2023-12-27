'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
class NXU16_Memory {
	constructor(mem) {
		this.SEGMENT_SHIFT_AMOUNT = 0x10;
		this.DEBUG_MEMORY_ADDRESSES = false;
		this.mem = new Uint8Array(mem);
		this.mem.fill(0xff, 0);
	}
	getLength() {
		return this.mem.length;
	}
	clear() {
		this.mem = new Uint8Array(this.mem);
	}
	setData(mem) {
		this.mem.fill(0xff, 0);
		for (var addr in mem) {
			this.mem[addr] = mem[addr];
		}
	}
	set8(val, addr) {
		this.mem[addr] = val;
	}
	get8(addr) {
		return this.mem[addr];
	}
	set16(val, addr) {
		this.mem[addr] = val & 0xff;
		this.mem[addr + 1] = val >> 8 & 0xff;
	}
	get16(addr) {
		let val = this.mem[addr];
		val |= this.mem[addr + 1] << 8;
		return val;
	}
	get32(addr) {
		let val = this.mem[addr];
		val |= this.mem[addr + 1] << 8;
		val |= this.mem[addr + 2] << 16;
		val |= this.mem[addr + 3] << 24;
		return val;
	}
	get64(addr) {
		let val = [];
		val[0]  = this.mem[addr];
		val[0] |= this.mem[addr + 1] << 8;
		val[0] |= this.mem[addr + 2] << 16;
		val[0] |= this.mem[addr + 3] << 24;
		val[1]  = this.mem[addr + 4];
		val[1] |= this.mem[addr + 5] << 8;
		val[1] |= this.mem[addr + 6] << 16;
		val[1] |= this.mem[addr + 7] << 24;
		return val;
	}
	getSubArray(start, end) {
		return this.mem.subarray(start, end);
	}
}
exports.NXU16_Memory = NXU16_Memory;
