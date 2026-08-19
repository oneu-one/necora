/***
 * ローカルまたは同一ネットワーク上のシングルボードコンピュータで走る rgpiod デーモンに接続して
 * GPIO/I2C/Serial などを操作するためのモジュール
 * rgpio.py の一部を CommonJS に書き換え（コールバック・スレッディングは省略）
 * 大部分を Gemini ちゃんにお任せした。ご了承ください。
 *
 * 例：
 * const rgpio = require('@necora/rgpio');
 * const sbc = await rgpio.sbc(192.168.0.1);
 * const h = await sbc.gpiochip_open(0);
 *
 * 全てのメソッドは await で呼び出す
 * その他基本的な書式は rgpio Python (https://abyz.me.uk/lg/py_rgpio.html) に準拠
 *
 * 動作確認済みの関数
 * * gpiochip_open
 * * gpiochip_close
 * * gpio_get_chip_info
 * * gpio_claim_output
 * * gpio_claim_input
 * * gpio_read
 * * gpio_write
 * * gpio_free
 * * i2c_open
 * * i2c_close
 * * i2c_read_byte
 * * i2c_write_byte_data
 * * i2c_read_byte_data
 * * i2c_write_word_data
 * * i2c_read_word_data
 * * i2c_write_i2c_block_data
 * * i2c_read_i2c_block_data
 * * i2c_write_device
 * * serial_open
 * * serial_close
 * * serial_write
 * * serial_read
 * * serial_data_available
 * * lgu_sleep
 *
 * 未確認（コメントアウト）※ 自分用メモ
 * * i2c_write_byte
 * * i2c_write_block_data
 * * i2c_read_block_data
 * * i2c_read_device
 ***/

const net = require("node:net");

let exceptions = true;

const MAGIC = 1818715245;

// GPIO levels
const OFF = 0;
const LOW = 0;
const CLEAR = 0;

const ON = 1;
const HIGH = 1;
const SET = 1;

const TIMEOUT = 2; // 接続タイムアウト（秒）

// 注: JavaScriptの数値(Number)は安全な最大整数が 2^53 - 1 なので、
// 64bitのフルビット(0xffffffffffffffff)は BigInt を使用する必要があります。
const GROUP_ALL = 0xffffffffffffffffn;

// GPIO line flags
const SET_ACTIVE_LOW = 4;
const SET_OPEN_DRAIN = 8;
const SET_OPEN_SOURCE = 16;
const SET_PULL_UP = 32;
const SET_PULL_DOWN = 64;
const SET_PULL_NONE = 128;

// GPIO event flags
const RISING_EDGE = 1;
const FALLING_EDGE = 2;
const BOTH_EDGES = 3;

// tx constants
const TX_PWM = 0;
const TX_WAVE = 1;

// script run status
const SCRIPT_INITING = 0;
const SCRIPT_READY = 1;
const SCRIPT_RUNNING = 2;
const SCRIPT_WAITING = 3;
const SCRIPT_ENDED = 4;
const SCRIPT_HALTED = 5;
const SCRIPT_FAILED = 6;

// notification flags
const NTFY_FLAGS_ALIVE = 1 << 0;

const FILE_READ = 1;
const FILE_WRITE = 2;
const FILE_RW = 3;

const FILE_APPEND = 4;
const FILE_CREATE = 8;
const FILE_TRUNC = 16;

const FROM_START = 0;
const FROM_CURRENT = 1;
const FROM_END = 2;

const SPI_MODE_0 = 0;
const SPI_MODE_1 = 1;
const SPI_MODE_2 = 2;
const SPI_MODE_3 = 3;

const _SOCK_CMD_LEN = 16;

