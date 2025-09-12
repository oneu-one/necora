"use strict";

let lg = require("bindings")("lgpio");

exports.SET_ACTIVE_LOW = 4;
exports.SET_OPEN_DRAIN = 8;
exports.SET_OPEN_SOURCE = 16;
exports.SET_PULL_UP = 32;
exports.SET_PULL_DOWN = 64;
exports.SET_PULL_NONE = 128;

// 簡易的なハンドルリセット
let chiphand_max = -1,
  i2chand_max = -1;
exports.lgreset = async () => {
  for (let i = 0; i <= chiphand_max; i++) {
    this.gpiochip_close(i);
    // console.log(i);
  }
  for (let i = 0; i <= i2chand_max; i++) {
    this.i2c_close(i);
  }
};

exports.gpiochip_open = async (gpiochip) => {
  let h = await lg._gpiochip_open(gpiochip);
  if (h > chiphand_max) chiphand_max = h;
  // console.log(h);
  return h;
};
exports.gpiochip_close = async (handle) => {
  if (handle == chiphand_max) chiphand_max--;
  return await lg._gpiochip_close(handle);
};
exports.gpio_claim_input = async (handle, gpio, lFlags = 0) => {
  return await lg._gpio_claim_input(handle, lFlags, gpio);
};
exports.gpio_claim_output = async (handle, gpio, level = 0, lFlags = 0) => {
  return await lg._gpio_claim_output(handle, lFlags, gpio, level);
};
exports.gpio_read = async (handle, gpio) => {
  return await lg._gpio_read(handle, gpio);
};
exports.gpio_write = async (handle, gpio, level) => {
  return await lg._gpio_write(handle, gpio, level);
};
exports.serial_open = async (tty, baud, ser_flags = 0) => {
  return await lg._serial_open(tty, baud, ser_flags);
};
exports.serial_close = async (handle) => {
  await lg._serial_close(handle);
};
// exports.serial_read_text = async (handle, count = 0) => {
//     return new TextDecoder().decode(await this.serial_read(handle, count));
// }
exports.serial_read = async (handle, count = 0) => {
  if (count === 0) count = await lg._serial_data_available(handle);
  return await lg._serial_read(handle, count);
};
exports.serial_write = async (handle, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return await lg._serial_write(handle, buffer, count);
};
exports.serial_data_available = async (handle) => {
  return await lg._serial_data_available(handle);
};
exports.i2c_open = async (i2c_bus, i2c_address, i2c_flags = 0) => {
  let h = await lg._i2c_open(i2c_bus, i2c_address, i2c_flags);
  if (h > i2chand_max) i2chand_max = h;
  return h;
};
exports.i2c_close = async (handle) => {
  if (handle == i2chand_max) i2chand_max--;
  return await lg._i2c_close(handle);
};

// exports.i2c_write_byte = async (handle, byte_val) => {
//     return await lg._i2c_write_byte(handle, byte_val);
// }
exports.i2c_read_byte = async (handle) => {
  return await lg._i2c_read_byte(handle);
};
exports.i2c_read_byte_data = async (handle, reg) => {
  return await lg._i2c_read_byte_data(handle, reg);
};
exports.i2c_write_byte_data = async (handle, reg, byte_val) => {
  return await lg._i2c_write_byte_data(handle, reg, byte_val);
};
exports.i2c_read_i2c_block_data = async (handle, reg, count) => {
  return await lg._i2c_read_i2c_block_data(handle, reg, count);
};
exports.i2c_write_i2c_block_data = async (handle, reg, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return await lg._i2c_write_i2c_block_data(handle, reg, buffer, count);
};
exports.i2c_read_word_data = async (handle, reg) => {
  return await lg._i2c_read_word_data(handle, reg);
};
// exports.i2c_write_word_data = async (handle, reg, word_val) => {
//     return await lg._i2c_write_word_data(handle, reg, word_val);
// }
// exports.i2c_read_device = async (handle, count) => {
//     return new TextDecoder().decode(await lg._i2c_read_device(handle, count));
// }
exports.i2c_write_device = async (handle, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return await lg._i2c_write_device(handle, buffer, count);
};
exports.lgu_sleep = async (sleep_secs) => {
  await lg._lgu_sleep(sleep_secs);
};
