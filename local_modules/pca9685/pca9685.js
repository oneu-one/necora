/*** 16チャネル 12ビット PWM/サーボコントローラ PCA9685 ***/

const MODE1 = 0x00;
const MODE2 = 0x01;
const SUBADR1 = 0x02;
const SUBADR2 = 0x03;
const SUBADR3 = 0x04;
const PRESCALE = 0xfe;
const LED0_ON_L = 0x06;
const LED0_ON_H = 0x07;
const LED0_OFF_L = 0x08;
const LED0_OFF_H = 0x09;
const ALL_LED_ON_L = 0xfa;
const ALL_LED_ON_H = 0xfb;
const ALL_LED_OFF_L = 0xfc;
const ALL_LED_OFF_H = 0xfd;

// Bits:
const RESTART = 0x80;
const SLEEP = 0x10;
const ALLCALL = 0x01;
const INVRT = 0x10;
const OUTDRV = 0x04;

class PCA9685 {
  constructor(sbc) {
    this.sbc = sbc;
    this.i2c_hand = null;
  }

  async init(i2c_bus, i2c_address, i2c_flags = 0) {
    let r = await this.sbc.i2c_open(i2c_bus, i2c_address, i2c_flags);
    if (r < 0) {
      console.log(`PCA9685 i2c_open error ${r}`);
      return r;
    }
    this.i2c_hand = r;

    await this.setAllPWM(0, 0);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, MODE2, OUTDRV);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, MODE1, ALLCALL);
    await this.sbc.lgu_sleep(0.005);
    let mode1 = await this.sbc.i2c_read_byte_data(this.i2c_hand, MODE1);
    mode1 = mode1 & ~SLEEP; // wake up (reset sleep)
    await this.sbc.i2c_write_byte_data(this.i2c_hand, MODE1, mode1);
    await this.sbc.lgu_sleep(0.005); // wait for oscillator

    return this.i2c_hand;
  }

  // 周波数設定
  async setPWMFreq(freq) {
    let prescaleval = 25000000.0; // 25MHz
    prescaleval /= 4096.0; // 12bit
    prescaleval /= freq;
    prescaleval -= 1.0;
    let prescale = Math.floor(prescaleval + 0.5);
    if (prescale < 3) prescale = 3;
    if (prescale > 255) prescale = 255;

    let oldmode = await this.sbc.i2c_read_byte_data(this.i2c_hand, MODE1);
    let newmode = (oldmode & 0x7f) | 0x10; // sleep
    await this.sbc.i2c_write_byte_data(this.i2c_hand, MODE1, newmode); // go to sleep
    await this.sbc.i2c_write_byte_data(this.i2c_hand, PRESCALE, prescale); // set the prescaler
    await this.sbc.i2c_write_byte_data(this.i2c_hand, MODE1, oldmode);
    await this.sbc.lgu_sleep(0.005);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, MODE1, oldmode | 0x80);
  }
  // 単チャンネル制御
  async setPWM(channel, on, off) {
    if (channel < 0 || channel > 15) return;
    await this.sbc.i2c_write_byte_data(
      this.i2c_hand,
      LED0_ON_L + 4 * channel,
      on & 0xff
    );
    await this.sbc.i2c_write_byte_data(
      this.i2c_hand,
      LED0_ON_H + 4 * channel,
      on >> 8
    );
    await this.sbc.i2c_write_byte_data(
      this.i2c_hand,
      LED0_OFF_L + 4 * channel,
      off & 0xff
    );
    await this.sbc.i2c_write_byte_data(
      this.i2c_hand,
      LED0_OFF_H + 4 * channel,
      off >> 8
    );
  }
  // 全チャンネル制御
  async setAllPWM(on, off) {
    await this.sbc.i2c_write_byte_data(this.i2c_hand, ALL_LED_ON_L, on & 0xff);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, ALL_LED_ON_H, on >> 8);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, ALL_LED_OFF_L, off & 0xff);
    await this.sbc.i2c_write_byte_data(this.i2c_hand, ALL_LED_OFF_H, off >> 8);
  }

  // 角度で指定 default: 0.5ms(0°) - 2.5ms(180°)  (min_pulse=150, max_pulse=600)
  async setAngle(channel, angle, min_pulse = 130, max_pulse = 540) {
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;
    let pulse = (angle * (max_pulse - min_pulse)) / 180 + min_pulse;
    await this.setPWM(channel, 0, Math.floor(pulse));
  }

  // 停止
  async stop() {
    await this.sbc.i2c_write_byte_data(this.i2c_hand, ALL_LED_OFF_H, 0x01);
  }

  // 接続解除
  async close() {
    if (this.i2c_hand !== null) {
      await this.sbc.i2c_close(this.i2c_hand);
    }
  }
}

module.exports = { PCA9685 };

/*
 * This code was ported from https://github.com/pozil/adafruit-i2c-pwm-driver/blob/master/src/pwmDriver.js
 */
