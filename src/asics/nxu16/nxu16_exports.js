'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const nxu16_memory = require("./nxu16_memory");
const nxu16_data_memory = require("./nxu16_data_memory");
const constants = require("../../emulators_ts/Constants");
const generic_keypad = require("../../emulators_ts/GenericKeypad");
class mcu {
	constructor(_0x102e32) {
		this.DATA_MEMORY_SIZE = 0x40000;
		this.CODE_MEMORY_SIZE = 0x40000;
		this.REGISTERS_SIZE = 0x2a;
		this.NXU16_MASK_C_FLAG = 128;
		this.NXU16_MASK_Z_FLAG = 64;
		this.NXU16_MASK_S_FLAG = 32;
		this.NXU16_MASK_OV_FLAG = 16;
		this.NXU16_MASK_MIE_FLAG = 8;
		this.NXU16_MASK_HC_FLAG = 4;
		this.NXU16_MASK_ELEVEL = 0x3;
		this.NXU16_MASK_DAA_FLAG = this.NXU16_MASK_C_FLAG | this.NXU16_MASK_Z_FLAG | this.NXU16_MASK_S_FLAG | this.NXU16_MASK_HC_FLAG;
		this.NXU16_PUSH_REGISTER_LIST_EA = 0x1;
		this.NXU16_PUSH_REGISTER_LIST_ELR = 2;
		this.NXU16_PUSH_REGISTER_LIST_PSW = 4;
		this.NXU16_PUSH_REGISTER_LIST_LR = 8;
		this.NXU16_POP_REGISTER_LIST_EA = 0x1;
		this.NXU16_POP_REGISTER_LIST_PC = 2;
		this.NXU16_POP_REGISTER_LIST_PSW = 4;
		this.NXU16_POP_REGISTER_LIST_LR = 8;
		this.r0 = 0;
		this.r1 = 0;
		this.r2 = 0;
		this.r3 = 0;
		this.r4 = 0;
		this.r5 = 0;
		this.r6 = 0;
		this.r7 = 0;
		this.r8 = 0;
		this.r9 = 0;
		this.r10 = 0;
		this.r11 = 0;
		this.r12 = 0;
		this.r13 = 0;
		this.r14 = 0;
		this.r15 = 0;
		this.psw = 0;
		this.psw1 = 0;
		this.psw2 = 0;
		this.psw3 = 0;
		this.ea = 0;
		this.pc = 0;
		this.sp = 0;
		this.ecsr = 0;
		this.lcsr = 0;
		this.ecsr1 = 0;
		this.ecsr2 = 0;
		this.ecsr3 = 0;
		this.lr = 0;
		this.elr1 = 0;
		this.elr2 = 0;
		this.elr3 = 0;
		this.dsr = 0;
		this.currentDSR = 0;
		this.operation = [];
		this.keyEventProcessor = new generic_keypad.KeyEventProcessor();
		this.showConsole = false;
		this.taRspBuffer = null;
		this.taRspLength = 0;
		this.taRspIndex = 0;
		let i;
		let j;
		let operand;
		this.codeMemory = new nxu16_memory.NXU16_Memory(this.CODE_MEMORY_SIZE);
		this.dataMemory = new nxu16_data_memory.NXU16_DataMemory(this.DATA_MEMORY_SIZE);
		this.pendingEI = 0;
		for (i = 0; i < 0x10; i++) {
			for (j = 0; j < 0x10; j++) {
				operand = 0x8001 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.add_Rn_Rm;
				operand = 0xf006 | i << 0x9 | j << 0x5;
				this.operation[operand] = this.add_ERn_ERm;
				operand = 0x8006 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.addc_Rn_Rm;
				operand = 0x8002 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.and_Rn_Rm;
				operand = 0x8008 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.sub_Rn_Rm;
				operand = 0x8007 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.sub_Rn_Rm;
				operand = 0x8005 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.subc_Rn_Rm;
				operand = 0x8009 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.subc_Rn_Rm;
				operand = 0x8000 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.mov_Rn_Rm;
				operand = 0xf005 | i << 0x9 | j << 0x5;
				this.operation[operand] = this.mov_ERn_ERm;
				operand = 0x8003 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.or_Rn_Rm;
				operand = 0x8004 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.xor_Rn_Rm;
				operand = 0xf007 | i << 0x9 | j << 0x5;
				this.operation[operand] = this.sub_ERn_ERm;
				operand = 0x800a | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.sll_Rn_Rm;
				operand = 0x800b | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.sllc_Rn_Rm;
				operand = 0x800e | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.sra_Rn_Rm;
				operand = 0x800c | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.srl_Rn_Rm;
				operand = 0x800d | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.srlc_Rn_Rm;
				operand = 0x9002 | i << 0x9 | j << 0x5;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0x9030 | (i & 0xf) << 8;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0x9050 | (i & 0xf) << 8;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xf004 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.mul_ERn_Rm;
				operand = 0xf009 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[operand] = this.div_ERn_Rm;
			}
		}
		for (i = 0; i < 0x10; i++) {
			for (j = 0; j <= 0xff; j++) {
				operand = 0x1000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.add_Rn_Imm8;
				operand = 0x6000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.addc_Rn_Rm;
				operand = 0x2000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.and_Rn_imm8;
				operand = 0x7000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.sub_Rn_Rm;
				operand = 0x5000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.subc_Rn_Rm;
				operand = 0 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.mov_Rn_Rm;
				operand = 0x3000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.or_Rn_Rm;
				operand = 0x4000 | (i & 0xf) << 8 | j;
				this.operation[operand] = this.xor_Rn_Rm;
				operand = 0x900a | i << 8 | (j & 0x7) << 0x4;
				this.operation[operand] = this.sll_Rn_Rm;
				operand = 0x900b | i << 8 | (j & 0x7) << 0x4;
				this.operation[operand] = this.sllc_Rn_Rm;
				operand = 0x900e | i << 8 | (j & 0x7) << 0x4;
				this.operation[operand] = this.sra_Rn_Rm;
				operand = 0x900c | i << 8 | (j & 0x7) << 0x4;
				this.operation[operand] = this.srl_Rn_Rm;
				operand = 0x900d | i << 8 | (j & 0x7) << 0x4;
				this.operation[operand] = this.srlc_Rn_Rm;
				operand = 0x9032 | i << 0x9;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0x9052 | i << 0x9;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xe900 | j;
				this.operation[operand] = this.mov_Rn_Rm;
			}
		}
		for (i = 0; i < 0x8; i++) {
			for (j = 0; j <= 0x7f; j++) {
				operand = 0xe080;
				operand |= i << 0x9;
				operand |= j & 0x7f;
				this.operation[operand] = this.add_ERn_imm7;
				operand = 0xe000;
				operand |= i << 0x9;
				operand |= j & 0x7f;
				this.operation[operand] = this.mov_ERn_ERm;
			}
		}
		for (i = 0; i < 0x8; i++) {
			for (j = 0; j < 0x8; j++) {
				operand = 0x9003 | (i & 0x7) << 0x9 | (j & 0x7) << 0x5;
				this.operation[operand] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i += 0x2) {
			for (j = 0; j < 0x10; j += 0x2) {
				operand = 0xa008 | i << 8 | j << 0x4;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0x9012 | i << 8;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xa009 | i << 8 | j << 0x4;
				this.operation[operand] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i += 0x2) {
			for (j = 0; j < 0x3f; j++) {
				operand = 0xb000 | i << 8 | j;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xb040 | i << 8 | j;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xb080 | i << 8 | j;
				this.operation[operand] = this.st_ERn_obj;
				operand = 0xb0c0 | i << 8 | j;
				this.operation[operand] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i++) {
			operand = 0x9010 | i << 8;
			this.operation[operand] = this.l_ERn_obj;
			operand = 0x9011 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0xf000 | i << 8;
			this.operation[operand] = this.b_cadr;
			operand = 0xf001 | i << 8;
			this.operation[operand] = this.b_cadr;
			for (j = 0; j <= 0x3f; j++) {
				operand = 0xd000 | i << 8 | j;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xd040 | i << 8 | j;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0xd080 | i << 8 | j;
				this.operation[operand] = this.st_ERn_obj;
				operand = 0xd0c0 | i << 8 | j;
				this.operation[operand] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i++) {
			operand = 0x900f | i << 0x4;
			this.operation[operand] = this.use_DSR_fromRegister;
			operand = 0x9031 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0x9051 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0xa00f | i << 0x4;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa00d | i << 8;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa005 | i << 8;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa00b | i << 0x4;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa01a | i << 8;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa00c | i << 0x4;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa007 | i << 8;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa004 | i << 8;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xa003 | i << 8;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xf04e | i << 8;
			this.operation[operand] = this.push_obj;
			operand = 0xf00e | i << 8;
			this.operation[operand] = this.pop_obj;
			operand = 0xf0ce | i << 8;
			this.operation[operand] = this.push_obj;
			operand = 0xf08e | i << 8;
			this.operation[operand] = this.pop_obj;
			operand = 0x801f | i << 8;
			this.operation[operand] = this.daa_obj;
			operand = 0x803f | i << 8;
			this.operation[operand] = this.das_obj;
			operand = 0x805f | i << 8;
			this.operation[operand] = this.neg_obj;
			for (j = 0; j < 0x8; j++) {
				operand = 0x9000 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0x9001 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[operand] = this.st_ERn_obj;
				operand = 0x9008 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[operand] = this.l_ERn_obj;
				operand = 0x9009 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[operand] = this.st_ERn_obj;
				operand = 0xa000 | i << 8 | j << 0x4;
				this.operation[operand] = this.sb_rn;
				operand = 0xa080 | j << 0x4;
				this.operation[operand] = this.sb_rn;
				operand = 0xa082 | j << 0x4;
				this.operation[operand] = this.rb_rn;
				operand = 0xa002 | i << 8 | j << 0x4;
				this.operation[operand] = this.rb_rn;
				operand = 0xa001 | i << 8 | j << 0x4;
				this.operation[operand] = this.tb_rn;
				operand = 0xa081 | j << 0x4;
				this.operation[operand] = this.tb_rn;
			}
		}
		for (i = 0; i < 0x10; i += 0x2) {
			operand = 0x9033 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0x9013 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0x9053 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0xa10a | i << 0x4;
			this.operation[operand] = this.mov_Rn_Rm;
			operand = 0xf05e | i << 8;
			this.operation[operand] = this.push_obj;
			operand = 0xf01e | i << 8;
			this.operation[operand] = this.pop_obj;
			operand = 0xf00a | i << 0x4;
			this.operation[operand] = this.lea_obj;
			operand = 0xf00b | i << 0x4;
			this.operation[operand] = this.lea_obj;
			operand = 0x800f | i + 0x1 << 8 | i << 0x4;
			this.operation[operand] = this.extbw_rn;
			operand = 0xf002 | i << 0x4;
			this.operation[operand] = this.b_cadr;
			operand = 0xf003 | i << 0x4;
			this.operation[operand] = this.b_cadr;
		}
		for (i = 0; i < 0x10; i += 0x4) {
			operand = 0x9034 | i << 8;
			this.operation[operand] = this.l_ERn_obj;
			operand = 0x9054 | i << 8;
			this.operation[operand] = this.l_ERn_obj;
			operand = 0x9035 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0x9055 | i << 8;
			this.operation[operand] = this.st_ERn_obj;
			operand = 0xf06e | i << 8;
			this.operation[operand] = this.push_obj;
			operand = 0xf02e | i << 8;
			this.operation[operand] = this.pop_obj;
		}
		for (i = 0; i <= 0xff; i++) {
			operand = 0xe300 | i & 0xff;
			this.operation[operand] = this.use_DSR;
			operand = 0xe100 | i;
			this.operation[operand] = this.add_SP_imm8;
			for (j = 0; j < 0x10; j++) {
				operand = 0xc000 | j << 8 | i;
				this.operation[operand] = this.b_conditional;
			}
		}
		for (i = 0; i <= 0x3f; i++) {
			operand = 0xe500 | i;
			this.operation[operand] = this.swi_snum;
		}
		this.operation[0x9036] = this.l_ERn_obj;
		this.operation[0x9836] = this.l_ERn_obj;
		this.operation[0x9056] = this.l_ERn_obj;
		this.operation[0x9856] = this.l_ERn_obj;
		this.operation[0x9037] = this.st_ERn_obj;
		this.operation[0x9837] = this.st_ERn_obj;
		this.operation[0x9057] = this.st_ERn_obj;
		this.operation[0x9857] = this.st_ERn_obj;
		this.operation[0xf07e] = this.push_obj;
		this.operation[0xf87e] = this.push_obj;
		this.operation[0xf03e] = this.pop_obj;
		this.operation[0xf83e] = this.pop_obj;
		this.operation[0xfe9f] = this.use_DSR;
		this.operation[0xf00c] = this.lea_obj;
		this.operation[0xffff] = this.brk;
		this.operation[0xfe2f] = function (exports, operand) { // INC [EA]
			let old_ea_val = exports.dataMemory.get8(exports.dsr, exports.ea);
			let new_ea_val = old_ea_val + 0x1 & 0xff;
			new_ea_val = exports.setFlagsFor8bitInc(exports, old_ea_val, 0x1, new_ea_val);
			exports.dataMemory.set8(exports.dsr, new_ea_val, exports.ea);
		};
		this.operation[0xfe3f] = function (exports, operand) { // DEC [EA]
			let old_ea_val = exports.dataMemory.get8(exports.dsr, exports.ea);
			let new_ea_val = old_ea_val - 0x1;
			new_ea_val = exports.setFlagsFor8bitDec(exports, old_ea_val, 0x1, new_ea_val);
			exports.dataMemory.set8(exports.dsr, new_ea_val, exports.ea);
		};
		this.operation[0xfe8f] = function (exports, operand) {}; // NOP
		this.operation[0xed08] = function (exports, _0x2bd513) {  // EI
			exports.psw |= exports.NXU16_MASK_MIE_FLAG;
			exports.pendingEI++;
		};
		this.operation[0xed80] = function (exports, operand) { // SC
			exports.psw |= exports.NXU16_MASK_C_FLAG;
		};
		this.operation[0xeb7f] = function (exports, operand) { // RC
			exports.psw &= ~exports.NXU16_MASK_C_FLAG;
		};
		this.operation[0xebf7] = function (exports, operand) { // DI
			exports.psw &= ~exports.NXU16_MASK_MIE_FLAG;
		};
		this.operation[0xfecf] = function (exports, operand) { // CPLC
			if ((exports.psw & exports.NXU16_MASK_C_FLAG) === 0) {
				exports.psw |= exports.NXU16_MASK_C_FLAG;
			} else {
				exports.psw &= ~exports.NXU16_MASK_C_FLAG;
			}
		};
		this.operation[0xfe0f] = function (exports, operand) { // RTI
			exports.ecsr = exports.getECSRForELevel(exports);
			exports.pc = exports.ecsr << 16 | exports.getELRForELevel(exports);
			exports.psw = exports.getEPSWForELevel(exports);
		};
		this.operation[0xfe1f] = function (exports, operand) { // RT
			exports.ecsr = exports.lcsr;
			exports.pc = exports.ecsr << 16 | exports.lr;
		};
		if (_0x102e32 && _0x102e32.parent) {
			this.parent = _0x102e32.parent;
		}
		this.isBusy = true;
	}
	getStack(exports) {
		let stack = [];
		for (let i = -1; i < 0xa; i++) {
			stack.push(exports.dataMemory.get16(0, exports.sp + 0x2 * i).toString(0x10));
		}
		return "Stack contents:  + stack.join(", ") + ";
	}
	initialize(exports) {
		this.codeMemory.setData(exports);
		this.dataMemory.setData(exports);
		this.resetAll(this);
		this.dataMemory.resetRegisters();
		this.sp = this.codeMemory.get16(0);
		this.pc = this.codeMemory.get16(0x2);
	}
	resetAll(exports) {
		exports.r0 = 0;
		exports.r1 = 0;
		exports.r2 = 0;
		exports.r3 = 0;
		exports.r4 = 0;
		exports.r5 = 0;
		exports.r6 = 0;
		exports.r7 = 0;
		exports.r8 = 0;
		exports.r9 = 0;
		exports.r10 = 0;
		exports.r11 = 0;
		exports.r12 = 0;
		exports.r13 = 0;
		exports.r14 = 0;
		exports.r15 = 0;
		exports.psw = 0;
		exports.psw1 = 0;
		exports.psw2 = 0;
		exports.psw3 = 0;
		exports.ea = 0;
		exports.pc = 0;
		exports.sp = 0;
		exports.dsr = 0;
		exports.currentDSR = 0;
		exports.ecsr = 0;
		exports.lcsr = 0;
		exports.ecsr1 = 0;
		exports.ecsr2 = 0;
		exports.ecsr3 = 0;
		exports.lr = 0;
		exports.elr1 = 0;
		exports.elr2 = 0;
		exports.elr3 = 0;
		exports.pendingEI = 0;
	}
	isCSet(exports) {
		return (exports.psw & exports.NXU16_MASK_C_FLAG) !== 0;
	}
	setC(exports, bit) {
		if (bit) {
			exports.psw |= exports.NXU16_MASK_C_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_C_FLAG;
		}
	}
	isZSet(exports) {
		return (exports.psw & exports.NXU16_MASK_Z_FLAG) !== 0;
	}
	setZ(exports, bit) {
		if (bit) {
			exports.psw |= exports.NXU16_MASK_Z_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
		}
	}
	isSSet(exports) {
		return (exports.psw & exports.NXU16_MASK_S_FLAG) !== 0;
	}
	setS(exports, bit) {
		if (bit) {
			exports.psw |= exports.NXU16_MASK_S_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_S_FLAG;
		}
	}
	isOVSet(exports) {
		return (exports.psw & exports.NXU16_MASK_OV_FLAG) !== 0;
	}
	setOV(exports, bit) {
		if (bit) {
			exports.psw |= exports.NXU16_MASK_OV_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_OV_FLAG;
		}
	}
	isHCSet(exports) {
		return (exports.psw & exports.NXU16_MASK_HC_FLAG) !== 0;
	}
	setHC(exports, bit) {
		if (bit) {
			exports.psw |= exports.NXU16_MASK_HC_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_HC_FLAG;
		}
	}
	isMIESet(exports) {
		return (exports.psw & exports.NXU16_MASK_MIE_FLAG) !== 0;
	}
	setMIE(exports, bit) {
		if (bit) {
			exports.psw |= exports.NXU16_MASK_MIE_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_MIE_FLAG;
		}
	}
	getECSRForELevel(exports) {
		switch (exports.psw & 0x3) {
			case 0:
				return exports.ecsr;
			case 1:
				return exports.ecsr1;
			case 2:
				return exports.ecsr2;
			case 3:
				return exports.ecsr3;
		}
	}
	setECSRForELevel(exports, val) {
		switch (exports.psw & 0x3) {
			case 0:
				exports.ecsr = val;
				break;
			case 1:
				exports.ecsr1 = val;
				break;
			case 2:
				exports.ecsr2 = val;
				break;
			case 3:
				exports.ecsr3 = val;
				break;
		}
	}
	getELRForELevel(exports) {
		switch (exports.psw & 0x3) {
			case 0:
				return exports.lr;
			case 1:
				return exports.elr1;
			case 2:
				return exports.elr2;
			case 3:
				return exports.elr3;
		}
	}
	setELRForELevel(exports, val) {
		switch (exports.psw & 0x3) {
			case 0:
				exports.lr = val;
				break;
			case 1:
				exports.elr1 = val;
				break;
			case 2:
				exports.elr2 = val;
				break;
			case 3:
				exports.elr3 = val;
				break;
		}
	}
	getEPSWForELevel(exports) {
		switch (exports.psw & 0x3) {
			case 0:
				return exports.psw;
			case 1:
				return exports.psw1;
			case 2:
				return exports.psw2;
			case 3:
				return exports.psw3;
		}
	}
	setEPSWForELevel(exports, val) {
		switch (exports.psw & 0x3) {
			case 0:
				exports.psw = val;
				break;
			case 1:
				exports.psw1 = val;
				break;
			case 2:
				exports.psw2 = val;
				break;
			case 3:
				exports.psw3 = val;
				break;
		}
	}
	getInterruptHandlerAddress(exports, idx, enable) {
		const dataMemory = exports.dataMemory;
		var ie = dataMemory.get8(exports.dsr, dataMemory.INTERRUPT_IE0 + idx);
		var irq = dataMemory.get8(exports.dsr, dataMemory.INTERRUPT_IRQ0 + idx);
		var request = 0;
		var i = 0;
		if (idx === 0) {
			dataMemory.set8(0, irq & 0xfe, dataMemory.INTERRUPT_IRQ0);
			return dataMemory.get16(0, dataMemory.INTERRUPT_QWDT_IRQ0_0_ADDRESS);
		}
		for (; i < 8; i++) {
			if (enable) {
				request = ie >> i & irq >> i & 1;
			} else {
				request = irq >> i & 1;
			}
			if (request !== 0) {
				irq &= ~(request << i);
				dataMemory.set8(0, irq, dataMemory.INTERRUPT_IRQ0 + idx);
				break;
			}
		}
		return exports.codeMemory.get16(2 * (8 * idx + i));
	}
	get8BitRegister(exports, n) {
		switch (n) {
			case 0:
				return exports.r0;
			case 1:
				return exports.r1;
			case 2:
				return exports.r2;
			case 3:
				return exports.r3;
			case 4:
				return exports.r4;
			case 5:
				return exports.r5;
			case 6:
				return exports.r6;
			case 7:
				return exports.r7;
			case 8:
				return exports.r8;
			case 9:
				return exports.r9;
			case 10:
				return exports.r10;
			case 11:
				return exports.r11;
			case 12:
				return exports.r12;
			case 13:
				return exports.r13;
			case 14:
				return exports.r14;
			case 15:
				return exports.r15;
		}
	}
	get16BitRegister(exports, n) {
		switch (n) {
			case 0:
				return exports.r0 | exports.r1 << 8;
			case 1:
				return exports.r1 | exports.r2 << 8;
			case 2:
				return exports.r2 | exports.r3 << 8;
			case 3:
				return exports.r3 | exports.r4 << 8;
			case 4:
				return exports.r4 | exports.r5 << 8;
			case 5:
				return exports.r5 | exports.r6 << 8;
			case 6:
				return exports.r6 | exports.r7 << 8;
			case 7:
				return exports.r7 | exports.r8 << 8;
			case 8:
				return exports.r8 | exports.r9 << 8;
			case 9:
				return exports.r9 | exports.r10 << 8;
			case 10:
				return exports.r10 | exports.r11 << 8;
			case 11:
				return exports.r11 | exports.r12 << 8;
			case 12:
				return exports.r12 | exports.r13 << 8;
			case 13:
				return exports.r13 | exports.r14 << 8;
			case 14:
				return exports.r14 | exports.r15 << 8;
			case 15:
				return exports.r15 | exports.r0 << 8;
		}
	}
	get32BitRegister(exports, n) {
		switch (n) {
			case 0:
				return exports.r0 | exports.r1 << 8 | exports.r2 << 16 | exports.r3 << 24;
			case 4:
				return exports.r4 | exports.r5 << 8 | exports.r6 << 16 | exports.r7 << 24;
			case 8:
				return exports.r8 | exports.r9 << 8 | exports.r10 << 16 | exports.r11 << 24;
			case 12:
				return exports.r12 | exports.r13 << 8 | exports.r14 << 16 | exports.r15 << 24;
				;
		}
	}
	get64BitRegister(exports, n) {
		let int32_0;
		let int32_1;
		switch (n) {
			case 0:
				int32_0 = exports.r0 | exports.r1 << 8 | exports.r2 << 16 | exports.r3 << 24;
				int32_1 = exports.r4 | exports.r5 << 8 | exports.r6 << 16 | exports.r7 << 24;
				break;
			case 8:
				int32_0 = exports.r8 | exports.r9 << 8 | exports.r10 << 16 | exports.r11 << 24;
				int32_1 = exports.r12 | exports.r13 << 8 | exports.r14 << 16 | exports.r15 << 24;
				break;
		}
		return [int32_0, int32_1];
	}
	get16BitRegisterReverse(exports, n) {
		switch (n) {
			case 0:
				return exports.r15 | exports.r0 << 8;
			case 0x1:
				return exports.r0 | exports.r1 << 8;
			case 0x2:
				return exports.r1 | exports.r2 << 8;
			case 0x3:
				return exports.r2 | exports.r3 << 8;
			case 0x4:
				return exports.r3 | exports.r4 << 8;
			case 0x5:
				return exports.r4 | exports.r5 << 8;
			case 0x6:
				return exports.r5 | exports.r6 << 8;
			case 0x7:
				return exports.r6 | exports.r7 << 8;
			case 0x8:
				return exports.r7 | exports.r8 << 8;
			case 0x9:
				return exports.r8 | exports.r9 << 8;
			case 0xa:
				return exports.r9 | exports.r10 << 8;
			case 0xb:
				return exports.r10 | exports.r11 << 8;
			case 0xc:
				return exports.r11 | exports.r12 << 8;
			case 0xd:
				return exports.r12 | exports.r13 << 8;
			case 0xe:
				return exports.r13 | exports.r14 << 8;
			case 0xf:
				return exports.r14 | exports.r15 << 8;
		}
	}
	setOperationResult8bit(exports, n, result) {
		switch (n) {
			case 0:
				exports.r0 = result;
				break;
			case 1:
				exports.r1 = result;
				break;
			case 2:
				exports.r2 = result;
				break;
			case 3:
				exports.r3 = result;
				break;
			case 4:
				exports.r4 = result;
				break;
			case 5:
				exports.r5 = result;
				break;
			case 6:
				exports.r6 = result;
				break;
			case 7:
				exports.r7 = result;
				break;
			case 8:
				exports.r8 = result;
				break;
			case 9:
				exports.r9 = result;
				break;
			case 10:
				exports.r10 = result;
				break;
			case 11:
				exports.r11 = result;
				break;
			case 12:
				exports.r12 = result;
				break;
			case 13:
				exports.r13 = result;
				break;
			case 14:
				exports.r14 = result;
				break;
			case 15:
				exports.r15 = result;
				break;
		}
	}
	setOperationResult16bit(exports, n, result) {
		switch (n) {
			case 0:
				exports.r0 = result & 0xff;
				exports.r1 = result >> 8 & 0xff;
				break;
			case 2:
				exports.r2 = result & 0xff;
				exports.r3 = result >> 8 & 0xff;
				break;
			case 4:
				exports.r4 = result & 0xff;
				exports.r5 = result >> 8 & 0xff;
				break;
			case 6:
				exports.r6 = result & 0xff;
				exports.r7 = result >> 8 & 0xff;
				break;
			case 8:
				exports.r8 = result & 0xff;
				exports.r9 = result >> 8 & 0xff;
				break;
			case 0xa:
				exports.r10 = result & 0xff;
				exports.r11 = result >> 8 & 0xff;
				break;
			case 0xc:
				exports.r12 = result & 0xff;
				exports.r13 = result >> 8 & 0xff;
				break;
			case 0xe:
				exports.r14 = result & 0xff;
				exports.r15 = result >> 8 & 0xff;
				break;
		}
	}
	setOperationResult32bit(exports, n, result) {
		switch (n) {
			case 0:
				exports.r0 = result & 0xff;
				exports.r1 = result >> 8 & 0xff;
				exports.r2 = result >> 16 & 0xff;
				exports.r3 = result >> 24 & 0xff;
				break;
			case 4:
				exports.r4 = result & 0xff;
				exports.r5 = result >> 8 & 0xff;
				exports.r6 = result >> 16 & 0xff;
				exports.r7 = result >> 24 & 0xff;
				break;
			case 8:
				exports.r8 = result & 0xff;
				exports.r9 = result >> 8 & 0xff;
				exports.r10 = result >> 16 & 0xff;
				exports.r11 = result >> 24 & 0xff;
				break;
			case 0xc:
				exports.r12 = result & 0xff;
				exports.r13 = result >> 8 & 0xff;
				exports.r14 = result >> 16 & 0xff;
				exports.r15 = result >> 24 & 0xff;
				break;
		}
	}
	setOperationResult64bit(exports, n, result0, result1) {
		switch (n) {
			case 0:
				exports.r0 = result0 & 0xff;
				exports.r1 = result0 >> 8 & 0xff;
				exports.r2 = result0 >> 16 & 0xff;
				exports.r3 = result0 >> 24 & 0xff;
				exports.r4 = result1 & 0xff;
				exports.r5 = result1 >> 8 & 0xff;
				exports.r6 = result1 >> 16 & 0xff;
				exports.r7 = result1 >> 24 & 0xff;
				break;
			case 8:
				exports.r8 = result0 & 0xff;
				exports.r9 = result0 >> 8 & 0xff;
				exports.r10 = result0 >> 16 & 0xff;
				exports.r11 = result0 >> 24 & 0xff;
				exports.r12 = result1 & 0xff;
				exports.r13 = result1 >> 8 & 0xff;
				exports.r14 = result1 >> 16 & 0xff;
				exports.r15 = result1 >> 24 & 0xff;
				break;
		}
	}
	setFlagsFor8bitAdd(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_C_FLAG | exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (result > 0xff) {
			psw |= exports.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((result ^ op0 ^ op1) & 0x10) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if (!((op0 ^ op1) & 0x80) && (op1 ^ result) & 0x80) {
			psw |= exports.NXU16_MASK_OV_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor8bitAddc(exports, op0, op1, result, zero) {
		let psw = exports.psw & ~(exports.NXU16_MASK_C_FLAG | exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (result > 0xff) {
			psw |= exports.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (zero && result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((result ^ op0 ^ op1) & 0x10) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if (!((op0 ^ op1) & 0x80) && (op1 ^ result) & 0x80) {
			psw |= exports.NXU16_MASK_OV_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setZeroAndSignFlags_8bit(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor8bitSub(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_C_FLAG | exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (result < 0) {
			psw |= exports.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= exports.NXU16_MASK_OV_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor8bitSubc(exports, op0, op1, result, zero) {
		let psw = exports.psw & ~(exports.NXU16_MASK_C_FLAG | exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (result < 0) {
			psw |= exports.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (zero && result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= exports.NXU16_MASK_OV_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor16bitAdd(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_C_FLAG | exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (result > 0xffff) {
			psw |= exports.NXU16_MASK_C_FLAG;
			result &= 0xffff;
		}
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((op1 & 0xfff) + (op0 & 0xfff) > 0xfff) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if (((op0 ^ op1) & 0x8000) === 0) {
			if (((op1 ^ result) & 0x8000) !== 0) {
				psw |= exports.NXU16_MASK_OV_FLAG;
			}
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor8bitInc(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((op1 & 0xf) + (op0 & 0xf) > 0xf) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if (((op0 ^ op1) & 0x80) === 0) {
			if (((op1 ^ result) & 0x80) !== 0) {
				psw |= exports.NXU16_MASK_OV_FLAG;
			}
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor16bitSub(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_C_FLAG | exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		if (op1 > op0) {
			psw |= exports.NXU16_MASK_C_FLAG;
		}
		result &= 0xffff;
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xfff) - (op1 & 0xfff) & -4096) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x8000 && ((op1 ^ result) & 0x8000) === 0) {
			psw |= exports.NXU16_MASK_OV_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setFlagsFor8bitDec(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG | exports.NXU16_MASK_OV_FLAG | exports.NXU16_MASK_HC_FLAG);
		result &= 0xff;
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= exports.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= exports.NXU16_MASK_OV_FLAG;
		}
		exports.psw = psw;
		return result;
	}
	setZeroAndSignFlags_16bit(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		exports.psw = psw;
		return result & 0xffff;
	}
	setZeroAndSignFlags_32bit(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80000000) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		exports.psw = psw;
		return result & 0xffffffff;
	}
	setZeroAndSignFlags_64bit(exports, op0, op1, result) {
		let psw = exports.psw & ~(exports.NXU16_MASK_Z_FLAG | exports.NXU16_MASK_S_FLAG);
		if (op0 === 0 && op1 === 0) {
			psw |= exports.NXU16_MASK_Z_FLAG;
		} else if (op1 & 0x80000000) {
			psw |= exports.NXU16_MASK_S_FLAG;
		}
		exports.psw = psw;
	}
	callScreenChanged(exports, addr) {
		if (exports.parent !== null) {
			let screen = this.dataMemory.getSubArray(addr, addr + 0x600);
			exports.parent.notifyScreenListeners(screen);
		}
	}
	callTopIconsChanged(exports, addr) {
		if (exports.parent !== null) {
			let sbar = this.dataMemory.get32(0, addr);
			this.is2ndMode = (sbar & 2) !== 0;
			exports.parent.notifyTopIconScreenListeners(sbar);
		}
	}
	add_Rn_Rm(exports, operand) {
		let result;
		let op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
		let op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		;
		result = op0 + op1;
		result = exports.setFlagsFor8bitAdd(exports, op0, op1, result);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	addc_Rn_Rm(exports, operand) {
		let result;
		let zero = (exports.psw & exports.NXU16_MASK_Z_FLAG) !== 0;
		let op1;
		let op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
		if ((operand & 0xf000) === 0x6000) { // ADDC Rn, #imm8
			op1 = operand & 0xff;
		} else { // ADDC Rn, Rm
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		}
		if ((exports.psw & exports.NXU16_MASK_C_FLAG) !== 0) {
			result = op0 + op1 + 0x1;
		} else {
			result = op0 + op1;
		}
		result = exports.setFlagsFor8bitAddc(exports, op0, op1, result, zero);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	add_Rn_Imm8(exports, operand) {
		let op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
		;
		let op1 = operand & 0xff;
		let result;
		if ((operand & 0x6000) !== 0 && (exports.psw & exports.NXU16_MASK_C_FLAG) !== 0) { // unused?
			result = op0 + op1 + 1;
		} else {
			result = op0 + op1;
		}
		result = exports.setFlagsFor8bitAdd(exports, op0, op1, result);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	add_ERn_ERm(exports, operand) {
		let op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
		let op1 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
		;
		let result = op0 + op1;
		result = exports.setFlagsFor16bitAdd(exports, op0, op1, result);
		exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
	}
	add_ERn_imm7(exports, operand) {
		let op0 = exports.get16BitRegister(exports, operand >> 8 & 0xe);
		let op1 = operand & 0x7f;
		if ((op1 & 0x40) === 0) {
			op1 &= 0x3f;
		} else {
			op1 |= 0xffc0;
		}
		let result = op0 + op1;
		result = exports.setFlagsFor16bitAdd(exports, op0, op1, result);
		exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
	}
	and_Rn_Rm(exports, operand) {
		let op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
		let op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		let result = op0 & op1;
		result = exports.setZeroAndSignFlags_8bit(exports, op0, op1, result);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	and_Rn_imm8(exports, operand) {
		let result;
		let op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
		let op1 = operand & 0xff;
		result = op0 & op1;
		result = exports.setZeroAndSignFlags_8bit(exports, op0, op1, result);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	sub_Rn_Rm(exports, operand) {
		let result;
		let obj_check = operand & 0xf00f;
		let op0;
		let op1;
		if ((obj_check & 0xf000) === 0x7000) { // CMP/SUB Rn, #imm8
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		} else { // CMP/SUB Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		}
		result = op0 - op1;
		result = exports.setFlagsFor8bitSub(exports, op0, op1, result);
		if (obj_check === 0x8008) { // SUB
			exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
		}
	}
	subc_Rn_Rm(exports, operand) {
		let result;
		let obj_check = operand & 0xf00f;
		let op0;
		let op1;
		let cArr = (exports.psw & exports.NXU16_MASK_C_FLAG) !== 0;
		let zero = (exports.psw & exports.NXU16_MASK_Z_FLAG) !== 0;
		if ((obj_check & 0xf000) === 0x5000 || (obj_check & 0xf000) === 0x7000) { // CMPC/SUBC Rn, #imm8
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		} else { // CMPC/SUBC Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 0x4 & 0xf);
		}
		result = op0 - op1 - (cArr ? 0x1 : 0);
		result = exports.setFlagsFor8bitSubc(exports, op0, op1, result, zero);
		if (obj_check === 0x8009) { // SUBC
			exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
		}
	}
	mov_Rn_Rm(exports, operand) {
		let result;
		let obj_check = operand & 0xf00f;
		let op0;
		let op1;
		if (obj_check >> 12 === 0) { // MOV Rn, #imm8
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		} else {
			if (obj_check === 0xa00f) { // MOV ECSR, Rm
				op0 = exports.getECSRForELevel(exports);
				op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
			} else {
				if (obj_check === 0xa00d) { // MOV ELR, Rm
					op0 = exports.getELRForELevel(exports);
					op1 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
				} else {
					if (obj_check === 0xa00c) { // MOV EPSW, Rm
						op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
					} else {
						if (obj_check === 0xa005) { // MOV ERn, ELR
							op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
							op1 = exports.getELRForELevel(exports);
						} else {
							if (obj_check === 0xa00b) { // MOV PSW, Rm
								op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
							} else {
								if (obj_check === 0xa007) { // MOV Rn, ECSR
									op1 = exports.getECSRForELevel(exports);
								} else {
									if (obj_check === 0xa004) { // MOV Rn, EPSW
										op1 = exports.getEPSWForELevel(exports);
									} else {
										if (obj_check === 0xa003) { // MOV Rn, PSW
											op1 = exports.psw;
										} else {
											if ((operand & 0xf0ff) === 0xa01a) { // MOV ERn, SP
												op1 = exports.sp;
											} else {
												if ((operand & 0xff00) === 0xe900) { // MOV PSW, #unsigned8
													op1 = operand & 0xff;
												} else if ((operand & 0xff0f) === 0xa10a) { // MOV SP, ERm
													op1 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
												} else { // MOV Rn, Rm
													op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
													op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		result = op1;
		if (obj_check === 0xa00f) { // MOV ECSR, Rm
			result &= 0xf;
			exports.setECSRForELevel(exports, result);
		} else {
			if (obj_check === 0xa00d) { // MOV ELR, Rm
				exports.setELRForELevel(exports, result);
			} else {
				if (obj_check === 0xa00c) { // MOV EPSW, Rm
					exports.setEPSWForELevel(exports, result);
				} else {
					if (obj_check === 0xa00b || (operand & 0xff00) === 0xe900) { // MOV PSW, Rm
						exports.psw = result;
					} else {
						if ((operand & 0xf0ff) === 0xa01a || obj_check === 0xa005) { // MOV ERn, obj
							exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
						} else {
							if (obj_check === 0xa003 || obj_check === 0xa007 || obj_check === 0xa004) { // MOV Rn, obj
								exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
							} else if ((operand & 0xff0f) === 0xa10a) { // MOV SP, ERm
								exports.sp = result & 0xfffe;
							} else { // MOV Rn, Rm
								result = exports.setZeroAndSignFlags_8bit(exports, op0, op1, result);
								exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
							}
						}
					}
				}
			}
		}
	}
	mov_ERn_ERm(exports, operand) {
		let op0;
		let op1;
		if ((operand & 0xf00f) === 0xf005) { // MOV ERn, ERm
			op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
		} else { // MOV ERn, #imm7
			op0 = exports.get16BitRegister(exports, operand >> 8 & 0xe);
			op1 = operand & 0x7f;
		}
		if ((operand & 0xf000) === 0xe000 && (op1 & 0x40) !== 0) {
			op1 |= 0xff80;
		}
		let result = op0 = op1;
		result = exports.setZeroAndSignFlags_16bit(exports, op0, op1, result);
		exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
	}
	or_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x8003) { // OR Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		} else { // OR Rn, #imm8
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		}
		result = op0 | op1;
		result = exports.setZeroAndSignFlags_8bit(exports, op0, op1, result);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	xor_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x8004) { // XOR Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		} else { // XOR Rn, #imm8
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		}
		result = op0 ^ op1;
		result = exports.setZeroAndSignFlags_8bit(exports, op0, op1, result);
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	sub_ERn_ERm(exports, operand) {
		let op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
		let op1 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
		let result = op0 - op1;
		result = exports.setFlagsFor16bitSub(exports, op0, op1, result);
	}
	sll_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800a) { // SLL Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf) & 7;
		} else { // SLL Rn, #width
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 << op1;
		if (op1 > 0) {
			if ((result & 0x100) !== 0) {
				exports.psw |= exports.NXU16_MASK_C_FLAG;
			} else {
				exports.psw &= ~exports.NXU16_MASK_C_FLAG;
			}
		}
		result &= 0xff;
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	sllc_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800b) { // SLLC Rn, Rm
			op0 = exports.get16BitRegisterReverse(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf) & 7;
		} else { // SLLC Rn, #width
			op0 = exports.get16BitRegisterReverse(exports, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 << op1;
		if (op1 > 0) {
			if ((result & 0x10000) !== 0) {
				exports.psw |= exports.NXU16_MASK_C_FLAG;
			} else {
				exports.psw &= ~exports.NXU16_MASK_C_FLAG;
			}
		}
		result = (result & 0xff00) >> 8;
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	sra_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let bit;
		let result;
		if ((operand & 0xf00f) === 0x800e) { // SRA Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf) & 7;
		} else { // SRA Rn, #width
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		bit = op0 & 0x80;
		for (let i = 0; i < op1; i++) {
			bit |= bit >> 0x1;
		}
		result = op0 >> op1;
		result |= bit;
		if (op1 > 0) {
			op1 = op1 - 0x1;
			exports.setC(exports, false);
			exports.psw |= (op0 >> op1 & 1) << 7;
		}
		result &= 0xff;
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	srl_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800c) { // SRL Rn, Rm
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf) & 7;
		} else { // SRL Rn, #width
			op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 >> op1;
		if (op1 > 0) {
			op1 = op1 - 1;
			if (op0 >> op1 & 1) {
				exports.setC(exports, true);
			} else {
				exports.setC(exports, false);
			}
		}
		result &= 0xff;
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	srlc_Rn_Rm(exports, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800d) {
			op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.get8BitRegister(exports, operand >> 4 & 0xf) & 7;
		} else {
			op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 >> op1;
		if (op1 > 0) {
			op1 = op1 - 0x1;
			if (op0 >> op1 & 0x1) {
				exports.setC(exports, true);
			} else {
				exports.setC(exports, false);
			}
		}
		result &= 0xff;
		exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
	}
	l_ERn_obj(exports, operand) {
		let op0;
		let op1;
		let ea_inc;
		let obj_check = operand & 0xf0ff;
		let result;
		if (obj_check === 0x9032) { // L ERn, [EA]
			op1 = exports.dataMemory.get16(exports.dsr, exports.ea & 0xfffe);
		} else {
			if (obj_check === 0x9052) { // L ERn, [EA+]
				exports.ea &= 0xfffe;
				op1 = exports.dataMemory.get16(exports.dsr, exports.ea);
				ea_inc = 2;
			} else {
				if (obj_check === 0x9012) { // L ERn, Dadr
					op0 = exports.codeMemory.get16(exports.pc);
					op1 = exports.dataMemory.get16(exports.dsr, op0 & 0xffff);
					exports.pc += 2;
				} else {
					if ((operand & 0xf00f) === 0x9002) { // L ERn, [ERm]
						let op0 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
						op0 &= 0xfffe;
						op1 = exports.dataMemory.get16(exports.dsr, op0);
					} else {
						if (obj_check === 0x9030 || obj_check === 0x9050) { // L Rn, [EA(+)]
							op1 = exports.dataMemory.get8(exports.dsr, exports.ea);
							ea_inc = 1;
						} else {
							if (obj_check === 0x9010) { // L Rn, Dadr
								op0 = exports.codeMemory.get16(exports.pc);
								op1 = exports.dataMemory.get8(exports.dsr, op0);
								exports.pc += 2;
							} else {
								if ((operand & 0xf00f) === 0x9000) { // L Rn, [ERm]
									let op0 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
									op1 = exports.dataMemory.get16(exports.dsr, op0);
								} else {
									if (obj_check === 0x9034) { // L XRn, [EA]
										op1 = exports.dataMemory.get32(exports.dsr, exports.ea & 0xfffe);
										ea_inc = 4;
									} else {
										if (obj_check === 0x9054) { // L XRn, [EA+]
											exports.ea &= 0xfffe;
											op1 = exports.dataMemory.get32(exports.dsr, exports.ea);
											ea_inc = 4;
										} else {
											if (obj_check === 0x9036) { // L QRn, [EA]
												let op0 = exports.dataMemory.get64(exports.dsr, exports.ea & 0xfffe);
												op0 = op0[0];
												op1 = op0[1];
												ea_inc = 8;
											} else {
												if (obj_check === 0x9056) { // L QRn, [EA+]
													exports.ea &= 0xfffe;
													let op0 = exports.dataMemory.get64(exports.dsr, exports.ea);
													op0 = op0[0];
													op1 = op0[1];
													ea_inc = 8;
												} else {
													if ((operand & 0xf00f) === 0xa008) { // L ERn, Disp16[ERm]
														let erm = exports.get16BitRegister(exports, operand >> 0x4 & 0xf);
														op0 = exports.codeMemory.get16(exports.pc);
														erm = erm + op0 & 0xfffe;
														op1 = exports.dataMemory.get16(exports.dsr, erm);
														exports.pc += 0x2;
													} else {
														if ((operand & 0xf0c0) === 0xb040) { // L ERn, Disp16[FP]
															let fp = exports.get16BitRegister(exports, 14);
															op0 = operand & 0x3f;
															if ((op0 & 0x20) !== 0) {
																op0 |= 0xffffffe0;
															}
															fp = fp + op0 & 0xfffe;
															op1 = exports.dataMemory.get16(exports.dsr, fp);
														} else {
															if ((operand & 0xf0c0) === 0xd040) { // L Rn, Disp16[FP]
																let fp = exports.get16BitRegister(exports, 14);
																op0 = operand & 0x3f;
																if ((op0 & 0x20) !== 0) {
																	op0 |= 0xffffffe0;
																}
																fp = fp + op0 & 0xffff;
																op1 = exports.dataMemory.get8(exports.dsr, fp);
															} else {
																if ((operand & 0xf000) === 0xb000) { // L ERn, Disp6[BP]
																	let bp = exports.get16BitRegister(exports, 12);
																	op0 = operand & 0x3f;
																	if ((op0 & 0x20) !== 0) {
																		op0 |= 0xffffffe0;
																	}
																	bp = bp + op0 & 0xfffe;
																	op1 = exports.dataMemory.get16(exports.dsr, bp);
																} else {
																	if ((operand & 0xf000) === 0xd000) { // L Rn, Disp6[BP]
																		let bp = exports.get16BitRegister(exports, 12);
																		op0 = operand & 0x3f;
																		if ((op0 & 0x20) !== 0) {
																			op0 |= 0xffffffe0;
																		}
																		bp = bp + op0 & 0xffff;
																		op1 = exports.dataMemory.get8(exports.dsr, bp);
																	} else {
																		if ((operand & 0xf00f) === 0x9008) { // L Rn, Disp16[ERm]
																			let erm = exports.get16BitRegister(exports, operand >> 4 & 0xf);
																			op0 = exports.codeMemory.get16(exports.pc);
																			erm = erm + op0 & 0xffff;
																			op1 = exports.dataMemory.get8(exports.dsr, erm);
																			exports.pc += 2;
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		result = op1;
		if (obj_check === 0x9032 || obj_check === 0x9052 || (operand & 0xf00f) === 0x9002 || (operand & 0xf00f) === 0xa008 || (operand & 0xf0c0) === 0xb040 || (operand & 0xf000) === 0xb000) { // L ERn, obj
			result = exports.setZeroAndSignFlags_16bit(exports, op0, op1, result);
			exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
		} else {
			if (obj_check === 0x9030 || obj_check === 0x9050 || (operand & 0xf00f) === 0x9000 || obj_check === 0x9010 || obj_check === 0x9012 || (operand & 0xf00f) === 0x9008 || (operand & 0xf000) === 0xd000 || (operand & 0xf0c0) === 0xd040) { // L Rn, obj; L ERn, Dadr
				result &= 0xff;
				result = exports.setZeroAndSignFlags_8bit(exports, op0, op1, result);
				exports.setOperationResult8bit(exports, operand >> 8 & 0xf, result);
			} else {
				if (obj_check === 0x9034 || obj_check === 0x9054) { // L XRn, obj
					result = exports.setZeroAndSignFlags_32bit(exports, op0, op1, result);
					exports.setOperationResult32bit(exports, operand >> 8 & 0xf, result);
				} else if (obj_check === 0x9036 || obj_check === 0x9056) { // L QRn, obj
					exports.setZeroAndSignFlags_64bit(exports, op0, op1, result);
					exports.setOperationResult64bit(exports, operand >> 8 & 0xf, op0, op1);
				}
			}
		}
		if (obj_check === 0x9052 || obj_check === 0x9050 || obj_check === 0x9054 || obj_check === 0x9056) { // Increment EA
			exports.ea += ea_inc;
		}
	}
	st_ERn_obj(exports, operand) {
		let op0;
		let op1;
		let obj_check = operand & 0xf0ff;
		let ea_inc;
		if (obj_check === 0x9033) { // ST ERn, [EA]
			op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
			op1 = exports.ea & 0xfffe;
			ea_inc = 2;
		} else {
			if (obj_check === 0x9053) { // ST ERn, [EA+]
				op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
				exports.ea &= 0xfffe;
				op1 = exports.ea;
				ea_inc = 2;
			} else {
				if (obj_check === 0x9013) { // ST ERn, Dadr
					op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
					op1 = exports.codeMemory.get16(exports.pc);
					ea_inc = 2;
					exports.pc += 2;
				} else {
					if ((operand & 0xf00f) === 0x9003) { // ST ERn, [ERm]
						op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
						op1 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
						ea_inc = 2;
					} else {
						if (obj_check === 0x9031 || obj_check === 0x9051) { // ST Rn, [EA(+)]
							op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
							op1 = exports.ea;
							ea_inc = 1;
						} else {
							if (obj_check === 0x9011) { // ST Rn, Dadr
								op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
								op1 = exports.codeMemory.get16(exports.pc);
								ea_inc = 1;
								exports.pc += 2;
							} else {
								if ((operand & 0xf00f) === 0x9001) { // ST Rn, [ERm]
									op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
									op1 = exports.get16BitRegister(exports, operand >> 4 & 0xf);
									ea_inc = 1;
								} else {
									if ((operand & 0xf00f) === 0xa009) { // ST ERn, Disp16[ERm]
										op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
										let erm = exports.get16BitRegister(exports, operand >> 0x4 & 0xf);
										op1 = exports.codeMemory.get16(exports.pc);
										op1 = erm + op1 & 0xfffe;
										ea_inc = 2;
										exports.pc += 2;
									} else {
										if ((operand & 0xf00f) === 0x9009) { // ST ERn, Disp16[ERm]
											op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
											let erm = exports.get16BitRegister(exports, operand >> 0x4 & 0xf);
											op1 = exports.codeMemory.get16(exports.pc);
											op1 = erm + op1 & 0xffff;
											ea_inc = 1;
											exports.pc += 2;
										} else {
											if ((operand & 0xf0c0) === 0xb080) { // ST ERn, Disp6[BP]
												op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
												let bp = exports.get16BitRegister(exports, 12);
												op1 = operand & 0x3f;
												if ((op1 & 0x20) !== 0) {
													op1 |= 0xffffffe0;
												}
												op1 = bp + op1 & 0xfffe;
												ea_inc = 2;
											} else {
												if ((operand & 0xf0c0) === 0xd080) { // ST Rn, Disp6[BP]
													op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
													let bp = exports.get16BitRegister(exports, 12);
													op1 = operand & 0x3f;
													if ((op1 & 0x20) !== 0) {
														op1 |= 0xffffffe0;
													}
													op1 = bp + op1 & 0xffff;
													ea_inc = 1;
												} else {
													if ((operand & 0xf0c0) === 0xd0c0) { // ST Rn, Disp6[FP]
														op0 = exports.get8BitRegister(exports, operand >> 8 & 0xf);
														let fp = exports.get16BitRegister(exports, 14);
														op1 = operand & 0x3f;
														if ((op1 & 0x20) !== 0) {
															op1 |= 0xffffffe0;
														}
														op1 = fp + op1 & 0xffff;
														ea_inc = 1;
													} else {
														if ((operand & 0xf0c0) === 0xb0c0) { // ST ERn, Disp6[FP]
															op0 = exports.get16BitRegister(exports, operand >> 8 & 0xf);
															let fp = exports.get16BitRegister(exports, 14);
															op1 = operand & 0x3f;
															if ((op1 & 0x20) !== 0) {
																op1 |= 0xffffffe0;
															}
															op1 = fp + op1 & 0xfffe;
															ea_inc = 2;
														} else {
															if (obj_check === 0x9035) { // ST XRn, [EA]
																op0 = exports.get32BitRegister(exports, operand >> 8 & 0xf);
																op1 = exports.ea & 0xfffe;
																ea_inc = 4;
															} else {
																if (obj_check === 0x9055) { // ST XRn, [EA+]
																	op0 = exports.get32BitRegister(exports, operand >> 8 & 0xf);
																	exports.ea &= 0xfffe;
																	op1 = exports.ea;
																	ea_inc = 4;
																} else {
																	if (obj_check === 0x9037) { // ST QRn, [EA]
																		op0 = exports.get64BitRegister(exports, operand >> 8 & 0xf);
																		op1 = exports.ea & 0xfffe;
																		ea_inc = 8;
																	} else if (obj_check === 0x9057) { // ST QRn, [EA+]
																		op0 = exports.get64BitRegister(exports, operand >> 8 & 0xf);
																		exports.ea &= 0xfffe;
																		op1 = exports.ea;
																		ea_inc = 8;
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		if (typeof op0 === "number") { // Rn, ERn, XRn
			for (let i = 0; i < ea_inc; i++) {
				exports.dataMemory.set8(exports.dsr, op0 >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
		} else { // QRn
			for (let i = 0; i < 4; i++) {
				exports.dataMemory.set8(exports.dsr, op0[0] >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0[0].toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
			for (let i = 4; i < 8; i++) {
				exports.dataMemory.set8(exports.dsr, op0[1] >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0[1].toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
		}
		if (obj_check === 0x9053 || obj_check === 0x9051 || obj_check === 0x9055 || obj_check === 0x9057) { // Increment EA
			exports.ea += ea_inc;
		}
	}
	add_SP_imm8(exports, operand) {
		let old_sp = exports.sp;
		let imm8 = operand & 0xff;
		if ((imm8 & 0x80) === 0) {
			imm8 &= 0x7f;
		} else {
			imm8 |= 0xff80;
		}
		let new_sp = old_sp + imm8;
		new_sp &= 0xffff;
		exports.sp = new_sp & 0xfffe;
	}
	pushValueToStack(exports, val, size) {
		let i;
		for (i = 0; i < size; i++) {
			exports.sp--;
			exports.dataMemory.set8(0, val >> 8 * (size - i - 1) & 0xff, exports.sp);
		}
		if (constants.Constants.DEBUG_PUSH_POP) {
			console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  pushed something " + val.toString(16));
		}
	}
	popValueFromStack(exports, size) {
		var val = 0;
		for (let i = size - 1; i >= 0; i--) {
			val |= exports.dataMemory.get8(0, exports.sp) << 8 * (size - i - 1);
			exports.sp++;
		}
		if (constants.Constants.DEBUG_PUSH_POP) {
			console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  popped something " + val.toString(16));
		}
		return val;
	}
	push_obj(exports, operand) {
		let reg_list;
		let pushval;
		let obj_check = operand & 0xf0ff;
		if (obj_check === 0xf04e) { // PUSH Rn
			pushval = exports.get8BitRegister(exports, operand >> 8 & 0xf);
			exports.pushValueToStack(exports, pushval, 2);
		} else {
			if (obj_check === 0xf05e) { // PUSH ERn
				pushval = exports.get16BitRegister(exports, operand >> 8 & 0xf);
				exports.pushValueToStack(exports, pushval, 2);
			} else {
				if (obj_check === 0xf06e) { // PUSH XRn
					pushval = exports.get32BitRegister(exports, operand >> 8 & 0xf);
					exports.pushValueToStack(exports, pushval, 4);
				} else {
					if (obj_check === 0xf07e) { // PUSH QRn
						pushval = exports.get64BitRegister(exports, operand >> 8 & 0xf);
						exports.pushValueToStack(exports, pushval[1], 4);
						exports.pushValueToStack(exports, pushval[0], 4);
					} else if (obj_check === 0xf0ce) { // PUSH register_list
						reg_list = operand >> 8 & 0xff;
						if ((reg_list & exports.NXU16_PUSH_REGISTER_LIST_ELR) !== 0) {
							exports.pushValueToStack(exports, exports.ecsr1, 2);
							exports.pushValueToStack(exports, exports.elr1, 2);
						}
						if ((reg_list & exports.NXU16_PUSH_REGISTER_LIST_PSW) !== 0) {
							exports.pushValueToStack(exports, exports.psw, 2);
						}
						if ((reg_list & exports.NXU16_PUSH_REGISTER_LIST_LR) !== 0) {
							exports.pushValueToStack(exports, exports.lcsr, 2);
							exports.pushValueToStack(exports, exports.lr & 0xffff, 2);
							if (constants.Constants.DEBUG_PUSH_POP) {
								console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  pushed lr=0x" + exports.lr.toString(16));
							}
						}
						if ((reg_list & exports.NXU16_PUSH_REGISTER_LIST_EA) !== 0) {
							exports.pushValueToStack(exports, exports.ea, 2);
						}
					}
				}
			}
		}
	}
	use_DSR(exports, operand) {
		if (operand === 0xfe9f) {
			exports.dsr = exports.currentDSR;
		} else {
			exports.currentDSR = operand & 0xff;
			exports.dsr = exports.currentDSR;
		}
		let next_op = exports.codeMemory.get16(exports.pc);
		exports.pc += 0x2;
		exports.operation[next_op](exports, next_op);
		exports.dsr = 0;
	}
	use_DSR_fromRegister(exports, operand) {
		let d = operand >> 0x4 & 0xf;
		exports.currentDSR = exports.get8BitRegister(exports, d);
		exports.dsr = exports.currentDSR;
		let next_op = exports.codeMemory.get16(exports.pc);
		exports.pc += 0x2;
		exports.operation[next_op](exports, next_op);
		exports.dsr = 0;
	}
	pop_obj(exports, operand) {
		let reg_list;
		let popval;
		let obj_check = operand & 0xf0ff;
		if (obj_check === 0xf01e) { // POP Rn
			popval = exports.popValueFromStack(exports, 2);
			exports.setOperationResult16bit(exports, operand >> 8 & 0xf, popval);
		} else {
			if (obj_check === 0xf00e) { // POP ERn
				popval = exports.popValueFromStack(exports, 2);
				exports.setOperationResult8bit(exports, operand >> 8 & 0xf, popval & 0xff);
			} else {
				if (obj_check === 0xf02e) { // POP XRn
					popval = exports.popValueFromStack(exports, 4);
					exports.setOperationResult32bit(exports, operand >> 8 & 0xf, popval);
				} else {
					if (obj_check === 0xf03e) { // POP QRn
						if ((operand >> 8 & 0xf) === 0) {
							exports.r0 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r1 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r2 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r3 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r4 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r5 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r6 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r7 = exports.dataMemory.get8(exports.dsr, exports.sp++);
						} else {
							exports.r8 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r9 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r10 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r11 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r12 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r13 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r14 = exports.dataMemory.get8(exports.dsr, exports.sp++);
							exports.r15 = exports.dataMemory.get8(exports.dsr, exports.sp++);
						}
					} else {
						if (obj_check === 0xf08e) { // POP register_list
							reg_list = operand >> 8 & 0xff;
							if ((reg_list & exports.NXU16_POP_REGISTER_LIST_EA) !== 0) {
								exports.ea = exports.popValueFromStack(exports, 2);
							}
							if ((reg_list & exports.NXU16_POP_REGISTER_LIST_LR) !== 0) {
								exports.ecsr = exports.popValueFromStack(exports, 2) & 0x3;
								exports.pc = exports.ecsr << 16 | exports.popValueFromStack(exports, 0x2);
							}
							if ((reg_list & exports.NXU16_POP_REGISTER_LIST_PSW) !== 0) {
								exports.psw = exports.popValueFromStack(exports, 2) & 0xff;
							}
							if ((reg_list & exports.NXU16_POP_REGISTER_LIST_PC) !== 0) {
								let pc = exports.popValueFromStack(exports, 2);
								if (constants.Constants.DEBUG_PUSH_POP) {
									console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  popped pc=" + exports.ecsr + ":" + exports.pc.toString(16));
									console.log("writing pc= 0x" + pc.toString(16));
								}
								exports.pc = pc;
								exports.ecsr = exports.popValueFromStack(exports, 2) & 0x3;
								exports.pc = exports.ecsr << 16 | exports.pc;
							}
						}
					}
				}
			}
		}
	}
	lea_obj(exports, operand) {
		let obj_check = operand & 0xf00f;
		if (obj_check === 0xf00a) { // LEA [ERm]
			let erm = exports.get16BitRegister(exports, operand >> 0x4 & 0xf);
			exports.ea = erm;
		} else {
			if (obj_check === 0xf00b) { // LEA Disp16[ERm]
				let erm = exports.get16BitRegister(exports, operand >> 0x4 & 0xf);
				let disp16 = exports.codeMemory.get16(exports.pc);
				erm = erm + disp16 & 0xffff;
				exports.ea = erm;
				exports.pc += 0x2;
			} else {
				if (obj_check === 0xf00c) { // LEA Dadr
					let dadr = exports.codeMemory.get16(exports.pc);
					exports.ea = dadr;
					exports.pc += 0x2;
				}
			}
		}
	}
	daa_obj(exports, operand) {
		const cArr = (exports.psw & exports.NXU16_MASK_C_FLAG) !== 0;
		const half_cArr = (exports.psw & exports.NXU16_MASK_HC_FLAG) !== 0;
		const n = operand >> 8 & 0xf;
		const rn = exports.get8BitRegister(exports, n);
		const hi_nib = (rn & 0xf0) >> 0x4;
		const lo_nib = rn & 0xf;
		let add_val;
		if (!cArr && !half_cArr && hi_nib <= 0x9 && lo_nib <= 0x9) {
			add_val = 0;
		} else {
			if (!cArr && (hi_nib <= 0x8 && lo_nib > 0x9 || hi_nib <= 0x9 && half_cArr)) {
				add_val = 0x6;
			} else if (!half_cArr && lo_nib <= 0x9 && (!cArr && hi_nib > 0x9 || cArr)) {
				add_val = 0x60;
			} else {
				add_val = 0x66;
			}
		}
		const result = rn + add_val & 0xff;
		if (result & 0x80) {
			exports.psw |= exports.NXU16_MASK_S_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_S_FLAG;
		}
		if (result === 0) {
			exports.psw |= exports.NXU16_MASK_Z_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
		}
		if (!cArr && (hi_nib > 0x9 || !half_cArr && hi_nib >= 0x9 && lo_nib > 0x9)) {
			exports.psw |= exports.NXU16_MASK_C_FLAG;
		}
		if ((result ^ rn ^ add_val) & 0x10) {
			exports.psw |= exports.NXU16_MASK_HC_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_HC_FLAG;
		}
		exports.setOperationResult8bit(exports, n, result);
	}
	das_obj(exports, operand) {
		const cArr = (exports.psw & exports.NXU16_MASK_C_FLAG) !== 0;
		const half_cArr = (exports.psw & exports.NXU16_MASK_HC_FLAG) !== 0;
		const n = operand >> 8 & 0xf;
		const rn = exports.get8BitRegister(exports, n);
		const hi_nib = (rn & 0xf0) >> 0x4;
		const lo_nib = rn & 0xf;
		let sub_val;
		if (!cArr && !half_cArr && hi_nib <= 0x9 && lo_nib <= 0x9) {
			sub_val = 0;
		} else {
			if (!cArr && (hi_nib <= 0x9 && lo_nib > 0x9 || hi_nib <= 0x9 && half_cArr)) {
				sub_val = 0x6;
			} else if (!half_cArr && lo_nib <= 0x9 && (!cArr && hi_nib > 0x9 || cArr)) {
				sub_val = 0x60;
			} else {
				sub_val = 0x66;
			}
		}
		const result = rn - sub_val & 0xff;
		if (result & 0x80) {
			exports.psw |= exports.NXU16_MASK_S_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_S_FLAG;
		}
		if (result === 0) {
			exports.psw |= exports.NXU16_MASK_Z_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
		}
		if ((rn & 0xf) - (sub_val & 0xf) & -16) {
			exports.psw |= exports.NXU16_MASK_HC_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_HC_FLAG;
		}
		exports.setOperationResult8bit(exports, n, result);
	}
	neg_obj(exports, operand) {
		const n = operand >> 8 & 0xf;
		const rn = exports.get8BitRegister(exports, n);
		let result = 0 - rn;
		result = exports.setFlagsFor8bitSub(exports, 0, rn, result);
		exports.setOperationResult8bit(exports, n, result);
	}
	mul_ERn_Rm(exports, operand) {
		const n = operand >> 8 & 0xf;
		const m = operand >> 4 & 0xf;
		const rn = exports.get8BitRegister(exports, n);
		const rm = exports.get8BitRegister(exports, m);
		const result = rn * rm;
		if (result === 0) {
			exports.psw |= exports.NXU16_MASK_Z_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
		}
		exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
	}
	div_ERn_Rm(exports, operand) {
		const n = operand >> 8 & 0xf;
		const m = operand >> 4 & 0xf;
		const rn = exports.get16BitRegister(exports, n);
		const rm = exports.get8BitRegister(exports, m);
		if (rm === 0) {
			exports.setC(exports, true);
		} else {
			const result = Math.floor(rn / rm);
			const remainder = rn % rm >>> 0;
			exports.setC(exports, false);
			if (result === 0) {
				exports.psw |= exports.NXU16_MASK_Z_FLAG;
			} else {
				exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
			}
			exports.setOperationResult16bit(exports, operand >> 8 & 0xf, result);
			exports.setOperationResult8bit(exports, m, remainder);
		}
	}
	sb_rn(exports, operand) {
		let bit = operand >> 4 & 7;
		let n;
		let op0;
		let obj_check = operand & 0xf08f;
		if (obj_check === 0xa000) { // SB Rn.bit_offset
			n = operand >> 8 & 0xf;
			op0 = exports.get8BitRegister(exports, n);
		} else if (obj_check === 0xa080) { // SB Dadr.bit_offset
			n = exports.codeMemory.get16(exports.pc);
			op0 = exports.dataMemory.get8(exports.dsr, n);
			exports.pc += 2;
		}
		let bit_mask = 1 << bit;
		if ((op0 & bit_mask) === 0) {
			exports.setZ(exports, true);
		} else {
			exports.setZ(exports, false);
		}
		op0 |= bit_mask;
		if (obj_check === 0xa000) { // SB Rn.bit_offset
			exports.setOperationResult8bit(exports, n, op0);
		} else if (obj_check === 0xa080) { // SB Dadr.bit_offset
			exports.dataMemory.set8(exports.dsr, op0, n);
		}
	}
	rb_rn(exports, operand) {
		let bit = operand >> 4 & 7;
		let n;
		let op0;
		let obj_check = operand & 0xf08f;
		if (obj_check === 0xa002) { // RB Rn.bit_offset
			n = operand >> 8 & 0xf;
			op0 = exports.get8BitRegister(exports, n);
		} else if (obj_check === 0xa082) { // RB Dadr.bit_offset
			n = exports.codeMemory.get16(exports.pc);
			op0 = exports.dataMemory.get8(exports.dsr, n);
			exports.pc += 0x2;
		}
		if ((op0 >> bit & 0x1) === 0) {
			exports.psw |= exports.NXU16_MASK_Z_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
		}
		op0 &= ~(0x1 << bit) & 0xff;
		if (obj_check === 0xa002) { // RB Rn.bit_offset
			exports.setOperationResult8bit(exports, n, op0);
		} else if (obj_check === 0xa082) { // RB Dadr.bit_offset
			exports.dataMemory.set8(exports.dsr, op0, n);
		}
	}
	tb_rn(exports, operand) {
		let bit = operand >> 0x4 & 0x7;
		let n;
		let op0;
		let obj_check = operand & 0xf08f;
		if (obj_check === 0xa001) { // TB Rn.bit_offset
			n = operand >> 8 & 0xf;
			op0 = exports.get8BitRegister(exports, n);
		} else if (obj_check === 0xa081) { // TB Rn.bit_offset
			n = exports.codeMemory.get16(exports.pc);
			op0 = exports.dataMemory.get8(exports.dsr, n);
			exports.pc += 0x2;
		}
		if ((op0 >> bit & 0x1) === 0) {
			exports.psw |= exports.NXU16_MASK_Z_FLAG;
		} else {
			exports.psw &= ~exports.NXU16_MASK_Z_FLAG;
		}
	}
	b_conditional(exports, operand) {
		var jump = false;
		var radr = operand & 0xff;
		var cond = operand >> 8 & 0xf;
		if ((radr & 0x80) !== 0) {
			radr |= 0xffffff80;
		}
		radr *= 0x2;
		switch (cond) {
			case 0: // BGE/BNC
				jump = !exports.isCSet(exports);
				break;
			case 1: // BLT/BCY
				jump = exports.isCSet(exports);
				break;
			case 2: // BGT
				jump = exports.isCSet(exports) === false && exports.isZSet(exports) === false;
				break;
			case 3: // BLE
				jump = exports.isCSet(exports) === true || exports.isZSet(exports) === true;
				break;
			case 4: // BGES
				var ov = exports.isOVSet(exports);
				var s = exports.isSSet(exports);
				jump = !(s !== ov);
				break;
			case 5: // BLTS
				var ov = exports.isOVSet(exports);
				var s = exports.isSSet(exports);
				jump = s !== ov;
				break;
			case 6: // BGTS
				var ov = exports.isOVSet(exports);
				var s = exports.isSSet(exports);
				var z = exports.isZSet(exports);
				jump = !(s !== ov || z);
				break;
			case 7: // BLES
				var z = exports.isZSet(exports);
				var ov = exports.isOVSet(exports);
				var s = exports.isSSet(exports);
				jump = s !== ov || z;
				break;
			case 8: // BNE/BNZ
				var z = exports.isZSet(exports);
				jump = !z;
				break;
			case 9: // BEQ/BZ
				var z = exports.isZSet(exports);
				jump = z;
				break;
			case 0xa: // BNV
				jump = !exports.isOVSet(exports);
				break;
			case 0xb: // BOV
				jump = exports.isOVSet(exports);
				break;
			case 0xc: // BPS
				var s = exports.isSSet(exports);
				jump = !s;
				break;
			case 0xd: // BNS
				var s = exports.isSSet(exports);
				jump = s;
				break;
			case 0xe: // BAL
				jump = true;
				break;
		}
		if (jump) {
			exports.pc += radr;
		}
	}
	extbw_rn(exports, operand) {
		let rn = exports.get8BitRegister(exports, operand >> 4 & 0xf);
		if ((rn & 0x80) !== 0) {
			rn |= 0xff80;
			exports.setS(exports, true);
		} else {
			exports.setS(exports, false);
		}
		if (rn === 0) {
			exports.setZ(exports, true);
		} else {
			exports.setZ(exports, false);
		}
		exports.setOperationResult16bit(exports, (operand >> 9 & 7) << 1, rn);
	}
	swi_snum(exports, operand) {
		let snum = operand & 0x3f;
		let swi_handler = function () {
			if (snum === 1) {
				if (typeof exports.parent !== "undefined") {
					let er0 = exports.get16BitRegister(exports, 0);
					exports.callScreenChanged(exports, er0);
					exports.r0 = 0;
					exports.r1 = 0;
				}
			} else {
				if (snum === 2) {
					let keycode = exports.keyEventProcessor.getNextKeyCode();
					if (keycode === 0x29 && exports.is2ndMode) {
						keycode = 0;
					}
					exports.r1 = 0;
					exports.r0 = keycode & 0xff;
					exports.isBusy = true;
					if (exports.r0 === 0xff) {
						exports.r2 = exports.uartStartAddress & 0xff;
						exports.r3 = exports.uartStartAddress >> 8 & 0xff;
					}
				} else {
					if (snum === 3) {
						if (typeof exports.automationResolve === "function") {
							let er0 = exports.get16BitRegister(exports, 0);
							let er2 = exports.get16BitRegister(exports, 2);
							if (exports.taRspBuffer === null) {
								let addr = exports.dataMemory.get8(0, er0) | exports.dataMemory.get8(0, er0 + 0x1) << 8;
								exports.taRspLength = addr + 0x2;
								exports.taRspBuffer = new Uint8Array(exports.taRspLength);
							}
							for (let i = 0; i < er2; i++) {
								exports.taRspBuffer[exports.taRspIndex++] = exports.dataMemory.get8(0, er0 + i);
							}
							if (exports.taRspIndex === exports.taRspLength) {
								exports.automationResolve(exports.taRspBuffer);
								exports.taRspBuffer = null;
								exports.taRspLength = 0;
								exports.taRspIndex = 0;
								exports.automationResolve = undefined;
							} else if (exports.taRspIndex > exports.taRspLength) {
								exports.automationReject("Failed to create response.");
								exports.taRspBuffer = null;
								exports.taRspLength = 0;
								exports.taRspIndex = 0;
							}
						} else if (typeof exports.uartReady === "function") {
							if (typeof exports.uartBufLenLocation === "undefined") {
								exports.uartBufLenLocation = exports.dataMemory.get16(0, 0x106);
								exports.uartStartAddress = exports.uartBufLenLocation + 0x2;
								console.log("TA framework is ready.");
								exports.uartReady("TA framework is ready.");
							} else {
								console.log("TA initialized already.");
							}
						}
					} else {
						if (snum === 4) {
							if (typeof exports.parent !== "undefined") {
								let er0 = exports.get16BitRegister(exports, 0);
								exports.callTopIconsChanged(exports, er0);
								exports.r0 = 0;
								exports.r1 = 0;
							}
						} else if (snum === 5) {
							exports.keyEventProcessor.notifyKeyCanRepeat();
						}
					}
				}
			}
			let swi_addr = (snum << 0x1) + 0x80;
			return exports.codeMemory.get16(swi_addr);
		};
		exports.psw1 = exports.psw;
		exports.psw |= 0x1;
		exports.elr1 = exports.pc & 0xffff;
		exports.ecsr1 = exports.ecsr;
		exports.psw &= ~exports.NXU16_MASK_MIE_FLAG;
		exports.pc = swi_handler();
	}
	brk(exports, operand) {
		const elevel = exports.psw & exports.NXU16_MASK_ELEVEL;
		if (elevel > 1) {
			exports.resetAll(exports);
			exports.sp = exports.codeMemory.get16(0);
			exports.pc = exports.codeMemory.get16(2);
		}
		if (elevel < 2) {
			exports.elr2 = exports.pc & 0xffff;
			exports.ecsr2 = exports.ecsr;
			exports.psw2 = exports.psw;
			exports.psw |= 2;
			exports.pc = exports.codeMemory.get16(4);
		}
	}
	b_cadr(exports, operand) {
		let cadr;
		if ((operand & 0xf00f) === 0xf000) { // B Cadr
			exports.ecsr = operand >> 8 & 3;
			cadr = exports.codeMemory.get16(exports.pc);
		} else {
			if ((operand & 0xf00f) === 0xf001) { // BL Cadr
				exports.lr = exports.pc + 2 & 0xffff;
				exports.lcsr = exports.ecsr;
				exports.ecsr = operand >> 8 & 0xf;
				cadr = exports.codeMemory.get16(exports.pc);
			} else {
				if ((operand & 0xf00f) === 0xf002) { // B ERn
					cadr = exports.get16BitRegister(exports, operand >> 4 & 0xf);
				} else if ((operand & 0xf00f) === 0xf003) { // BL ERn
					exports.lr = exports.pc + 2 & 0xffff;
					exports.lcsr = exports.ecsr;
					cadr = exports.get16BitRegister(exports, operand >> 4 & 0xf);
				}
			}
		}
		exports.pc = exports.ecsr << 16 | cadr;
	}
	checkForInterrupt() {
		const exports = this;
		const data_mem = exports.dataMemory;
		if (exports.pendingEI > 0) {
			exports.pendingEI--;
		} else {
			for (let i = 0; i < 1; i++) {
				if (data_mem.get8(0, data_mem.INTERRUPT_IRQ0 + i) !== 0) {
					exports.elr2 = exports.pc & 0xffff;
					exports.ecsr2 = exports.ecsr;
					exports.psw2 = exports.psw;
					exports.psw = 2;
					exports.ecsr = 0;
					exports.pc = exports.getInterruptHandlerAddress(exports, i, false);
					break;
				}
			}
			if (exports.isMIESet(exports)) {
				for (let j = 1; j < 8; j++) {
					if (data_mem.get8(0, data_mem.INTERRUPT_IE0 + j) !== 0 && data_mem.get8(0, data_mem.INTERRUPT_IRQ0 + j) !== 0) {
						if ((exports.psw & exports.NXU16_MASK_ELEVEL) < 2) {
							exports.elr1 = exports.pc & 0xffff;
							exports.ecsr1 = exports.ecsr;
							exports.psw1 = exports.psw;
							exports.psw = 1;
							exports.setMIE(exports, false);
							exports.ecsr = 0;
							exports.pc = exports.getInterruptHandlerAddress(exports, j, true);
							break;
						}
					}
				}
			}
		}
	}
	run() {
		let exports = this;
		let pc;
		let operand;
		const loop_count = this.isBusy ? 0x1388 : 0x32;
		for (let i = 0; i < loop_count; i++) {
			pc = this.pc;
			operand = this.codeMemory.get16(pc);
			if (operand === 0xe502 && exports.keyEventProcessor.isQueueEmpty()) { // E502 = SWI 2
				this.isBusy = false;
				break;
			}
			if (constants.Constants.SHOW_C_TRACE && typeof dolphinMapData[pc] !== "undefined") {
				console.log("pc= 0x" + pc.toString(16) + " - " + dolphinMapData[pc]);
				if (dolphinMapData[pc].includes("memClearedDialog")) {
					exports.showConsole = true;
					debugger;
				}
			}
			this.pc += 2;
			if (typeof this.operation[operand] === "function" || pc > this.CODE_MEMORY_SIZE) {
				this.operation[operand](this, operand);
			} else {
				console.log("ERROR!!!, tried to call an unsupported opcode!");
				console.log("pc= 0x" + pc.toString(16));
				console.log("opcode= 0x" + operand.toString(16));
				debugger;
			}
		}
		let _0x362ddc = exports.dataMemory.get8(0, exports.dataMemory.INTERRUPT_IRQ7);
		if ((_0x362ddc & 0x1) !== 0) {
			_0x362ddc = _0x362ddc ^ 0x1;
			exports.dataMemory.set8(0, _0x362ddc, exports.dataMemory.INTERRUPT_IRQ7);
			if (exports.keyEventProcessor.isQueueEmpty() && !exports.keyEventProcessor.isPotentialAutoRepeat()) {
				exports.setLastKeyPressed(0);
			}
		}
		this.checkForInterrupt();
	}
	interp1() {
		var pc = this.pc;
		var operand = this.codeMemory.get16(pc);
		this.pc += 2;
		if (typeof this.operation[operand] === "function") {
			this.operation[operand](this, operand);
		} else {
			debugger;
		}
	}
	setLastKeyPressed(keycode) {
		if (keycode === 0x29 && this.isBusy) {
			let addr = this.dataMemory.get16(0, 0x102);
			let bitmask = 0x1 << this.dataMemory.get8(0, 0x104);
			let result = this.dataMemory.get8(0, addr) | bitmask;
			this.dataMemory.set8(0, result, addr);
		}
		this.keyEventProcessor.addKeyDown(keycode);
	}
	setLastKeyReleased(keycode) {
		this.keyEventProcessor.addKeyUp(keycode);
	}
	initUART() {
		return new Promise((_0x2c2f47, _0x1108f3) => {
			this.uartReady = _0x2c2f47;
		});
	}
	setTestAutomationBuffer(mem, val) {
		console.log(" Setting TA buffer...");
		let ta_buffer = new Promise((automationResolve, automationReject) => {
			if (typeof val !== "undefined") {
				if (val < 0xff) {
					this.dataMemory.set8(0, val, this.uartBufLenLocation);
				} else {
					console.log("Bad length designation.");
					automationReject();
				}
			}
			this.automationResolve = automationResolve;
			this.automationReject = automationReject;
			for (let addr in mem) {
				this.dataMemory.set8(0, mem[addr], this.uartStartAddress + parseInt(addr, 10));
			}
			this.setLastKeyPressed(0xff);
			this.setLastKeyReleased(0xff);
		});
		return ta_buffer;
	}
	getState() {
		let data_mem_size = this.DATA_MEMORY_SIZE + this.dataMemory.getNumOfTimers();
		let mem = new Uint8Array(data_mem_size + this.CODE_MEMORY_SIZE + this.REGISTERS_SIZE);
		let i = 0;
		mem[i++] = this.r0;
		mem[i++] = this.r1;
		mem[i++] = this.r2;
		mem[i++] = this.r3;
		mem[i++] = this.r4;
		mem[i++] = this.r5;
		mem[i++] = this.r6;
		mem[i++] = this.r7;
		mem[i++] = this.r8;
		mem[i++] = this.r9;
		mem[i++] = this.r10;
		mem[i++] = this.r11;
		mem[i++] = this.r12;
		mem[i++] = this.r13;
		mem[i++] = this.r14;
		mem[i++] = this.r15;
		mem[i++] = this.psw;
		mem[i++] = this.psw1;
		mem[i++] = this.psw2;
		mem[i++] = this.psw3;
		mem[i++] = this.dsr;
		mem[i++] = this.currentDSR;
		mem[i++] = this.ecsr;
		mem[i++] = this.lcsr;
		mem[i++] = this.ecsr1;
		mem[i++] = this.ecsr2;
		mem[i++] = this.ecsr3;
		mem[i++] = this.pendingEI;
		mem[i++] = this.ea & 0xff;
		mem[i++] = this.ea >> 8 & 0xff;
		mem[i++] = this.pc & 0xff;
		mem[i++] = this.pc >> 8 & 0xff;
		mem[i++] = this.sp & 0xff;
		mem[i++] = this.sp >> 8 & 0xff;
		mem[i++] = this.lr & 0xff;
		mem[i++] = this.lr >> 8 & 0xff;
		mem[i++] = this.elr1 & 0xff;
		mem[i++] = this.elr1 >> 8 & 0xff;
		mem[i++] = this.elr2 & 0xff;
		mem[i++] = this.elr2 >> 8 & 0xff;
		mem[i++] = this.elr3 & 0xff;
		mem[i++] = this.elr3 >> 8 & 0xff;
		mem.set(this.dataMemory.getState(), i);
		i += data_mem_size;
		mem.set(this.codeMemory.getSubArray(0, this.CODE_MEMORY_SIZE), i);
		return mem;
	}
	setState(mem) {
		let i = 0;
		this.r0 = mem[i++];
		this.r1 = mem[i++];
		this.r2 = mem[i++];
		this.r3 = mem[i++];
		this.r4 = mem[i++];
		this.r5 = mem[i++];
		this.r6 = mem[i++];
		this.r7 = mem[i++];
		this.r8 = mem[i++];
		this.r9 = mem[i++];
		this.r10 = mem[i++];
		this.r11 = mem[i++];
		this.r12 = mem[i++];
		this.r13 = mem[i++];
		this.r14 = mem[i++];
		this.r15 = mem[i++];
		this.psw = mem[i++];
		this.psw1 = mem[i++];
		this.psw2 = mem[i++];
		this.psw3 = mem[i++];
		this.dsr = mem[i++];
		this.currentDSR = mem[i++];
		this.ecsr = mem[i++];
		this.lcsr = mem[i++];
		this.ecsr1 = mem[i++];
		this.ecsr2 = mem[i++];
		this.ecsr3 = mem[i++];
		this.pendingEI = mem[i++];
		this.ea = mem[i++] | mem[i++] << 8;
		this.pc = this.ecsr << 16 | mem[i++] | mem[i++] << 8;
		this.sp = mem[i++] | mem[i++] << 8;
		this.lr = mem[i++] | mem[i++] << 8;
		this.elr1 = mem[i++] | mem[i++] << 8;
		this.elr2 = mem[i++] | mem[i++] << 8;
		this.elr3 = mem[i++] | mem[i++] << 8;
		let data_mem_size = this.DATA_MEMORY_SIZE + this.dataMemory.getNumOfTimers();
		this.dataMemory.setState(mem.subarray(i, i + data_mem_size));
		i += data_mem_size;
		this.codeMemory.setData(mem.subarray(i, i + this.CODE_MEMORY_SIZE));
	}
}
exports.NXU16_MCU = mcu;
