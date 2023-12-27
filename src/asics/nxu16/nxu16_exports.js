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
		this.operation[0xfe2f] = function (mcu, operand) { // INC [EA]
			let old_ea_val = mcu.dataMemory.get8(mcu.dsr, mcu.ea);
			let new_ea_val = old_ea_val + 0x1 & 0xff;
			new_ea_val = mcu.setFlagsFor8bitInc(mcu, old_ea_val, 0x1, new_ea_val);
			mcu.dataMemory.set8(mcu.dsr, new_ea_val, mcu.ea);
		};
		this.operation[0xfe3f] = function (mcu, operand) { // DEC [EA]
			let old_ea_val = mcu.dataMemory.get8(mcu.dsr, mcu.ea);
			let new_ea_val = old_ea_val - 0x1;
			new_ea_val = mcu.setFlagsFor8bitDec(mcu, old_ea_val, 0x1, new_ea_val);
			mcu.dataMemory.set8(mcu.dsr, new_ea_val, mcu.ea);
		};
		this.operation[0xfe8f] = function (mcu, operand) {}; // NOP
		this.operation[0xed08] = function (mcu, _0x2bd513) {  // EI
			mcu.psw |= mcu.NXU16_MASK_MIE_FLAG;
			mcu.pendingEI++;
		};
		this.operation[0xed80] = function (mcu, operand) { // SC
			mcu.psw |= mcu.NXU16_MASK_C_FLAG;
		};
		this.operation[0xeb7f] = function (mcu, operand) { // RC
			mcu.psw &= ~mcu.NXU16_MASK_C_FLAG;
		};
		this.operation[0xebf7] = function (mcu, operand) { // DI
			mcu.psw &= ~mcu.NXU16_MASK_MIE_FLAG;
		};
		this.operation[0xfecf] = function (mcu, operand) { // CPLC
			if ((mcu.psw & mcu.NXU16_MASK_C_FLAG) === 0) {
				mcu.psw |= mcu.NXU16_MASK_C_FLAG;
			} else {
				mcu.psw &= ~mcu.NXU16_MASK_C_FLAG;
			}
		};
		this.operation[0xfe0f] = function (mcu, operand) { // RTI
			mcu.ecsr = mcu.getECSRForELevel(mcu);
			mcu.pc = mcu.ecsr << 16 | mcu.getELRForELevel(mcu);
			mcu.psw = mcu.getEPSWForELevel(mcu);
		};
		this.operation[0xfe1f] = function (mcu, operand) { // RT
			mcu.ecsr = mcu.lcsr;
			mcu.pc = mcu.ecsr << 16 | mcu.lr;
		};
		if (_0x102e32 && _0x102e32.parent) {
			this.parent = _0x102e32.parent;
		}
		this.isBusy = true;
	}
	getStack(mcu) {
		let stack = [];
		for (let i = -1; i < 10; i++) {
			stack.push(mcu.dataMemory.get16(0, mcu.sp + 2 * i).toString(16));
		}
		return "Stack contents:  + stack.join(", ") + ";
	}
	initialize(size) {
		this.codeMemory.setData(size);
		this.dataMemory.setData(size);
		this.resetAll(this);
		this.dataMemory.resetRegisters();
		this.sp = this.codeMemory.get16(0);
		this.pc = this.codeMemory.get16(2);
	}
	resetAll(mcu) {
		mcu.r0 = 0;
		mcu.r1 = 0;
		mcu.r2 = 0;
		mcu.r3 = 0;
		mcu.r4 = 0;
		mcu.r5 = 0;
		mcu.r6 = 0;
		mcu.r7 = 0;
		mcu.r8 = 0;
		mcu.r9 = 0;
		mcu.r10 = 0;
		mcu.r11 = 0;
		mcu.r12 = 0;
		mcu.r13 = 0;
		mcu.r14 = 0;
		mcu.r15 = 0;
		mcu.psw = 0;
		mcu.psw1 = 0;
		mcu.psw2 = 0;
		mcu.psw3 = 0;
		mcu.ea = 0;
		mcu.pc = 0;
		mcu.sp = 0;
		mcu.dsr = 0;
		mcu.currentDSR = 0;
		mcu.ecsr = 0;
		mcu.lcsr = 0;
		mcu.ecsr1 = 0;
		mcu.ecsr2 = 0;
		mcu.ecsr3 = 0;
		mcu.lr = 0;
		mcu.elr1 = 0;
		mcu.elr2 = 0;
		mcu.elr3 = 0;
		mcu.pendingEI = 0;
	}
	isCSet(mcu) {
		return (mcu.psw & mcu.NXU16_MASK_C_FLAG) !== 0;
	}
	setC(mcu, bit) {
		if (bit) {
			mcu.psw |= mcu.NXU16_MASK_C_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_C_FLAG;
		}
	}
	isZSet(mcu) {
		return (mcu.psw & mcu.NXU16_MASK_Z_FLAG) !== 0;
	}
	setZ(mcu, bit) {
		if (bit) {
			mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
		}
	}
	isSSet(mcu) {
		return (mcu.psw & mcu.NXU16_MASK_S_FLAG) !== 0;
	}
	setS(mcu, bit) {
		if (bit) {
			mcu.psw |= mcu.NXU16_MASK_S_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_S_FLAG;
		}
	}
	isOVSet(mcu) {
		return (mcu.psw & mcu.NXU16_MASK_OV_FLAG) !== 0;
	}
	setOV(mcu, bit) {
		if (bit) {
			mcu.psw |= mcu.NXU16_MASK_OV_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_OV_FLAG;
		}
	}
	isHCSet(mcu) {
		return (mcu.psw & mcu.NXU16_MASK_HC_FLAG) !== 0;
	}
	setHC(mcu, bit) {
		if (bit) {
			mcu.psw |= mcu.NXU16_MASK_HC_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_HC_FLAG;
		}
	}
	isMIESet(mcu) {
		return (mcu.psw & mcu.NXU16_MASK_MIE_FLAG) !== 0;
	}
	setMIE(mcu, bit) {
		if (bit) {
			mcu.psw |= mcu.NXU16_MASK_MIE_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_MIE_FLAG;
		}
	}
	getECSRForELevel(mcu) {
		switch (mcu.psw & 3) {
			case 0:
				return mcu.ecsr;
			case 1:
				return mcu.ecsr1;
			case 2:
				return mcu.ecsr2;
			case 3:
				return mcu.ecsr3;
		}
	}
	setECSRForELevel(mcu, val) {
		switch (mcu.psw & 3) {
			case 0:
				mcu.ecsr = val;
				break;
			case 1:
				mcu.ecsr1 = val;
				break;
			case 2:
				mcu.ecsr2 = val;
				break;
			case 3:
				mcu.ecsr3 = val;
				break;
		}
	}
	getELRForELevel(mcu) {
		switch (mcu.psw & 3) {
			case 0:
				return mcu.lr;
			case 1:
				return mcu.elr1;
			case 2:
				return mcu.elr2;
			case 3:
				return mcu.elr3;
		}
	}
	setELRForELevel(mcu, val) {
		switch (mcu.psw & 3) {
			case 0:
				mcu.lr = val;
				break;
			case 1:
				mcu.elr1 = val;
				break;
			case 2:
				mcu.elr2 = val;
				break;
			case 3:
				mcu.elr3 = val;
				break;
		}
	}
	getEPSWForELevel(mcu) {
		switch (mcu.psw & 3) {
			case 0:
				return mcu.psw;
			case 1:
				return mcu.psw1;
			case 2:
				return mcu.psw2;
			case 3:
				return mcu.psw3;
		}
	}
	setEPSWForELevel(mcu, val) {
		switch (mcu.psw & 3) {
			case 0:
				mcu.psw = val;
				break;
			case 1:
				mcu.psw1 = val;
				break;
			case 2:
				mcu.psw2 = val;
				break;
			case 3:
				mcu.psw3 = val;
				break;
		}
	}
	getInterruptHandlerAddress(mcu, idx, enable) {
		const dataMemory = mcu.dataMemory;
		var ie = dataMemory.get8(mcu.dsr, dataMemory.INTERRUPT_IE0 + idx);
		var irq = dataMemory.get8(mcu.dsr, dataMemory.INTERRUPT_IRQ0 + idx);
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
		return mcu.codeMemory.get16(2 * (8 * idx + i));
	}
	get8BitRegister(mcu, n) {
		switch (n) {
			case 0:
				return mcu.r0;
			case 1:
				return mcu.r1;
			case 2:
				return mcu.r2;
			case 3:
				return mcu.r3;
			case 4:
				return mcu.r4;
			case 5:
				return mcu.r5;
			case 6:
				return mcu.r6;
			case 7:
				return mcu.r7;
			case 8:
				return mcu.r8;
			case 9:
				return mcu.r9;
			case 10:
				return mcu.r10;
			case 11:
				return mcu.r11;
			case 12:
				return mcu.r12;
			case 13:
				return mcu.r13;
			case 14:
				return mcu.r14;
			case 15:
				return mcu.r15;
		}
	}
	get16BitRegister(mcu, n) {
		switch (n) {
			case 0:
				return mcu.r0 | mcu.r1 << 8;
			case 1:
				return mcu.r1 | mcu.r2 << 8;
			case 2:
				return mcu.r2 | mcu.r3 << 8;
			case 3:
				return mcu.r3 | mcu.r4 << 8;
			case 4:
				return mcu.r4 | mcu.r5 << 8;
			case 5:
				return mcu.r5 | mcu.r6 << 8;
			case 6:
				return mcu.r6 | mcu.r7 << 8;
			case 7:
				return mcu.r7 | mcu.r8 << 8;
			case 8:
				return mcu.r8 | mcu.r9 << 8;
			case 9:
				return mcu.r9 | mcu.r10 << 8;
			case 10:
				return mcu.r10 | mcu.r11 << 8;
			case 11:
				return mcu.r11 | mcu.r12 << 8;
			case 12:
				return mcu.r12 | mcu.r13 << 8;
			case 13:
				return mcu.r13 | mcu.r14 << 8;
			case 14:
				return mcu.r14 | mcu.r15 << 8;
			case 15:
				return mcu.r15 | mcu.r0 << 8;
		}
	}
	get32BitRegister(mcu, n) {
		switch (n) {
			case 0:
				return mcu.r0 | mcu.r1 << 8 | mcu.r2 << 16 | mcu.r3 << 24;
			case 4:
				return mcu.r4 | mcu.r5 << 8 | mcu.r6 << 16 | mcu.r7 << 24;
			case 8:
				return mcu.r8 | mcu.r9 << 8 | mcu.r10 << 16 | mcu.r11 << 24;
			case 12:
				return mcu.r12 | mcu.r13 << 8 | mcu.r14 << 16 | mcu.r15 << 24;
				;
		}
	}
	get64BitRegister(mcu, n) {
		let int32_0;
		let int32_1;
		switch (n) {
			case 0:
				int32_0 = mcu.r0 | mcu.r1 << 8 | mcu.r2 << 16 | mcu.r3 << 24;
				int32_1 = mcu.r4 | mcu.r5 << 8 | mcu.r6 << 16 | mcu.r7 << 24;
				break;
			case 8:
				int32_0 = mcu.r8 | mcu.r9 << 8 | mcu.r10 << 16 | mcu.r11 << 24;
				int32_1 = mcu.r12 | mcu.r13 << 8 | mcu.r14 << 16 | mcu.r15 << 24;
				break;
		}
		return [int32_0, int32_1];
	}
	get16BitRegisterReverse(mcu, n) {
		switch (n) {
			case 0:
				return mcu.r15 | mcu.r0 << 8;
			case 0x1:
				return mcu.r0 | mcu.r1 << 8;
			case 0x2:
				return mcu.r1 | mcu.r2 << 8;
			case 0x3:
				return mcu.r2 | mcu.r3 << 8;
			case 0x4:
				return mcu.r3 | mcu.r4 << 8;
			case 0x5:
				return mcu.r4 | mcu.r5 << 8;
			case 0x6:
				return mcu.r5 | mcu.r6 << 8;
			case 0x7:
				return mcu.r6 | mcu.r7 << 8;
			case 0x8:
				return mcu.r7 | mcu.r8 << 8;
			case 0x9:
				return mcu.r8 | mcu.r9 << 8;
			case 0xa:
				return mcu.r9 | mcu.r10 << 8;
			case 0xb:
				return mcu.r10 | mcu.r11 << 8;
			case 0xc:
				return mcu.r11 | mcu.r12 << 8;
			case 0xd:
				return mcu.r12 | mcu.r13 << 8;
			case 0xe:
				return mcu.r13 | mcu.r14 << 8;
			case 0xf:
				return mcu.r14 | mcu.r15 << 8;
		}
	}
	setOperationResult8bit(mcu, n, result) {
		switch (n) {
			case 0:
				mcu.r0 = result;
				break;
			case 1:
				mcu.r1 = result;
				break;
			case 2:
				mcu.r2 = result;
				break;
			case 3:
				mcu.r3 = result;
				break;
			case 4:
				mcu.r4 = result;
				break;
			case 5:
				mcu.r5 = result;
				break;
			case 6:
				mcu.r6 = result;
				break;
			case 7:
				mcu.r7 = result;
				break;
			case 8:
				mcu.r8 = result;
				break;
			case 9:
				mcu.r9 = result;
				break;
			case 10:
				mcu.r10 = result;
				break;
			case 11:
				mcu.r11 = result;
				break;
			case 12:
				mcu.r12 = result;
				break;
			case 13:
				mcu.r13 = result;
				break;
			case 14:
				mcu.r14 = result;
				break;
			case 15:
				mcu.r15 = result;
				break;
		}
	}
	setOperationResult16bit(mcu, n, result) {
		switch (n) {
			case 0:
				mcu.r0 = result & 0xff;
				mcu.r1 = result >> 8 & 0xff;
				break;
			case 2:
				mcu.r2 = result & 0xff;
				mcu.r3 = result >> 8 & 0xff;
				break;
			case 4:
				mcu.r4 = result & 0xff;
				mcu.r5 = result >> 8 & 0xff;
				break;
			case 6:
				mcu.r6 = result & 0xff;
				mcu.r7 = result >> 8 & 0xff;
				break;
			case 8:
				mcu.r8 = result & 0xff;
				mcu.r9 = result >> 8 & 0xff;
				break;
			case 0xa:
				mcu.r10 = result & 0xff;
				mcu.r11 = result >> 8 & 0xff;
				break;
			case 0xc:
				mcu.r12 = result & 0xff;
				mcu.r13 = result >> 8 & 0xff;
				break;
			case 0xe:
				mcu.r14 = result & 0xff;
				mcu.r15 = result >> 8 & 0xff;
				break;
		}
	}
	setOperationResult32bit(mcu, n, result) {
		switch (n) {
			case 0:
				mcu.r0 = result & 0xff;
				mcu.r1 = result >> 8 & 0xff;
				mcu.r2 = result >> 16 & 0xff;
				mcu.r3 = result >> 24 & 0xff;
				break;
			case 4:
				mcu.r4 = result & 0xff;
				mcu.r5 = result >> 8 & 0xff;
				mcu.r6 = result >> 16 & 0xff;
				mcu.r7 = result >> 24 & 0xff;
				break;
			case 8:
				mcu.r8 = result & 0xff;
				mcu.r9 = result >> 8 & 0xff;
				mcu.r10 = result >> 16 & 0xff;
				mcu.r11 = result >> 24 & 0xff;
				break;
			case 0xc:
				mcu.r12 = result & 0xff;
				mcu.r13 = result >> 8 & 0xff;
				mcu.r14 = result >> 16 & 0xff;
				mcu.r15 = result >> 24 & 0xff;
				break;
		}
	}
	setOperationResult64bit(mcu, n, result0, result1) {
		switch (n) {
			case 0:
				mcu.r0 = result0 & 0xff;
				mcu.r1 = result0 >> 8 & 0xff;
				mcu.r2 = result0 >> 16 & 0xff;
				mcu.r3 = result0 >> 24 & 0xff;
				mcu.r4 = result1 & 0xff;
				mcu.r5 = result1 >> 8 & 0xff;
				mcu.r6 = result1 >> 16 & 0xff;
				mcu.r7 = result1 >> 24 & 0xff;
				break;
			case 8:
				mcu.r8 = result0 & 0xff;
				mcu.r9 = result0 >> 8 & 0xff;
				mcu.r10 = result0 >> 16 & 0xff;
				mcu.r11 = result0 >> 24 & 0xff;
				mcu.r12 = result1 & 0xff;
				mcu.r13 = result1 >> 8 & 0xff;
				mcu.r14 = result1 >> 16 & 0xff;
				mcu.r15 = result1 >> 24 & 0xff;
				break;
		}
	}
	setFlagsFor8bitAdd(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_C_FLAG | mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (result > 0xff) {
			psw |= mcu.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((result ^ op0 ^ op1) & 0x10) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if (!((op0 ^ op1) & 0x80) && (op1 ^ result) & 0x80) {
			psw |= mcu.NXU16_MASK_OV_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor8bitAddc(mcu, op0, op1, result, zero) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_C_FLAG | mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (result > 0xff) {
			psw |= mcu.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (zero && result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((result ^ op0 ^ op1) & 0x10) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if (!((op0 ^ op1) & 0x80) && (op1 ^ result) & 0x80) {
			psw |= mcu.NXU16_MASK_OV_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setZeroAndSignFlags_8bit(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor8bitSub(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_C_FLAG | mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (result < 0) {
			psw |= mcu.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= mcu.NXU16_MASK_OV_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor8bitSubc(mcu, op0, op1, result, zero) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_C_FLAG | mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (result < 0) {
			psw |= mcu.NXU16_MASK_C_FLAG;
			result &= 0xff;
		}
		if (zero && result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= mcu.NXU16_MASK_OV_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor16bitAdd(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_C_FLAG | mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (result > 0xffff) {
			psw |= mcu.NXU16_MASK_C_FLAG;
			result &= 0xffff;
		}
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((op1 & 0xfff) + (op0 & 0xfff) > 0xfff) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if (((op0 ^ op1) & 0x8000) === 0) {
			if (((op1 ^ result) & 0x8000) !== 0) {
				psw |= mcu.NXU16_MASK_OV_FLAG;
			}
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor8bitInc(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((op1 & 0xf) + (op0 & 0xf) > 0xf) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if (((op0 ^ op1) & 0x80) === 0) {
			if (((op1 ^ result) & 0x80) !== 0) {
				psw |= mcu.NXU16_MASK_OV_FLAG;
			}
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor16bitSub(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_C_FLAG | mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		if (op1 > op0) {
			psw |= mcu.NXU16_MASK_C_FLAG;
		}
		result &= 0xffff;
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xfff) - (op1 & 0xfff) & -4096) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x8000 && ((op1 ^ result) & 0x8000) === 0) {
			psw |= mcu.NXU16_MASK_OV_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setFlagsFor8bitDec(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG | mcu.NXU16_MASK_OV_FLAG | mcu.NXU16_MASK_HC_FLAG);
		result &= 0xff;
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		if ((op0 & 0xf) - (op1 & 0xf) & -16) {
			psw |= mcu.NXU16_MASK_HC_FLAG;
		}
		if ((op0 ^ op1) & 0x80 && ((op1 ^ result) & 0x80) === 0) {
			psw |= mcu.NXU16_MASK_OV_FLAG;
		}
		mcu.psw = psw;
		return result;
	}
	setZeroAndSignFlags_16bit(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x8000) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		mcu.psw = psw;
		return result & 0xffff;
	}
	setZeroAndSignFlags_32bit(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG);
		if (result === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (result & 0x80000000) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		mcu.psw = psw;
		return result & 0xffffffff;
	}
	setZeroAndSignFlags_64bit(mcu, op0, op1, result) {
		let psw = mcu.psw & ~(mcu.NXU16_MASK_Z_FLAG | mcu.NXU16_MASK_S_FLAG);
		if (op0 === 0 && op1 === 0) {
			psw |= mcu.NXU16_MASK_Z_FLAG;
		} else if (op1 & 0x80000000) {
			psw |= mcu.NXU16_MASK_S_FLAG;
		}
		mcu.psw = psw;
	}
	callScreenChanged(mcu, addr) {
		if (mcu.parent !== null) {
			let screen = this.dataMemory.getSubArray(addr, addr + 0x600);
			mcu.parent.notifyScreenListeners(screen);
		}
	}
	callTopIconsChanged(mcu, addr) {
		if (mcu.parent !== null) {
			let sbar = this.dataMemory.get32(0, addr);
			this.is2ndMode = (sbar & 2) !== 0;
			mcu.parent.notifyTopIconScreenListeners(sbar);
		}
	}
	add_Rn_Rm(mcu, operand) {
		let result;
		let op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
		let op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		;
		result = op0 + op1;
		result = mcu.setFlagsFor8bitAdd(mcu, op0, op1, result);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	addc_Rn_Rm(mcu, operand) {
		let result;
		let zero = (mcu.psw & mcu.NXU16_MASK_Z_FLAG) !== 0;
		let op1;
		let op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
		if ((operand & 0xf000) === 0x6000) { // ADDC Rn, #imm8
			op1 = operand & 0xff;
		} else { // ADDC Rn, Rm
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		}
		if ((mcu.psw & mcu.NXU16_MASK_C_FLAG) !== 0) {
			result = op0 + op1 + 0x1;
		} else {
			result = op0 + op1;
		}
		result = mcu.setFlagsFor8bitAddc(mcu, op0, op1, result, zero);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	add_Rn_Imm8(mcu, operand) {
		let op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
		;
		let op1 = operand & 0xff;
		let result;
		if ((operand & 0x6000) !== 0 && (mcu.psw & mcu.NXU16_MASK_C_FLAG) !== 0) { // unused?
			result = op0 + op1 + 1;
		} else {
			result = op0 + op1;
		}
		result = mcu.setFlagsFor8bitAdd(mcu, op0, op1, result);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	add_ERn_ERm(mcu, operand) {
		let op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
		let op1 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
		;
		let result = op0 + op1;
		result = mcu.setFlagsFor16bitAdd(mcu, op0, op1, result);
		mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
	}
	add_ERn_imm7(mcu, operand) {
		let op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xe);
		let op1 = operand & 0x7f;
		if ((op1 & 0x40) === 0) {
			op1 &= 0x3f;
		} else {
			op1 |= 0xffc0;
		}
		let result = op0 + op1;
		result = mcu.setFlagsFor16bitAdd(mcu, op0, op1, result);
		mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
	}
	and_Rn_Rm(mcu, operand) {
		let op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
		let op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		let result = op0 & op1;
		result = mcu.setZeroAndSignFlags_8bit(mcu, op0, op1, result);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	and_Rn_imm8(mcu, operand) {
		let result;
		let op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
		let op1 = operand & 0xff;
		result = op0 & op1;
		result = mcu.setZeroAndSignFlags_8bit(mcu, op0, op1, result);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	sub_Rn_Rm(mcu, operand) {
		let result;
		let obj_check = operand & 0xf00f;
		let op0;
		let op1;
		if ((obj_check & 0xf000) === 0x7000) { // CMP/SUB Rn, #imm8
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		} else { // CMP/SUB Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		}
		result = op0 - op1;
		result = mcu.setFlagsFor8bitSub(mcu, op0, op1, result);
		if (obj_check === 0x8008) { // SUB
			mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
		}
	}
	subc_Rn_Rm(mcu, operand) {
		let result;
		let obj_check = operand & 0xf00f;
		let op0;
		let op1;
		let cArr = (mcu.psw & mcu.NXU16_MASK_C_FLAG) !== 0;
		let zero = (mcu.psw & mcu.NXU16_MASK_Z_FLAG) !== 0;
		if ((obj_check & 0xf000) === 0x5000 || (obj_check & 0xf000) === 0x7000) { // CMPC/SUBC Rn, #imm8
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		} else { // CMPC/SUBC Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 0x4 & 0xf);
		}
		result = op0 - op1 - (cArr ? 0x1 : 0);
		result = mcu.setFlagsFor8bitSubc(mcu, op0, op1, result, zero);
		if (obj_check === 0x8009) { // SUBC
			mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
		}
	}
	mov_Rn_Rm(mcu, operand) {
		let result;
		let obj_check = operand & 0xf00f;
		let op0;
		let op1;
		if (obj_check >> 12 === 0) { // MOV Rn, #imm8
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		} else {
			if (obj_check === 0xa00f) { // MOV ECSR, Rm
				op0 = mcu.getECSRForELevel(mcu);
				op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
			} else {
				if (obj_check === 0xa00d) { // MOV ELR, Rm
					op0 = mcu.getELRForELevel(mcu);
					op1 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
				} else {
					if (obj_check === 0xa00c) { // MOV EPSW, Rm
						op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
					} else {
						if (obj_check === 0xa005) { // MOV ERn, ELR
							op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
							op1 = mcu.getELRForELevel(mcu);
						} else {
							if (obj_check === 0xa00b) { // MOV PSW, Rm
								op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
							} else {
								if (obj_check === 0xa007) { // MOV Rn, ECSR
									op1 = mcu.getECSRForELevel(mcu);
								} else {
									if (obj_check === 0xa004) { // MOV Rn, EPSW
										op1 = mcu.getEPSWForELevel(mcu);
									} else {
										if (obj_check === 0xa003) { // MOV Rn, PSW
											op1 = mcu.psw;
										} else {
											if ((operand & 0xf0ff) === 0xa01a) { // MOV ERn, SP
												op1 = mcu.sp;
											} else {
												if ((operand & 0xff00) === 0xe900) { // MOV PSW, #unsigned8
													op1 = operand & 0xff;
												} else if ((operand & 0xff0f) === 0xa10a) { // MOV SP, ERm
													op1 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
												} else { // MOV Rn, Rm
													op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
													op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
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
			mcu.setECSRForELevel(mcu, result);
		} else {
			if (obj_check === 0xa00d) { // MOV ELR, Rm
				mcu.setELRForELevel(mcu, result);
			} else {
				if (obj_check === 0xa00c) { // MOV EPSW, Rm
					mcu.setEPSWForELevel(mcu, result);
				} else {
					if (obj_check === 0xa00b || (operand & 0xff00) === 0xe900) { // MOV PSW, Rm
						mcu.psw = result;
					} else {
						if ((operand & 0xf0ff) === 0xa01a || obj_check === 0xa005) { // MOV ERn, obj
							mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
						} else {
							if (obj_check === 0xa003 || obj_check === 0xa007 || obj_check === 0xa004) { // MOV Rn, obj
								mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
							} else if ((operand & 0xff0f) === 0xa10a) { // MOV SP, ERm
								mcu.sp = result & 0xfffe;
							} else { // MOV Rn, Rm
								result = mcu.setZeroAndSignFlags_8bit(mcu, op0, op1, result);
								mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
							}
						}
					}
				}
			}
		}
	}
	mov_ERn_ERm(mcu, operand) {
		let op0;
		let op1;
		if ((operand & 0xf00f) === 0xf005) { // MOV ERn, ERm
			op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
		} else { // MOV ERn, #imm7
			op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xe);
			op1 = operand & 0x7f;
		}
		if ((operand & 0xf000) === 0xe000 && (op1 & 0x40) !== 0) {
			op1 |= 0xff80;
		}
		let result = op0 = op1;
		result = mcu.setZeroAndSignFlags_16bit(mcu, op0, op1, result);
		mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
	}
	or_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x8003) { // OR Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		} else { // OR Rn, #imm8
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		}
		result = op0 | op1;
		result = mcu.setZeroAndSignFlags_8bit(mcu, op0, op1, result);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	xor_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x8004) { // XOR Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		} else { // XOR Rn, #imm8
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand & 0xff;
		}
		result = op0 ^ op1;
		result = mcu.setZeroAndSignFlags_8bit(mcu, op0, op1, result);
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	sub_ERn_ERm(mcu, operand) {
		let op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
		let op1 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
		let result = op0 - op1;
		result = mcu.setFlagsFor16bitSub(mcu, op0, op1, result);
	}
	sll_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800a) { // SLL Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf) & 7;
		} else { // SLL Rn, #width
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 << op1;
		if (op1 > 0) {
			if ((result & 0x100) !== 0) {
				mcu.psw |= mcu.NXU16_MASK_C_FLAG;
			} else {
				mcu.psw &= ~mcu.NXU16_MASK_C_FLAG;
			}
		}
		result &= 0xff;
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	sllc_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800b) { // SLLC Rn, Rm
			op0 = mcu.get16BitRegisterReverse(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf) & 7;
		} else { // SLLC Rn, #width
			op0 = mcu.get16BitRegisterReverse(mcu, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 << op1;
		if (op1 > 0) {
			if ((result & 0x10000) !== 0) {
				mcu.psw |= mcu.NXU16_MASK_C_FLAG;
			} else {
				mcu.psw &= ~mcu.NXU16_MASK_C_FLAG;
			}
		}
		result = (result & 0xff00) >> 8;
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	sra_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let bit;
		let result;
		if ((operand & 0xf00f) === 0x800e) { // SRA Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf) & 7;
		} else { // SRA Rn, #width
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
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
			mcu.setC(mcu, false);
			mcu.psw |= (op0 >> op1 & 1) << 7;
		}
		result &= 0xff;
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	srl_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800c) { // SRL Rn, Rm
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf) & 7;
		} else { // SRL Rn, #width
			op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 >> op1;
		if (op1 > 0) {
			op1 = op1 - 1;
			if (op0 >> op1 & 1) {
				mcu.setC(mcu, true);
			} else {
				mcu.setC(mcu, false);
			}
		}
		result &= 0xff;
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	srlc_Rn_Rm(mcu, operand) {
		let op0;
		let op1;
		let result;
		if ((operand & 0xf00f) === 0x800d) {
			op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.get8BitRegister(mcu, operand >> 4 & 0xf) & 7;
		} else {
			op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
			op1 = operand >> 4 & 7;
		}
		result = op0 >> op1;
		if (op1 > 0) {
			op1 = op1 - 0x1;
			if (op0 >> op1 & 0x1) {
				mcu.setC(mcu, true);
			} else {
				mcu.setC(mcu, false);
			}
		}
		result &= 0xff;
		mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
	}
	l_ERn_obj(mcu, operand) {
		let op0;
		let op1;
		let ea_inc;
		let obj_check = operand & 0xf0ff;
		let result;
		if (obj_check === 0x9032) { // L ERn, [EA]
			op1 = mcu.dataMemory.get16(mcu.dsr, mcu.ea & 0xfffe);
		} else {
			if (obj_check === 0x9052) { // L ERn, [EA+]
				mcu.ea &= 0xfffe;
				op1 = mcu.dataMemory.get16(mcu.dsr, mcu.ea);
				ea_inc = 2;
			} else {
				if (obj_check === 0x9012) { // L ERn, Dadr
					op0 = mcu.codeMemory.get16(mcu.pc);
					op1 = mcu.dataMemory.get16(mcu.dsr, op0 & 0xffff);
					mcu.pc += 2;
				} else {
					if ((operand & 0xf00f) === 0x9002) { // L ERn, [ERm]
						let op0 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
						op0 &= 0xfffe;
						op1 = mcu.dataMemory.get16(mcu.dsr, op0);
					} else {
						if (obj_check === 0x9030 || obj_check === 0x9050) { // L Rn, [EA(+)]
							op1 = mcu.dataMemory.get8(mcu.dsr, mcu.ea);
							ea_inc = 1;
						} else {
							if (obj_check === 0x9010) { // L Rn, Dadr
								op0 = mcu.codeMemory.get16(mcu.pc);
								op1 = mcu.dataMemory.get8(mcu.dsr, op0);
								mcu.pc += 2;
							} else {
								if ((operand & 0xf00f) === 0x9000) { // L Rn, [ERm]
									let op0 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
									op1 = mcu.dataMemory.get16(mcu.dsr, op0);
								} else {
									if (obj_check === 0x9034) { // L XRn, [EA]
										op1 = mcu.dataMemory.get32(mcu.dsr, mcu.ea & 0xfffe);
										ea_inc = 4;
									} else {
										if (obj_check === 0x9054) { // L XRn, [EA+]
											mcu.ea &= 0xfffe;
											op1 = mcu.dataMemory.get32(mcu.dsr, mcu.ea);
											ea_inc = 4;
										} else {
											if (obj_check === 0x9036) { // L QRn, [EA]
												let op0 = mcu.dataMemory.get64(mcu.dsr, mcu.ea & 0xfffe);
												op0 = op0[0];
												op1 = op0[1];
												ea_inc = 8;
											} else {
												if (obj_check === 0x9056) { // L QRn, [EA+]
													mcu.ea &= 0xfffe;
													let op0 = mcu.dataMemory.get64(mcu.dsr, mcu.ea);
													op0 = op0[0];
													op1 = op0[1];
													ea_inc = 8;
												} else {
													if ((operand & 0xf00f) === 0xa008) { // L ERn, Disp16[ERm]
														let erm = mcu.get16BitRegister(mcu, operand >> 0x4 & 0xf);
														op0 = mcu.codeMemory.get16(mcu.pc);
														erm = erm + op0 & 0xfffe;
														op1 = mcu.dataMemory.get16(mcu.dsr, erm);
														mcu.pc += 0x2;
													} else {
														if ((operand & 0xf0c0) === 0xb040) { // L ERn, Disp16[FP]
															let fp = mcu.get16BitRegister(mcu, 14);
															op0 = operand & 0x3f;
															if ((op0 & 0x20) !== 0) {
																op0 |= 0xffffffe0;
															}
															fp = fp + op0 & 0xfffe;
															op1 = mcu.dataMemory.get16(mcu.dsr, fp);
														} else {
															if ((operand & 0xf0c0) === 0xd040) { // L Rn, Disp16[FP]
																let fp = mcu.get16BitRegister(mcu, 14);
																op0 = operand & 0x3f;
																if ((op0 & 0x20) !== 0) {
																	op0 |= 0xffffffe0;
																}
																fp = fp + op0 & 0xffff;
																op1 = mcu.dataMemory.get8(mcu.dsr, fp);
															} else {
																if ((operand & 0xf000) === 0xb000) { // L ERn, Disp6[BP]
																	let bp = mcu.get16BitRegister(mcu, 12);
																	op0 = operand & 0x3f;
																	if ((op0 & 0x20) !== 0) {
																		op0 |= 0xffffffe0;
																	}
																	bp = bp + op0 & 0xfffe;
																	op1 = mcu.dataMemory.get16(mcu.dsr, bp);
																} else {
																	if ((operand & 0xf000) === 0xd000) { // L Rn, Disp6[BP]
																		let bp = mcu.get16BitRegister(mcu, 12);
																		op0 = operand & 0x3f;
																		if ((op0 & 0x20) !== 0) {
																			op0 |= 0xffffffe0;
																		}
																		bp = bp + op0 & 0xffff;
																		op1 = mcu.dataMemory.get8(mcu.dsr, bp);
																	} else {
																		if ((operand & 0xf00f) === 0x9008) { // L Rn, Disp16[ERm]
																			let erm = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
																			op0 = mcu.codeMemory.get16(mcu.pc);
																			erm = erm + op0 & 0xffff;
																			op1 = mcu.dataMemory.get8(mcu.dsr, erm);
																			mcu.pc += 2;
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
			result = mcu.setZeroAndSignFlags_16bit(mcu, op0, op1, result);
			mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
		} else {
			if (obj_check === 0x9030 || obj_check === 0x9050 || (operand & 0xf00f) === 0x9000 || obj_check === 0x9010 || obj_check === 0x9012 || (operand & 0xf00f) === 0x9008 || (operand & 0xf000) === 0xd000 || (operand & 0xf0c0) === 0xd040) { // L Rn, obj; L ERn, Dadr
				result &= 0xff;
				result = mcu.setZeroAndSignFlags_8bit(mcu, op0, op1, result);
				mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, result);
			} else {
				if (obj_check === 0x9034 || obj_check === 0x9054) { // L XRn, obj
					result = mcu.setZeroAndSignFlags_32bit(mcu, op0, op1, result);
					mcu.setOperationResult32bit(mcu, operand >> 8 & 0xf, result);
				} else if (obj_check === 0x9036 || obj_check === 0x9056) { // L QRn, obj
					mcu.setZeroAndSignFlags_64bit(mcu, op0, op1, result);
					mcu.setOperationResult64bit(mcu, operand >> 8 & 0xf, op0, op1);
				}
			}
		}
		if (obj_check === 0x9052 || obj_check === 0x9050 || obj_check === 0x9054 || obj_check === 0x9056) { // Increment EA
			mcu.ea += ea_inc;
		}
	}
	st_ERn_obj(mcu, operand) {
		let op0;
		let op1;
		let obj_check = operand & 0xf0ff;
		let ea_inc;
		if (obj_check === 0x9033) { // ST ERn, [EA]
			op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
			op1 = mcu.ea & 0xfffe;
			ea_inc = 2;
		} else {
			if (obj_check === 0x9053) { // ST ERn, [EA+]
				op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
				mcu.ea &= 0xfffe;
				op1 = mcu.ea;
				ea_inc = 2;
			} else {
				if (obj_check === 0x9013) { // ST ERn, Dadr
					op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
					op1 = mcu.codeMemory.get16(mcu.pc);
					ea_inc = 2;
					mcu.pc += 2;
				} else {
					if ((operand & 0xf00f) === 0x9003) { // ST ERn, [ERm]
						op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
						op1 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
						ea_inc = 2;
					} else {
						if (obj_check === 0x9031 || obj_check === 0x9051) { // ST Rn, [EA(+)]
							op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
							op1 = mcu.ea;
							ea_inc = 1;
						} else {
							if (obj_check === 0x9011) { // ST Rn, Dadr
								op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
								op1 = mcu.codeMemory.get16(mcu.pc);
								ea_inc = 1;
								mcu.pc += 2;
							} else {
								if ((operand & 0xf00f) === 0x9001) { // ST Rn, [ERm]
									op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
									op1 = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
									ea_inc = 1;
								} else {
									if ((operand & 0xf00f) === 0xa009) { // ST ERn, Disp16[ERm]
										op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
										let erm = mcu.get16BitRegister(mcu, operand >> 0x4 & 0xf);
										op1 = mcu.codeMemory.get16(mcu.pc);
										op1 = erm + op1 & 0xfffe;
										ea_inc = 2;
										mcu.pc += 2;
									} else {
										if ((operand & 0xf00f) === 0x9009) { // ST ERn, Disp16[ERm]
											op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
											let erm = mcu.get16BitRegister(mcu, operand >> 0x4 & 0xf);
											op1 = mcu.codeMemory.get16(mcu.pc);
											op1 = erm + op1 & 0xffff;
											ea_inc = 1;
											mcu.pc += 2;
										} else {
											if ((operand & 0xf0c0) === 0xb080) { // ST ERn, Disp6[BP]
												op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
												let bp = mcu.get16BitRegister(mcu, 12);
												op1 = operand & 0x3f;
												if ((op1 & 0x20) !== 0) {
													op1 |= 0xffffffe0;
												}
												op1 = bp + op1 & 0xfffe;
												ea_inc = 2;
											} else {
												if ((operand & 0xf0c0) === 0xd080) { // ST Rn, Disp6[BP]
													op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
													let bp = mcu.get16BitRegister(mcu, 12);
													op1 = operand & 0x3f;
													if ((op1 & 0x20) !== 0) {
														op1 |= 0xffffffe0;
													}
													op1 = bp + op1 & 0xffff;
													ea_inc = 1;
												} else {
													if ((operand & 0xf0c0) === 0xd0c0) { // ST Rn, Disp6[FP]
														op0 = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
														let fp = mcu.get16BitRegister(mcu, 14);
														op1 = operand & 0x3f;
														if ((op1 & 0x20) !== 0) {
															op1 |= 0xffffffe0;
														}
														op1 = fp + op1 & 0xffff;
														ea_inc = 1;
													} else {
														if ((operand & 0xf0c0) === 0xb0c0) { // ST ERn, Disp6[FP]
															op0 = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
															let fp = mcu.get16BitRegister(mcu, 14);
															op1 = operand & 0x3f;
															if ((op1 & 0x20) !== 0) {
																op1 |= 0xffffffe0;
															}
															op1 = fp + op1 & 0xfffe;
															ea_inc = 2;
														} else {
															if (obj_check === 0x9035) { // ST XRn, [EA]
																op0 = mcu.get32BitRegister(mcu, operand >> 8 & 0xf);
																op1 = mcu.ea & 0xfffe;
																ea_inc = 4;
															} else {
																if (obj_check === 0x9055) { // ST XRn, [EA+]
																	op0 = mcu.get32BitRegister(mcu, operand >> 8 & 0xf);
																	mcu.ea &= 0xfffe;
																	op1 = mcu.ea;
																	ea_inc = 4;
																} else {
																	if (obj_check === 0x9037) { // ST QRn, [EA]
																		op0 = mcu.get64BitRegister(mcu, operand >> 8 & 0xf);
																		op1 = mcu.ea & 0xfffe;
																		ea_inc = 8;
																	} else if (obj_check === 0x9057) { // ST QRn, [EA+]
																		op0 = mcu.get64BitRegister(mcu, operand >> 8 & 0xf);
																		mcu.ea &= 0xfffe;
																		op1 = mcu.ea;
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
				mcu.dataMemory.set8(mcu.dsr, op0 >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
		} else { // QRn
			for (let i = 0; i < 4; i++) {
				mcu.dataMemory.set8(mcu.dsr, op0[0] >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0[0].toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
			for (let i = 4; i < 8; i++) {
				mcu.dataMemory.set8(mcu.dsr, op0[1] >> 8 * i & 0xff, op1 + i);
			}
			if (constants.Constants.DEBUG_DISPLAY_ADDRESSES && op1 > constants.Constants.DISPLAY_BUFFER_START_ADDRESS && op1 < constants.Constants.DISPLAY_BUFFER_END_ADDRESS) {
				console.log("wrote 0x" + op0[1].toString(16) + " to display address 0x" + op1.toString(16));
			}
			if (constants.Constants.DEBUG_ARBITRARY_ADDRESSES && op1 === constants.Constants.DEBUG_ARBITRARY_MEMORY_ADDRESS) {
				console.log("wrote 0x" + op0.toString(16) + " to display address 0x" + op1.toString(16));
			}
		}
		if (obj_check === 0x9053 || obj_check === 0x9051 || obj_check === 0x9055 || obj_check === 0x9057) { // Increment EA
			mcu.ea += ea_inc;
		}
	}
	add_SP_imm8(mcu, operand) {
		let old_sp = mcu.sp;
		let imm8 = operand & 0xff;
		if ((imm8 & 0x80) === 0) {
			imm8 &= 0x7f;
		} else {
			imm8 |= 0xff80;
		}
		let new_sp = old_sp + imm8;
		new_sp &= 0xffff;
		mcu.sp = new_sp & 0xfffe;
	}
	pushValueToStack(mcu, val, size) {
		let i;
		for (i = 0; i < size; i++) {
			mcu.sp--;
			mcu.dataMemory.set8(0, val >> 8 * (size - i - 1) & 0xff, mcu.sp);
		}
		if (constants.Constants.DEBUG_PUSH_POP) {
			console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  pushed something " + val.toString(16));
		}
	}
	popValueFromStack(mcu, size) {
		var val = 0;
		for (let i = size - 1; i >= 0; i--) {
			val |= mcu.dataMemory.get8(0, mcu.sp) << 8 * (size - i - 1);
			mcu.sp++;
		}
		if (constants.Constants.DEBUG_PUSH_POP) {
			console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  popped something " + val.toString(16));
		}
		return val;
	}
	push_obj(mcu, operand) {
		let reg_list;
		let pushval;
		let obj_check = operand & 0xf0ff;
		if (obj_check === 0xf04e) { // PUSH Rn
			pushval = mcu.get8BitRegister(mcu, operand >> 8 & 0xf);
			mcu.pushValueToStack(mcu, pushval, 2);
		} else {
			if (obj_check === 0xf05e) { // PUSH ERn
				pushval = mcu.get16BitRegister(mcu, operand >> 8 & 0xf);
				mcu.pushValueToStack(mcu, pushval, 2);
			} else {
				if (obj_check === 0xf06e) { // PUSH XRn
					pushval = mcu.get32BitRegister(mcu, operand >> 8 & 0xf);
					mcu.pushValueToStack(mcu, pushval, 4);
				} else {
					if (obj_check === 0xf07e) { // PUSH QRn
						pushval = mcu.get64BitRegister(mcu, operand >> 8 & 0xf);
						mcu.pushValueToStack(mcu, pushval[1], 4);
						mcu.pushValueToStack(mcu, pushval[0], 4);
					} else if (obj_check === 0xf0ce) { // PUSH register_list
						reg_list = operand >> 8 & 0xff;
						if ((reg_list & mcu.NXU16_PUSH_REGISTER_LIST_ELR) !== 0) {
							mcu.pushValueToStack(mcu, mcu.ecsr1, 2);
							mcu.pushValueToStack(mcu, mcu.elr1, 2);
						}
						if ((reg_list & mcu.NXU16_PUSH_REGISTER_LIST_PSW) !== 0) {
							mcu.pushValueToStack(mcu, mcu.psw, 2);
						}
						if ((reg_list & mcu.NXU16_PUSH_REGISTER_LIST_LR) !== 0) {
							mcu.pushValueToStack(mcu, mcu.lcsr, 2);
							mcu.pushValueToStack(mcu, mcu.lr & 0xffff, 2);
							if (constants.Constants.DEBUG_PUSH_POP) {
								console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  pushed lr=0x" + mcu.lr.toString(16));
							}
						}
						if ((reg_list & mcu.NXU16_PUSH_REGISTER_LIST_EA) !== 0) {
							mcu.pushValueToStack(mcu, mcu.ea, 2);
						}
					}
				}
			}
		}
	}
	use_DSR(mcu, operand) {
		if (operand === 0xfe9f) {
			mcu.dsr = mcu.currentDSR;
		} else {
			mcu.currentDSR = operand & 0xff;
			mcu.dsr = mcu.currentDSR;
		}
		let next_op = mcu.codeMemory.get16(mcu.pc);
		mcu.pc += 0x2;
		mcu.operation[next_op](mcu, next_op);
		mcu.dsr = 0;
	}
	use_DSR_fromRegister(mcu, operand) {
		let d = operand >> 0x4 & 0xf;
		mcu.currentDSR = mcu.get8BitRegister(mcu, d);
		mcu.dsr = mcu.currentDSR;
		let next_op = mcu.codeMemory.get16(mcu.pc);
		mcu.pc += 0x2;
		mcu.operation[next_op](mcu, next_op);
		mcu.dsr = 0;
	}
	pop_obj(mcu, operand) {
		let reg_list;
		let popval;
		let obj_check = operand & 0xf0ff;
		if (obj_check === 0xf01e) { // POP Rn
			popval = mcu.popValueFromStack(mcu, 2);
			mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, popval);
		} else {
			if (obj_check === 0xf00e) { // POP ERn
				popval = mcu.popValueFromStack(mcu, 2);
				mcu.setOperationResult8bit(mcu, operand >> 8 & 0xf, popval & 0xff);
			} else {
				if (obj_check === 0xf02e) { // POP XRn
					popval = mcu.popValueFromStack(mcu, 4);
					mcu.setOperationResult32bit(mcu, operand >> 8 & 0xf, popval);
				} else {
					if (obj_check === 0xf03e) { // POP QRn
						if ((operand >> 8 & 0xf) === 0) {
							mcu.r0 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r1 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r2 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r3 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r4 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r5 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r6 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r7 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
						} else {
							mcu.r8 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r9 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r10 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r11 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r12 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r13 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r14 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
							mcu.r15 = mcu.dataMemory.get8(mcu.dsr, mcu.sp++);
						}
					} else {
						if (obj_check === 0xf08e) { // POP register_list
							reg_list = operand >> 8 & 0xff;
							if ((reg_list & mcu.NXU16_POP_REGISTER_LIST_EA) !== 0) {
								mcu.ea = mcu.popValueFromStack(mcu, 2);
							}
							if ((reg_list & mcu.NXU16_POP_REGISTER_LIST_LR) !== 0) {
								mcu.ecsr = mcu.popValueFromStack(mcu, 2) & 0x3;
								mcu.pc = mcu.ecsr << 16 | mcu.popValueFromStack(mcu, 0x2);
							}
							if ((reg_list & mcu.NXU16_POP_REGISTER_LIST_PSW) !== 0) {
								mcu.psw = mcu.popValueFromStack(mcu, 2) & 0xff;
							}
							if ((reg_list & mcu.NXU16_POP_REGISTER_LIST_PC) !== 0) {
								let pc = mcu.popValueFromStack(mcu, 2);
								if (constants.Constants.DEBUG_PUSH_POP) {
									console.log("*****-*-*-*-*-*-*-*-*-*-*-*-*-  popped pc=" + mcu.ecsr + ":" + mcu.pc.toString(16));
									console.log("writing pc= 0x" + pc.toString(16));
								}
								mcu.pc = pc;
								mcu.ecsr = mcu.popValueFromStack(mcu, 2) & 0x3;
								mcu.pc = mcu.ecsr << 16 | mcu.pc;
							}
						}
					}
				}
			}
		}
	}
	lea_obj(mcu, operand) {
		let obj_check = operand & 0xf00f;
		if (obj_check === 0xf00a) { // LEA [ERm]
			let erm = mcu.get16BitRegister(mcu, operand >> 0x4 & 0xf);
			mcu.ea = erm;
		} else {
			if (obj_check === 0xf00b) { // LEA Disp16[ERm]
				let erm = mcu.get16BitRegister(mcu, operand >> 0x4 & 0xf);
				let disp16 = mcu.codeMemory.get16(mcu.pc);
				erm = erm + disp16 & 0xffff;
				mcu.ea = erm;
				mcu.pc += 0x2;
			} else {
				if (obj_check === 0xf00c) { // LEA Dadr
					let dadr = mcu.codeMemory.get16(mcu.pc);
					mcu.ea = dadr;
					mcu.pc += 0x2;
				}
			}
		}
	}
	daa_obj(mcu, operand) {
		const cArr = (mcu.psw & mcu.NXU16_MASK_C_FLAG) !== 0;
		const half_cArr = (mcu.psw & mcu.NXU16_MASK_HC_FLAG) !== 0;
		const n = operand >> 8 & 0xf;
		const rn = mcu.get8BitRegister(mcu, n);
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
			mcu.psw |= mcu.NXU16_MASK_S_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_S_FLAG;
		}
		if (result === 0) {
			mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
		}
		if (!cArr && (hi_nib > 0x9 || !half_cArr && hi_nib >= 0x9 && lo_nib > 0x9)) {
			mcu.psw |= mcu.NXU16_MASK_C_FLAG;
		}
		if ((result ^ rn ^ add_val) & 0x10) {
			mcu.psw |= mcu.NXU16_MASK_HC_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_HC_FLAG;
		}
		mcu.setOperationResult8bit(mcu, n, result);
	}
	das_obj(mcu, operand) {
		const cArr = (mcu.psw & mcu.NXU16_MASK_C_FLAG) !== 0;
		const half_cArr = (mcu.psw & mcu.NXU16_MASK_HC_FLAG) !== 0;
		const n = operand >> 8 & 0xf;
		const rn = mcu.get8BitRegister(mcu, n);
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
			mcu.psw |= mcu.NXU16_MASK_S_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_S_FLAG;
		}
		if (result === 0) {
			mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
		}
		if ((rn & 0xf) - (sub_val & 0xf) & -16) {
			mcu.psw |= mcu.NXU16_MASK_HC_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_HC_FLAG;
		}
		mcu.setOperationResult8bit(mcu, n, result);
	}
	neg_obj(mcu, operand) {
		const n = operand >> 8 & 0xf;
		const rn = mcu.get8BitRegister(mcu, n);
		let result = 0 - rn;
		result = mcu.setFlagsFor8bitSub(mcu, 0, rn, result);
		mcu.setOperationResult8bit(mcu, n, result);
	}
	mul_ERn_Rm(mcu, operand) {
		const n = operand >> 8 & 0xf;
		const m = operand >> 4 & 0xf;
		const rn = mcu.get8BitRegister(mcu, n);
		const rm = mcu.get8BitRegister(mcu, m);
		const result = rn * rm;
		if (result === 0) {
			mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
		}
		mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
	}
	div_ERn_Rm(mcu, operand) {
		const n = operand >> 8 & 0xf;
		const m = operand >> 4 & 0xf;
		const rn = mcu.get16BitRegister(mcu, n);
		const rm = mcu.get8BitRegister(mcu, m);
		if (rm === 0) {
			mcu.setC(mcu, true);
		} else {
			const result = Math.floor(rn / rm);
			const remainder = rn % rm >>> 0;
			mcu.setC(mcu, false);
			if (result === 0) {
				mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
			} else {
				mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
			}
			mcu.setOperationResult16bit(mcu, operand >> 8 & 0xf, result);
			mcu.setOperationResult8bit(mcu, m, remainder);
		}
	}
	sb_rn(mcu, operand) {
		let bit = operand >> 4 & 7;
		let n;
		let op0;
		let obj_check = operand & 0xf08f;
		if (obj_check === 0xa000) { // SB Rn.bit_offset
			n = operand >> 8 & 0xf;
			op0 = mcu.get8BitRegister(mcu, n);
		} else if (obj_check === 0xa080) { // SB Dadr.bit_offset
			n = mcu.codeMemory.get16(mcu.pc);
			op0 = mcu.dataMemory.get8(mcu.dsr, n);
			mcu.pc += 2;
		}
		let bit_mask = 1 << bit;
		if ((op0 & bit_mask) === 0) {
			mcu.setZ(mcu, true);
		} else {
			mcu.setZ(mcu, false);
		}
		op0 |= bit_mask;
		if (obj_check === 0xa000) { // SB Rn.bit_offset
			mcu.setOperationResult8bit(mcu, n, op0);
		} else if (obj_check === 0xa080) { // SB Dadr.bit_offset
			mcu.dataMemory.set8(mcu.dsr, op0, n);
		}
	}
	rb_rn(mcu, operand) {
		let bit = operand >> 4 & 7;
		let n;
		let op0;
		let obj_check = operand & 0xf08f;
		if (obj_check === 0xa002) { // RB Rn.bit_offset
			n = operand >> 8 & 0xf;
			op0 = mcu.get8BitRegister(mcu, n);
		} else if (obj_check === 0xa082) { // RB Dadr.bit_offset
			n = mcu.codeMemory.get16(mcu.pc);
			op0 = mcu.dataMemory.get8(mcu.dsr, n);
			mcu.pc += 0x2;
		}
		if ((op0 >> bit & 0x1) === 0) {
			mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
		}
		op0 &= ~(0x1 << bit) & 0xff;
		if (obj_check === 0xa002) { // RB Rn.bit_offset
			mcu.setOperationResult8bit(mcu, n, op0);
		} else if (obj_check === 0xa082) { // RB Dadr.bit_offset
			mcu.dataMemory.set8(mcu.dsr, op0, n);
		}
	}
	tb_rn(mcu, operand) {
		let bit = operand >> 0x4 & 0x7;
		let n;
		let op0;
		let obj_check = operand & 0xf08f;
		if (obj_check === 0xa001) { // TB Rn.bit_offset
			n = operand >> 8 & 0xf;
			op0 = mcu.get8BitRegister(mcu, n);
		} else if (obj_check === 0xa081) { // TB Rn.bit_offset
			n = mcu.codeMemory.get16(mcu.pc);
			op0 = mcu.dataMemory.get8(mcu.dsr, n);
			mcu.pc += 0x2;
		}
		if ((op0 >> bit & 0x1) === 0) {
			mcu.psw |= mcu.NXU16_MASK_Z_FLAG;
		} else {
			mcu.psw &= ~mcu.NXU16_MASK_Z_FLAG;
		}
	}
	b_conditional(mcu, operand) {
		var jump = false;
		var radr = operand & 0xff;
		var cond = operand >> 8 & 0xf;
		if ((radr & 0x80) !== 0) {
			radr |= 0xffffff80;
		}
		radr *= 0x2;
		switch (cond) {
			case 0: // BGE/BNC
				jump = !mcu.isCSet(mcu);
				break;
			case 1: // BLT/BCY
				jump = mcu.isCSet(mcu);
				break;
			case 2: // BGT
				jump = mcu.isCSet(mcu) === false && mcu.isZSet(mcu) === false;
				break;
			case 3: // BLE
				jump = mcu.isCSet(mcu) === true || mcu.isZSet(mcu) === true;
				break;
			case 4: // BGES
				var ov = mcu.isOVSet(mcu);
				var s = mcu.isSSet(mcu);
				jump = !(s !== ov);
				break;
			case 5: // BLTS
				var ov = mcu.isOVSet(mcu);
				var s = mcu.isSSet(mcu);
				jump = s !== ov;
				break;
			case 6: // BGTS
				var ov = mcu.isOVSet(mcu);
				var s = mcu.isSSet(mcu);
				var z = mcu.isZSet(mcu);
				jump = !(s !== ov || z);
				break;
			case 7: // BLES
				var z = mcu.isZSet(mcu);
				var ov = mcu.isOVSet(mcu);
				var s = mcu.isSSet(mcu);
				jump = s !== ov || z;
				break;
			case 8: // BNE/BNZ
				var z = mcu.isZSet(mcu);
				jump = !z;
				break;
			case 9: // BEQ/BZ
				var z = mcu.isZSet(mcu);
				jump = z;
				break;
			case 0xa: // BNV
				jump = !mcu.isOVSet(mcu);
				break;
			case 0xb: // BOV
				jump = mcu.isOVSet(mcu);
				break;
			case 0xc: // BPS
				var s = mcu.isSSet(mcu);
				jump = !s;
				break;
			case 0xd: // BNS
				var s = mcu.isSSet(mcu);
				jump = s;
				break;
			case 0xe: // BAL
				jump = true;
				break;
		}
		if (jump) {
			mcu.pc += radr;
		}
	}
	extbw_rn(mcu, operand) {
		let rn = mcu.get8BitRegister(mcu, operand >> 4 & 0xf);
		if ((rn & 0x80) !== 0) {
			rn |= 0xff80;
			mcu.setS(mcu, true);
		} else {
			mcu.setS(mcu, false);
		}
		if (rn === 0) {
			mcu.setZ(mcu, true);
		} else {
			mcu.setZ(mcu, false);
		}
		mcu.setOperationResult16bit(mcu, (operand >> 9 & 7) << 1, rn);
	}
	swi_snum(mcu, operand) {
		let snum = operand & 0x3f;
		let swi_handler = function () {
			if (snum === 1) {
				if (typeof mcu.parent !== "undefined") {
					let er0 = mcu.get16BitRegister(mcu, 0);
					mcu.callScreenChanged(mcu, er0);
					mcu.r0 = 0;
					mcu.r1 = 0;
				}
			} else {
				if (snum === 2) {
					let keycode = mcu.keyEventProcessor.getNextKeyCode();
					if (keycode === 0x29 && mcu.is2ndMode) {
						keycode = 0;
					}
					mcu.r1 = 0;
					mcu.r0 = keycode & 0xff;
					mcu.isBusy = true;
					if (mcu.r0 === 0xff) {
						mcu.r2 = mcu.uartStartAddress & 0xff;
						mcu.r3 = mcu.uartStartAddress >> 8 & 0xff;
					}
				} else {
					if (snum === 3) {
						if (typeof mcu.automationResolve === "function") {
							let er0 = mcu.get16BitRegister(mcu, 0);
							let er2 = mcu.get16BitRegister(mcu, 2);
							if (mcu.taRspBuffer === null) {
								let addr = mcu.dataMemory.get8(0, er0) | mcu.dataMemory.get8(0, er0 + 0x1) << 8;
								mcu.taRspLength = addr + 0x2;
								mcu.taRspBuffer = new Uint8Array(mcu.taRspLength);
							}
							for (let i = 0; i < er2; i++) {
								mcu.taRspBuffer[mcu.taRspIndex++] = mcu.dataMemory.get8(0, er0 + i);
							}
							if (mcu.taRspIndex === mcu.taRspLength) {
								mcu.automationResolve(mcu.taRspBuffer);
								mcu.taRspBuffer = null;
								mcu.taRspLength = 0;
								mcu.taRspIndex = 0;
								mcu.automationResolve = undefined;
							} else if (mcu.taRspIndex > mcu.taRspLength) {
								mcu.automationReject("Failed to create response.");
								mcu.taRspBuffer = null;
								mcu.taRspLength = 0;
								mcu.taRspIndex = 0;
							}
						} else if (typeof mcu.uartReady === "function") {
							if (typeof mcu.uartBufLenLocation === "undefined") {
								mcu.uartBufLenLocation = mcu.dataMemory.get16(0, 0x106);
								mcu.uartStartAddress = mcu.uartBufLenLocation + 0x2;
								console.log("TA framework is ready.");
								mcu.uartReady("TA framework is ready.");
							} else {
								console.log("TA initialized already.");
							}
						}
					} else {
						if (snum === 4) {
							if (typeof mcu.parent !== "undefined") {
								let er0 = mcu.get16BitRegister(mcu, 0);
								mcu.callTopIconsChanged(mcu, er0);
								mcu.r0 = 0;
								mcu.r1 = 0;
							}
						} else if (snum === 5) {
							mcu.keyEventProcessor.notifyKeyCanRepeat();
						}
					}
				}
			}
			let swi_addr = (snum << 0x1) + 0x80;
			return mcu.codeMemory.get16(swi_addr);
		};
		mcu.psw1 = mcu.psw;
		mcu.psw |= 0x1;
		mcu.elr1 = mcu.pc & 0xffff;
		mcu.ecsr1 = mcu.ecsr;
		mcu.psw &= ~mcu.NXU16_MASK_MIE_FLAG;
		mcu.pc = swi_handler();
	}
	brk(mcu, operand) {
		const elevel = mcu.psw & mcu.NXU16_MASK_ELEVEL;
		if (elevel > 1) {
			mcu.resetAll(mcu);
			mcu.sp = mcu.codeMemory.get16(0);
			mcu.pc = mcu.codeMemory.get16(2);
		}
		if (elevel < 2) {
			mcu.elr2 = mcu.pc & 0xffff;
			mcu.ecsr2 = mcu.ecsr;
			mcu.psw2 = mcu.psw;
			mcu.psw |= 2;
			mcu.pc = mcu.codeMemory.get16(4);
		}
	}
	b_cadr(mcu, operand) {
		let cadr;
		if ((operand & 0xf00f) === 0xf000) { // B Cadr
			mcu.ecsr = operand >> 8 & 3;
			cadr = mcu.codeMemory.get16(mcu.pc);
		} else {
			if ((operand & 0xf00f) === 0xf001) { // BL Cadr
				mcu.lr = mcu.pc + 2 & 0xffff;
				mcu.lcsr = mcu.ecsr;
				mcu.ecsr = operand >> 8 & 0xf;
				cadr = mcu.codeMemory.get16(mcu.pc);
			} else {
				if ((operand & 0xf00f) === 0xf002) { // B ERn
					cadr = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
				} else if ((operand & 0xf00f) === 0xf003) { // BL ERn
					mcu.lr = mcu.pc + 2 & 0xffff;
					mcu.lcsr = mcu.ecsr;
					cadr = mcu.get16BitRegister(mcu, operand >> 4 & 0xf);
				}
			}
		}
		mcu.pc = mcu.ecsr << 16 | cadr;
	}
	checkForInterrupt() {
		const mcu = this;
		const data_mem = mcu.dataMemory;
		if (mcu.pendingEI > 0) {
			mcu.pendingEI--;
		} else {
			for (let i = 0; i < 1; i++) {
				if (data_mem.get8(0, data_mem.INTERRUPT_IRQ0 + i) !== 0) {
					mcu.elr2 = mcu.pc & 0xffff;
					mcu.ecsr2 = mcu.ecsr;
					mcu.psw2 = mcu.psw;
					mcu.psw = 2;
					mcu.ecsr = 0;
					mcu.pc = mcu.getInterruptHandlerAddress(mcu, i, false);
					break;
				}
			}
			if (mcu.isMIESet(mcu)) {
				for (let j = 1; j < 8; j++) {
					if (data_mem.get8(0, data_mem.INTERRUPT_IE0 + j) !== 0 && data_mem.get8(0, data_mem.INTERRUPT_IRQ0 + j) !== 0) {
						if ((mcu.psw & mcu.NXU16_MASK_ELEVEL) < 2) {
							mcu.elr1 = mcu.pc & 0xffff;
							mcu.ecsr1 = mcu.ecsr;
							mcu.psw1 = mcu.psw;
							mcu.psw = 1;
							mcu.setMIE(mcu, false);
							mcu.ecsr = 0;
							mcu.pc = mcu.getInterruptHandlerAddress(mcu, j, true);
							break;
						}
					}
				}
			}
		}
	}
	run() {
		let mcu = this;
		let pc;
		let operand;
		const loop_count = this.isBusy ? 0x1388 : 0x32;
		for (let i = 0; i < loop_count; i++) {
			pc = this.pc;
			operand = this.codeMemory.get16(pc);
			if (operand === 0xe502 && mcu.keyEventProcessor.isQueueEmpty()) { // E502 = SWI 2
				this.isBusy = false;
				break;
			}
			if (constants.Constants.SHOW_C_TRACE && typeof dolphinMapData[pc] !== "undefined") {
				console.log("pc= 0x" + pc.toString(16) + " - " + dolphinMapData[pc]);
				if (dolphinMapData[pc].includes("memClearedDialog")) {
					mcu.showConsole = true;
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
		let _0x362ddc = mcu.dataMemory.get8(0, mcu.dataMemory.INTERRUPT_IRQ7);
		if ((_0x362ddc & 0x1) !== 0) {
			_0x362ddc = _0x362ddc ^ 0x1;
			mcu.dataMemory.set8(0, _0x362ddc, mcu.dataMemory.INTERRUPT_IRQ7);
			if (mcu.keyEventProcessor.isQueueEmpty() && !mcu.keyEventProcessor.isPotentialAutoRepeat()) {
				mcu.setLastKeyPressed(0);
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