// rgpiod command numbers
const _CMD_FO = 1;
const _CMD_FC = 2;
const _CMD_FR = 3;
const _CMD_FW = 4;
const _CMD_FS = 5;
const _CMD_FL = 6;
const _CMD_GO = 10;
const _CMD_GC = 11;
const _CMD_GSIX = 12;
const _CMD_GSOX = 13;
const _CMD_GSAX = 14;
const _CMD_GSF = 15;
const _CMD_GSGIX = 16;
const _CMD_GSGOX = 17;
const _CMD_GSGF = 18;
const _CMD_GR = 19;
const _CMD_GW = 20;
const _CMD_GGR = 21;
const _CMD_GGWX = 22;
const _CMD_GPX = 23;
const _CMD_PX = 24;
const _CMD_SX = 25;
const _CMD_GWAVE = 26;
const _CMD_GBUSY = 27;
const _CMD_GROOM = 28;
const _CMD_GDEB = 29;
const _CMD_GWDOG = 30;
const _CMD_GIC = 31;
const _CMD_GIL = 32;
const _CMD_GMODE = 33;
const _CMD_I2CO = 40;
const _CMD_I2CC = 41;
const _CMD_I2CRD = 42;
const _CMD_I2CWD = 43;
const _CMD_I2CWQ = 44;
const _CMD_I2CRS = 45;
const _CMD_I2CWS = 46;
const _CMD_I2CRB = 47;
const _CMD_I2CWB = 48;
const _CMD_I2CRW = 49;
const _CMD_I2CWW = 50;
const _CMD_I2CRK = 51;
const _CMD_I2CWK = 52;
const _CMD_I2CRI = 53;
const _CMD_I2CWI = 54;
const _CMD_I2CPC = 55;
const _CMD_I2CPK = 56;
const _CMD_I2CZ = 57;
const _CMD_NO = 70;
const _CMD_NC = 71;
const _CMD_NR = 72;
const _CMD_NP = 73;
const _CMD_PARSE = 80;
const _CMD_PROC = 81;
const _CMD_PROCD = 82;
const _CMD_PROCP = 83;
const _CMD_PROCR = 84;
const _CMD_PROCS = 85;
const _CMD_PROCU = 86;
const _CMD_SERO = 90;
const _CMD_SERC = 91;
const _CMD_SERRB = 92;
const _CMD_SERWB = 93;
const _CMD_SERR = 94;
const _CMD_SERW = 95;
const _CMD_SERDA = 96;
const _CMD_SPIO = 100;
const _CMD_SPIC = 101;
const _CMD_SPIR = 102;
const _CMD_SPIW = 103;
const _CMD_SPIX = 104;
const _CMD_MICS = 113;
const _CMD_MILS = 114;
const _CMD_CGI = 115;
const _CMD_CSI = 116;
const _CMD_NOIB = 117;
const _CMD_SHELL = 118;
const _CMD_SBC = 120;
const _CMD_FREE = 121;
const _CMD_SHARE = 130;
const _CMD_USER = 131;
const _CMD_PASSW = 132;
const _CMD_LCFG = 133;
const _CMD_SHRU = 134;
const _CMD_SHRS = 135;
const _CMD_PWD = 136;
const _CMD_PCD = 137;
const _CMD_LGV = 140;
const _CMD_TICK = 141;

// rgpiod error numbers
const OKAY = 0;
const INIT_FAILED = -1;
const BAD_MICROS = -2;
const BAD_PATHNAME = -3;
const NO_HANDLE = -4;
const BAD_HANDLE = -5;
const BAD_SOCKET_PORT = -6;
const NOT_PERMITTED = -7;
const SOME_PERMITTED = -8;
const BAD_SCRIPT = -9;
const BAD_TX_TYPE = -10;
const GPIO_IN_USE = -11;
const BAD_PARAM_NUM = -12;
const DUP_TAG = -13;
const TOO_MANY_TAGS = -14;
const BAD_SCRIPT_CMD = -15;
const BAD_VAR_NUM = -16;
const NO_SCRIPT_ROOM = -17;
const NO_MEMORY = -18;
const SOCK_READ_FAILED = -19;
const SOCK_WRIT_FAILED = -20;
const TOO_MANY_PARAM = -21;
const SCRIPT_NOT_READY = -22;
const BAD_TAG = -23;
const BAD_MICS_DELAY = -24;
const BAD_MILS_DELAY = -25;
const I2C_OPEN_FAILED = -26;
const SERIAL_OPEN_FAILED = -27;
const SPI_OPEN_FAILED = -28;
const BAD_I2C_BUS = -29;
const BAD_I2C_ADDR = -30;
const BAD_SPI_CHANNEL = -31;
const BAD_I2C_FLAGS = -32;
const BAD_SPI_FLAGS = -33;
const BAD_SERIAL_FLAGS = -34;
const BAD_SPI_SPEED = -35;
const BAD_SERIAL_DEVICE = -36;
const BAD_SERIAL_SPEED = -37;
const BAD_FILE_PARAM = -38;
const BAD_I2C_PARAM = -39;
const BAD_SERIAL_PARAM = -40;
const I2C_WRITE_FAILED = -41;
const I2C_READ_FAILED = -42;
const BAD_SPI_COUNT = -43;
const SERIAL_WRITE_FAILED = -44;
const SERIAL_READ_FAILED = -45;
const SERIAL_READ_NO_DATA = -46;
const UNKNOWN_COMMAND = -47;
const SPI_XFER_FAILED = -48;
const BAD_POINTER = -49;
const MSG_TOOBIG = -50;
const BAD_MALLOC_MODE = -51;
const TOO_MANY_SEGS = -52;
const BAD_I2C_SEG = -53;
const BAD_SMBUS_CMD = -54;
const BAD_I2C_WLEN = -55;
const BAD_I2C_RLEN = -56;
const BAD_I2C_CMD = -57;
const FILE_OPEN_FAILED = -58;
const BAD_FILE_MODE = -59;
const BAD_FILE_FLAG = -60;
const BAD_FILE_READ = -61;
const BAD_FILE_WRITE = -62;
const FILE_NOT_ROPEN = -63;
const FILE_NOT_WOPEN = -64;
const BAD_FILE_SEEK = -65;
const NO_FILE_MATCH = -66;
const NO_FILE_ACCESS = -67;
const FILE_IS_A_DIR = -68;
const BAD_SHELL_STATUS = -69;
const BAD_SCRIPT_NAME = -70;
const CMD_INTERRUPTED = -71;
const BAD_EVENT_REQUEST = -72;
const BAD_GPIO_NUMBER = -73;
const BAD_GROUP_SIZE = -74;
const BAD_LINEINFO_IOCTL = -75;
const BAD_READ = -76;
const BAD_WRITE = -77;
const CANNOT_OPEN_CHIP = -78;
const GPIO_BUSY = -79;
const GPIO_NOT_ALLOCATED = -80;
const NOT_A_GPIOCHIP = -81;
const NOT_ENOUGH_MEMORY = -82;
const POLL_FAILED = -83;
const TOO_MANY_GPIOS = -84;
const UNEGPECTED_ERROR = -85;
const BAD_PWM_MICROS = -86;
const NOT_GROUP_LEADER = -87;
const SPI_IOCTL_FAILED = -88;
const BAD_GPIOCHIP = -89;
const BAD_CHIPINFO_IOCTL = -90;
const BAD_CONFIG_FILE = -91;
const BAD_CONFIG_VALUE = -92;
const NO_PERMISSIONS = -93;
const BAD_USERNAME = -94;
const BAD_SECRET = -95;
const TX_QUEUE_FULL = -96;
const BAD_CONFIG_ID = -97;
const BAD_DEBOUNCE_MICS = -98;
const BAD_WATCHDOG_MICS = -99;
const BAD_SERVO_FREQ = -100;
const BAD_SERVO_WIDTH = -101;
const BAD_PWM_FREQ = -102;
const BAD_PWM_DUTY = -103;
const GPIO_NOT_AN_OUTPUT = -104;
const INVALID_GROUP_ALERT = -105;

