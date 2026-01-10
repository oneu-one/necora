"use strict";

const rg = require("bindings")("rgpio");

exports.SET_ACTIVE_LOW = 4;
exports.SET_OPEN_DRAIN = 8;
exports.SET_OPEN_SOURCE = 16;
exports.SET_PULL_UP = 32;
exports.SET_PULL_DOWN = 64;
exports.SET_PULL_NONE = 128;

// Properties
let sbc = -1;
let gpiochip_hand = -1;

exports.start = async (host = "localhost", port = "8889", gpiodev = 4) => {
  if (sbc < 0) sbc = await rg._rgpiod_start(host, port);
  if (gpiochip_hand < 0) gpiochip_hand = await rg._gpiochip_open(sbc, gpiodev);
};

exports.stop = async () => {
  if (gpiochip_hand >= 0) {
    await rg._gpiochip_close(sbc, gpiochip_hand);
    gpiochip_hand = -1;
  }
  if (sbc >= 0) {
    await rg._rgpiod_stop(sbc);
    sbc = -1;
  }
};

// exports.rgpiod_start = async (
//   host = "localhost",
//   port = "8889",
//   show_errors = true
// ) => {
//   sbc = await rg._rgpiod_start(host, port);
//   return sbc;
// };
// exports.rgpiod_stop = async () => {
//   await rg._rgpiod_stop(sbc);
// };
// exports.gpiochip_open = async (gpiochip) => {
//   return await rg._gpiochip_open(sbc, gpiochip);
// };
exports.gpio_claim_input = async (gpio, lFlags = 0) => {
  return await rg._gpio_claim_input(sbc, gpiochip_hand, lFlags, gpio);
};
exports.gpio_claim_output = async (gpio, level = 0, lFlags = 0) => {
  return await rg._gpio_claim_output(sbc, gpiochip_hand, lFlags, gpio, level);
};
exports.gpio_read = async (gpio) => {
  return await rg._gpio_read(sbc, gpiochip_hand, gpio);
};
exports.gpio_write = async (gpio, level) => {
  return await rg._gpio_write(sbc, gpiochip_hand, gpio, level);
};
exports.tx_pwm = async (
  gpio,
  pwmFrequency,
  pwmDutyCycle,
  pwmOffset = 0,
  pwmCycles = 0 // 0 = infinite
) => {
  return await rg._tx_pwm(
    sbc,
    gpiochip_hand,
    gpio,
    pwmFrequency,
    pwmDutyCycle,
    pwmOffset,
    pwmCycles
  );
};
exports.serial_open = async (tty, baud, ser_flags = 0) => {
  return await rg._serial_open(sbc, tty, baud, ser_flags);
};
exports.serial_close = async (handle) => {
  await rg._serial_close(sbc, handle);
};
exports.serial_read_text = async (handle, count = 0) => {
  return new TextDecoder().decode(await this.serial_read(handle, count));
};
exports.serial_read = async (handle, count = 0) => {
  if (count === 0) count = await rg._serial_data_available(sbc, handle);
  return await rg._serial_read(sbc, handle, count);
};
exports.serial_write = async (handle, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return await rg._serial_write(sbc, handle, buffer, count);
};
exports.serial_data_available = async (handle) => {
  return await rg._serial_data_available(sbc, handle);
};
exports.i2c_open = async (i2c_bus, i2c_address, i2c_flags = 0) => {
  return await rg._i2c_open(sbc, i2c_bus, i2c_address, i2c_flags);
};
exports.i2c_close = async (handle) => {
  await rg._i2c_close(sbc, handle);
};

// exports.i2c_write_byte = async (handle, byte_val) => {
//   return await rg._i2c_write_byte(sbc, handle, byte_val);
// };
exports.i2c_read_byte = async (handle) => {
  return await rg._i2c_read_byte(sbc, handle);
};
exports.i2c_read_byte_data = async (handle, reg) => {
  return await rg._i2c_read_byte_data(sbc, handle, reg);
};
exports.i2c_write_byte_data = async (handle, reg, byte_val) => {
  return await rg._i2c_write_byte_data(sbc, handle, reg, byte_val);
};
exports.i2c_read_i2c_block_data = async (handle, reg, count) => {
  return await rg._i2c_read_i2c_block_data(sbc, handle, reg, count);
};
exports.i2c_write_i2c_block_data = async (handle, reg, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return await rg._i2c_write_i2c_block_data(sbc, handle, reg, buffer, count);
};
exports.i2c_read_word_data = async (handle, reg) => {
  return await rg._i2c_read_word_data(sbc, handle, reg);
};
exports.i2c_write_word_data = async (handle, reg, word_val) => {
  return await rg._i2c_write_word_data(sbc, handle, reg, word_val);
};
// exports.i2c_read_device = async (handle, count) => {
//   return new TextDecoder().decode(
//     await rg._i2c_read_device(sbc, handle, count)
//   );
// };
exports.i2c_write_device = async (handle, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return await rg._i2c_write_device(sbc, handle, buffer, count);
};
exports.lgu_sleep = async (sleep_secs) => {
  await rg._lgu_sleep(sleep_secs);
};

/***** 同期関数 *****/
exports.rgpio_sbc_sync = (
  host = "localhost",
  port = 8889,
  show_errors = true
) => {
  if (sbc < 0) {
    sbc = rg._rgpiod_start_sync(host, port.toString());
    if (sbc < 0) {
      if (show_errors) console.log(sbc);
    }
  }
  return sbc;
};
exports.sbc_stop_sync = () => {
  rg._rgpiod_stop_sync(sbc);
  sbc = -1;
};
exports.i2c_open_sync = (i2c_bus, i2c_address, i2c_flags = 0) => {
  return rg._i2c_open_sync(sbc, i2c_bus, i2c_address, i2c_flags);
};
exports.i2c_close_sync = (handle) => {
  rg._i2c_close_sync(sbc, handle);
};
exports.i2c_read_byte_sync = (handle) => {
  return rg._i2c_read_byte_sync(sbc, handle);
};
exports.i2c_write_device_sync = (handle, data, count = -1) => {
  let buffer = Buffer.from(data);
  if (count < 0) count = buffer.length;
  return rg._i2c_write_device_sync(sbc, handle, buffer, count);
};
