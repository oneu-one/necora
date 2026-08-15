/*** 指紋センサ SFM-V1.7 ***/

class SFMV17 {
  constructor(sbc) {
    this.sbc = sbc;
    this.SFM_SERIAL_TIMEOUT = 8000; // serial timeout (ms)
    this.SFM_DEFAULT_USERROLE = 0x03; // Default user role for register

    this.SFM_ACK_SUCCESS = 0x00; // Command successful
    this.SFM_ACK_FAIL = 0x01; // Command failed
    this.SFM_ACK_FULL = 0x04; // Database full
    this.SFM_ACK_NOUSER = 0x05; // User does not exist
    this.SFM_ACK_USER_EXIST = 0x07; // User exists
    this.SFM_ACK_TIMEOUT = 0x08; // Image collection timeout
    this.SFM_ACK_HWERROR = 0x0a; // Hardware error
    this.SFM_ACK_IMGERROR = 0x10; // Image error
    this.SFM_ACK_BREAK = 0x18; // Stop current cmd
    this.SFM_ACK_ALGORITHMFAIL = 0x11; // Film/Mask attack detected
    this.SFM_ACK_HOMOLOGYFAIL = 0x12; // Homology check fail
    this.SFM_ACK_SERIALTIMEOUT = 0x13; // Serial receive time exceeds SFM_SERIAL_TIMEOUT
    this.SFM_ACK_IDLE = 0x14; // Module idle

    // Public constance

    this.SFM_RING_OFF = 0x07; // Ring LED Off
    this.SFM_RING_RED = 0x03; // Ring Color Red
    this.SFM_RING_GREEN = 0x05; // Ring Color Green
    this.SFM_RING_BLUE = 0x06; // Ring Color Blue
    this.SFM_RING_YELLOW = 0x01; // Ring Color Yellow
    this.SFM_RING_PURPLE = 0x02; // Ring Color Purple
    this.SFM_RING_CYAN = 0x04; // Ring Color Cyan

    // Public variables

    this.last_status = 0;
  }

  // Calculate XOR checksum
  getCheckSum = (buffer) => {
    let result = 0;
    for (let i = 1; i <= 5; i++) {
      result ^= buffer[i];
    }
    return result;
  };
  // Send command to uart and retruns responce tuple
  sendCmd = async (cmdType, p1, p2, p3) => {
    while (await this.sbc.serial_data_available(this.ser_hand))
      await this.sbc.serial_read(this.ser_hand);
    let cmdBuffer = [0xf5, cmdType, p1, p2, p3, 0, 0, 0xf5];
    cmdBuffer[6] = this.getCheckSum(cmdBuffer);
    await this.sbc.serial_write(this.ser_hand, cmdBuffer);
  };
  getAck = async () => {
    let ackBuffer = Buffer.alloc(0); //Buffer.from([]);
    let timer = this.SFM_SERIAL_TIMEOUT;
    while (timer--) {
      if ((await this.sbc.serial_data_available(this.ser_hand)) > 0) {
        ackBuffer = Buffer.concat([
          ackBuffer,
          await this.sbc.serial_read(this.ser_hand, 0),
        ]);
      } else if (ackBuffer.length >= 8) {
        // 1/100秒待ってデバイス側にデータが残っていないか再チェック
        // await delay(10);
        await this.sbc.lgu_sleep(0.01);
        timer -= 10;
        if ((await this.sbc.serial_data_available(this.ser_hand)) > 0) continue;
        // もうデータは残っていないらしい
        if (ackBuffer[6] == this.getCheckSum(ackBuffer))
          if (ackBuffer.length > 8) {
            // Has data field
            if (ackBuffer[ackBuffer.length - 1] == 0xf5) {
              let dataBuffer = Buffer.alloc(ackBuffer.length - 8);
              ackBuffer.copy(dataBuffer, 0, 8);
              return [
                ackBuffer[1],
                ackBuffer[2],
                ackBuffer[3],
                ackBuffer[4],
                dataBuffer,
              ];
            }
          } else
            return [ackBuffer[1], ackBuffer[2], ackBuffer[3], ackBuffer[4]];
        else return [null, null, null, this.SFM_ACK_FAIL];
      }
      // await delay(1);
      await this.sbc.lgu_sleep(0.001);
    }
    return [null, null, null, SFM_ACK_SERIALTIMEOUT];
  };

