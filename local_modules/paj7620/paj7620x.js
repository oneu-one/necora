const rg = require("@necora/rgpio");

class PAJ7620 {
  constructor() {
    this.i2cHand = null;
    this.GES_REACTION_TIME = 0.1; // default:0.5 // You can adjust the reaction time according to the actual circumstance.
    this.GES_ENTRY_TIME = 0.05; // default:0.8 // When you want to recognize the Forward/Backward gestures, your gestures' reaction time must less than GES_ENTRY_TIME(0.8s).
    this.GES_QUIT_TIME = 1.0;

    this.BANK0 = 0;
    this.BANK1 = 1;

    this.PAJ7620_ADDR_BASE = 0x00;

    //REGISTER BANK SELECT
    this.PAJ7620_REGITER_BANK_SEL = PAJ7620_ADDR_BASE + 0xef; //W

    //DEVICE ID
    // this.PAJ7620_ID = 0x73;

    //REGISTER BANK 0
    this.PAJ7620_ADDR_SUSPEND_CMD = PAJ7620_ADDR_BASE + 0x3; //W
    this.PAJ7620_ADDR_GES_PS_DET_MASK_0 = PAJ7620_ADDR_BASE + 0x41; //RW
    this.PAJ7620_ADDR_GES_PS_DET_MASK_1 = PAJ7620_ADDR_BASE + 0x42; //RW
    this.PAJ7620_ADDR_GES_PS_DET_FLAG_0 = PAJ7620_ADDR_BASE + 0x43; //R
    this.PAJ7620_ADDR_GES_PS_DET_FLAG_1 = PAJ7620_ADDR_BASE + 0x44; //R
    this.PAJ7620_ADDR_STATE_INDICATOR = PAJ7620_ADDR_BASE + 0x45; //R
    this.PAJ7620_ADDR_PS_HIGH_THRESHOLD = PAJ7620_ADDR_BASE + 0x69; //RW
    this.PAJ7620_ADDR_PS_LOW_THRESHOLD = PAJ7620_ADDR_BASE + 0x6a; //RW
    this.PAJ7620_ADDR_PS_APPROACH_STATE = PAJ7620_ADDR_BASE + 0x6b; //R
    this.PAJ7620_ADDR_PS_RAW_DATA = PAJ7620_ADDR_BASE + 0x6c; //R

    //REGISTER BANK 1
    this.PAJ7620_ADDR_PS_GAIN = PAJ7620_ADDR_BASE + 0x44; //RW
    this.PAJ7620_ADDR_IDLE_S1_STEP_0 = PAJ7620_ADDR_BASE + 0x67; //RW
    this.PAJ7620_ADDR_IDLE_S1_STEP_1 = PAJ7620_ADDR_BASE + 0x68; //RW
    this.PAJ7620_ADDR_IDLE_S2_STEP_0 = PAJ7620_ADDR_BASE + 0x69; //RW
    this.PAJ7620_ADDR_IDLE_S2_STEP_1 = PAJ7620_ADDR_BASE + 0x6a; //RW
    this.PAJ7620_ADDR_OP_TO_S1_STEP_0 = PAJ7620_ADDR_BASE + 0x6b; //RW
    this.PAJ7620_ADDR_OP_TO_S1_STEP_1 = PAJ7620_ADDR_BASE + 0x6c; //RW
    this.PAJ7620_ADDR_OP_TO_S2_STEP_0 = PAJ7620_ADDR_BASE + 0x6d; //RW
    this.PAJ7620_ADDR_OP_TO_S2_STEP_1 = PAJ7620_ADDR_BASE + 0x6e; //RW
    this.PAJ7620_ADDR_OPERATION_ENABLE = PAJ7620_ADDR_BASE + 0x72; //RW

    //PAJ7620_REGITER_BANK_SEL
    this.PAJ7620_BANK0 = 0;
    this.PAJ7620_BANK1 = 1;

    //PAJ7620_ADDR_SUSPEND_CMD
    this.PAJ7620_I2C_WAKEUP = 1;
    this.PAJ7620_I2C_SUSPEND = 0;

    //PAJ7620_ADDR_OPERATION_ENABLE
    this.PAJ7620_ENABLE = 1;
    this.PAJ7620_DISABLE = 0;

    //ADC, delete
    this.REG_ADDR_RESULT = 0x00;
    this.REG_ADDR_ALERT = 0x01;
    this.REG_ADDR_CONFIG = 0x02;
    this.REG_ADDR_LIMITL = 0x03;
    this.REG_ADDR_LIMITH = 0x04;
    this.REG_ADDR_HYST = 0x05;
    this.REG_ADDR_CONVL = 0x06;
    this.REG_ADDR_CONVH = 0x07;

    this.GES_RIGHT_FLAG = 1 << 0;
    this.GES_LEFT_FLAG = 1 << 1;
    this.GES_UP_FLAG = 1 << 2;
    this.GES_DOWN_FLAG = 1 << 3;
    this.GES_FORWARD_FLAG = 1 << 4;
    this.GES_BACKWARD_FLAG = 1 << 5;
    this.GES_CLOCKWISE_FLAG = 1 << 6;
    this.GES_COUNT_CLOCKWISE_FLAG = 1 << 7;
    this.GES_WAVE_FLAG = 1 << 0;

    //Gesture output
    this.FORWARD = 1;
    this.BACKWARD = 2;
    this.RIGHT = 3;
    this.LEFT = 4;
    this.UP = 5;
    this.DOWN = 6;
    this.CLOCKWISE = 7;
    this.ANTI_CLOCKWISE = 8;
    this.WAVE = 9;

    //Initial register state
    this.initRegisterArray = [
      [0xef, 0x00],
      [0x32, 0x29],
      [0x33, 0x01],
      [0x34, 0x00],
      [0x35, 0x01],
      [0x36, 0x00],
      [0x37, 0x07],
      [0x38, 0x17],
      [0x39, 0x06],
      [0x3a, 0x12],
      [0x3f, 0x00],
      [0x40, 0x02],
      [0x41, 0xff],
      [0x42, 0x01],
      [0x46, 0x2d],
      [0x47, 0x0f],
      [0x48, 0x3c],
      [0x49, 0x00],
      [0x4a, 0x1e],
      [0x4b, 0x00],
      [0x4c, 0x20],
      [0x4d, 0x00],
      [0x4e, 0x1a],
      [0x4f, 0x14],
      [0x50, 0x00],
      [0x51, 0x10],
      [0x52, 0x00],
      [0x5c, 0x02],
      [0x5d, 0x00],
      [0x5e, 0x10],
      [0x5f, 0x3f],
      [0x60, 0x27],
      [0x61, 0x28],
      [0x62, 0x00],
      [0x63, 0x03],
      [0x64, 0xf7],
      [0x65, 0x03],
      [0x66, 0xd9],
      [0x67, 0x03],
      [0x68, 0x01],
      [0x69, 0xc8],
      [0x6a, 0x40],
      [0x6d, 0x04],
      [0x6e, 0x00],
      [0x6f, 0x00],
      [0x70, 0x80],
      [0x71, 0x00],
      [0x72, 0x00],
      [0x73, 0x00],
      [0x74, 0xf0],
      [0x75, 0x00],
      [0x80, 0x42],
      [0x81, 0x44],
      [0x82, 0x04],
      [0x83, 0x20],
      [0x84, 0x20],
      [0x85, 0x00],
      [0x86, 0x10],
      [0x87, 0x00],
      [0x88, 0x05],
      [0x89, 0x18],
      [0x8a, 0x10],
      [0x8b, 0x01],
      [0x8c, 0x37],
      [0x8d, 0x00],
      [0x8e, 0xf0],
      [0x8f, 0x81],
      [0x90, 0x06],
      [0x91, 0x06],
      [0x92, 0x1e],
      [0x93, 0x0d],
      [0x94, 0x0a],
      [0x95, 0x0a],
      [0x96, 0x0c],
      [0x97, 0x05],
      [0x98, 0x0a],
      [0x99, 0x41],
      [0x9a, 0x14],
      [0x9b, 0x0a],
      [0x9c, 0x3f],
      [0x9d, 0x33],
      [0x9e, 0xae],
      [0x9f, 0xf9],
      [0xa0, 0x48],
      [0xa1, 0x13],
      [0xa2, 0x10],
      [0xa3, 0x08],
      [0xa4, 0x30],
      [0xa5, 0x19],
      [0xa6, 0x10],
      [0xa7, 0x08],
      [0xa8, 0x24],
      [0xa9, 0x04],
      [0xaa, 0x1e],
      [0xab, 0x1e],
      [0xcc, 0x19],
      [0xcd, 0x0b],
      [0xce, 0x13],
      [0xcf, 0x64],
      [0xd0, 0x21],
      [0xd1, 0x0f],
      [0xd2, 0x88],
      [0xe0, 0x01],
      [0xe1, 0x04],
      [0xe2, 0x41],
      [0xe3, 0xd6],
      [0xe4, 0x00],
      [0xe5, 0x0c],
      [0xe6, 0x0a],
      [0xe7, 0x00],
      [0xe8, 0x00],
      [0xe9, 0x00],
      [0xee, 0x07],
      [0xef, 0x01],
      [0x00, 0x1e],
      [0x01, 0x1e],
      [0x02, 0x0f],
      [0x03, 0x10],
      [0x04, 0x02],
      [0x05, 0x00],
      [0x06, 0xb0],
      [0x07, 0x04],
      [0x08, 0x0d],
      [0x09, 0x0e],
      [0x0a, 0x9c],
      [0x0b, 0x04],
      [0x0c, 0x05],
      [0x0d, 0x0f],
      [0x0e, 0x02],
      [0x0f, 0x12],
      [0x10, 0x02],
      [0x11, 0x02],
      [0x12, 0x00],
      [0x13, 0x01],
      [0x14, 0x05],
      [0x15, 0x07],
      [0x16, 0x05],
      [0x17, 0x07],
      [0x18, 0x01],
      [0x19, 0x04],
      [0x1a, 0x05],
      [0x1b, 0x0c],
      [0x1c, 0x2a],
      [0x1d, 0x01],
      [0x1e, 0x00],
      [0x21, 0x00],
      [0x22, 0x00],
      [0x23, 0x00],
      [0x25, 0x01],
      [0x26, 0x00],
      [0x27, 0x39],
      [0x28, 0x7f],
      [0x29, 0x08],
      [0x30, 0x03],
      [0x31, 0x00],
      [0x32, 0x1a],
      [0x33, 0x1a],
      [0x34, 0x07],
      [0x35, 0x07],
      [0x36, 0x01],
      [0x37, 0xff],
      [0x38, 0x36],
      [0x39, 0x07],
      [0x3a, 0x00],
      [0x3e, 0xff],
      [0x3f, 0x00],
      [0x40, 0x77],
      [0x41, 0x40],
      [0x42, 0x00],
      [0x43, 0x30],
      [0x44, 0xa0],
      [0x45, 0x5c],
      [0x46, 0x00],
      [0x47, 0x00],
      [0x48, 0x58],
      [0x4a, 0x1e],
      [0x4b, 0x1e],
      [0x4c, 0x00],
      [0x4d, 0x00],
      [0x4e, 0xa0],
      [0x4f, 0x80],
      [0x50, 0x00],
      [0x51, 0x00],
      [0x52, 0x00],
      [0x53, 0x00],
      [0x54, 0x00],
      [0x57, 0x80],
      [0x59, 0x10],
      [0x5a, 0x08],
      [0x5b, 0x94],
      [0x5c, 0xe8],
      [0x5d, 0x08],
      [0x5e, 0x3d],
      [0x5f, 0x99],
      [0x60, 0x45],
      [0x61, 0x40],
      [0x63, 0x2d],
      [0x64, 0x02],
      [0x65, 0x96],
      [0x66, 0x00],
      [0x67, 0x97],
      [0x68, 0x01],
      [0x69, 0xcd],
      [0x6a, 0x01],
      [0x6b, 0xb0],
      [0x6c, 0x04],
      [0x6d, 0x2c],
      [0x6e, 0x01],
      [0x6f, 0x32],
      [0x71, 0x00],
      [0x72, 0x01],
      [0x73, 0x35],
      [0x74, 0x00],
      [0x75, 0x33],
      [0x76, 0x31],
      [0x77, 0x01],
      [0x7c, 0x84],
      [0x7d, 0x03],
      [0x7e, 0x01],
    ];
  }
  async init(i2c_bus, i2c_addr, i2c_flags = 0) {
    this.i2cHand = await rg.i2c_open(i2c_bus, i2c_addr, i2c_flags);
    await rg.lgu_sleep(0.001);
    await this.paj7620SelectBank(this.BANK0);
    await this.paj7620SelectBank(this.BANK0);

    let data0 = (await this.paj7620ReadReg(0, 1))[0];
    let data1 = (await this.paj7620ReadReg(1, 1))[0];
    if (data0 != 0x20)
      //or data1 <> 0x76
      console.log("Error with sensor");
    //return 0xff
    if (data0 == 0x20) console.log("wake-up finish.");

    for (let i = 0; i < this.initRegisterArray.length; i += 1)
      await this.paj7620WriteReg(
        this.initRegisterArray[i][0],
        this.initRegisterArray[i][1]
      );

    await this.paj7620SelectBank(BANK0);

    console.log("Paj7620 initialize register finished.");
  }
  // Write a byte to a register on the Gesture sensor
  async paj7620WriteReg(addr, cmd) {
    await rg.i2c_write_word_data(i2c_hand, addr, cmd);
  }

