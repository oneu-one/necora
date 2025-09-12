// import * as rg from "@necoge/rgpio";
const rg = require("@necora/rgpio");

class AMG8833 {
  constructor() {
    this.i2c_hand = null;
  }

  async init(i2c_bus, i2c_address, i2c_flags = 0) {
    let r = await rg.i2c_open(i2c_bus, i2c_address, i2c_flags);
    this.i2c_hand = r;
    let r1 = await rg.i2c_write_byte_data(this.i2c_hand, 0x00, 0x00); //Normal mode
    let r2 = await rg.i2c_write_byte_data(this.i2c_hand, 0x02, 0x00); //10FPS
    if (r1 < 0 || r2 < 0) console.log(`AMG8833 initialize failed`);
    return this.i2c_hand;
  }
  // 本体温度
  async read_thermistor() {
    let temp = await rg.i2c_read_word_data(this.i2c_hand, 0x0e);
    return temp * 0.0625;
  }
  // 温度データ読み取り
  async read_temp_array() {
    let lines = [];
    for (let i = 0; i < 8; i++) {
      let data = await rg.i2c_read_i2c_block_data(
        this.i2c_hand,
        0x80 + 0x10 * i,
        16
      );
      let line = [];
      for (let j = 0; j < 8; j++) {
        line.push(((data[2 * j + 1] & 0x07) * 256 + data[2 * j]) * 0.25);
      }
      lines.push(line);
    }
    return lines;
  }
  // 接続解除
  async close() {
    if (this.i2c_hand !== null) {
      await rg.i2c_close(this.i2c_hand);
    }
  }
}

module.exports = { AMG8833 };

/*
 * This code was ported from https://www.denshi.club/pc/raspi/5raspberry-pi-zeroiot381i2c-amg8833.html
 */