  // Rapping sendCmd... Returns tuple
  sendAndGet = async (cmdType, p1 = 0, p2 = 0, p3 = 0) => {
    await this.sendCmd(cmdType, p1, p2, p3);
    let [ackType, q1, q2, q3, dataBuffer] = await this.getAck();
    this.last_status = q3; // コマンド実行結果ステータスを保存
    if (ackType == cmdType) return [ackType, q1, q2, q3, dataBuffer];
    else return [this.SFM_ACK_FAIL, 0, 0, 0];
  };

  // Initialize module... just connect uart
  init = async (serial_port, baud = 115200) => {
    this.ser_hand = await this.sbc.serial_open(serial_port, baud);
    return this.ser_hand;
  };

  // LED ring
  setRingColor = async (start_color, end_color = -1, period = 500) => {
    period /= 10;
    if (period < 30) period = 30;
    else if (period > 200) period = 200;
    if (end_color == -1) end_color = start_color;
    let [ackType, q1, q2, q3] = await this.sendAndGet(
      0xc3,
      start_color,
      end_color,
      period
    );
    return q3;
  };

  // Count users
  getUserCount = async () => {
    let [ackType, q1, q2, q3] = await this.sendAndGet(0x09, 0x00, 0x00, 0x00);
    let userCount = -1;
    if (q3 != this.SFM_ACK_FAIL) userCount = (q1 << 8) | q2;
    // else userCount = -1;
    return userCount;
  };

  // Recognize fingerprint... returns userID / 0: not found / -1: error
  recognition_1vN = async () => {
    let [ackType, q1, q2, q3] = await this.sendAndGet(0x0c, 0x00, 0x00, 0x00);
    let uid = (q1 << 8) | q2;
    if (uid == 0 && q3 != this.SFM_ACK_SUCCESS) return -1;
    else return uid;
  };

  // Registration :
  // step 1... returns success: 0 / fail: -1
  // step 2... returns success: 0 / fail: -1
  // step 3... returns new userID / fail: -1
  register_3c3r = async (step, uid = 0) => {
    let q3, ackType, q1, q2;
    if (step == 1) {
      [ackType, q1, q2, q3] = await this.sendAndGet(
        0x01,
        (uid >> 8) & 0xff,
        uid & 0xff,
        this.SFM_DEFAULT_USERROLE
      );
      if (q3 == this.SFM_ACK_SUCCESS) return 0;
      else return -1;
    } else if (step == 2) {
      [ackType, q1, q2, q3] = await this.sendAndGet(0x02);
      if (q3 == this.SFM_ACK_SUCCESS) return 0;
      else return -1;
    } else if (step == 3) {
      [ackType, q1, q2, q3] = await this.sendAndGet(0x03, 0x00, 0x00, 0x00);
      let uid = -1;
      if (q3 == this.SFM_ACK_SUCCESS) uid = (q1 << 8) | q2;
      return uid;
    }
  };

  // Get fingerprint image
  getImage = async () => {
    let [ackType, q1, q2, q3, dataBuffer] = await this.sendAndGet(0x24);
    if (q3 == this.SFM_ACK_SUCCESS) {
      let width = q1 << 2;
      let height = q2 << 2;
      let len = width * height;
      let imgBuffer = Buffer.alloc(len); //dataBuffer.slice(1, 1 + len);
      dataBuffer.copy(imgBuffer, 0, 1, 1 + len);
      // const imgblob = new Blob([imgBuffer], { type: "image/bmp" });
      return imgBuffer;
    }
    // return [, ];
    else return -1;
  };

  // Delete user(s)
  deleteUser = async (uid) => {
    let ackType, q1, q2, q3;
    if (uid == 0)
      // Delete All users
      [ackType, q1, q2, q3] = await this.sendAndGet(0x05);
    // Delete specific user
    else
      [ackType, q1, q2, q3] = await this.sendAndGet(
        0x04,
        (uid >> 8) & 0xff,
        uid & 0xff,
        this.SFM_DEFAULT_USERROLE
      );
    if (q3 == this.SFM_ACK_SUCCESS) return 0;
    else return -1;
  };

  // Disconnect from uart
  stop = async () => {
    if (this.ser_hand >= 0) {
      await this.sbc.serial_close(this.ser_hand);
      this.ser_hand = -1;
    }
  };
}

/**
 * This library is forked from https://github.com/Matrixchung/SFM-V1.7/
 */
