const rg = require("@necora/rgpio");

class BME280 {
  constructor() {
    // 宣言だけ、後に使用
    this.i2cHand = null;
    this.cal = null;
    // 定数
    this.I2C_ADDRESS_B = 0x76;
    this.I2C_ADDRESS_A = 0x77;
    this.CHIP_ID = 0x58;

    this.REGISTER_DIG_T1 = 0x88;
    this.REGISTER_DIG_T2 = 0x8a;
    this.REGISTER_DIG_T3 = 0x8c;

    this.REGISTER_DIG_P1 = 0x8e;
    this.REGISTER_DIG_P2 = 0x90;
    this.REGISTER_DIG_P3 = 0x92;
    this.REGISTER_DIG_P4 = 0x94;
    this.REGISTER_DIG_P5 = 0x96;
    this.REGISTER_DIG_P6 = 0x98;
    this.REGISTER_DIG_P7 = 0x9a;
    this.REGISTER_DIG_P8 = 0x9c;
    this.REGISTER_DIG_P9 = 0x9e;

    this.REGISTER_DIG_H1 = 0xa1;
    this.REGISTER_DIG_H2 = 0xe1;
    this.REGISTER_DIG_H3 = 0xe3;
    this.REGISTER_DIG_H4 = 0xe4;
    this.REGISTER_DIG_H5 = 0xe5;
    this.REGISTER_DIG_H6 = 0xe7;

    this.REGISTER_CHIPID = 0xd0;
    this.REGISTER_RESET = 0xe0;

    this.REGISTER_CONTROL_HUM = 0xf2;
    this.REGISTER_CONTROL = 0xf4;
    this.REGISTER_PRESSURE_DATA = 0xf7;
    this.REGISTER_TEMP_DATA = 0xfa;
    this.REGISTER_HUMIDITY_DATA = 0xfd;
  }

  async init(i2c_bus, i2c_address, i2c_flags = 0) {
    this.i2cHand = await rg.i2c_open(i2c_bus, i2c_address, i2c_flags);

    let r;
    r = await rg.i2c_write_byte_data(this.i2cHand, this.REGISTER_CHIPID, 0);
    if (r < 0) return r;

    let chipId = await rg.i2c_read_byte_data(
      this.i2cHand,
      this.REGISTER_CHIPID
    );
    if (
      chipId !== this.CHIP_ID_BME280() &&
      chipId !== this.CHIP_ID1_BMP280() &&
      chipId !== this.CHIP_ID2_BMP280() &&
      chipId !== this.CHIP_ID3_BMP280()
    ) {
      return `Unexpected BMx280 chip ID: 0x${chipId
        .toString(16)
        .toUpperCase()}`;
    }
    // console.log(`Found BMx280 chip ID 0x${chipId.toString(16).toUpperCase()}`); // on bus i2c-${i2cBusNo}, address 0x${i2cAddress.toString(16).toUpperCase()}
    await this.loadCalibration(async (err) => {
      if (err) {
        return err;
      }
      // Humidity 16x oversampling
      //
      let r = await rg.i2c_write_byte_data(
        this.i2cHand,
        this.REGISTER_CONTROL_HUM,
        0b00000101
      );
      if (r < 0) return `Humidity 16x oversampling error: ${r}`;
      // Temperture/pressure 16x oversampling, normal mode
      //
      r = await rg.i2c_write_byte_data(
        this.i2cHand,
        this.REGISTER_CONTROL,
        0b10110111
      );
      if (r < 0) return `Temperture/pressure 16x oversampling error: ${r}`;

      return 0;
    });
    return this.i2cHand;
  }

  // reset()
  //
  // Perform a power-on reset procedure. You will need to call init() following a reset()
  //
  async reset() {
    const POWER_ON_RESET_CMD = 0xb6;
    let r = await rg.i2c_write_byte_data(
      this.i2cHand,
      this.REGISTER_RESET,
      POWER_ON_RESET_CMD
    );
    if (r < 0) return `cannot power-on reset: ${r}`;
    else return 0;
  }