// エラーコードとメッセージをマッピングした配列
const _errors = [
  [OKAY, "No error"],
  [INIT_FAILED, "initialisation failed"],
  [BAD_MICROS, "micros not 0-999999"],
  [BAD_PATHNAME, "can not open pathname"],
  [NO_HANDLE, "no handle available"],
  [BAD_HANDLE, "unknown handle"],
  [BAD_SOCKET_PORT, "socket port not 1024-32000"],
  [NOT_PERMITTED, "GPIO operation not permitted"],
  [SOME_PERMITTED, "one or more GPIO not permitted"],
  [BAD_SCRIPT, "invalid script"],
  [BAD_TX_TYPE, "bad tx type for GPIO and group"],
  [GPIO_IN_USE, "GPIO already in use"],
  [BAD_PARAM_NUM, "script parameter id not 0-9"],
  [DUP_TAG, "script has duplicate tag"],
  [TOO_MANY_TAGS, "script has too many tags"],
  [BAD_SCRIPT_CMD, "illegal script command"],
  [BAD_VAR_NUM, "script variable id not 0-149"],
  [NO_SCRIPT_ROOM, "no more room for scripts"],
  [NO_MEMORY, "can not allocate temporary memory"],
  [SOCK_READ_FAILED, "socket read failed"],
  [SOCK_WRIT_FAILED, "socket write failed"],
  [TOO_MANY_PARAM, "too many script parameters (> 10)"],
  [SCRIPT_NOT_READY, "script initialising"],
  [BAD_TAG, "script has unresolved tag"],
  [BAD_MICS_DELAY, "bad MICS delay (too large)"],
  [BAD_MILS_DELAY, "bad MILS delay (too large)"],
  [I2C_OPEN_FAILED, "can not open I2C device"],
  [SERIAL_OPEN_FAILED, "can not open serial device"],
  [SPI_OPEN_FAILED, "can not open SPI device"],
  [BAD_I2C_BUS, "bad I2C bus"],
  [BAD_I2C_ADDR, "bad I2C address"],
  [BAD_SPI_CHANNEL, "bad SPI channel"],
  [BAD_I2C_FLAGS, "bad I2C open flags"],
  [BAD_SPI_FLAGS, "bad SPI open flags"],
  [BAD_SERIAL_FLAGS, "bad serial open flags"],
  [BAD_SPI_SPEED, "bad SPI speed"],
  [BAD_SERIAL_DEVICE, "bad serial device name"],
  [BAD_SERIAL_SPEED, "bad serial baud rate"],
  [BAD_FILE_PARAM, "bad file parameter"],
  [BAD_I2C_PARAM, "bad I2C parameter"],
  [BAD_SERIAL_PARAM, "bad serial parameter"],
  [I2C_WRITE_FAILED, "i2c write failed"],
  [I2C_READ_FAILED, "i2c read failed"],
  [BAD_SPI_COUNT, "bad SPI count"],
  [SERIAL_WRITE_FAILED, "ser write failed"],
  [SERIAL_READ_FAILED, "ser read failed"],
  [SERIAL_READ_NO_DATA, "ser read no data available"],
  [UNKNOWN_COMMAND, "unknown command"],
  [SPI_XFER_FAILED, "spi xfer/read/write failed"],
  [BAD_POINTER, "bad (NULL) pointer"],
  [MSG_TOOBIG, "socket/pipe message too big"],
  [BAD_MALLOC_MODE, "bad memory allocation mode"],
  [TOO_MANY_SEGS, "too many I2C transaction segments"],
  [BAD_I2C_SEG, "an I2C transaction segment failed"],
  [BAD_SMBUS_CMD, "SMBus command not supported by driver"],
  [BAD_I2C_WLEN, "bad I2C write length"],
  [BAD_I2C_RLEN, "bad I2C read length"],
  [BAD_I2C_CMD, "bad I2C command"],
  [FILE_OPEN_FAILED, "file open failed"],
  [BAD_FILE_MODE, "bad file mode"],
  [BAD_FILE_FLAG, "bad file flag"],
  [BAD_FILE_READ, "bad file read"],
  [BAD_FILE_WRITE, "bad file write"],
  [FILE_NOT_ROPEN, "file not open for read"],
  [FILE_NOT_WOPEN, "file not open for write"],
  [BAD_FILE_SEEK, "bad file seek"],
  [NO_FILE_MATCH, "no files match pattern"],
  [NO_FILE_ACCESS, "no permission to access file"],
  [FILE_IS_A_DIR, "file is a directory"],
  [BAD_SHELL_STATUS, "bad shell return status"],
  [BAD_SCRIPT_NAME, "bad script name"],
  [CMD_INTERRUPTED, "Node.js socket command interrupted"],
  [BAD_EVENT_REQUEST, "bad event request"],
  [BAD_GPIO_NUMBER, "bad GPIO number"],
  [BAD_GROUP_SIZE, "bad group size"],
  [BAD_LINEINFO_IOCTL, "bad lineinfo IOCTL"],
  [BAD_READ, "bad GPIO read"],
  [BAD_WRITE, "bad GPIO write"],
  [CANNOT_OPEN_CHIP, "can not open gpiochip"],
  [GPIO_BUSY, "GPIO busy"],
  [GPIO_NOT_ALLOCATED, "GPIO not allocated"],
  [NOT_A_GPIOCHIP, "not a gpiochip"],
  [NOT_ENOUGH_MEMORY, "not enough memory"],
  [POLL_FAILED, "GPIO poll failed"],
  [TOO_MANY_GPIOS, "too many GPIO"],
  [UNEGPECTED_ERROR, "unexpected error"],
  [BAD_PWM_MICROS, "bad PWM micros"],
  [NOT_GROUP_LEADER, "GPIO not the group leader"],
  [SPI_IOCTL_FAILED, "SPI iOCTL failed"],
  [BAD_GPIOCHIP, "bad gpiochip"],
  [BAD_CHIPINFO_IOCTL, "bad chipinfo IOCTL"],
  [BAD_CONFIG_FILE, "bad configuration file"],
  [BAD_CONFIG_VALUE, "bad configuration value"],
  [NO_PERMISSIONS, "no permission to perform action"],
  [BAD_USERNAME, "bad user name"],
  [BAD_SECRET, "bad secret for user"],
  [TX_QUEUE_FULL, "TX queue full"],
  [BAD_CONFIG_ID, "bad configuration id"],
  [BAD_DEBOUNCE_MICS, "bad debounce microseconds"],
  [BAD_WATCHDOG_MICS, "bad watchdog microseconds"],
  [BAD_SERVO_FREQ, "bad servo frequency"],
  [BAD_SERVO_WIDTH, "bad servo pulsewidth"],
  [BAD_PWM_FREQ, "bad PWM frequency"],
  [BAD_PWM_DUTY, "bad PWM dutycycle"],
  [GPIO_NOT_AN_OUTPUT, "GPIO not set as an output"],
  [INVALID_GROUP_ALERT, "can not set a group to alert"],
];