  //Select a register bank on the Gesture Sensor
  async paj7620SelectBank(bank) {
    if (bank == BANK0)
      await this.paj7620WriteReg(
        this.PAJ7620_REGITER_BANK_SEL,
        this.PAJ7620_BANK0
      );
  }

  //Read a block of bytes of length "qty" starting at address "addr" from the Gesture sensor
  async paj7620ReadReg(addr, qty) {
    return await rg.i2c_read_i2c_block_data(i2c_hand, addr, qty);
  }

  async return_gesture() {
    let data = (await this.paj7620ReadReg(0x43, 1))[0];
    if (data == this.GES_RIGHT_FLAG) {
      // await sleep(GES_ENTRY_TIME);
      await rg.lgu_sleep(this.GES_ENTRY_TIME);
      data = (await this.paj7620ReadReg(0x43, 1))[0];
      if (data == this.GES_FORWARD_FLAG) {
        return 1;
      } else if (data == this.GES_BACKWARD_FLAG) {
        return 2;
      } else return 3;
    } else if (data == this.GES_LEFT_FLAG) {
      // await sleep(GES_ENTRY_TIME);
      await rg.lgu_sleep(this.GES_ENTRY_TIME);
      data = (await this.paj7620ReadReg(0x43, 1))[0];
      if (data == this.GES_FORWARD_FLAG) {
        return 1;
      } else if (data == this.GES_BACKWARD_FLAG) {
        return 2;
      } else return 4;
    } else if (data == this.GES_UP_FLAG) {
      // await sleep(GES_ENTRY_TIME);
      await rg.lgu_sleep(this.GES_ENTRY_TIME);
      data = (await this.paj7620ReadReg(0x43, 1))[0];
      if (data == this.GES_FORWARD_FLAG) {
        return 1;
      } else if (data == this.GES_BACKWARD_FLAG) {
        return 2;
      } else return 5;
    } else if (data == this.GES_DOWN_FLAG) {
      // await sleep(GES_ENTRY_TIME);
      await rg.lgu_sleep(this.GES_ENTRY_TIME);
      data = (await this.paj7620ReadReg(0x43, 1))[0];
      if (data == this.GES_FORWARD_FLAG) {
        return 1;
      } else if (data == this.GES_BACKWARD_FLAG) {
        return 2;
      } else return 6;
    } else if (data == this.GES_FORWARD_FLAG) {
      return 1;
    } else if (data == this.GES_BACKWARD_FLAG) {
      return 2;
    } else if (data == this.GES_CLOCKWISE_FLAG) return 7;
    else if (data == this.GES_COUNT_CLOCKWISE_FLAG) return 8;
    else {
      let data1 = (await this.paj7620ReadReg(0x44, 1))[0];
      if (data1 == this.GES_WAVE_FLAG) return 9;
    }
    return 0;
  }