  // close()
  //
  // Close connection and releases resources.
  //
  async close() {
    if (this.i2cHand >= 0) {
      await rg.i2c_close(this.i2cHand);
      this.i2cHand = null;
    }
  }

  async readSensorData() {
    if (!this.cal) {
      return "You must first call bme280.init()";
    }

    // Grab temperature, humidity, and pressure in a single read
    //
    let buffer = await rg.i2c_read_i2c_block_data(
      this.i2cHand,
      this.REGISTER_PRESSURE_DATA,
      8
    );
    if (!buffer) return `couldn't grab data`;
    // Temperature (temperature first since we need t_fine for pressure and humidity)
    //
    let adc_T = this.uint20(buffer[3], buffer[4], buffer[5]);
    let tvar1 =
      (((adc_T >> 3) - (this.cal.dig_T1 << 1)) * this.cal.dig_T2) >> 11;
    let tvar2 =
      (((((adc_T >> 4) - this.cal.dig_T1) * ((adc_T >> 4) - this.cal.dig_T1)) >>
        12) *
        this.cal.dig_T3) >>
      14;
    let t_fine = tvar1 + tvar2;

    let temperature_C = ((t_fine * 5 + 128) >> 8) / 100;

    // Pressure
    //
    let adc_P = this.uint20(buffer[0], buffer[1], buffer[2]);
    let pvar1 = t_fine / 2 - 64000;
    let pvar2 = (pvar1 * pvar1 * this.cal.dig_P6) / 32768;
    pvar2 = pvar2 + pvar1 * this.cal.dig_P5 * 2;
    pvar2 = pvar2 / 4 + this.cal.dig_P4 * 65536;
    pvar1 =
      ((this.cal.dig_P3 * pvar1 * pvar1) / 524288 + this.cal.dig_P2 * pvar1) /
      524288;
    pvar1 = (1 + pvar1 / 32768) * this.cal.dig_P1;

    let pressure_hPa = 0;

    if (pvar1 !== 0) {
      let p = 1048576 - adc_P;
      p = ((p - pvar2 / 4096) * 6250) / pvar1;
      pvar1 = (this.cal.dig_P9 * p * p) / 2147483648;
      pvar2 = (p * this.cal.dig_P8) / 32768;
      p = p + (pvar1 + pvar2 + this.cal.dig_P7) / 16;

      pressure_hPa = p / 100;
    }

    // Humidity (available on the BME280, will be zero on the BMP280 since it has no humidity sensor)
    //
    let adc_H = this.uint16(buffer[6], buffer[7]);

    let h = t_fine - 76800;
    h =
      (adc_H - (this.cal.dig_H4 * 64 + (this.cal.dig_H5 / 16384) * h)) *
      ((this.cal.dig_H2 / 65536) *
        (1 +
          (this.cal.dig_H6 / 67108864) *
            h *
            (1 + (this.cal.dig_H3 / 67108864) * h)));
    h = h * (1 - (this.cal.dig_H1 * h) / 524288);

    let humidity = h > 100 ? 100 : h < 0 ? 0 : h;

    return [
      Math.round(temperature_C * 10) / 10,
      Math.round(humidity * 10) / 10,
      Math.round(pressure_hPa),
    ];

    // return {
    //   temperature_C: temperature_C,
    //   humidity: humidity,
    //   pressure_hPa: pressure_hPa
    // };
  }