const _except_a =
  "############################################################\n{}";

const _except_z =
  "############################################################";

const _except_1 = `
Did you start the rgpiod daemon? E.g. rgpiod &

Did you specify the correct host/port in the environment
variables LG_ADDR and/or LG_PORT?
E.g. export LG_ADDR=soft, export LG_PORT=8889

Did you specify the correct host/port in the
rgpio.sbc() function? E.g. rgpio.sbc('soft', 8889)
`;

const _except_2 = `
Do you have permission to access the rgpiod daemon?
Perhaps it was started with rgpiod -nlocalhost
`;

const _except_3 = `
Can't create callback thread.
Perhaps too many simultaneous rgpiod connections.
`;

// カスタムエラークラスの定義
class RGpioError extends Error {
  constructor(value) {
    super(value);
    this.name = "RGpioError";
    this.value = value;
  }
  toString() {
    return String(this.value);
  }
}
// エラーテキスト取得
function error_text(errnum) {
  if (typeof _errors !== "undefined") {
    for (const e of _errors) {
      if (e[0] === errnum) return e[1];
    }
  }
  return "unknown error";
}

// ユーティリティ関数

// 符号なし32bit整数を符号付き32bit整数に変換する関数
function u2i(uint32) {
  // JavaScriptで32bit符号付き整数にキャストする最も高速な方法（ビット演算を利用）
  return uint32 >> 0;
}

