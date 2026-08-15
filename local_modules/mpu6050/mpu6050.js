/*** 6軸ジャイロセンサ MPU6050 ***/

class MPU6050 {
  constructor(sbc) {
    this.sbc = sbc;
    this.i2c_hand = null;
    this.GRAVITY_MS2 = 9.80665;

    // Scale Modifiers
    this.ACCEL_SCALE_MODIFIER_2G = 16384.0;
    this.ACCEL_SCALE_MODIFIER_4G = 8192.0;
    this.ACCEL_SCALE_MODIFIER_8G = 4096.0;
    this.ACCEL_SCALE_MODIFIER_16G = 2048.0;

    this.GYRO_SCALE_MODIFIER_250DEG = 131.0;
    this.GYRO_SCALE_MODIFIER_500DEG = 65.5;
    this.GYRO_SCALE_MODIFIER_1000DEG = 32.8;
    this.GYRO_SCALE_MODIFIER_2000DEG = 16.4;

    // Pre-defined ranges
    this.ACCEL_RANGE_2G = 0x00;
    this.ACCEL_RANGE_4G = 0x08;
    this.ACCEL_RANGE_8G = 0x10;
    this.ACCEL_RANGE_16G = 0x18;

    this.GYRO_RANGE_250DEG = 0x00;
    this.GYRO_RANGE_500DEG = 0x08;
    this.GYRO_RANGE_1000DEG = 0x10;
    this.GYRO_RANGE_2000DEG = 0x18;

    this.FILTER_BW_256 = 0x00;
    this.FILTER_BW_188 = 0x01;
    this.FILTER_BW_98 = 0x02;
    this.FILTER_BW_42 = 0x03;
    this.FILTER_BW_20 = 0x04;
    this.FILTER_BW_10 = 0x05;
    this.FILTER_BW_5 = 0x06;

    // MPU-6050 Registers
    this.PWR_MGMT_1 = 0x6b;
    this.PWR_MGMT_2 = 0x6c;

    this.ACCEL_XOUT0 = 0x3b;
    this.ACCEL_YOUT0 = 0x3d;
    this.ACCEL_ZOUT0 = 0x3f;

    this.TEMP_OUT0 = 0x41;

    this.GYRO_XOUT0 = 0x43;
    this.GYRO_YOUT0 = 0x45;
    this.GYRO_ZOUT0 = 0x47;

    this.ACCEL_CONFIG = 0x1c;
    this.GYRO_CONFIG = 0x1b;
    this.MPU_CONFIG = 0x1a;
  }