  async loadCalibration(callback) {
    let buffer = await rg.i2c_read_i2c_block_data(
      this.i2cHand,
      this.REGISTER_DIG_T1,
      24
    );
    if (buffer) {
      let h1 = await rg.i2c_read_byte_data(this.i2cHand, this.REGISTER_DIG_H1);
      let h2 = await rg.i2c_read_word_data(this.i2cHand, this.REGISTER_DIG_H2);
      let h3 = await rg.i2c_read_byte_data(this.i2cHand, this.REGISTER_DIG_H3);
      let h4 = await rg.i2c_read_byte_data(this.i2cHand, this.REGISTER_DIG_H4);
      let h5 = await rg.i2c_read_byte_data(this.i2cHand, this.REGISTER_DIG_H5);
      let h5_1 = await rg.i2c_read_byte_data(
        this.i2cHand,
        this.REGISTER_DIG_H5 + 1
      );
      let h6 = await rg.i2c_read_byte_data(this.i2cHand, this.REGISTER_DIG_H6);

      this.cal = {
        dig_T1: this.uint16(buffer[1], buffer[0]),
        dig_T2: this.int16(buffer[3], buffer[2]),
        dig_T3: this.int16(buffer[5], buffer[4]),

        dig_P1: this.uint16(buffer[7], buffer[6]),
        dig_P2: this.int16(buffer[9], buffer[8]),
        dig_P3: this.int16(buffer[11], buffer[10]),
        dig_P4: this.int16(buffer[13], buffer[12]),
        dig_P5: this.int16(buffer[15], buffer[14]),
        dig_P6: this.int16(buffer[17], buffer[16]),
        dig_P7: this.int16(buffer[19], buffer[18]),
        dig_P8: this.int16(buffer[21], buffer[20]),
        dig_P9: this.int16(buffer[23], buffer[22]),

        dig_H1: h1,
        dig_H2: h2,
        dig_H3: h3,
        dig_H4: (h4 << 4) | (h5 & 0xf),
        dig_H5: (h5_1 << 4) | (h5 >> 4),
        dig_H6: h6,
      };

      // console.log('BME280 cal = ' + JSON.stringify(this.cal, null, 2));
      await callback();
    }
  }

  BME280_DEFAULT_I2C_ADDRESS() {
    return 0x77;
  }
  CHIP_ID1_BMP280() {
    return 0x56;
  }
  CHIP_ID2_BMP280() {
    return 0x57;
  }
  CHIP_ID3_BMP280() {
    return 0x58;
  }
  CHIP_ID_BME280() {
    return 0x60;
  }
  int16(msb, lsb) {
    let val = this.uint16(msb, lsb);
    return val > 32767 ? val - 65536 : val;
  }

  uint16(msb, lsb) {
    return (msb << 8) | lsb;
  }

  uint20(msb, lsb, xlsb) {
    return ((((msb << 8) | lsb) << 8) | xlsb) >> 4;
  }

  convertCelciusToFahrenheit(c) {
    return (c * 9) / 5 + 32;
  }

  convertHectopascalToInchesOfMercury(hPa) {
    return hPa * 0.02952998751;
  }

  convertMetersToFeet(m) {
    return m * 3.28084;
  }

  calculateHeatIndexCelcius(temperature_C, humidity) {
    return (
      -8.784695 +
      1.61139411 * temperature_C +
      2.338549 * humidity +
      -0.14611605 * temperature_C * humidity +
      -0.01230809 * Math.pow(temperature_C, 2) +
      -0.01642482 * Math.pow(humidity, 2) +
      0.00221173 * Math.pow(temperature_C, 2) * humidity +
      0.00072546 * temperature_C * Math.pow(humidity, 2) +
      -0.00000358 * Math.pow(temperature_C, 2) * Math.pow(humidity, 2)
    );
  }

  calculateDewPointCelcius(temperature_C, humidity) {
    return (
      (243.04 *
        (Math.log(humidity / 100.0) +
          (17.625 * temperature_C) / (243.04 + temperature_C))) /
      (17.625 -
        Math.log(humidity / 100.0) -
        (17.625 * temperature_C) / (243.04 + temperature_C))
    );
  }

  calculateAltitudeMeters(pressure_hPa, seaLevelPressure_hPa) {
    if (!seaLevelPressure_hPa) {
      seaLevelPressure_hPa = 1013.25;
    }

    return (
      (1.0 - Math.pow(pressure_hPa / seaLevelPressure_hPa, 1 / 5.2553)) *
      145366.45 *
      0.3048
    );
  }
}

module.exports = { BME280 };

// /*
//  * This code was forked from skylarstein's bme280-sensor: https://github.com/skylarstein/bme280-sensor
//  */