function _u2i(status) {
  const v = u2i(status);
  if (v < 0) {
    if (exceptions) {
      throw new RGpioError(error_text(v));
    }
  }
  return v;
}

function _u2i_list(lst) {
  lst[0] = u2i(lst[0]);
  if (lst[0] < 0) {
    if (exceptions) {
      throw new RGpioError(error_text(lst[0]));
    }
  }
  return lst;
}

// ソケット接続（await/async, timeout 対応）
function connectAsync(port, host) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.destroy(new Error("Connect timeout"));
    }, TIMEOUT * 1000);
    const socket = net.connect(port, host, () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

/**
 * 指定バイト数に達するまでソケットからデータを同期・非同期風に読み込むヘルパー関数
 */
function readBytesAsync(socket, count) {
  return new Promise((resolve, reject) => {
    let buf = socket._rxBuffer || Buffer.alloc(0);

    const onData = (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      if (buf.length >= count) {
        cleanup();
        socket._rxBuffer = buf.slice(count); // 超過分を次回用に保持
        resolve(buf.slice(0, count));
      }
    };

    const onError = (err) => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      socket.removeListener("data", onData);
      socket.removeListener("error", onError);
    };

    // 既にバッファに必要な量が溜まっている場合
    if (buf.length >= count) {
      socket._rxBuffer = buf.slice(count);
      return resolve(buf.slice(0, count));
    }

    socket._rxBuffer = null;
    socket.on("data", onData);
    socket.on("error", onError);
  });
}

// コマンド送信（引数なし/基本形式）
async function _lg_command_nolock(sl_s, cmd, Q = 0, L = 0, H = 0) {
  try {
    // Python: struct.pack('IIHHHH', MAGIC, 0, cmd, Q, L, H)
    // I=4byte(UInt32), H=2byte(UInt16) -> 合計16バイト
    const sendBuf = Buffer.alloc(16);
    sendBuf.writeUInt32LE(MAGIC, 0);
    sendBuf.writeUInt32LE(0, 4);
    sendBuf.writeUInt16LE(cmd, 8);
    sendBuf.writeUInt16LE(Q, 10);
    sendBuf.writeUInt16LE(L, 12);
    sendBuf.writeUInt16LE(H, 14);

    sl_s.write(sendBuf);

    // レスポンスの受信待ち（_SOCK_CMD_LEN = 16 バイト）
    const resBuf = await readBytesAsync(sl_s, 16);

    // Python: struct.unpack('I12s', ...) -> 先頭4バイトがstatus
    const status = resBuf.readUInt32LE(0);
    return status;
  } catch (err) {
    return u2i(CMD_INTERRUPTED);
  }
}

// コマンド送信（拡張データあり形式）
async function _lg_command_ext_nolock(
  sl_s,
  cmd,
  p3,
  extents,
  Q = 0,
  L = 0,
  H = 0,
) {
  try {
    const header = Buffer.alloc(16);
    header.writeUInt32LE(MAGIC, 0);
    header.writeUInt32LE(p3, 4);
    header.writeUInt16LE(cmd, 8);
    header.writeUInt16LE(Q, 10);
    header.writeUInt16LE(L, 12);
    header.writeUInt16LE(H, 14);

    // 拡張データの結合
    const buffers = [header];
    for (const x of extents) {
      buffers.push(x); // extents の要素は全て Buffer でなければならない。書き込みデータを持つ関数は特に気を付けること。
    }
    const ext = Buffer.concat(buffers);
    sl_s.write(ext);

    const resBuf = await readBytesAsync(sl_s, 16);
    const status = resBuf.readUInt32LE(0);
    return status;
  } catch (err) {
    return u2i(CMD_INTERRUPTED);
  }
}

