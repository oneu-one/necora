const fs = require("fs").promises;

class SERVO {
  constructor(chipNo, channel) {
    this.CHANNEL = channel.toString();
    this.EXPORT_PATH = `/sys/class/pwm/pwmchip${chipNo.toString()}/export`;
    this.PWM_PATH = `/sys/class/pwm/pwmchip${chipNo.toString()}/pwm${
      this.CHANNEL
    }`;
    this.ENABLE_PATH = `${this.PWM_PATH}/enable`;
    this.PERIOD_PATH = `${this.PWM_PATH}/period`;
    this.DUTY_PATH = `${this.PWM_PATH}/duty_cycle`;
  }
  isExported = async (syspath) => {
    try {
      await fs.access(syspath, fs.constants.F_OK);
    } catch {
      return false;
    }
    return true;
  };
  haveAccess = async (syspath) => {
    try {
      await fs.access(syspath, fs.constants.W_OK);
    } catch {
      return false;
    }
    return true;
  };
  waitExported = async (path) => {
    const sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000));
    let waitTime = 0.0;
    do {
      if ((await this.isExported(path)) && (await this.haveAccess(path)))
        return;
      await sleep(0.05);
      waitTime += 0.05;
    } while (waitTime <= 5.0);
    throw new Error("Timeout waiting for export.");
  };

  async start() {
    if (!(await this.isExported(this.PWM_PATH))) {
      await fs.writeFile(this.EXPORT_PATH, this.CHANNEL);
      await this.waitExported(this.PWM_PATH);
    }
    // PWM Start with no pulse
    await fs.writeFile(this.PERIOD_PATH, "20000000"); //50Hz
    await fs.writeFile(this.DUTY_PATH, "0"); //停止状態
    await fs.writeFile(this.ENABLE_PATH, "1");
  }
  async stop() {
    await fs.writeFile(this.DUTY_PATH, "0");
    await fs.writeFile(this.ENABLE_PATH, "0");
  }
  async angle(ang) {
    if (ang < 0 || ang > 180) return;
    const duty_cycle = ang * 10555 + 500000;
    await fs.writeFile(this.DUTY_PATH, duty_cycle.toString());
  }
}
module.exports = { SERVO };