  async stop() {
    if (this.i2c_hand >= 0) {
      await rg.i2c_close(this.i2c_hand);
      this.i2c_hand = -1;
    }
  }
}

module.exports = { PAJ7620 };

//Enable debug message
// const debug = 1;

// const err_msg =
//   "PAJ7620 is already opened. Please close old connection to use new one.";
// let rg = -1;
// // let sbc = -1;
// let i2c_hand = -1;

//Initialize the sensors
// exports.init = async (_rg, i2c_bus, i2c_addr) => {
// if (wael !== null) {
//     wael('beforeunload', async () => {
//         await exports.stop();
//     });
// }
// rg = require(`rgpio`);//${apptool.gpio_lib}
// if (sbc >= 0) { throw new Error(err_msg); return; }
// sbc = await rg._rgpiod_start('', '');
//   rg = _rg;
//   if (i2c_hand >= 0) {
//     throw new Error(err_msg);
//     return;
//   }
//   i2c_hand = await rg.i2c_open(i2c_bus, i2c_addr, 0);
//   if (debug) console.log("i2c_hand=" + i2c_hand);

//   // await sleep(.001);
// };

//Return a vlaue from the gestire sensor which can be used in a program
// 	0:nothing
// 	1:Forward
// 	2:Backward
// 	3:Right
// 	4:Left
// 	5:Up
// 	6:Down
// 	7:Clockwise
// 	8:anti-clockwise
// 	9:wave

/*
 * This code was ported from "Grove - Gesture Sensor v1.0 Python library and examples": https://github.com/DexterInd/GrovePi/tree/master/Software/Python/grove_gesture_sensor
 */