// rgpio.cjs を require してから最初に呼び出す関数
// sbc クラスを作成して初期化（rgpiodへ接続など）してからクラスのインスタンスを返す
// sbc() の名前でエクスポート（書式を rgpio Python に準拠）
async function create_sbc(
  host = process.env.LG_ADDR || "localhost",
  port = process.env.LG_PORT || 8889,
  show_errors = true,
) {
  const instance = new _sbc();
  await instance._init(host, port, show_errors);
  return instance;
}

// SBCクラスの定義
class _sbc {
  constructor() {
    this.connected = false;
    this.sl_s = null;
    this._host = "";
    this._port = 0;
  }

  async _rxbuf(count) {
    return await readBytesAsync(this.sl_s, count);
  }

  async _init(
    host = process.env.LG_ADDR || "localhost",
    port = process.env.LG_PORT || 8889,
    show_errors = true,
  ) {
    this.connected = true;
    this.sl_s = null;
    let numericPort = parseInt(port, 10);
    if (host === "") {
      host = "localhost";
    }

    this._host = host;
    this._port = numericPort;

    let exception = 0;

    try {
      let client = await connectAsync(numericPort, host);
      this.sl_s = client;
    } catch (err) {
      // エラー内容に応じた分岐判定（簡易版）
      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        exception = 1;
      } else {
        exception = 2;
      }
    }