  async init(i2c_bus, i2c_address, i2c_flags = 0) {
    let r = await this.sbc.i2c_open(i2c_bus, i2c_address, i2c_flags);
    if (r < 0) throw new Error(`Failed to open I2C device: ${r}\n`);
    else this.i2c_hand = r;
    // Wake up the MPU-6050 since it starts in sleep mode
    this.sbc.lgu_sleep(0.1);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.ACCEL_CONFIG, 0x00);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.GYRO_CONFIG, 0x00);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.MPU_CONFIG, 0x00);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.PWR_MGMT_1, 0x00);
    return r;
  }

  async stop() {
    if (this.i2c_hand !== null) {
      await this.sbc.i2c_close(this.i2c_hand);
      this.i2c_hand = null;
    }
  }

  async read_word_sensor(reg) {
    let h = await this.sbc.i2c_read_byte_data(this.i2c_hand, reg);
    let l = await this.sbc.i2c_read_byte_data(this.i2c_hand, reg + 1);
    let value = (h << 8) + l;
    if (value >= 0x8000) value -= 0x10000;
    return value;
  }

  // MPU-6050 Methods
  async get_temp() {
    let raw_temp = await this.read_word_sensor(this.TEMP_OUT0);
    let actual_temp = raw_temp / 340.0 + 36.53;
    return actual_temp;
  }

  async set_accel_range(accel_range) {
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.ACCEL_CONFIG, 0x00);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.ACCEL_CONFIG, accel_range);
  }

  async read_accel_range(raw = false) {
    let raw_data = await this.sbc.i2c_read_byte_data(
      this.i2c_hand,
      this.ACCEL_CONFIG
    );
    if (raw) return raw_data;
    // let accel_range = (raw_data & 0x18);
    // return accel_range;
    else {
      switch (raw_data) {
        case this.ACCEL_RANGE_2G:
          return 2;
        case this.ACCEL_RANGE_4G:
          return 4;
        case this.ACCEL_RANGE_8G:
          return 8;
        case this.ACCEL_RANGE_16G:
          return 16;
        default:
          return null;
      }
    }
  }

  async get_accel_data(g = true) {
    let x = await this.read_word_sensor(this.ACCEL_XOUT0);
    let y = await this.read_word_sensor(this.ACCEL_YOUT0);
    let z = await this.read_word_sensor(this.ACCEL_ZOUT0);

    let accel_scale_modifier = undefined;
    let accel_range = await this.read_accel_range(true);

    switch (accel_range) {
      case this.ACCEL_RANGE_2G:
        accel_scale_modifier = this.ACCEL_SCALE_MODIFIER_2G;
        break;
      case this.ACCEL_RANGE_4G:
        accel_scale_modifier = this.ACCEL_SCALE_MODIFIER_4G;
        break;
      case this.ACCEL_RANGE_8G:
        accel_scale_modifier = this.ACCEL_SCALE_MODIFIER_8G;
        break;
      case this.ACCEL_RANGE_16G:
        accel_scale_modifier = this.ACCEL_SCALE_MODIFIER_16G;
        break;
      default:
        break;
    }

    x = x / accel_scale_modifier;
    y = y / accel_scale_modifier;
    z = z / accel_scale_modifier;

    if (!g) {
      x = x * this.GRAVITY_MS2;
      y = y * this.GRAVITY_MS2;
      z = z * this.GRAVITY_MS2;
    }

    // return { x: x, y: y, z: z };
    return [x, y, z];
  }

  async set_gyro_range(gyro_range) {
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.GYRO_CONFIG, 0x00);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, this.GYRO_CONFIG, gyro_range);
  }

  async set_filter_range(filter_range = this.FILTER_BW_256) {
    let current_config = await this.sbc.i2c_read_byte_data(
      this.i2c_hand,
      this.MPU_CONFIG
    );
    let new_config = (current_config & 0b00111000) | filter_range;
    return await this.sbc.i2c_write_byte_data(
      this.i2c_hand,
      this.MPU_CONFIG,
      new_config
    );
  }

  async read_gyro_range(raw = false) {
    let raw_data = await this.sbc.i2c_read_byte_data(this.i2c_hand, this.GYRO_CONFIG);
    if (raw) return raw_data;
    else {
      switch (raw_data) {
        case this.GYRO_RANGE_250DEG:
          return 250;
        case this.GYRO_RANGE_500DEG:
          return 500;
        case this.GYRO_RANGE_1000DEG:
          return 1000;
        case this.GYRO_RANGE_2000DEG:
          return 2000;
        default:
          return null;
      }
    }
  }

  async get_gyro_data() {
    let x = await this.read_word_sensor(this.GYRO_XOUT0);
    let y = await this.read_word_sensor(this.GYRO_YOUT0);
    let z = await this.read_word_sensor(this.GYRO_ZOUT0);

    let gyro_scale_modifier = undefined;
    let gyro_range = await this.read_gyro_range(true);

    switch (gyro_range) {
      case this.GYRO_RANGE_250DEG:
        gyro_scale_modifier = this.GYRO_SCALE_MODIFIER_250DEG;
        break;
      case this.GYRO_RANGE_500DEG:
        gyro_scale_modifier = this.GYRO_SCALE_MODIFIER_500DEG;
        break;
      case this.GYRO_RANGE_1000DEG:
        gyro_scale_modifier = this.GYRO_SCALE_MODIFIER_1000DEG;
        break;
      case this.GYRO_RANGE_2000DEG:
        gyro_scale_modifier = this.GYRO_SCALE_MODIFIER_2000DEG;
        break;
      default:
        break;
    }

    x = x / gyro_scale_modifier;
    y = y / gyro_scale_modifier;
    z = z / gyro_scale_modifier;

    // return { x: x, y: y, z: z };
    return [x, y, z];
  }

  async get_all_data() {
    let accel = await this.get_accel_data();
    let gyro = await this.get_gyro_data();
    let temp = await this.get_temp();

    return {
      accel: accel,
      gyro: gyro,
      temp: temp,
    };
  }
}

module.exports = { MPU6050 };

/*
 * This code was ported from https://github.com/m-rtijn/mpu6050/blob/master/mpu6050/mpu6050.py
 */
