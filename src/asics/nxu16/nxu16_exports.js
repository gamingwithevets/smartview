'use strict';

Object.defineProperty(exports, "__esModule", {
	"value": true
});
const nxu16_memory = require("./nxu16_memory");
const nxu16_data_memory = require("./nxu16_data_memory");
const constants = require("../../emulators_ts/Constants");
const generic_keypad = require("../../emulators_ts/GenericKeypad");
class NXU16_MCU {
	constructor(obj) {
		this.DATA_MEMORY_SIZE = 0x40000;
		this.CODE_MEMORY_SIZE = 0x40000;
		this.REGISTERS_SIZE = 42;
		this.NXU16_MASK_C_FLAG = 128;
		this.NXU16_MASK_Z_FLAG = 64;
		this.NXU16_MASK_S_FLAG = 32;
		this.NXU16_MASK_OV_FLAG = 16;
		this.NXU16_MASK_MIE_FLAG = 8;
		this.NXU16_MASK_HC_FLAG = 4;
		this.NXU16_MASK_ELEVEL = 3;
		this.NXU16_MASK_DAA_FLAG = this.NXU16_MASK_C_FLAG | this.NXU16_MASK_Z_FLAG | this.NXU16_MASK_S_FLAG | this.NXU16_MASK_HC_FLAG;
		this.NXU16_PUSH_REGISTER_LIST_EA = 1;
		this.NXU16_PUSH_REGISTER_LIST_ELR = 2;
		this.NXU16_PUSH_REGISTER_LIST_PSW = 4;
		this.NXU16_PUSH_REGISTER_LIST_LR = 8;
		this.NXU16_POP_REGISTER_LIST_EA = 1;
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
		let opcode;
		this.codeMemory = new nxu16_memory.NXU16_Memory(this.CODE_MEMORY_SIZE);
		this.dataMemory = new nxu16_data_memory.NXU16_DataMemory(this.DATA_MEMORY_SIZE);
		this.pendingEI = 0;
		for (i = 0; i < 0x10; i++) {
			for (j = 0; j < 0x10; j++) {
				opcode = 0x8001 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.add_Rn_Rm;
				opcode = 0xf006 | i << 0x9 | j << 0x5;
				this.operation[opcode] = this.add_ERn_ERm;
				opcode = 0x8006 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.addc_Rn_Rm;
				opcode = 0x8002 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.and_Rn_Rm;
				opcode = 0x8008 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.sub_Rn_Rm;
				opcode = 0x8007 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.sub_Rn_Rm;
				opcode = 0x8005 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.subc_Rn_Rm;
				opcode = 0x8009 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.subc_Rn_Rm;
				opcode = 0x8000 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.mov_Rn_Rm;
				opcode = 0xf005 | i << 0x9 | j << 0x5;
				this.operation[opcode] = this.mov_ERn_ERm;
				opcode = 0x8003 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.or_Rn_Rm;
				opcode = 0x8004 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.xor_Rn_Rm;
				opcode = 0xf007 | i << 0x9 | j << 0x5;
				this.operation[opcode] = this.sub_ERn_ERm;
				opcode = 0x800a | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.sll_Rn_Rm;
				opcode = 0x800b | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.sllc_Rn_Rm;
				opcode = 0x800e | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.sra_Rn_Rm;
				opcode = 0x800c | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.srl_Rn_Rm;
				opcode = 0x800d | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.srlc_Rn_Rm;
				opcode = 0x9002 | i << 0x9 | j << 0x5;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0x9030 | (i & 0xf) << 8;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0x9050 | (i & 0xf) << 8;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xf004 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.mul_ERn_Rm;
				opcode = 0xf009 | (i & 0xf) << 8 | (j & 0xf) << 0x4;
				this.operation[opcode] = this.div_ERn_Rm;
			}
		}
		for (i = 0; i < 0x10; i++) {
			for (j = 0; j <= 0xff; j++) {
				opcode = 0x1000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.add_Rn_Imm8;
				opcode = 0x6000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.addc_Rn_Rm;
				opcode = 0x2000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.and_Rn_imm8;
				opcode = 0x7000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.sub_Rn_Rm;
				opcode = 0x5000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.subc_Rn_Rm;
				opcode = 0 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.mov_Rn_Rm;
				opcode = 0x3000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.or_Rn_Rm;
				opcode = 0x4000 | (i & 0xf) << 8 | j;
				this.operation[opcode] = this.xor_Rn_Rm;
				opcode = 0x900a | i << 8 | (j & 0x7) << 0x4;
				this.operation[opcode] = this.sll_Rn_Rm;
				opcode = 0x900b | i << 8 | (j & 0x7) << 0x4;
				this.operation[opcode] = this.sllc_Rn_Rm;
				opcode = 0x900e | i << 8 | (j & 0x7) << 0x4;
				this.operation[opcode] = this.sra_Rn_Rm;
				opcode = 0x900c | i << 8 | (j & 0x7) << 0x4;
				this.operation[opcode] = this.srl_Rn_Rm;
				opcode = 0x900d | i << 8 | (j & 0x7) << 0x4;
				this.operation[opcode] = this.srlc_Rn_Rm;
				opcode = 0x9032 | i << 0x9;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0x9052 | i << 0x9;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xe900 | j;
				this.operation[opcode] = this.mov_Rn_Rm;
			}
		}
		for (i = 0; i < 0x8; i++) {
			for (j = 0; j <= 0x7f; j++) {
				opcode = 0xe080;
				opcode |= i << 0x9;
				opcode |= j & 0x7f;
				this.operation[opcode] = this.add_ERn_imm7;
				opcode = 0xe000;
				opcode |= i << 0x9;
				opcode |= j & 0x7f;
				this.operation[opcode] = this.mov_ERn_ERm;
			}
		}
		for (i = 0; i < 0x8; i++) {
			for (j = 0; j < 0x8; j++) {
				opcode = 0x9003 | (i & 0x7) << 0x9 | (j & 0x7) << 0x5;
				this.operation[opcode] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i += 0x2) {
			for (j = 0; j < 0x10; j += 0x2) {
				opcode = 0xa008 | i << 8 | j << 0x4;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0x9012 | i << 8;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xa009 | i << 8 | j << 0x4;
				this.operation[opcode] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i += 0x2) {
			for (j = 0; j < 0x3f; j++) {
				opcode = 0xb000 | i << 8 | j;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xb040 | i << 8 | j;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xb080 | i << 8 | j;
				this.operation[opcode] = this.st_ERn_obj;
				opcode = 0xb0c0 | i << 8 | j;
				this.operation[opcode] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i++) {
			opcode = 0x9010 | i << 8;
			this.operation[opcode] = this.l_ERn_obj;
			opcode = 0x9011 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0xf000 | i << 8;
			this.operation[opcode] = this.b_cadr;
			opcode = 0xf001 | i << 8;
			this.operation[opcode] = this.b_cadr;
			for (j = 0; j <= 0x3f; j++) {
				opcode = 0xd000 | i << 8 | j;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xd040 | i << 8 | j;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0xd080 | i << 8 | j;
				this.operation[opcode] = this.st_ERn_obj;
				opcode = 0xd0c0 | i << 8 | j;
				this.operation[opcode] = this.st_ERn_obj;
			}
		}
		for (i = 0; i < 0x10; i++) {
			opcode = 0x900f | i << 0x4;
			this.operation[opcode] = this.use_DSR_fromRegister;
			opcode = 0x9031 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0x9051 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0xa00f | i << 0x4;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa00d | i << 8;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa005 | i << 8;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa00b | i << 0x4;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa01a | i << 8;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa00c | i << 0x4;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa007 | i << 8;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa004 | i << 8;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xa003 | i << 8;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xf04e | i << 8;
			this.operation[opcode] = this.push_obj;
			opcode = 0xf00e | i << 8;
			this.operation[opcode] = this.pop_obj;
			opcode = 0xf0ce | i << 8;
			this.operation[opcode] = this.push_obj;
			opcode = 0xf08e | i << 8;
			this.operation[opcode] = this.pop_obj;
			opcode = 0x801f | i << 8;
			this.operation[opcode] = this.daa_obj;
			opcode = 0x803f | i << 8;
			this.operation[opcode] = this.das_obj;
			opcode = 0x805f | i << 8;
			this.operation[opcode] = this.neg_obj;
			for (j = 0; j < 0x8; j++) {
				opcode = 0x9000 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0x9001 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[opcode] = this.st_ERn_obj;
				opcode = 0x9008 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[opcode] = this.l_ERn_obj;
				opcode = 0x9009 | (i & 0xf) << 8 | (j & 0x7) << 0x5;
				this.operation[opcode] = this.st_ERn_obj;
				opcode = 0xa000 | i << 8 | j << 0x4;
				this.operation[opcode] = this.sb_rn;
				opcode = 0xa080 | j << 0x4;
				this.operation[opcode] = this.sb_rn;
				opcode = 0xa082 | j << 0x4;
				this.operation[opcode] = this.rb_rn;
				opcode = 0xa002 | i << 8 | j << 0x4;
				this.operation[opcode] = this.rb_rn;
				opcode = 0xa001 | i << 8 | j << 0x4;
				this.operation[opcode] = this.tb_rn;
				opcode = 0xa081 | j << 0x4;
				this.operation[opcode] = this.tb_rn;
			}
		}
		for (i = 0; i < 0x10; i += 0x2) {
			opcode = 0x9033 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0x9013 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0x9053 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0xa10a | i << 0x4;
			this.operation[opcode] = this.mov_Rn_Rm;
			opcode = 0xf05e | i << 8;
			this.operation[opcode] = this.push_obj;
			opcode = 0xf01e | i << 8;
			this.operation[opcode] = this.pop_obj;
			opcode = 0xf00a | i << 0x4;
			this.operation[opcode] = this.lea_obj;
			opcode = 0xf00b | i << 0x4;
			this.operation[opcode] = this.lea_obj;
			opcode = 0x800f | i + 0x1 << 8 | i << 0x4;
			this.operation[opcode] = this.extbw_rn;
			opcode = 0xf002 | i << 0x4;
			this.operation[opcode] = this.b_cadr;
			opcode = 0xf003 | i << 0x4;
			this.operation[opcode] = this.b_cadr;
		}
		for (i = 0; i < 0x10; i += 0x4) {
			opcode = 0x9034 | i << 8;
			this.operation[opcode] = this.l_ERn_obj;
			opcode = 0x9054 | i << 8;
			this.operation[opcode] = this.l_ERn_obj;
			opcode = 0x9035 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0x9055 | i << 8;
			this.operation[opcode] = this.st_ERn_obj;
			opcode = 0xf06e | i << 8;
			this.operation[opcode] = this.push_obj;
			opcode = 0xf02e | i << 8;
			this.operation[opcode] = this.pop_obj;
		}
		for (i = 0; i <= 0xff; i++) {
			opcode = 0xe300 | i & 0xff;
			this.operation[opcode] = this.use_DSR;
			opcode = 0xe100 | i;
			this.operation[opcode] = this.add_SP_imm8;
			for (j = 0; j < 0x10; j++) {
				opcode = 0xc000 | j << 8 | i;
				this.operation[opcode] = this.b_conditional;
			}
		}
		for (i = 0; i <= 0x3f; i++) {
			opcode = 0xe500 | i;
			this.operation[opcode] = this.swi_snum;
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
		// INC [EA]
		this.operation[0xfe2f] = function (this_, opcode) { 
			let old_ea_val = this_.dataMemory.get8(this_.dsr, this_.ea);
			let new_ea_val = old_ea_val + 0x1 & 0xff;
			new_ea_val = this_.setFlagsFor8bitInc(this_, old_ea_val, 0x1, new_ea_val);
			this_.dataMemory.set8(this_.dsr, new_ea_val, this_.ea);
		};
		// DEC [EA]
		this.operation[0xfe3f] = function (this_, opcode) {
			let old_ea_val = this_.dataMemory.get8(this_.dsr, this_.ea);
			let new_ea_val = old_ea_val - 0x1;
			new_ea_val = this_.setFlagsFor8bitDec(this_, old_ea_val, 0x1, new_ea_val);
			this_.dataMemory.set8(this_.dsr, new_ea_val, this_.ea);
		};
		// NOP
		this.operation[0xfe8f] = function (this_, opcode) {};
		// EI
		this.operation[0xed08] = function (this_, _0x2bd513) {
			this_.psw |= this_.NXU16_MASK_MIE_FLAG;
			this_.pendingEI++;
		};
		// SC
		this.operation[0xed80] = function (this_, opcode) {
			this_.psw |= this_.NXU16_MASK_C_FLAG;
		};
		// RC
		this.operation[0xeb7f] = function (this_, opcode) {
			this_.psw &= ~this_.NXU16_MASK_C_FLAG;
		};
		// DI
		this.operation[0xebf7] = function (this_, opcode) {
			this_.psw &= ~this_.NXU16_MASK_MIE_FLAG;
		};
		// CPLC
		this.operation[0xfecf] = function (this_, opcode) {
			if ((this_.psw & this_.NXU16_MASK_C_FLAG) === 0) {
				this_.psw |= this_.NXU16_MASK_C_FLAG;
			} else {
				this_.psw &= ~this_.NXU16_MASK_C_FLAG;
			}
		};
		// RTI
		this.operation[0xfe0f] = function (this_, opcode) {
			this_.ecsr = this_.getECSRForELevel(this_);
			this_.pc = this_.ecsr << 16 | this_.getELRForELevel(this_);
			this_.psw = this_.getEPSWForELevel(this_);
		};
		// RT
		this.operation[0xfe1f] = function (this_, opcode) {
			this_.ecsr = this_.lcsr;
			this_.pc = this_.ecsr << 16 | this_.lr;
		};
		if (obj && obj.parent) {
			this.parent = obj.parent;
		}
		this.isBusy = true;
	}
	getStack(this_) {
		let stack = [];
		for (let i = -1; i < 10; i++) {
			stack.push(this_.dataMemory.get16(0, this_.sp + 2 * i).toString(16));
		}
		return "Stack contents: [" + stack.join(", ") + "]";
	}
	initialize(size) {
		this.codeMemory.setData(size);
		this.dataMemory.setData(size);
		this.resetAll(this);
		this.dataMemory.resetRegisters();
		this.sp = this.codeMemory.get16(0);
		this.pc = this.codeMemory.get16(2);
	}
	resetAll(this_) {
		this_.r0 = 0;
		this_.r1 = 0;
		this_.r2 = 0;
		this_.r3 = 0;
		this_.r4 = 0;
		this_.r5 = 0;
		this_.r6 = 0;
		this_.r7 = 0;
		this_.r8 = 0;
		this_.r9 = 0;
		this_.r10 = 0;
		this_.r11 = 0;
		this_.r12 = 0;
		this_.r13 = 0;
		this_.r14 = 0;
		this_.r15 = 0;
		this_.psw = 0;
		this_.psw1 = 0;
		this_.psw2 = 0;
		this_.psw3 = 0;
		this_.ea = 0;
		this_.pc = 0;
		this_.sp = 0;
		this_.dsr = 0;
		this_.currentDSR = 0;
		this_.ecsr = 0;
		this_.lcsr = 0;
		this_.ecsr1 = 0;
		this_.ecsr2 = 0;
		this_.ecsr3 = 0;
		this_.lr = 0;
		this_.elr1 = 0;
		this_.elr2 = 0;
		this_.elr3 = 0;
		this_.pendingEI = 0;
	}
	isCSet(this_) {
		return (this_.psw & this_.NXU16_MASK_C_FLAG) !== 0;
	}
	setC(this_, bit) {
		if (bit) {
			this_.psw |= this_.NXU16_MASK_C_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_C_FLAG;
		}
	}
	isZSet(this_) {
		return (this_.psw & this_.NXU16_MASK_Z_FLAG) !== 0;
	}
	setZ(this_, bit) {
		if (bit) {
			this_.psw |= this_.NXU16_MASK_Z_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
		}
	}
	isSSet(this_) {
		return (this_.psw & this_.NXU16_MASK_S_FLAG) !== 0;
	}
	setS(this_, bit) {
		if (bit) {
			this_.psw |= this_.NXU16_MASK_S_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_S_FLAG;
		}
	}
	isOVSet(this_) {
		return (this_.psw & this_.NXU16_MASK_OV_FLAG) !== 0;
	}
	setOV(this_, bit) {
		if (bit) {
			this_.psw |= this_.NXU16_MASK_OV_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_OV_FLAG;
		}
	}
	isHCSet(this_) {
		return (this_.psw & this_.NXU16_MASK_HC_FLAG) !== 0;
	}
	setHC(this_, bit) {
		if (bit) {
			this_.psw |= this_.NXU16_MASK_HC_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_HC_FLAG;
		}
	}
	isMIESet(this_) {
		return (this_.psw & this_.NXU16_MASK_MIE_FLAG) !== 0;
	}
	setMIE(this_, bit) {
		if (bit) {
			this_.psw |= this_.NXU16_MASK_MIE_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_MIE_FLAG;
		}
	}
	getECSRForELevel(this_) {
		switch (this_.psw & 3) {
			case 0:
				return this_.ecsr;
			case 1:
				return this_.ecsr1;
			case 2:
				return this_.ecsr2;
			case 3:
				return this_.ecsr3;
		}
	}
	setECSRForELevel(this_, val) {
		switch (this_.psw & 3) {
			case 0:
				this_.ecsr = val;
				break;
			case 1:
				this_.ecsr1 = val;
				break;
			case 2:
				this_.ecsr2 = val;
				break;
			case 3:
				this_.ecsr3 = val;
				break;
		}
	}
	getELRForELevel(this_) {
		switch (this_.psw & 3) {
			case 0:
				return this_.lr;
			case 1:
				return this_.elr1;
			case 2:
				return this_.elr2;
			case 3:
				return this_.elr3;
		}
	}
	setELRForELevel(this_, val) {
		switch (this_.psw & 3) {
			case 0:
				this_.lr = val;
				break;
			case 1:
				this_.elr1 = val;
				break;
			case 2:
				this_.elr2 = val;
				break;
			case 3:
				this_.elr3 = val;
				break;
		}
	}
	getEPSWForELevel(this_) {
		switch (this_.psw & 3) {
			case 0:
				return this_.psw;
			case 1:
				return this_.psw1;
			case 2:
				return this_.psw2;
			case 3:
				return this_.psw3;
		}
	}
	setEPSWForELevel(this_, val) {
		switch (this_.psw & 3) {
			case 0:
				this_.psw = val;
				break;
			case 1:
				this_.psw1 = val;
				break;
			case 2:
				this_.psw2 = val;
				break;
			case 3:
				this_.psw3 = val;
				break;
		}
	}
	getInterruptHandlerAddress(this_, idx, enable) {
		const dataMemory = this_.dataMemory;
		var ie = dataMemory.get8(this_.dsr, dataMemory.INTERRUPT_IE0 + idx);
		var irq = dataMemory.get8(this_.dsr, dataMemory.INTERRUPT_IRQ0 + idx);
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
		return this_.codeMemory.get16(2 * (8 * idx + i));
	}
	get8BitRegister(this_, n) {
		switch (n) {
			case 0:
				return this_.r0;
			case 1:
				return this_.r1;
			case 2:
				return this_.r2;
			case 3:
				return this_.r3;
			case 4:
				return this_.r4;
			case 5:
				return this_.r5;
			case 6:
				return this_.r6;
			case 7:
				return this_.r7;
			case 8:
				return this_.r8;
			case 9:
				return this_.r9;
			case 10:
				return this_.r10;
			case 11:
				return this_.r11;
			case 12:
				return this_.r12;
			case 13:
				return this_.r13;
			case 14:
				return this_.r14;
			case 15:
				return this_.r15;
		}
	}
	get16BitRegister(this_, n) {
		switch (n) {
			case 0:
				return this_.r0 | this_.r1 << 8;
			case 1:
				return this_.r1 | this_.r2 << 8;
			case 2:
				return this_.r2 | this_.r3 << 8;
			case 3:
				return this_.r3 | this_.r4 << 8;
			case 4:
				return this_.r4 | this_.r5 << 8;
			case 5:
				return this_.r5 | this_.r6 << 8;
			case 6:
				return this_.r6 | this_.r7 << 8;
			case 7:
				return this_.r7 | this_.r8 << 8;
			case 8:
				return this_.r8 | this_.r9 << 8;
			case 9:
				return this_.r9 | this_.r10 << 8;
			case 10:
				return this_.r10 | this_.r11 << 8;
			case 11:
				return this_.r11 | this_.r12 << 8;
			case 12:
				return this_.r12 | this_.r13 << 8;
			case 13:
				return this_.r13 | this_.r14 << 8;
			case 14:
				return this_.r14 | this_.r15 << 8;
			case 15:
				return this_.r15 | this_.r0 << 8;
		}
	}
	get32BitRegister(this_, n) {
		switch (n) {
			case 0:
				return this_.r0 | this_.r1 << 8 | this_.r2 << 16 | this_.r3 << 24;
			case 4:
				return this_.r4 | this_.r5 << 8 | this_.r6 << 16 | this_.r7 << 24;
			case 8:
				return this_.r8 | this_.r9 << 8 | this_.r10 << 16 | this_.r11 << 24;
			case 12:
				return this_.r12 | this_.r13 << 8 | this_.r14 << 16 | this_.r15 << 24;
				;
		}
	}
	get64BitRegister(this_, n) {
		let int32_0;
		let int32_1;
		switch (n) {
			case 0:
				int32_0 = this_.r0 | this_.r1 << 8 | this_.r2 << 16 | this_.r3 << 24;
				int32_1 = this_.r4 | this_.r5 << 8 | this_.r6 << 16 | this_.r7 << 24;
				break;
			case 8:
				int32_0 = this_.r8 | this_.r9 << 8 | this_.r10 << 16 | this_.r11 << 24;
				int32_1 = this_.r12 | this_.r13 << 8 | this_.r14 << 16 | this_.r15 << 24;
				break;
		}
		return [int32_0, int32_1];
	}
	get16BitRegisterReverse(this_, n) {
		switch (n) {
			case 0:
				return this_.r15 | this_.r0 << 8;
			case 0x1:
				return this_.r0 | this_.r1 << 8;
			case 0x2:
				return this_.r1 | this_.r2 << 8;
			case 0x3:
				return this_.r2 | this_.r3 << 8;
			case 0x4:
				return this_.r3 | this_.r4 << 8;
			case 0x5:
				return this_.r4 | this_.r5 << 8;
			case 0x6:
				return this_.r5 | this_.r6 << 8;
			case 0x7:
				return this_.r6 | this_.r7 << 8;
			case 0x8:
				return this_.r7 | this_.r8 << 8;
			case 0x9:
				return this_.r8 | this_.r9 << 8;
			case 0xa:
				return this_.r9 | this_.r10 << 8;
			case 0xb:
				return this_.r10 | this_.r11 << 8;
			case 0xc:
				return this_.r11 | this_.r12 << 8;
			case 0xd:
				return this_.r12 | this_.r13 << 8;
			case 0xe:
				return this_.r13 | this_.r14 << 8;
			case 0xf:
				return this_.r14 | this_.r15 << 8;
		}
	}
	setOperationResult8bit(this_, n, result) {
		switch (n) {
			case 0:
				this_.r0 = result;
				break;
			case 1:
				this_.r1 = result;
				break;
			case 2:
				this_.r2 = result;
				break;
			case 3:
				this_.r3 = result;
				break;
			case 4:
				this_.r4 = result;
				break;
			case 5:
				this_.r5 = result;
				break;
			case 6:
				this_.r6 = result;
				break;
			case 7:
				this_.r7 = result;
				break;
			case 8:
				this_.r8 = result;
				break;
			case 9:
				this_.r9 = result;
				break;
			case 10:
				this_.r10 = result;
				break;
			case 11:
				this_.r11 = result;
				break;
			case 12:
				this_.r12 = result;
				break;
			case 13:
				this_.r13 = result;
				break;
			case 14:
				this_.r14 = result;
				break;
			case 15:
				this_.r15 = result;
				break;
		}
	}
	setOperationResult16bit(this_, n, result) {
		switch (n) {
			case 0:
				this_.r0 = result & 0xff;
				this_.r1 = result >> 8 & 0xff;
				break;
			case 2:
				this_.r2 = result & 0xff;
				this_.r3 = result >> 8 & 0xff;
				break;
			case 4:
				this_.r4 = result & 0xff;
				this_.r5 = result >> 8 & 0xff;
				break;
			case 6:
				this_.r6 = result & 0xff;
				this_.r7 = result >> 8 & 0xff;
				break;
			case 8:
				this_.r8 = result & 0xff;
				this_.r9 = result >> 8 & 0xff;
				break;
			case 0xa:
				this_.r10 = result & 0xff;
				this_.r11 = result >> 8 & 0xff;
				break;
			case 0xc:
				this_.r12 = result & 0xff;
				this_.r13 = result >> 8 & 0xff;
				break;
			case 0xe:
				this_.r14 = result & 0xff;
				this_.r15 = result >> 8 & 0xff;
				break;
		}
	}
	setOperationResult32bit(this_, n, result) {
		switch (n) {
			case 0:
				this_.r0 = result & 0xff;
				this_.r1 = result >> 8 & 0xff;
				this_.r2 = result >> 16 & 0xff;
				this_.r3 = result >> 24 & 0xff;
				break;
			case 4:
				this_.r4 = result & 0xff;
				this_.r5 = result >> 8 & 0xff;
				this_.r6 = result >> 16 & 0xff;
				this_.r7 = result >> 24 & 0xff;
				break;
			case 8:
				this_.r8 = result & 0xff;
				this_.r9 = result >> 8 & 0xff;
				this_.r10 = result >> 16 & 0xff;
				this_.r11 = result >> 24 & 0xff;
				break;
			case 0xc:
				this_.r12 = result & 0xff;
				this_.r13 = result >> 8 & 0xff;
				this_.r14 = result >> 16 & 0xff;
				this_.r15 = result >> 24 & 0xff;
				break;
		}
	}
	setOperationResult64bit(this_, n, result0, result1) {
		switch (n) {
			case 0:
				this_.r0 = result0 & 0xff;
				this_.r1 = result0 >> 8 & 0xff;
				this_.r2 = result0 >> 16 & 0xff;
				this_.r3 = result0 >> 24 & 0xff;
				this_.r4 = result1 & 0xff;
				this_.r5 = result1 >> 8 & 0xff;
				this_.r6 = result1 >> 16 & 0xff;
				this_.r7 = result1 >> 24 & 0xff;
				break;
			case 8:
				this_.r8 = result0 & 0xff;
				this_.r9 = result0 >> 8 & 0xff;
				this_.r10 = result0 >> 16 & 0xff;
				this_.r11 = result0 >> 24 & 0xff;
				this_.r12 = result1 & 0xff;
				this_.r13 = result1 >> 8 & 0xff;
				this_.r14 = result1 >> 16 & 0xff;
				this_.r15 = result1 >> 24 & 0xff;
				break;
		}
	}
	setFlagsFor8bitAdd(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_C_FLAG | this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (result > 0xff) {
			psw |= this_.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((result ^ op0 ^ op1) & 0x10) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if (!((op0 ^ op1) & 0x80) && (op1 ^ result) & 0x80) {
			psw |= this_.NXU16_MASK_OV_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor8bitAddc(this_, op0, op1, result, zero) {
		let psw = this_.psw & ~(this_.NXU16_MASK_C_FLAG | this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (result > 0xff) {
			psw |= this_.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (zero && result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((result ^ op0 ^ op1) & 0x10) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if (!((op0 ^ op1) & 0x80) && (op1 ^ result) & 0x80) {
			psw |= this_.NXU16_MASK_OV_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setZeroAndSignFlags_8bit(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor8bitSub(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_C_FLAG | this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (result < 0) {
			psw |= this_.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= this_.NXU16_MASK_OV_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor8bitSubc(this_, op0, op1, result, zero) {
		let psw = this_.psw & ~(this_.NXU16_MASK_C_FLAG | this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (result < 0) {
			psw |= this_.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (zero && result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= this_.NXU16_MASK_OV_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor16bitAdd(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_C_FLAG | this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (result > 0xffff) {
			psw |= this_.NXU16_MASK_C_FLAG;
			result &= 0xffff;
		}
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((op1 & 0xfff) + (op0 & 0xfff) > 0xfff) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if (((op0 ^ op1) & 0x8000) === 0) {
			if (((op1 ^ result) & 0x8000) !== 0) {
				psw |= this_.NXU16_MASK_OV_FLAG;
			}
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor8bitInc(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((op1 & 0xf) + (op0 & 0xf) > 0xf) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if (((op0 ^ op1) & 0x80) === 0) {
			if (((op1 ^ result) & 0x80) !== 0) {
				psw |= this_.NXU16_MASK_OV_FLAG;
			}
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor16bitSub(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_C_FLAG | this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		if (op1 > op0) {
			psw |= this_.NXU16_MASK_C_FLAG;
		}
		result &= 0xffff;
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xfff) - (op1 & 0xfff) & -4096) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x8000 && ((op1 ^ result) & 0x8000) === 0) {
			psw |= this_.NXU16_MASK_OV_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setFlagsFor8bitDec(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG | this_.NXU16_MASK_OV_FLAG | this_.NXU16_MASK_HC_FLAG);
		result &= 0xff;
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= this_.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= this_.NXU16_MASK_OV_FLAG;
		}
		this_.psw = psw;
		return result;
	}
	setZeroAndSignFlags_16bit(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		this_.psw = psw;
		return result & 0xffff;
	}
	setZeroAndSignFlags_32bit(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80000000) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		this_.psw = psw;
		return result & 0xffffffff;
	}
	setZeroAndSignFlags_64bit(this_, op0, op1, result) {
		let psw = this_.psw & ~(this_.NXU16_MASK_Z_FLAG | this_.NXU16_MASK_S_FLAG);
		if (op0 === 0 && op1 === 0) {
			psw |= this_.NXU16_MASK_Z_FLAG;
		} else if (op1 & 0x80000000) {
			psw |= this_.NXU16_MASK_S_FLAG;
		}
		this_.psw = psw;
	}
	callScreenChanged(this_, addr) {
		if (this_.parent !== null) {
			let screen = this.dataMemory.getSubArray(addr, addr + 0x600);
			this_.parent.notifyScreenListeners(screen);
		}
	}
	callTopIconsChanged(this_, addr) {
		if (this_.parent !== null) {
			let sbar = this.dataMemory.get32(0, addr);
			this.is2ndMode = (sbar & 2) !== 0;
			this_.parent.notifyTopIconScreenListeners(sbar);
		}
	}
	add_Rn_Rm(this_, opcode) {
		let result;
		let op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
		let op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		
		result = op0 + op1;
		result = this_.setFlagsFor8bitAdd(this_, op0, op1, result);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	addc_Rn_Rm(this_, opcode) {
		let result;
		let zero = (this_.psw & this_.NXU16_MASK_Z_FLAG) !== 0;
		let op1;
		let op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
		if ((opcode & 0xf000) === 0x6000) {
			// ADDC Rn, #imm8
			op1 = opcode & 0xff;
		} else {
			// ADDC Rn, Rm
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		}
		if ((this_.psw & this_.NXU16_MASK_C_FLAG) !== 0) {
			result = op0 + op1 + 0x1;
		} else {
			result = op0 + op1;
		}
		result = this_.setFlagsFor8bitAddc(this_, op0, op1, result, zero);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	add_Rn_Imm8(this_, opcode) {
		let op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
		
		let op1 = opcode & 0xff;
		let result;
		if ((opcode & 0x6000) !== 0 && (this_.psw & this_.NXU16_MASK_C_FLAG) !== 0) {
			// add carry (unused)
			result = op0 + op1 + 1;
		} else {
			result = op0 + op1;
		}
		result = this_.setFlagsFor8bitAdd(this_, op0, op1, result);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	add_ERn_ERm(this_, opcode) {
		let op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
		let op1 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
		
		let result = op0 + op1;
		result = this_.setFlagsFor16bitAdd(this_, op0, op1, result);
		this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
	}
	add_ERn_imm7(this_, opcode) {
		let op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xe);
		let op1 = opcode & 0x7f;
		if ((op1 & 0x40) === 0) {
			op1 &= 0x3f;
		} else {
			op1 |= 0xffc0;
		}
		let result = op0 + op1;
		result = this_.setFlagsFor16bitAdd(this_, op0, op1, result);
		this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
	}
	and_Rn_Rm(this_, opcode) {
		let op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
		let op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		let result = op0 & op1;
		result = this_.setZeroAndSignFlags_8bit(this_, op0, op1, result);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	and_Rn_imm8(this_, opcode) {
		let result;
		let op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
		let op1 = opcode & 0xff;
		result = op0 & op1;
		result = this_.setZeroAndSignFlags_8bit(this_, op0, op1, result);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	sub_Rn_Rm(this_, opcode) {
		let result;
		let obj_check = opcode & 0xf00f;
		let op0;
		let op1;
		if ((obj_check & 0xf000) === 0x7000) {
			// CMP/SUB Rn, #imm8
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode & 0xff;
		} else {
			// CMP/SUB Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		}
		result = op0 - op1;
		result = this_.setFlagsFor8bitSub(this_, op0, op1, result);
		if (obj_check === 0x8008) {
			// SUB
			this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
		}
	}
	subc_Rn_Rm(this_, opcode) {
		let result;
		let obj_check = opcode & 0xf00f;
		let op0;
		let op1;
		let carry = (this_.psw & this_.NXU16_MASK_C_FLAG) !== 0;
		let zero = (this_.psw & this_.NXU16_MASK_Z_FLAG) !== 0;
		if ((obj_check & 0xf000) === 0x5000 || (obj_check & 0xf000) === 0x7000) {
			// CMPC/SUBC Rn, #imm8
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode & 0xff;
		} else {
			// CMPC/SUBC Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 0x4 & 0xf);
		}
		result = op0 - op1 - (carry ? 0x1 : 0);
		result = this_.setFlagsFor8bitSubc(this_, op0, op1, result, zero);
		if (obj_check === 0x8009) {
			// SUBC
			this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
		}
	}
	mov_Rn_Rm(this_, opcode) {
		let result;
		let obj_check = opcode & 0xf00f;
		let op0;
		let op1;
		if (obj_check >> 12 === 0) {
			// MOV Rn, #imm8
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode & 0xff;
		} else if (obj_check === 0xa00f) {
			// MOV ECSR, Rm
			op0 = this_.getECSRForELevel(this_);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		} else if (obj_check === 0xa00d) {
			// MOV ELR, Rm
			op0 = this_.getELRForELevel(this_);
			op1 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
		} else if (obj_check === 0xa00c) {
			// MOV EPSW, Rm
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		} else if (obj_check === 0xa005) {
			// MOV ERn, ELR
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.getELRForELevel(this_);
		} else if (obj_check === 0xa00b) {
			// MOV PSW, Rm
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		} else if (obj_check === 0xa007) {
			// MOV Rn, ECSR
			op1 = this_.getECSRForELevel(this_);
		} else if (obj_check === 0xa004) {
			// MOV Rn, EPSW
			op1 = this_.getEPSWForELevel(this_);
		} else if (obj_check === 0xa003) {
			// MOV Rn, PSW
			op1 = this_.psw;
		} else if ((opcode & 0xf0ff) === 0xa01a) {
			// MOV ERn, SP
			op1 = this_.sp;
		} else if ((opcode & 0xff00) === 0xe900) {
			// MOV PSW, #unsigned8
			op1 = opcode & 0xff;
		} else if ((opcode & 0xff0f) === 0xa10a) {
			// MOV SP, ERm
			op1 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
		} else {
			// MOV Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		}
		result = op1;
		if (obj_check === 0xa00f) {
			// MOV ECSR, Rm
			result &= 0xf;
			this_.setECSRForELevel(this_, result);
		} else if (obj_check === 0xa00d) {
			// MOV ELR, Rm
			this_.setELRForELevel(this_, result);
		} else if (obj_check === 0xa00c) {
			// MOV EPSW, Rm
			this_.setEPSWForELevel(this_, result);
		} else if (obj_check === 0xa00b || (opcode & 0xff00) === 0xe900) {
			// MOV PSW, Rm
			this_.psw = result;
		} else if ((opcode & 0xf0ff) === 0xa01a || obj_check === 0xa005) {
			// MOV ERn, obj
			this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
		} else if (obj_check === 0xa003 || obj_check === 0xa007 || obj_check === 0xa004) {
			// MOV Rn, obj
			this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
		} else if ((opcode & 0xff0f) === 0xa10a) {
			// MOV SP, ERm
			this_.sp = result & 0xfffe;
		} else {
			// MOV Rn, Rm
			result = this_.setZeroAndSignFlags_8bit(this_, op0, op1, result);
			this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
		}
	}
	mov_ERn_ERm(this_, opcode) {
		let op0;
		let op1;
		if ((opcode & 0xf00f) === 0xf005) {
			// MOV ERn, ERm
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
		} else {
			// MOV ERn, #imm7
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xe);
			op1 = opcode & 0x7f;
		}
		if ((opcode & 0xf000) === 0xe000 && (op1 & 0x40) !== 0) {
			// #imm7 mask
			op1 |= 0xff80;
		}
		let result = op0 = op1;
		result = this_.setZeroAndSignFlags_16bit(this_, op0, op1, result);
		this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
	}
	or_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let result;
		if ((opcode & 0xf00f) === 0x8003) {
			// OR Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		} else {
			// OR Rn, #imm8
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode & 0xff;
		}
		result = op0 | op1;
		result = this_.setZeroAndSignFlags_8bit(this_, op0, op1, result);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	xor_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let result;
		if ((opcode & 0xf00f) === 0x8004) {
			// XOR Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		} else {
			// XOR Rn, #imm8
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode & 0xff;
		}
		result = op0 ^ op1;
		result = this_.setZeroAndSignFlags_8bit(this_, op0, op1, result);
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	sub_ERn_ERm(this_, opcode) {
		let op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
		let op1 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
		let result = op0 - op1;
		result = this_.setFlagsFor16bitSub(this_, op0, op1, result);
	}
	sll_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let result;
		if ((opcode & 0xf00f) === 0x800a) {
			// SLL Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf) & 7;
		} else {
			// SLL Rn, #width
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode >> 4 & 7;
		}
		result = op0 << op1;
		if (op1 > 0) {
			if ((result & 0x100) !== 0) {
				this_.psw |= this_.NXU16_MASK_C_FLAG;
			} else {
				this_.psw &= ~this_.NXU16_MASK_C_FLAG;
			}
		}
		result &= 0xff;
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	sllc_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let result;
		if ((opcode & 0xf00f) === 0x800b) {
			// SLLC Rn, Rm
			op0 = this_.get16BitRegisterReverse(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf) & 7;
		} else {
			// SLLC Rn, #width
			op0 = this_.get16BitRegisterReverse(this_, opcode >> 8 & 0xf);
			op1 = opcode >> 4 & 7;
		}
		result = op0 << op1;
		if (op1 > 0) {
			if ((result & 0x10000) !== 0) {
				this_.psw |= this_.NXU16_MASK_C_FLAG;
			} else {
				this_.psw &= ~this_.NXU16_MASK_C_FLAG;
			}
		}
		result = (result & 0xff00) >> 8;
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	sra_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let bit;
		let result;
		if ((opcode & 0xf00f) === 0x800e) {
			// SRA Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf) & 7;
		} else {
			// SRA Rn, #width
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode >> 4 & 7;
		}
		bit = op0 & 0x80;
		for (let i = 0; i < op1; i++) {
			bit |= bit >> 0x1;
		}
		result = op0 >> op1;
		result |= bit;
		if (op1 > 0) {
			op1 = op1 - 0x1;
			this_.setC(this_, false);
			this_.psw |= (op0 >> op1 & 1) << 7;
		}
		result &= 0xff;
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	srl_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let result;
		if ((opcode & 0xf00f) === 0x800c) {
			// SRL Rn, Rm
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf) & 7;
		} else {
			// SRL Rn, #width
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode >> 4 & 7;
		}
		result = op0 >> op1;
		if (op1 > 0) {
			op1 = op1 - 1;
			if (op0 >> op1 & 1) {
				this_.setC(this_, true);
			} else {
				this_.setC(this_, false);
			}
		}
		result &= 0xff;
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	srlc_Rn_Rm(this_, opcode) {
		let op0;
		let op1;
		let result;
		if ((opcode & 0xf00f) === 0x800d) {
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get8BitRegister(this_, opcode >> 4 & 0xf) & 7;
		} else {
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = opcode >> 4 & 7;
		}
		result = op0 >> op1;
		if (op1 > 0) {
			op1 = op1 - 0x1;
			if (op0 >> op1 & 0x1) {
				this_.setC(this_, true);
			} else {
				this_.setC(this_, false);
			}
		}
		result &= 0xff;
		this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
	}
	l_ERn_obj(this_, opcode) {
		let op0;
		let op1;
		let ea_inc;
		let obj_check = opcode & 0xf0ff;
		let result;
		if (obj_check === 0x9032) {
			// L ERn, [EA]
			op1 = this_.dataMemory.get16(this_.dsr, this_.ea & 0xfffe);
		} else if (obj_check === 0x9052) {
			// L ERn, [EA+]
			this_.ea &= 0xfffe;
			op1 = this_.dataMemory.get16(this_.dsr, this_.ea);
			ea_inc = 2;
		} else if (obj_check === 0x9012) {
			// L ERn, Dadr
			op0 = this_.codeMemory.get16(this_.pc);
			op1 = this_.dataMemory.get16(this_.dsr, op0 & 0xffff);
			this_.pc += 2;
		} else if ((opcode & 0xf00f) === 0x9002) {
			// L ERn, [ERm]
			let op0 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			op0 &= 0xfffe;
			op1 = this_.dataMemory.get16(this_.dsr, op0);
		} else if (obj_check === 0x9030 || obj_check === 0x9050) {
			// L Rn, [EA(+)]
			op1 = this_.dataMemory.get8(this_.dsr, this_.ea);
			ea_inc = 1;
		} else if (obj_check === 0x9010) {
			// L Rn, Dadr
			op0 = this_.codeMemory.get16(this_.pc);
			op1 = this_.dataMemory.get8(this_.dsr, op0);
			this_.pc += 2;
		} else if ((opcode & 0xf00f) === 0x9000) {
			// L Rn, [ERm]
			let op0 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			op1 = this_.dataMemory.get16(this_.dsr, op0);
		} else if (obj_check === 0x9034) {
			// L XRn, [EA]
			op1 = this_.dataMemory.get32(this_.dsr, this_.ea & 0xfffe);
			ea_inc = 4;
		} else if (obj_check === 0x9054) {
			// L XRn, [EA+]
			this_.ea &= 0xfffe;
			op1 = this_.dataMemory.get32(this_.dsr, this_.ea);
			ea_inc = 4;
		} else if (obj_check === 0x9036) {
			// L QRn, [EA]
			let op0 = this_.dataMemory.get64(this_.dsr, this_.ea & 0xfffe);
			op0 = op0[0];
			op1 = op0[1];
			ea_inc = 8;
		} else if (obj_check === 0x9056) {
			// L QRn, [EA+]
			this_.ea &= 0xfffe;
			let op0 = this_.dataMemory.get64(this_.dsr, this_.ea);
			op0 = op0[0];
			op1 = op0[1];
			ea_inc = 8;
		} else if ((opcode & 0xf00f) === 0xa008) {
			// L ERn, Disp16[ERm]
			let erm = this_.get16BitRegister(this_, opcode >> 0x4 & 0xf);
			op0 = this_.codeMemory.get16(this_.pc);
			erm = erm + op0 & 0xfffe;
			op1 = this_.dataMemory.get16(this_.dsr, erm);
			this_.pc += 0x2;
		} else if ((opcode & 0xf0c0) === 0xb040) {
			// L ERn, Disp16[FP]
			let fp = this_.get16BitRegister(this_, 14);
			op0 = opcode & 0x3f;
			if ((op0 & 0x20) !== 0) {
				op0 |= 0xffffffe0;
			}
			fp = fp + op0 & 0xfffe;
			op1 = this_.dataMemory.get16(this_.dsr, fp);
		} else if ((opcode & 0xf0c0) === 0xd040) {
			// L Rn, Disp16[FP]
			let fp = this_.get16BitRegister(this_, 14);
			op0 = opcode & 0x3f;
			if ((op0 & 0x20) !== 0) {
				op0 |= 0xffffffe0;
			}
			fp = fp + op0 & 0xffff;
			op1 = this_.dataMemory.get8(this_.dsr, fp);
		} else if ((opcode & 0xf000) === 0xb000) {
			// L ERn, Disp6[BP]
			let bp = this_.get16BitRegister(this_, 12);
			op0 = opcode & 0x3f;
			if ((op0 & 0x20) !== 0) {
				op0 |= 0xffffffe0;
			}
			bp = bp + op0 & 0xfffe;
			op1 = this_.dataMemory.get16(this_.dsr, bp);
		} else if ((opcode & 0xf000) === 0xd000) {
			// L Rn, Disp6[BP]
			let bp = this_.get16BitRegister(this_, 12);
			op0 = opcode & 0x3f;
			if ((op0 & 0x20) !== 0) {
				op0 |= 0xffffffe0;
			}
			bp = bp + op0 & 0xffff;
			op1 = this_.dataMemory.get8(this_.dsr, bp);
		} else if ((opcode & 0xf00f) === 0x9008) {
			// L Rn, Disp16[ERm]
			let erm = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			op0 = this_.codeMemory.get16(this_.pc);
			erm = erm + op0 & 0xffff;
			op1 = this_.dataMemory.get8(this_.dsr, erm);
			this_.pc += 2;
		}
		result = op1;
		if (obj_check === 0x9032 || obj_check === 0x9052 || (opcode & 0xf00f) === 0x9002 || (opcode & 0xf00f) === 0xa008 || (opcode & 0xf0c0) === 0xb040 || (opcode & 0xf000) === 0xb000) {
			// L ERn, obj
			result = this_.setZeroAndSignFlags_16bit(this_, op0, op1, result);
			this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
		} else if (obj_check === 0x9030 || obj_check === 0x9050 || (opcode & 0xf00f) === 0x9000 || obj_check === 0x9010 || obj_check === 0x9012 || (opcode & 0xf00f) === 0x9008 || (opcode & 0xf000) === 0xd000 || (opcode & 0xf0c0) === 0xd040) {
			// L Rn, obj / L ERn, Dadr
			result &= 0xff;
			result = this_.setZeroAndSignFlags_8bit(this_, op0, op1, result);
			this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, result);
		} else if (obj_check === 0x9034 || obj_check === 0x9054) {
			// L XRn, obj
			result = this_.setZeroAndSignFlags_32bit(this_, op0, op1, result);
			this_.setOperationResult32bit(this_, opcode >> 8 & 0xf, result);
		} else if (obj_check === 0x9036 || obj_check === 0x9056) {
			// L QRn, obj
			this_.setZeroAndSignFlags_64bit(this_, op0, op1, result);
			this_.setOperationResult64bit(this_, opcode >> 8 & 0xf, op0, op1);
		}
		if (obj_check === 0x9052 || obj_check === 0x9050 || obj_check === 0x9054 || obj_check === 0x9056) {
			// Increment EA
			this_.ea += ea_inc;
		}
	}
	st_ERn_obj(this_, opcode) {
		let op0;
		let op1;
		let obj_check = opcode & 0xf0ff;
		let ea_inc;
		if (obj_check === 0x9033) {
			// ST ERn, [EA]
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.ea & 0xfffe;
			ea_inc = 2;
		} else if (obj_check === 0x9053) {
			// ST ERn, [EA+]
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			this_.ea &= 0xfffe;
			op1 = this_.ea;
			ea_inc = 2;
		} else if (obj_check === 0x9013) {
			// ST ERn, Dadr
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.codeMemory.get16(this_.pc);
			ea_inc = 2;
			this_.pc += 2;
		} else if ((opcode & 0xf00f) === 0x9003) {
			// ST ERn, [ERm]
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			ea_inc = 2;
		} else if (obj_check === 0x9031 || obj_check === 0x9051) {
			// ST Rn, [EA(+)]
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.ea;
			ea_inc = 1;
		} else if (obj_check === 0x9011) {
			// ST Rn, Dadr
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.codeMemory.get16(this_.pc);
			ea_inc = 1;
			this_.pc += 2;
		} else if ((opcode & 0xf00f) === 0x9001) {
			// ST Rn, [ERm]
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			ea_inc = 1;
		} else if ((opcode & 0xf00f) === 0xa009) {
			// ST ERn, Disp16[ERm]
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			let erm = this_.get16BitRegister(this_, opcode >> 0x4 & 0xf);
			op1 = this_.codeMemory.get16(this_.pc);
			op1 = erm + op1 & 0xfffe;
			ea_inc = 2;
			this_.pc += 2;
		} else if ((opcode & 0xf00f) === 0x9009) {
			// ST ERn, Disp16[ERm]
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			let erm = this_.get16BitRegister(this_, opcode >> 0x4 & 0xf);
			op1 = this_.codeMemory.get16(this_.pc);
			op1 = erm + op1 & 0xffff;
			ea_inc = 1;
			this_.pc += 2;
		} else if ((opcode & 0xf0c0) === 0xb080) {
			// ST ERn, Disp6[BP]
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			let bp = this_.get16BitRegister(this_, 12);
			op1 = opcode & 0x3f;
			if ((op1 & 0x20) !== 0) {
				op1 |= 0xffffffe0;
			}
			op1 = bp + op1 & 0xfffe;
			ea_inc = 2;
		} else if ((opcode & 0xf0c0) === 0xd080) {
			// ST Rn, Disp6[BP]
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			let bp = this_.get16BitRegister(this_, 12);
			op1 = opcode & 0x3f;
			if ((op1 & 0x20) !== 0) {
				op1 |= 0xffffffe0;
			}
			op1 = bp + op1 & 0xffff;
			ea_inc = 1;
		} else if ((opcode & 0xf0c0) === 0xd0c0) {
			// ST Rn, Disp6[FP]
			op0 = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			let fp = this_.get16BitRegister(this_, 14);
			op1 = opcode & 0x3f;
			if ((op1 & 0x20) !== 0) {
				op1 |= 0xffffffe0;
			}
			op1 = fp + op1 & 0xffff;
			ea_inc = 1;
		} else if ((opcode & 0xf0c0) === 0xb0c0) {
			// ST ERn, Disp6[FP]
			op0 = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			let fp = this_.get16BitRegister(this_, 14);
			op1 = opcode & 0x3f;
			if ((op1 & 0x20) !== 0) {
				op1 |= 0xffffffe0;
			}
			op1 = fp + op1 & 0xfffe;
			ea_inc = 2;
		} else if (obj_check === 0x9035) {
			// ST XRn, [EA]
			op0 = this_.get32BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.ea & 0xfffe;
			ea_inc = 4;
		} else if (obj_check === 0x9055) {
			// ST XRn, [EA+]
			op0 = this_.get32BitRegister(this_, opcode >> 8 & 0xf);
			this_.ea &= 0xfffe;
			op1 = this_.ea;
			ea_inc = 4;
		} else if (obj_check === 0x9037) {
			// ST QRn, [EA]
			op0 = this_.get64BitRegister(this_, opcode >> 8 & 0xf);
			op1 = this_.ea & 0xfffe;
			ea_inc = 8;
		} else if (obj_check === 0x9057) {
			// ST QRn, [EA+]
			op0 = this_.get64BitRegister(this_, opcode >> 8 & 0xf);
			this_.ea &= 0xfffe;
			op1 = this_.ea;
			ea_inc = 8;
		}
		if (typeof op0 === "number") {
			// Rn, ERn, XRn
			for (let i = 0; i < ea_inc; i++) {
				this_.dataMemory.set8(this_.dsr, op0 >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
		} else {
			// QRn
			for (let i = 0; i < 4; i++) {
				this_.dataMemory.set8(this_.dsr, op0[0] >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0[0].toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
			for (let i = 4; i < 8; i++) {
				this_.dataMemory.set8(this_.dsr, op0[1] >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0[1].toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
		}
		if (obj_check === 0x9053 || obj_check === 0x9051 || obj_check === 0x9055 || obj_check === 0x9057) { // Increment EA
			this_.ea += ea_inc;
		}
	}
	add_SP_imm8(this_, opcode) {
		let old_sp = this_.sp;
		let imm8 = opcode & 0xff;
		if ((imm8 & 0x80) === 0) {
			imm8 &= 0x7f;
		} else {
			imm8 |= 0xff80;
		}
		let new_sp = old_sp + imm8;
		new_sp &= 0xffff;
		this_.sp = new_sp & 0xfffe;
	}
	pushValueToStack(this_, val, size) {
		let i;
		for (i = 0; i < size; i++) {
			this_.sp--;
			this_.dataMemory.set8(0, val >> 8 * (size - i - 1) & 0xff, this_.sp);
		}
		if (constants.Constants.DEBUG_PUSH_POP) {
			console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  pushed something " + val.toString(16));
		}
	}
	popValueFromStack(this_, size) {
		var val = 0;
		for (let i = size - 1; i >= 0; i--) {
			val |= this_.dataMemory.get8(0, this_.sp) << 8 * (size - i - 1);
			this_.sp++;
		}
		if (constants.Constants.DEBUG_PUSH_POP) {
			console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  popped something " + val.toString(16));
		}
		return val;
	}
	push_obj(this_, opcode) {
		let reg_list;
		let pushval;
		let obj_check = opcode & 0xf0ff;
		if (obj_check === 0xf04e) {
			// PUSH Rn
			pushval = this_.get8BitRegister(this_, opcode >> 8 & 0xf);
			this_.pushValueToStack(this_, pushval, 2);
		} else if (obj_check === 0xf05e) {
			// PUSH ERn
			pushval = this_.get16BitRegister(this_, opcode >> 8 & 0xf);
			this_.pushValueToStack(this_, pushval, 2);
		} else if (obj_check === 0xf06e) {
			// PUSH XRn
			pushval = this_.get32BitRegister(this_, opcode >> 8 & 0xf);
			this_.pushValueToStack(this_, pushval, 4);
		} else if (obj_check === 0xf07e) {
			// PUSH QRn
			pushval = this_.get64BitRegister(this_, opcode >> 8 & 0xf);
			this_.pushValueToStack(this_, pushval[1], 4);
			this_.pushValueToStack(this_, pushval[0], 4);
		} else if (obj_check === 0xf0ce) {
			// PUSH register_list
			reg_list = opcode >> 8 & 0xff;
			if ((reg_list & this_.NXU16_PUSH_REGISTER_LIST_ELR) !== 0) {
				this_.pushValueToStack(this_, this_.ecsr1, 2);
				this_.pushValueToStack(this_, this_.elr1, 2);
			}
			if ((reg_list & this_.NXU16_PUSH_REGISTER_LIST_PSW) !== 0) {
				this_.pushValueToStack(this_, this_.psw, 2);
			}
			if ((reg_list & this_.NXU16_PUSH_REGISTER_LIST_LR) !== 0) {
				this_.pushValueToStack(this_, this_.lcsr, 2);
				this_.pushValueToStack(this_, this_.lr & 0xffff, 2);
				if (constants.Constants.DEBUG_PUSH_POP) {
					console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  pushed lr=0x" + this_.lr.toString(16));
				}
			}
			if ((reg_list & this_.NXU16_PUSH_REGISTER_LIST_EA) !== 0) {
				this_.pushValueToStack(this_, this_.ea, 2);
			}
		}
	}
	use_DSR(this_, opcode) {
		if (opcode === 0xfe9f) {
			// DSR <- DSR
			this_.dsr = this_.currentDSR;
		} else {
			// DSR <- #pseg_addr
			this_.currentDSR = opcode & 0xff;
			this_.dsr = this_.currentDSR;
		}
		let next_op = this_.codeMemory.get16(this_.pc);
		this_.pc += 2;
		this_.operation[next_op](this_, next_op);
		this_.dsr = 0;
	}
	use_DSR_fromRegister(this_, opcode) {
		let d = opcode >> 4 & 0xf;
		this_.currentDSR = this_.get8BitRegister(this_, d);
		this_.dsr = this_.currentDSR;
		let next_op = this_.codeMemory.get16(this_.pc);
		this_.pc += 2;
		this_.operation[next_op](this_, next_op);
		this_.dsr = 0;
	}
	pop_obj(this_, opcode) {
		let reg_list;
		let popval;
		let obj_check = opcode & 0xf0ff;
		if (obj_check === 0xf01e) {
			// POP Rn
			popval = this_.popValueFromStack(this_, 2);
			this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, popval);
		} else if (obj_check === 0xf00e) {
			// POP ERn
			popval = this_.popValueFromStack(this_, 2);
			this_.setOperationResult8bit(this_, opcode >> 8 & 0xf, popval & 0xff);
		} else if (obj_check === 0xf02e) {
			// POP XRn
			popval = this_.popValueFromStack(this_, 4);
			this_.setOperationResult32bit(this_, opcode >> 8 & 0xf, popval);
		} else if (obj_check === 0xf03e) {
			// POP QRn
			// to be honest this is a quite unelegant way of doing it...
			if ((opcode >> 8 & 0xf) === 0) {
				this_.r0 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r1 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r2 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r3 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r4 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r5 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r6 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r7 = this_.dataMemory.get8(this_.dsr, this_.sp++);
			} else {
				this_.r8 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r9 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r10 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r11 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r12 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r13 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r14 = this_.dataMemory.get8(this_.dsr, this_.sp++);
				this_.r15 = this_.dataMemory.get8(this_.dsr, this_.sp++);
			}
		} else if (obj_check === 0xf08e) {
			// POP register_list
			reg_list = opcode >> 8 & 0xff;
			if ((reg_list & this_.NXU16_POP_REGISTER_LIST_EA) !== 0) {
				this_.ea = this_.popValueFromStack(this_, 2);
			}
			if ((reg_list & this_.NXU16_POP_REGISTER_LIST_LR) !== 0) {
				this_.ecsr = this_.popValueFromStack(this_, 2) & 3;
				this_.pc = this_.ecsr << 16 | this_.popValueFromStack(this_, 2);
			}
			if ((reg_list & this_.NXU16_POP_REGISTER_LIST_PSW) !== 0) {
				this_.psw = this_.popValueFromStack(this_, 2) & 0xff;
			}
			if ((reg_list & this_.NXU16_POP_REGISTER_LIST_PC) !== 0) {
				let pc = this_.popValueFromStack(this_, 2);
				if (constants.Constants.DEBUG_PUSH_POP) {
					console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  popped pc=" + this_.ecsr + ":" + this_.pc.toString(16));
					console.log("writing pc= 0x" + pc.toString(16));
				}
				this_.pc = pc;
				this_.ecsr = this_.popValueFromStack(this_, 2) & 3;
				this_.pc = this_.ecsr << 16 | this_.pc;
			}
		}
	}
	lea_obj(this_, opcode) {
		let obj_check = opcode & 0xf00f;
		if (obj_check === 0xf00a) {
			// LEA [ERm]
			let erm = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			this_.ea = erm;
		} else if (obj_check === 0xf00b) {
			// LEA Disp16[ERm]
			let erm = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
			let disp16 = this_.codeMemory.get16(this_.pc);
			erm = erm + disp16 & 0xffff;
			this_.ea = erm;
			this_.pc += 2;
		} else if (obj_check === 0xf00c) {
			// LEA Dadr
			let dadr = this_.codeMemory.get16(this_.pc);
			this_.ea = dadr;
			this_.pc += 2;
		}
	}
	daa_obj(this_, opcode) {
		const carry = (this_.psw & this_.NXU16_MASK_C_FLAG) !== 0;
		const half_carry = (this_.psw & this_.NXU16_MASK_HC_FLAG) !== 0;
		const n = opcode >> 8 & 0xf;
		const rn = this_.get8BitRegister(this_, n);
		const hi_nib = (rn & 0xf0) >> 4;
		const lo_nib = rn & 0xf;
		let add_val;
		if (!carry && !half_carry && hi_nib <= 9 && lo_nib <= 9) {
			add_val = 0;
		} else {
			if (!carry && (hi_nib <= 8 && lo_nib > 9 || hi_nib <= 9 && half_carry)) {
				add_val = 6;
			} else if (!half_carry && lo_nib <= 9 && (!carry && hi_nib > 9 || carry)) {
				add_val = 0x60;
			} else {
				add_val = 0x66;
			}
		}
		const result = rn + add_val & 0xff;
		if (result & 0x80) {
			this_.psw |= this_.NXU16_MASK_S_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_S_FLAG;
		}
		if (result === 0) {
			this_.psw |= this_.NXU16_MASK_Z_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
		}
		if (!carry && (hi_nib > 9 || !half_carry && hi_nib >= 9 && lo_nib > 9)) {
			this_.psw |= this_.NXU16_MASK_C_FLAG;
		}
		if ((result ^ rn ^ add_val) & 0x10) {
			this_.psw |= this_.NXU16_MASK_HC_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_HC_FLAG;
		}
		this_.setOperationResult8bit(this_, n, result);
	}
	das_obj(this_, opcode) {
		const carry = (this_.psw & this_.NXU16_MASK_C_FLAG) !== 0;
		const half_carry = (this_.psw & this_.NXU16_MASK_HC_FLAG) !== 0;
		const n = opcode >> 8 & 0xf;
		const rn = this_.get8BitRegister(this_, n);
		const hi_nib = (rn & 0xf0) >> 0x4;
		const lo_nib = rn & 0xf;
		let sub_val;
		if (!carry && !half_carry && hi_nib <= 9 && lo_nib <= 9) {
			sub_val = 0;
		} else {
			if (!carry && (hi_nib <= 9 && lo_nib > 9 || hi_nib <= 9 && half_carry)) {
				sub_val = 6;
			} else if (!half_carry && lo_nib <= 9 && (!carry && hi_nib > 9 || carry)) {
				sub_val = 0x60;
			} else {
				sub_val = 0x66;
			}
		}
		const result = rn - sub_val & 0xff;
		if (result & 0x80) {
			this_.psw |= this_.NXU16_MASK_S_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_S_FLAG;
		}
		if (result === 0) {
			this_.psw |= this_.NXU16_MASK_Z_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
		}
		if ((rn & 0xf) - (sub_val & 0xf) & -0x10) {
			this_.psw |= this_.NXU16_MASK_HC_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_HC_FLAG;
		}
		this_.setOperationResult8bit(this_, n, result);
	}
	neg_obj(this_, opcode) {
		const n = opcode >> 8 & 0xf;
		const rn = this_.get8BitRegister(this_, n);
		let result = 0 - rn;
		result = this_.setFlagsFor8bitSub(this_, 0, rn, result);
		this_.setOperationResult8bit(this_, n, result);
	}
	mul_ERn_Rm(this_, opcode) {
		const n = opcode >> 8 & 0xf;
		const m = opcode >> 4 & 0xf;
		const rn = this_.get8BitRegister(this_, n);
		const rm = this_.get8BitRegister(this_, m);
		const result = rn * rm;
		if (result === 0) {
			this_.psw |= this_.NXU16_MASK_Z_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
		}
		this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
	}
	div_ERn_Rm(this_, opcode) {
		const n = opcode >> 8 & 0xf;
		const m = opcode >> 4 & 0xf;
		const rn = this_.get16BitRegister(this_, n);
		const rm = this_.get8BitRegister(this_, m);
		if (rm === 0) {
			this_.setC(this_, true);
		} else {
			const result = Math.floor(rn / rm);
			const remainder = rn % rm >>> 0;
			this_.setC(this_, false);
			if (result === 0) {
				this_.psw |= this_.NXU16_MASK_Z_FLAG;
			} else {
				this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
			}
			this_.setOperationResult16bit(this_, opcode >> 8 & 0xf, result);
			this_.setOperationResult8bit(this_, m, remainder);
		}
	}
	sb_rn(this_, opcode) {
		let bit = opcode >> 4 & 7;
		let n;
		let op0;
		let obj_check = opcode & 0xf08f;
		if (obj_check === 0xa000) {
			// SB Rn.bit_offset
			n = opcode >> 8 & 0xf;
			op0 = this_.get8BitRegister(this_, n);
		} else if (obj_check === 0xa080) {
			// SB Dbitadr
			n = this_.codeMemory.get16(this_.pc);
			op0 = this_.dataMemory.get8(this_.dsr, n);
			this_.pc += 2;
		}
		let bit_mask = 1 << bit;
		if ((op0 & bit_mask) === 0) {
			this_.setZ(this_, true);
		} else {
			this_.setZ(this_, false);
		}
		op0 |= bit_mask;
		if (obj_check === 0xa000) {
			// SB Rn.bit_offset
			this_.setOperationResult8bit(this_, n, op0);
		} else if (obj_check === 0xa080) {
			// SB Dbitadr
			this_.dataMemory.set8(this_.dsr, op0, n);
		}
	}
	rb_rn(this_, opcode) {
		let bit = opcode >> 4 & 7;
		let n;
		let op0;
		let obj_check = opcode & 0xf08f;
		if (obj_check === 0xa002) {
			// RB Rn.bit_offset
			n = opcode >> 8 & 0xf;
			op0 = this_.get8BitRegister(this_, n);
		} else if (obj_check === 0xa082) {
			// RB Dbitadr
			n = this_.codeMemory.get16(this_.pc);
			op0 = this_.dataMemory.get8(this_.dsr, n);
			this_.pc += 0x2;
		}
		if ((op0 >> bit & 0x1) === 0) {
			this_.psw |= this_.NXU16_MASK_Z_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
		}
		op0 &= ~(0x1 << bit) & 0xff;
		if (obj_check === 0xa002) {
			// RB Rn.bit_offset
			this_.setOperationResult8bit(this_, n, op0);
		} else if (obj_check === 0xa082) {
			// RB Dbitadr
			this_.dataMemory.set8(this_.dsr, op0, n);
		}
	}
	tb_rn(this_, opcode) {
		let bit = opcode >> 0x4 & 0x7;
		let n;
		let op0;
		let obj_check = opcode & 0xf08f;
		if (obj_check === 0xa001) {
			// TB Rn.bit_offset
			n = opcode >> 8 & 0xf;
			op0 = this_.get8BitRegister(this_, n);
		} else if (obj_check === 0xa081) {
			// TB Dbitadr
			n = this_.codeMemory.get16(this_.pc);
			op0 = this_.dataMemory.get8(this_.dsr, n);
			this_.pc += 0x2;
		}
		if ((op0 >> bit & 1) === 0) {
			this_.psw |= this_.NXU16_MASK_Z_FLAG;
		} else {
			this_.psw &= ~this_.NXU16_MASK_Z_FLAG;
		}
	}
	b_conditional(this_, opcode) {
		var jump = false;
		var radr = opcode & 0xff;
		var cond = opcode >> 8 & 0xf;
		if ((radr & 0x80) !== 0) {
			radr |= 0xffffff80;
		}
		radr *= 0x2;
		switch (cond) {
			case 0:
				// BGE/BNC
				jump = !this_.isCSet(this_);
				break;
			case 1:
				// BLT/BCY
				jump = this_.isCSet(this_);
				break;
			case 2:
				// BGT
				jump = this_.isCSet(this_) === false && this_.isZSet(this_) === false;
				break;
			case 3:
				// BLE
				jump = this_.isCSet(this_) === true || this_.isZSet(this_) === true;
				break;
			case 4:
				// BGES
				var ov = this_.isOVSet(this_);
				var s = this_.isSSet(this_);
				jump = !(s !== ov);
				break;
			case 5:
				// BLTS
				var ov = this_.isOVSet(this_);
				var s = this_.isSSet(this_);
				jump = s !== ov;
				break;
			case 6:
				// BGTS
				var ov = this_.isOVSet(this_);
				var s = this_.isSSet(this_);
				var z = this_.isZSet(this_);
				jump = !(s !== ov || z);
				break;
			case 7:
				// BLES
				var z = this_.isZSet(this_);
				var ov = this_.isOVSet(this_);
				var s = this_.isSSet(this_);
				jump = s !== ov || z;
				break;
			case 8:
				// BNE/BNZ
				var z = this_.isZSet(this_);
				jump = !z;
				break;
			case 9:
				// BEQ/BZ
				var z = this_.isZSet(this_);
				jump = z;
				break;
			case 0xa:
				// BNV
				jump = !this_.isOVSet(this_);
				break;
			case 0xb:
				// BOV
				jump = this_.isOVSet(this_);
				break;
			case 0xc:
				// BPS
				var s = this_.isSSet(this_);
				jump = !s;
				break;
			case 0xd:
				// BNS
				var s = this_.isSSet(this_);
				jump = s;
				break;
			case 0xe:
				// BAL
				jump = true;
				break;
		}
		if (jump) {
			this_.pc += radr;
		}
	}
	extbw_rn(this_, opcode) {
		let rn = this_.get8BitRegister(this_, opcode >> 4 & 0xf);
		if ((rn & 0x80) !== 0) {
			rn |= 0xff80;
			this_.setS(this_, true);
		} else {
			this_.setS(this_, false);
		}
		if (rn === 0) {
			this_.setZ(this_, true);
		} else {
			this_.setZ(this_, false);
		}
		this_.setOperationResult16bit(this_, (opcode >> 9 & 7) << 1, rn);
	}
	swi_snum(this_, opcode) {
		let snum = opcode & 0x3f;
		let swi_handler = function () {
			if (snum === 1) {
				if (typeof this_.parent !== "undefined") {
					let er0 = this_.get16BitRegister(this_, 0);
					this_.callScreenChanged(this_, er0);
					this_.r0 = 0;
					this_.r1 = 0;
				}
			} else if (snum === 2) {
				let keycode = this_.keyEventProcessor.getNextKeyCode();
				if (keycode === 0x29 && this_.is2ndMode) {
					keycode = 0;
				}
				this_.r1 = 0;
				this_.r0 = keycode & 0xff;
				this_.isBusy = true;
				if (this_.r0 === 0xff) {
					this_.r2 = this_.uartStartAddress & 0xff;
					this_.r3 = this_.uartStartAddress >> 8 & 0xff;
				}
			} else if (snum === 3) {
				if (typeof this_.automationResolve === "function") {
					let er0 = this_.get16BitRegister(this_, 0);
					let er2 = this_.get16BitRegister(this_, 2);
					if (this_.taRspBuffer === null) {
						let addr = this_.dataMemory.get8(0, er0) | this_.dataMemory.get8(0, er0 + 1) << 8;
						this_.taRspLength = addr + 2;
						this_.taRspBuffer = new Uint8Array(this_.taRspLength);
					}
					for (let i = 0; i < er2; i++) {
						this_.taRspBuffer[this_.taRspIndex++] = this_.dataMemory.get8(0, er0 + i);
					}
					if (this_.taRspIndex === this_.taRspLength) {
						this_.automationResolve(this_.taRspBuffer);
						this_.taRspBuffer = null;
						this_.taRspLength = 0;
						this_.taRspIndex = 0;
						this_.automationResolve = undefined;
					} else if (this_.taRspIndex > this_.taRspLength) {
						this_.automationReject("Failed to create response.");
						this_.taRspBuffer = null;
						this_.taRspLength = 0;
						this_.taRspIndex = 0;
					}
				} else if (typeof this_.uartReady === "function") {
					if (typeof this_.uartBufLenLocation === "undefined") {
						this_.uartBufLenLocation = this_.dataMemory.get16(0, 0x106);
						this_.uartStartAddress = this_.uartBufLenLocation + 2;
						console.log("TA framework is ready.");
						this_.uartReady("TA framework is ready.");
					} else {
						console.log("TA initialized already.");
					}
				}
			} else if (snum === 4) {
				if (typeof this_.parent !== "undefined") {
					let er0 = this_.get16BitRegister(this_, 0);
					this_.callTopIconsChanged(this_, er0);
					this_.r0 = 0;
					this_.r1 = 0;
				}
			} else if (snum === 5) {
				this_.keyEventProcessor.notifyKeyCanRepeat();
			}
			let swi_addr = (snum << 1) + 0x80;
			return this_.codeMemory.get16(swi_addr);
		};
		this_.psw1 = this_.psw;
		this_.psw |= 0x1;
		this_.elr1 = this_.pc & 0xffff;
		this_.ecsr1 = this_.ecsr;
		this_.psw &= ~this_.NXU16_MASK_MIE_FLAG;
		this_.pc = swi_handler();
	}
	brk(this_, opcode) {
		const elevel = this_.psw & this_.NXU16_MASK_ELEVEL;
		if (elevel > 1) {
			this_.resetAll(this_);
			this_.sp = this_.codeMemory.get16(0);
			this_.pc = this_.codeMemory.get16(2);
		}
		if (elevel < 2) {
			this_.elr2 = this_.pc & 0xffff;
			this_.ecsr2 = this_.ecsr;
			this_.psw2 = this_.psw;
			this_.psw |= 2;
			this_.pc = this_.codeMemory.get16(4);
		}
	}
	b_cadr(this_, opcode) {
		let cadr;
		if ((opcode & 0xf00f) === 0xf000) {
			// B Cadr
			this_.ecsr = opcode >> 8 & 3;
			cadr = this_.codeMemory.get16(this_.pc);
		} else if ((opcode & 0xf00f) === 0xf001) {
			// BL Cadr
			this_.lr = this_.pc + 2 & 0xffff;
			this_.lcsr = this_.ecsr;
			this_.ecsr = opcode >> 8 & 0xf;
			cadr = this_.codeMemory.get16(this_.pc);
		} else if ((opcode & 0xf00f) === 0xf002) {
			// B ERn
			cadr = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
		} else if ((opcode & 0xf00f) === 0xf003) {
			// BL ERn
			this_.lr = this_.pc + 2 & 0xffff;
			this_.lcsr = this_.ecsr;
			cadr = this_.get16BitRegister(this_, opcode >> 4 & 0xf);
		}
		this_.pc = this_.ecsr << 16 | cadr;
	}
	checkForInterrupt() {
		const this_ = this;
		const data_mem = this_.dataMemory;
		if (this_.pendingEI > 0) {
			this_.pendingEI--;
		} else {
			for (let i = 0; i < 1; i++) {
				if (data_mem.get8(0, data_mem.INTERRUPT_IRQ0 + i) !== 0) {
					this_.elr2 = this_.pc & 0xffff;
					this_.ecsr2 = this_.ecsr;
					this_.psw2 = this_.psw;
					this_.psw = 2;
					this_.ecsr = 0;
					this_.pc = this_.getInterruptHandlerAddress(this_, i, false);
					break;
				}
			}
			if (this_.isMIESet(this_)) {
				for (let j = 1; j < 8; j++) {
					if (data_mem.get8(0, data_mem.INTERRUPT_IE0 + j) !== 0 && data_mem.get8(0, data_mem.INTERRUPT_IRQ0 + j) !== 0) {
						if ((this_.psw & this_.NXU16_MASK_ELEVEL) < 2) {
							this_.elr1 = this_.pc & 0xffff;
							this_.ecsr1 = this_.ecsr;
							this_.psw1 = this_.psw;
							this_.psw = 1;
							this_.setMIE(this_, false);
							this_.ecsr = 0;
							this_.pc = this_.getInterruptHandlerAddress(this_, j, true);
							break;
						}
					}
				}
			}
		}
	}
	run() {
		let this_ = this;
		let pc;
		let opcode;
		const loop_count = this.isBusy ? 0x1388 : 0x32;
		for (let i = 0; i < loop_count; i++) {
			pc = this.pc;
			opcode = this.codeMemory.get16(pc);
			if (opcode === 0xe502 && this_.keyEventProcessor.isQueueEmpty()) { // E502 = SWI 2
				this.isBusy = false;
				break;
			}
			if (constants.Constants.SHOW_C_TRACE && typeof dolphinMapData[pc] !== "undefined") {
				console.log("pc= 0x" + pc.toString(16) + " - " + dolphinMapData[pc]);
				if (dolphinMapData[pc].includes("memClearedDialog")) {
					this_.showConsole = true;
					debugger;
				}
			}
			this.pc += 2;
			if (typeof this.operation[opcode] === "function" || pc > this.CODE_MEMORY_SIZE) {
				this.operation[opcode](this, opcode);
			} else {
				console.log("ERROR!!!, tried to call an unsupported opcode!");
				console.log("pc= 0x" + pc.toString(16));
				console.log("opcode= 0x" + opcode.toString(16));
				debugger;
			}
		}
		let irq7 = this_.dataMemory.get8(0, this_.dataMemory.INTERRUPT_IRQ7);
		if ((irq7 & 1) !== 0) {
			irq7 = irq7 ^ 1;
			this_.dataMemory.set8(0, irq7, this_.dataMemory.INTERRUPT_IRQ7);
			if (this_.keyEventProcessor.isQueueEmpty() && !this_.keyEventProcessor.isPotentialAutoRepeat()) {
				this_.setLastKeyPressed(0);
			}
		}
		this.checkForInterrupt();
	}
	interp1() {
		var pc = this.pc;
		var opcode = this.codeMemory.get16(pc);
		this.pc += 2;
		if (typeof this.operation[opcode] === "function") {
			this.operation[opcode](this, opcode);
		} else {
			debugger;
		}
	}
	setLastKeyPressed(keycode) {
		if (keycode === 0x29 && this.isBusy) {
			let addr = this.dataMemory.get16(0, 0x102);
			let bitmask = 1 << this.dataMemory.get8(0, 0x104);
			let result = this.dataMemory.get8(0, addr) | bitmask;
			this.dataMemory.set8(0, result, addr);
		}
		this.keyEventProcessor.addKeyDown(keycode);
	}
	setLastKeyReleased(keycode) {
		this.keyEventProcessor.addKeyUp(keycode);
	}
	initUART() {
		return new Promise((resolve, reject) => {
			this.uartReady = resolve;
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
exports.NXU16_MCU = NXU16_MCU;