    if (exception !== 0) {
      this.connected = false;
      this.sl_s = null;

      if (show_errors) {
        const s = `Can't connect to rgpiod at ${host}(${numericPort})`;
        if (typeof _except_a === "function") console.log(_except_a(s));
        if (exception === 1) console.log(_except_1);
        else if (exception === 2) console.log(_except_2);
        else console.log(_except_3);
        if (typeof _except_z === "string") console.log(_except_z);
      }
    } else {
      // プログラム正常終了時のクリーンアップ処理の登録
      process.on("exit", () => this.stop());

      const user = process.env.LG_USER || "";
      if (user.length > 0) {
        if (typeof this.set_user === "function") {
          await this.set_user(user);
        }
      }
    }
  }

  // rgpiod から切断
  async stop() {
    this.connected = false;
    if (this.sl_s !== null) {
      await _lg_command_nolock(this.sl_s, _CMD_FREE);
      this.sl_s.destroy(); // ソケットを完全に閉じる
      this.sl_s = null;
    }
  }

  // GPIO 操作系メソッド

  // gpiochip_open: 指定した gpiochip を開き、ハンドルを返す
  async gpiochip_open(gpiochip) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(gpiochip, 0);

    let handle = u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GO, 4, [extBuf], 0, 1, 0),
    );
    if (handle >= 0) {
      handle = handle | (gpiochip << 16);
    }
    return _u2i(handle);
  }

  // gpiochip_close: 指定したハンドルの gpiochip を閉じる
  async gpiochip_close(handle) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GC, 4, [extBuf], 0, 1, 0),
    );
  }

  // gpio_get_chip_info: 指定したハンドルの gpiochip 情報を取得
  async gpio_get_chip_info(handle) {
    let bytes = u2i(CMD_INTERRUPTED);
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    let rdata = "";

    bytes = u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GIC, 4, [extBuf], 0, 1, 0),
    );

    let lines = 0,
      name = "",
      label = "";
    if (bytes > 0) {
      rdata = await this._rxbuf(bytes);
      // Python: struct.unpack("I32s32s", rdata) -> 4byte + 32byte + 32byte
      lines = rdata.readUInt32LE(0);
      name = rdata.toString("utf8", 4, 36).replace(/\0+$/, "");
      label = rdata.toString("utf8", 36, 68).replace(/\0+$/, "");
      bytes = OKAY;
    } else {
      lines = 0;
      name = "";
      label = "";
    }
    return _u2i_list([bytes, lines, name, label]);
  }

  // 指定したハンドルの GPIO を出力に設定
  async gpio_claim_output(handle, gpio, level = 0, lFlags = 0) {
    const extBuf = Buffer.alloc(16);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    extBuf.writeUInt32LE(lFlags, 4);
    extBuf.writeUInt32LE(gpio, 8);
    extBuf.writeUInt32LE(level, 12);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GSOX, 16, [extBuf], 0, 4, 0),
    );
  }

  // 指定したハンドルの GPIO を入力に設定
  async gpio_claim_input(handle, gpio, lFlags = 0) {
    const extBuf = Buffer.alloc(12);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    extBuf.writeUInt32LE(lFlags, 4);
    extBuf.writeUInt32LE(gpio, 8);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GSIX, 12, [extBuf], 0, 3, 0),
    );
  }

  // GPIO の入力レベルを取得
  async gpio_read(handle, gpio) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    extBuf.writeUInt32LE(gpio, 4);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GR, 8, [extBuf], 0, 2, 0),
    );
  }

  // GPIO の出力レベルを設定
  async gpio_write(handle, gpio, level) {
    const extBuf = Buffer.alloc(12);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    extBuf.writeUInt32LE(gpio, 4);
    extBuf.writeUInt32LE(level, 8);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GW, 12, [extBuf], 0, 3, 0),
    );
  }

  // GPIO を解放
  async gpio_free(handle, gpio) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    extBuf.writeUInt32LE(gpio, 4);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_GSF, 8, [extBuf], 0, 2, 0),
    );
  }

  // PWM
  async tx_pwm(
    handle,
    gpio,
    pwm_frequency,
    pwm_duty_cycle,
    pulse_offset = 0,
    pulse_cycles = 0,
  ) {
    const extBuf = Buffer.alloc(24);
    extBuf.writeUInt32LE(handle & 0xffff, 0);
    extBuf.writeUInt32LE(gpio, 4);
    extBuf.writeUInt32LE(pwm_frequency * 1000, 8);
    extBuf.writeUInt32LE(pwm_duty_cycle * 1000, 12);
    extBuf.writeUInt32LE(pulse_offset, 16);
    extBuf.writeUInt32LE(pulse_cycles, 20);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_PX, 24, [extBuf], 0, 6, 0),
    );
  }

  // I2C

  // I2C デバイスを開く
  async i2c_open(bus, addr, flags = 0) {
    const extBuf = Buffer.alloc(12);
    extBuf.writeUInt32LE(bus, 0);
    extBuf.writeUInt32LE(addr, 4);
    extBuf.writeUInt32LE(flags, 8);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_I2CO, 12, [extBuf], 0, 3, 0),
    );
  }

  // I2C デバイスを閉じる
  async i2c_close(handle) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle, 0);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_I2CC, 4, [extBuf], 0, 1, 0),
    );
  }

  // // I2C デバイスに1バイト書き込む
  // async i2c_write_byte(handle, byte_val) {
  //     const extBuf = Buffer.alloc(8);
  //     extBuf.writeUInt32LE(handle, 0);
  //     extBuf.writeUInt32LE(byte_val, 4);
  //     return _u2i(await _lg_command_ext_nolock(this.sl_s, _CMD_I2CWS, 8, [extBuf], 0, 2, 0));
  // }

  // I2C デバイスから1バイト読み込む
  async i2c_read_byte(handle) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle, 0);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_I2CRS, 4, [extBuf], 0, 1, 0),
    );
  }

  // I2C デバイスの指定レジスタに1バイト書き込む
  async i2c_write_byte_data(handle, reg, byte_val) {
    const extBuf = Buffer.alloc(12);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(reg, 4);
    extBuf.writeUInt32LE(byte_val, 8);
    return _u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_I2CWB,
        12,
        [extBuf],
        0,
        3,
        0,
      ),
    );
  }

  // I2C デバイスの指定レジスタから1バイト読み込む
  async i2c_read_byte_data(handle, reg) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(reg, 4);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_I2CRB, 8, [extBuf], 0, 2, 0),
    );
  }

  // I2C デバイスの指定レジスタに 16bit ワードを書き込む
  async i2c_write_word_data(handle, reg, word_val) {
    const extBuf = Buffer.alloc(12);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(reg, 4);
    extBuf.writeUInt32LE(word_val, 8);
    return _u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_I2CWW,
        12,
        [extBuf],
        0,
        3,
        0,
      ),
    );
  }

  // I2C デバイスの指定レジスタから 16bit ワードを読み込む
  async i2c_read_word_data(handle, reg) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(reg, 4);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_I2CRW, 8, [extBuf], 0, 2, 0),
    );
  }

  // // I2C デバイスの指定レジスタに最大 32バイトのデータを書き込む
  // async i2c_write_block_data(handle, reg, data) {
  //     const extBuf = Buffer.alloc(8);
  //     extBuf.writeUInt32LE(handle, 0);
  //     extBuf.writeUInt32LE(reg, 4);
  //     const d = Buffer.from(data);
  //     return _u2i(await _lg_command_ext_nolock(this.sl_s, _CMD_I2CWK, 8 + d.length, [extBuf, d], 0, 2, 0));
  // }

  // // I2C デバイスの指定レジスタから最大 32バイトのデータを読み込む
  // async i2c_read_block_data(handle, reg) {
  //     const extBuf = Buffer.alloc(8);
  //     extBuf.writeUInt32LE(handle, 0);
  //     extBuf.writeUInt32LE(reg, 4);
  //     const bytes = u2i(await _lg_command_ext_nolock(this.sl_s, _CMD_I2CRK, 8, [extBuf], 0, 2, 0));
  //     if (bytes > 0) {
  //         const rdata = await this._rxbuf(bytes);
  //         return _u2i_list([bytes, rdata]);
  //     } else {
  //         return _u2i_list([bytes, Buffer.alloc(0)]);
  //     }
  // }

  // I2C デバイスの指定レジスタにデータ（1-32バイト）を書き込む
  async i2c_write_i2c_block_data(handle, reg, data) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(reg, 4);
    const dataBuf = Buffer.from(data);
    return _u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_I2CWI,
        8 + dataBuf.length,
        [extBuf, dataBuf],
        0,
        2,
        0,
      ),
    );
  }

  // I2C デバイスの指定レジスタから count バイトのデータ（1-32バイト）を読み込む
  async i2c_read_i2c_block_data(handle, reg, count) {
    const extBuf = Buffer.alloc(12);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(reg, 4);
    extBuf.writeUInt32LE(count, 8);
    const bytes = u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_I2CRI,
        12,
        [extBuf],
        0,
        3,
        0,
      ),
    );
    if (bytes > 0) {
      const rdata = await this._rxbuf(bytes);
      return _u2i_list([bytes, rdata]);
    } else {
      return _u2i_list([bytes, Buffer.alloc(0)]);
    }
  }

  // // I2C 生デバイスから count バイトのデータを読み込む
  // async i2c_read_device(handle, count) {
  //     const extBuf = Buffer.alloc(8);
  //     extBuf.writeUInt32LE(handle, 0);
  //     extBuf.writeUInt32LE(count, 4);
  //     const bytes = u2i(await _lg_command_ext_nolock(this.sl_s, _CMD_I2CRD, 8, [extBuf], 0, 2, 0));
  //     if (bytes > 0) {
  //         const rdata = await this._rxbuf(bytes);
  //         return _u2i_list([bytes, rdata]);
  //     } else {
  //         return _u2i_list([bytes, Buffer.alloc(0)]);
  //     }
  // }

  // I2C 生デバイスにデータを書き込む
  async i2c_write_device(handle, data) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle, 0);
    const dataBuf = Buffer.from(data);
    return _u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_I2CWD,
        4 + dataBuf.length,
        [extBuf, dataBuf],
        0,
        1,
        0,
      ),
    );
  }

  // シリアル

  // シリアルデバイスを開く
  async serial_open(tty, baud, ser_flags = 0) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(baud, 0);
    extBuf.writeUInt32LE(ser_flags, 4);
    const ttyBuf = Buffer.from(tty);
    return _u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_SERO,
        8 + ttyBuf.length,
        [extBuf, ttyBuf],
        0,
        2,
        0,
      ),
    );
  }

  // シリアルデバイスを閉じる
  async serial_close(handle) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle, 0);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_SERC, 4, [extBuf], 0, 1, 0),
    );
  }

  // シリアルデバイスにデータを書き込む
  async serial_write(handle, data) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle, 0);
    const dataBuf = Buffer.from(data);
    return _u2i(
      await _lg_command_ext_nolock(
        this.sl_s,
        _CMD_SERW,
        4 + dataBuf.length,
        [extBuf, dataBuf],
        0,
        1,
        0,
      ),
    );
  }

  // シリアルデバイスからデータを読み込む
  async serial_read(handle, count = 1000) {
    const extBuf = Buffer.alloc(8);
    extBuf.writeUInt32LE(handle, 0);
    extBuf.writeUInt32LE(count, 4);
    const bytes = u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_SERR, 8, [extBuf], 0, 2, 0),
    );
    if (bytes > 0) {
      const rdata = await this._rxbuf(bytes);
      return _u2i_list([bytes, rdata]);
    } else {
      return _u2i_list([bytes, Buffer.alloc(0)]);
    }
  }

  // シリアルデバイスの読み込みバッファに残っているデータ数を取得
  async serial_data_available(handle) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(handle, 0);
    return _u2i(
      await _lg_command_ext_nolock(this.sl_s, _CMD_SERDA, 4, [extBuf], 0, 1, 0),
    );
  }

  // ツール

  // 指定秒数処理を停止
  lgu_sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000));
}

module.exports = {
  sbc: create_sbc,
  SET_PULL_UP: SET_PULL_UP,
  SET_PULL_DOWN: SET_PULL_DOWN,
  SET_PULL_NONE: SET_PULL_NONE,
};

// Python -> Node.js 変換アシスト：Gemini, Copilot
