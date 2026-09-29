/***
 * ローカルまたは同一ネットワーク上の Raspberry Piで走る pigpiod デーモンに接続して
 * GPIO/I2C/Serial などを操作するためのモジュール
 * pigpio.py の一部を CommonJS に書き換え（コールバックは省略）
 * 大部分を Gemini ちゃんにお任せした。ご了承ください。
 * そしてさらに最終確認を ChatGPT にお任せしました。
 *
 * 例：
 * const pigpio = require('./pigpio.cjs');
 * const pi = await pigpio.pi("192.168.0.1", "8888");
 * const h = await pi.i2c_open(1, 0x76); // bme280
 *
 * 全てのメソッドは await で呼び出す
 * その他基本的な書式は pigpio Python (https://abyz.me.uk/rpi/pigpio/python.html) に準拠
 *
 * 動作確認済みの関数
 * * pigpio.pi
 * * stop
 * * set_mode
 * * get_mode
 * * set_pull_up_down
 * * read
 * * write
 * * set_servo_pulsewidth
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
 * * sleep
 ***/

const net = require("node:net");

let exceptions = true;

// GPIO levels
const OFF = 0;
const LOW = 0;
const CLEAR = 0;

const ON = 1;
const HIGH = 1;
const SET = 1;

const TIMEOUT = 2; // 接続タイムアウト（秒）

// GPIO edges
const RISING_EDGE = 0;
const FALLING_EDGE = 1;
const EITHER_EDGE = 2;

// GPIO modes
const INPUT = 0;
const OUTPUT = 1;
const ALT0 = 4;
const ALT1 = 5;
const ALT2 = 6;
const ALT3 = 7;
const ALT4 = 3;
const ALT5 = 2;

// GPIO Pull Up Down
const PUD_OFF = 0;
const PUD_DOWN = 1;
const PUD_UP = 2;

// script run status

const PI_SCRIPT_INITING = 0;
const PI_SCRIPT_HALTED = 1;
const PI_SCRIPT_RUNNING = 2;
const PI_SCRIPT_WAITING = 3;
const PI_SCRIPT_FAILED = 4;

// notification flags

const NTFY_FLAGS_EVENT = 1 << 7;
const NTFY_FLAGS_ALIVE = 1 << 6;
const NTFY_FLAGS_WDOG = 1 << 5;
const NTFY_FLAGS_GPIO = 31;

// wave modes

const WAVE_MODE_ONE_SHOT = 0;
const WAVE_MODE_REPEAT = 1;
const WAVE_MODE_ONE_SHOT_SYNC = 2;
const WAVE_MODE_REPEAT_SYNC = 3;

const WAVE_NOT_FOUND = 9998; // Transmitted wave not found.
const NO_TX_WAVE = 9999; // No wave being transmitted.

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

const SPI_CPHA = 1 << 0;
const SPI_CPOL = 1 << 1;

const SPI_CS_HIGH_ACTIVE = 1 << 2;

const SPI_TX_LSBFIRST = 1 << 14;
const SPI_RX_LSBFIRST = 1 << 15;

const EVENT_BSC = 31;

const _SOCK_CMD_LEN = 16;

// pigpio command numbers

const _PI_CMD_MODES = 0;
const _PI_CMD_MODEG = 1;
const _PI_CMD_PUD = 2;
const _PI_CMD_READ = 3;
const _PI_CMD_WRITE = 4;
const _PI_CMD_PWM = 5;
const _PI_CMD_PRS = 6;
const _PI_CMD_PFS = 7;
const _PI_CMD_SERVO = 8;
const _PI_CMD_WDOG = 9;
const _PI_CMD_BR1 = 10;
const _PI_CMD_BR2 = 11;
const _PI_CMD_BC1 = 12;
const _PI_CMD_BC2 = 13;
const _PI_CMD_BS1 = 14;
const _PI_CMD_BS2 = 15;
const _PI_CMD_TICK = 16;
const _PI_CMD_HWVER = 17;

const _PI_CMD_NO = 18;
const _PI_CMD_NB = 19;
const _PI_CMD_NP = 20;
const _PI_CMD_NC = 21;

const _PI_CMD_PRG = 22;
const _PI_CMD_PFG = 23;
const _PI_CMD_PRRG = 24;
const _PI_CMD_HELP = 25;
const _PI_CMD_PIGPV = 26;

const _PI_CMD_WVCLR = 27;
const _PI_CMD_WVAG = 28;
const _PI_CMD_WVAS = 29;
const _PI_CMD_WVGO = 30;
const _PI_CMD_WVGOR = 31;
const _PI_CMD_WVBSY = 32;
const _PI_CMD_WVHLT = 33;
const _PI_CMD_WVSM = 34;
const _PI_CMD_WVSP = 35;
const _PI_CMD_WVSC = 36;

const _PI_CMD_TRIG = 37;

const _PI_CMD_PROC = 38;
const _PI_CMD_PROCD = 39;
const _PI_CMD_PROCR = 40;
const _PI_CMD_PROCS = 41;

const _PI_CMD_SLRO = 42;
const _PI_CMD_SLR = 43;
const _PI_CMD_SLRC = 44;

const _PI_CMD_PROCP = 45;
const _PI_CMD_MICRO = 46;
const _PI_CMD_MILLI = 47;
const _PI_CMD_PARSE = 48;

const _PI_CMD_WVCRE = 49;
const _PI_CMD_WVDEL = 50;
const _PI_CMD_WVTX = 51;
const _PI_CMD_WVTXR = 52;
const _PI_CMD_WVNEW = 53;

const _PI_CMD_I2CO = 54;
const _PI_CMD_I2CC = 55;
const _PI_CMD_I2CRD = 56;
const _PI_CMD_I2CWD = 57;
const _PI_CMD_I2CWQ = 58;
const _PI_CMD_I2CRS = 59;
const _PI_CMD_I2CWS = 60;
const _PI_CMD_I2CRB = 61;
const _PI_CMD_I2CWB = 62;
const _PI_CMD_I2CRW = 63;
const _PI_CMD_I2CWW = 64;
const _PI_CMD_I2CRK = 65;
const _PI_CMD_I2CWK = 66;
const _PI_CMD_I2CRI = 67;
const _PI_CMD_I2CWI = 68;
const _PI_CMD_I2CPC = 69;
const _PI_CMD_I2CPK = 70;

const _PI_CMD_SPIO = 71;
const _PI_CMD_SPIC = 72;
const _PI_CMD_SPIR = 73;
const _PI_CMD_SPIW = 74;
const _PI_CMD_SPIX = 75;

const _PI_CMD_SERO = 76;
const _PI_CMD_SERC = 77;
const _PI_CMD_SERRB = 78;
const _PI_CMD_SERWB = 79;
const _PI_CMD_SERR = 80;
const _PI_CMD_SERW = 81;
const _PI_CMD_SERDA = 82;

const _PI_CMD_GDC = 83;
const _PI_CMD_GPW = 84;

const _PI_CMD_HC = 85;
const _PI_CMD_HP = 86;

const _PI_CMD_CF1 = 87;
const _PI_CMD_CF2 = 88;

const _PI_CMD_NOIB = 99;

const _PI_CMD_BI2CC = 89;
const _PI_CMD_BI2CO = 90;
const _PI_CMD_BI2CZ = 91;

const _PI_CMD_I2CZ = 92;

const _PI_CMD_WVCHA = 93;

const _PI_CMD_SLRI = 94;

const _PI_CMD_CGI = 95;
const _PI_CMD_CSI = 96;

const _PI_CMD_FG = 97;
const _PI_CMD_FN = 98;

const _PI_CMD_WVTXM = 100;
const _PI_CMD_WVTAT = 101;

const _PI_CMD_PADS = 102;
const _PI_CMD_PADG = 103;

const _PI_CMD_FO = 104;
const _PI_CMD_FC = 105;
const _PI_CMD_FR = 106;
const _PI_CMD_FW = 107;
const _PI_CMD_FS = 108;
const _PI_CMD_FL = 109;
const _PI_CMD_SHELL = 110;

const _PI_CMD_BSPIC = 111;
const _PI_CMD_BSPIO = 112;
const _PI_CMD_BSPIX = 113;

const _PI_CMD_BSCX = 114;

const _PI_CMD_EVM = 115;
const _PI_CMD_EVT = 116;

const _PI_CMD_PROCU = 117;
const _PI_CMD_WVCAP = 118;

// pigpio error numbers

const _PI_INIT_FAILED = -1;
const PI_BAD_USER_GPIO = -2;
const PI_BAD_GPIO = -3;
const PI_BAD_MODE = -4;
const PI_BAD_LEVEL = -5;
const PI_BAD_PUD = -6;
const PI_BAD_PULSEWIDTH = -7;
const PI_BAD_DUTYCYCLE = -8;
const _PI_BAD_TIMER = -9;
const _PI_BAD_MS = -10;
const _PI_BAD_TIMETYPE = -11;
const _PI_BAD_SECONDS = -12;
const _PI_BAD_MICROS = -13;
const _PI_TIMER_FAILED = -14;
const PI_BAD_WDOG_TIMEOUT = -15;
const _PI_NO_ALERT_FUNC = -16;
const _PI_BAD_CLK_PERIPH = -17;
const _PI_BAD_CLK_SOURCE = -18;
const _PI_BAD_CLK_MICROS = -19;
const _PI_BAD_BUF_MILLIS = -20;
const PI_BAD_DUTYRANGE = -21;
const _PI_BAD_SIGNUM = -22;
const _PI_BAD_PATHNAME = -23;
const PI_NO_HANDLE = -24;
const PI_BAD_HANDLE = -25;
const _PI_BAD_IF_FLAGS = -26;
const _PI_BAD_CHANNEL = -27;
const _PI_BAD_PRIM_CHANNEL = -27;
const _PI_BAD_SOCKET_PORT = -28;
const _PI_BAD_FIFO_COMMAND = -29;
const _PI_BAD_SECO_CHANNEL = -30;
const _PI_NOT_INITIALISED = -31;
const _PI_INITIALISED = -32;
const _PI_BAD_WAVE_MODE = -33;
const _PI_BAD_CFG_INTERNAL = -34;
const PI_BAD_WAVE_BAUD = -35;
const PI_TOO_MANY_PULSES = -36;
const PI_TOO_MANY_CHARS = -37;
const PI_NOT_SERIAL_GPIO = -38;
const _PI_BAD_SERIAL_STRUC = -39;
const _PI_BAD_SERIAL_BUF = -40;
const PI_NOT_PERMITTED = -41;
const PI_SOME_PERMITTED = -42;
const PI_BAD_WVSC_COMMND = -43;
const PI_BAD_WVSM_COMMND = -44;
const PI_BAD_WVSP_COMMND = -45;
const PI_BAD_PULSELEN = -46;
const PI_BAD_SCRIPT = -47;
const PI_BAD_SCRIPT_ID = -48;
const PI_BAD_SER_OFFSET = -49;
const PI_GPIO_IN_USE = -50;
const PI_BAD_SERIAL_COUNT = -51;
const PI_BAD_PARAM_NUM = -52;
const PI_DUP_TAG = -53;
const PI_TOO_MANY_TAGS = -54;
const PI_BAD_SCRIPT_CMD = -55;
const PI_BAD_VAR_NUM = -56;
const PI_NO_SCRIPT_ROOM = -57;
const PI_NO_MEMORY = -58;
const PI_SOCK_READ_FAILED = -59;
const PI_SOCK_WRIT_FAILED = -60;
const PI_TOO_MANY_PARAM = -61;
const PI_SCRIPT_NOT_READY = -62;
const PI_BAD_TAG = -63;
const PI_BAD_MICS_DELAY = -64;
const PI_BAD_MILS_DELAY = -65;
const PI_BAD_WAVE_ID = -66;
const PI_TOO_MANY_CBS = -67;
const PI_TOO_MANY_OOL = -68;
const PI_EMPTY_WAVEFORM = -69;
const PI_NO_WAVEFORM_ID = -70;
const PI_I2C_OPEN_FAILED = -71;
const PI_SER_OPEN_FAILED = -72;
const PI_SPI_OPEN_FAILED = -73;
const PI_BAD_I2C_BUS = -74;
const PI_BAD_I2C_ADDR = -75;
const PI_BAD_SPI_CHANNEL = -76;
const PI_BAD_FLAGS = -77;
const PI_BAD_SPI_SPEED = -78;
const PI_BAD_SER_DEVICE = -79;
const PI_BAD_SER_SPEED = -80;
const PI_BAD_PARAM = -81;
const PI_I2C_WRITE_FAILED = -82;
const PI_I2C_READ_FAILED = -83;
const PI_BAD_SPI_COUNT = -84;
const PI_SER_WRITE_FAILED = -85;
const PI_SER_READ_FAILED = -86;
const PI_SER_READ_NO_DATA = -87;
const PI_UNKNOWN_COMMAND = -88;
const PI_SPI_XFER_FAILED = -89;
const _PI_BAD_POINTER = -90;
const PI_NO_AUX_SPI = -91;
const PI_NOT_PWM_GPIO = -92;
const PI_NOT_SERVO_GPIO = -93;
const PI_NOT_HCLK_GPIO = -94;
const PI_NOT_HPWM_GPIO = -95;
const PI_BAD_HPWM_FREQ = -96;
const PI_BAD_HPWM_DUTY = -97;
const PI_BAD_HCLK_FREQ = -98;
const PI_BAD_HCLK_PASS = -99;
const PI_HPWM_ILLEGAL = -100;
const PI_BAD_DATABITS = -101;
const PI_BAD_STOPBITS = -102;
const PI_MSG_TOOBIG = -103;
const PI_BAD_MALLOC_MODE = -104;
const _PI_TOO_MANY_SEGS = -105;
const _PI_BAD_I2C_SEG = -106;
const PI_BAD_SMBUS_CMD = -107;
const PI_NOT_I2C_GPIO = -108;
const PI_BAD_I2C_WLEN = -109;
const PI_BAD_I2C_RLEN = -110;
const PI_BAD_I2C_CMD = -111;
const PI_BAD_I2C_BAUD = -112;
const PI_CHAIN_LOOP_CNT = -113;
const PI_BAD_CHAIN_LOOP = -114;
const PI_CHAIN_COUNTER = -115;
const PI_BAD_CHAIN_CMD = -116;
const PI_BAD_CHAIN_DELAY = -117;
const PI_CHAIN_NESTING = -118;
const PI_CHAIN_TOO_BIG = -119;
const PI_DEPRECATED = -120;
const PI_BAD_SER_INVERT = -121;
const _PI_BAD_EDGE = -122;
const _PI_BAD_ISR_INIT = -123;
const PI_BAD_FOREVER = -124;
const PI_BAD_FILTER = -125;
const PI_BAD_PAD = -126;
const PI_BAD_STRENGTH = -127;
const PI_FIL_OPEN_FAILED = -128;
const PI_BAD_FILE_MODE = -129;
const PI_BAD_FILE_FLAG = -130;
const PI_BAD_FILE_READ = -131;
const PI_BAD_FILE_WRITE = -132;
const PI_FILE_NOT_ROPEN = -133;
const PI_FILE_NOT_WOPEN = -134;
const PI_BAD_FILE_SEEK = -135;
const PI_NO_FILE_MATCH = -136;
const PI_NO_FILE_ACCESS = -137;
const PI_FILE_IS_A_DIR = -138;
const PI_BAD_SHELL_STATUS = -139;
const PI_BAD_SCRIPT_NAME = -140;
const PI_BAD_SPI_BAUD = -141;
const PI_NOT_SPI_GPIO = -142;
const PI_BAD_EVENT_ID = -143;
const PI_CMD_INTERRUPTED = -144;
const PI_NOT_ON_BCM2711 = -145;
const PI_ONLY_ON_BCM2711 = -146;

// pigpio error text

const _errors = [
  [_PI_INIT_FAILED, "pigpio initialisation failed"],
  [PI_BAD_USER_GPIO, "GPIO not 0-31"],
  [PI_BAD_GPIO, "GPIO not 0-53"],
  [PI_BAD_MODE, "mode not 0-7"],
  [PI_BAD_LEVEL, "level not 0-1"],
  [PI_BAD_PUD, "pud not 0-2"],
  [PI_BAD_PULSEWIDTH, "pulsewidth not 0 or 500-2500"],
  [PI_BAD_DUTYCYCLE, "dutycycle not 0-range (default 255)"],
  [_PI_BAD_TIMER, "timer not 0-9"],
  [_PI_BAD_MS, "ms not 10-60000"],
  [_PI_BAD_TIMETYPE, "timetype not 0-1"],
  [_PI_BAD_SECONDS, "seconds < 0"],
  [_PI_BAD_MICROS, "micros not 0-999999"],
  [_PI_TIMER_FAILED, "gpioSetTimerFunc failed"],
  [PI_BAD_WDOG_TIMEOUT, "timeout not 0-60000"],
  [_PI_NO_ALERT_FUNC, "DEPRECATED"],
  [_PI_BAD_CLK_PERIPH, "clock peripheral not 0-1"],
  [_PI_BAD_CLK_SOURCE, "DEPRECATED"],
  [_PI_BAD_CLK_MICROS, "clock micros not 1, 2, 4, 5, 8, or 10"],
  [_PI_BAD_BUF_MILLIS, "buf millis not 100-10000"],
  [PI_BAD_DUTYRANGE, "dutycycle range not 25-40000"],
  [_PI_BAD_SIGNUM, "signum not 0-63"],
  [_PI_BAD_PATHNAME, "can't open pathname"],
  [PI_NO_HANDLE, "no handle available"],
  [PI_BAD_HANDLE, "unknown handle"],
  [_PI_BAD_IF_FLAGS, "ifFlags > 4"],
  [_PI_BAD_CHANNEL, "DMA channel not 0-14"],
  [_PI_BAD_SOCKET_PORT, "socket port not 1024-30000"],
  [_PI_BAD_FIFO_COMMAND, "unknown fifo command"],
  [_PI_BAD_SECO_CHANNEL, "DMA secondary channel not 0-14"],
  [_PI_NOT_INITIALISED, "function called before gpioInitialise"],
  [_PI_INITIALISED, "function called after gpioInitialise"],
  [_PI_BAD_WAVE_MODE, "waveform mode not 0-1"],
  [_PI_BAD_CFG_INTERNAL, "bad parameter in gpioCfgInternals call"],
  [PI_BAD_WAVE_BAUD, "baud rate not 50-250000(RX)/1000000(TX)"],
  [PI_TOO_MANY_PULSES, "waveform has too many pulses"],
  [PI_TOO_MANY_CHARS, "waveform has too many chars"],
  [PI_NOT_SERIAL_GPIO, "no bit bang serial read in progress on GPIO"],
  [PI_NOT_PERMITTED, "no permission to update GPIO"],
  [PI_SOME_PERMITTED, "no permission to update one or more GPIO"],
  [PI_BAD_WVSC_COMMND, "bad WVSC subcommand"],
  [PI_BAD_WVSM_COMMND, "bad WVSM subcommand"],
  [PI_BAD_WVSP_COMMND, "bad WVSP subcommand"],
  [PI_BAD_PULSELEN, "trigger pulse length not 1-100"],
  [PI_BAD_SCRIPT, "invalid script"],
  [PI_BAD_SCRIPT_ID, "unknown script id"],
  [PI_BAD_SER_OFFSET, "add serial data offset > 30 minute"],
  [PI_GPIO_IN_USE, "GPIO already in use"],
  [PI_BAD_SERIAL_COUNT, "must read at least a byte at a time"],
  [PI_BAD_PARAM_NUM, "script parameter id not 0-9"],
  [PI_DUP_TAG, "script has duplicate tag"],
  [PI_TOO_MANY_TAGS, "script has too many tags"],
  [PI_BAD_SCRIPT_CMD, "illegal script command"],
  [PI_BAD_VAR_NUM, "script variable id not 0-149"],
  [PI_NO_SCRIPT_ROOM, "no more room for scripts"],
  [PI_NO_MEMORY, "can't allocate temporary memory"],
  [PI_SOCK_READ_FAILED, "socket read failed"],
  [PI_SOCK_WRIT_FAILED, "socket write failed"],
  [PI_TOO_MANY_PARAM, "too many script parameters (> 10)"],
  [PI_SCRIPT_NOT_READY, "script initialising"],
  [PI_BAD_TAG, "script has unresolved tag"],
  [PI_BAD_MICS_DELAY, "bad MICS delay (too large)"],
  [PI_BAD_MILS_DELAY, "bad MILS delay (too large)"],
  [PI_BAD_WAVE_ID, "non existent wave id"],
  [PI_TOO_MANY_CBS, "No more CBs for waveform"],
  [PI_TOO_MANY_OOL, "No more OOL for waveform"],
  [PI_EMPTY_WAVEFORM, "attempt to create an empty waveform"],
  [PI_NO_WAVEFORM_ID, "No more waveform ids"],
  [PI_I2C_OPEN_FAILED, "can't open I2C device"],
  [PI_SER_OPEN_FAILED, "can't open serial device"],
  [PI_SPI_OPEN_FAILED, "can't open SPI device"],
  [PI_BAD_I2C_BUS, "bad I2C bus"],
  [PI_BAD_I2C_ADDR, "bad I2C address"],
  [PI_BAD_SPI_CHANNEL, "bad SPI channel"],
  [PI_BAD_FLAGS, "bad i2c/spi/ser open flags"],
  [PI_BAD_SPI_SPEED, "bad SPI speed"],
  [PI_BAD_SER_DEVICE, "bad serial device name"],
  [PI_BAD_SER_SPEED, "bad serial baud rate"],
  [PI_BAD_PARAM, "bad i2c/spi/ser parameter"],
  [PI_I2C_WRITE_FAILED, "I2C write failed"],
  [PI_I2C_READ_FAILED, "I2C read failed"],
  [PI_BAD_SPI_COUNT, "bad SPI count"],
  [PI_SER_WRITE_FAILED, "ser write failed"],
  [PI_SER_READ_FAILED, "ser read failed"],
  [PI_SER_READ_NO_DATA, "ser read no data available"],
  [PI_UNKNOWN_COMMAND, "unknown command"],
  [PI_SPI_XFER_FAILED, "SPI xfer/read/write failed"],
  [_PI_BAD_POINTER, "bad (NULL) pointer"],
  [PI_NO_AUX_SPI, "no auxiliary SPI on Pi A or B"],
  [PI_NOT_PWM_GPIO, "GPIO is not in use for PWM"],
  [PI_NOT_SERVO_GPIO, "GPIO is not in use for servo pulses"],
  [PI_NOT_HCLK_GPIO, "GPIO has no hardware clock"],
  [PI_NOT_HPWM_GPIO, "GPIO has no hardware PWM"],
  [PI_BAD_HPWM_FREQ, "invalid hardware PWM frequency"],
  [PI_BAD_HPWM_DUTY, "hardware PWM dutycycle not 0-1M"],
  [PI_BAD_HCLK_FREQ, "invalid hardware clock frequency"],
  [PI_BAD_HCLK_PASS, "need password to use hardware clock 1"],
  [PI_HPWM_ILLEGAL, "illegal, PWM in use for main clock"],
  [PI_BAD_DATABITS, "serial data bits not 1-32"],
  [PI_BAD_STOPBITS, "serial (half) stop bits not 2-8"],
  [PI_MSG_TOOBIG, "socket/pipe message too big"],
  [PI_BAD_MALLOC_MODE, "bad memory allocation mode"],
  [_PI_TOO_MANY_SEGS, "too many I2C transaction segments"],
  [_PI_BAD_I2C_SEG, "an I2C transaction segment failed"],
  [PI_BAD_SMBUS_CMD, "SMBus command not supported"],
  [PI_NOT_I2C_GPIO, "no bit bang I2C in progress on GPIO"],
  [PI_BAD_I2C_WLEN, "bad I2C write length"],
  [PI_BAD_I2C_RLEN, "bad I2C read length"],
  [PI_BAD_I2C_CMD, "bad I2C command"],
  [PI_BAD_I2C_BAUD, "bad I2C baud rate, not 50-500k"],
  [PI_CHAIN_LOOP_CNT, "bad chain loop count"],
  [PI_BAD_CHAIN_LOOP, "empty chain loop"],
  [PI_CHAIN_COUNTER, "too many chain counters"],
  [PI_BAD_CHAIN_CMD, "bad chain command"],
  [PI_BAD_CHAIN_DELAY, "bad chain delay micros"],
  [PI_CHAIN_NESTING, "chain counters nested too deeply"],
  [PI_CHAIN_TOO_BIG, "chain is too long"],
  [PI_DEPRECATED, "deprecated function removed"],
  [PI_BAD_SER_INVERT, "bit bang serial invert not 0 or 1"],
  [_PI_BAD_EDGE, "bad ISR edge value, not 0-2"],
  [_PI_BAD_ISR_INIT, "bad ISR initialisation"],
  [PI_BAD_FOREVER, "loop forever must be last chain command"],
  [PI_BAD_FILTER, "bad filter parameter"],
  [PI_BAD_PAD, "bad pad number"],
  [PI_BAD_STRENGTH, "bad pad drive strength"],
  [PI_FIL_OPEN_FAILED, "file open failed"],
  [PI_BAD_FILE_MODE, "bad file mode"],
  [PI_BAD_FILE_FLAG, "bad file flag"],
  [PI_BAD_FILE_READ, "bad file read"],
  [PI_BAD_FILE_WRITE, "bad file write"],
  [PI_FILE_NOT_ROPEN, "file not open for read"],
  [PI_FILE_NOT_WOPEN, "file not open for write"],
  [PI_BAD_FILE_SEEK, "bad file seek"],
  [PI_NO_FILE_MATCH, "no files match pattern"],
  [PI_NO_FILE_ACCESS, "no permission to access file"],
  [PI_FILE_IS_A_DIR, "file is a directory"],
  [PI_BAD_SHELL_STATUS, "bad shell return status"],
  [PI_BAD_SCRIPT_NAME, "bad script name"],
  [PI_BAD_SPI_BAUD, "bad SPI baud rate, not 50-500k"],
  [PI_NOT_SPI_GPIO, "no bit bang SPI in progress on GPIO"],
  [PI_BAD_EVENT_ID, "bad event id"],
  [PI_CMD_INTERRUPTED, "pigpio command interrupted"],
  [PI_NOT_ON_BCM2711, "not available on BCM2711"],
  [PI_ONLY_ON_BCM2711, "only available on BCM2711"],
];

const _except_a =
  "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n";

const _except_z =
  "%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%";

const _except_1 = `
Did you start the pigpio daemon? E.g. sudo pigpiod

Did you specify the correct Pi host/port in the environment
variables PIGPIO_ADDR/PIGPIO_PORT?
E.g. export PIGPIO_ADDR=soft, export PIGPIO_PORT=8888

Did you specify the correct Pi host/port in the
pigpio.pi() function? E.g. pigpio.pi('soft', 8888)"""
`;

const _except_2 = `
Do you have permission to access the pigpio daemon?
Perhaps it was started with sudo pigpiod -nlocalhost`;

const _except_3 = `
Can't create callback thread.
Perhaps too many simultaneous pigpio connections.`;

// カスタムエラークラスの定義
class PigpioError extends Error {
  constructor(value) {
    super(value);
    this.name = "PigpioError";
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

// データを pigpio 用の Buffer に変換するユーティリティ関数
function toPigpioBuffer(data) {
  if (Buffer.isBuffer(data)) return data;
  if (Array.isArray(data)) return Buffer.from(data);
  if (typeof data === "string") {
    return Buffer.from(data, "latin1");
  }
  throw new TypeError("data must be Buffer, Array, or string");
}

// 符号なし32bit整数を符号付き32bit整数に変換する関数
function u2i(uint32) {
  // JavaScriptで32bit符号付き整数にキャストする最も高速な方法（ビット演算を利用）
  return uint32 >> 0;
}

function _u2i(status) {
  const v = u2i(status);
  if (v < 0) {
    if (exceptions) {
      throw new PigpioError(error_text(v));
    }
  }
  return v;
}

// ソケット接続（await/async, timeout 対応）
function connectAsync(host, port) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;

    const socket = net.connect(port, host);

    const cleanup = () => {
      if (timer !== null) clearTimeout(timer);
      socket.removeListener("connect", onConnect);
      socket.removeListener("error", onError);
    };

    const onConnect = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(socket);
    };

    const onError = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(err);
    };

    socket.once("connect", onConnect);
    socket.once("error", onError);

    timer = setTimeout(() => {
      if (settled) return;
      const err = new Error("Connect timeout");
      err.code = "ETIMEDOUT";
      settled = true;
      cleanup();
      socket.destroy();
      reject(err);
    }, TIMEOUT * 1000);
  });
}

// pigpio の TCP 通信は「16 バイトのヘッダ + 必要なら追加データ」です。
// TCP にはメッセージ境界がないため、data イベントをコマンド単位で扱わず、
// ソケット全体に対して 1 本の受信バッファを持ち、readExact() で必要な
// バイト数だけ切り出します。
//
// 重要：コマンドの Promise キューと組み合わせることで、1 コマンドについて
// 「送信 → 16 バイト応答 → 追加データ受信」までを完全に 1 トランザクション
// として扱います。これにより i2c_read_i2c_block_data() や serial_read() の
// 追加データが次のコマンドの応答として誤認されることを防ぎます。

class PigpioSocketError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "PigpioSocketError";
    if (cause) this.cause = cause;
  }
}

function attachSocketReader(socket) {
  socket._rxBuffer = Buffer.alloc(0);
  socket._rxWaiters = [];
  socket._rxClosedError = null;

  const drain = () => {
    while (socket._rxWaiters.length > 0) {
      const waiter = socket._rxWaiters[0];

      if (socket._rxBuffer.length >= waiter.count) {
        socket._rxWaiters.shift();
        const result = socket._rxBuffer.subarray(0, waiter.count);
        socket._rxBuffer = socket._rxBuffer.subarray(waiter.count);
        waiter.resolve(result);
        continue;
      }

      // まだデータが足りないので次の data イベントを待つ。
      break;
    }
  };

  const fail = (err) => {
    if (socket._rxClosedError) return;

    const error =
      err instanceof Error
        ? err
        : new PigpioSocketError("pigpio socket closed");

    socket._rxClosedError = error;

    const waiters = socket._rxWaiters.splice(0);
    for (const waiter of waiters) waiter.reject(error);
  };

  socket._onPigpioData = (chunk) => {
    if (!Buffer.isBuffer(chunk)) chunk = toPigpioBuffer(chunk);
    if (chunk.length === 0) return;

    socket._rxBuffer =
      socket._rxBuffer.length === 0
        ? chunk
        : Buffer.concat([socket._rxBuffer, chunk]);

    drain();
  };

  socket._onPigpioError = (err) => {
    fail(new PigpioSocketError("pigpio socket error", err));
  };

  socket._onPigpioEnd = () => {
    fail(new PigpioSocketError("pigpio socket ended by peer"));
  };

  socket._onPigpioClose = (hadError) => {
    if (!socket._rxClosedError) {
      fail(
        new PigpioSocketError(
          hadError
            ? "pigpio socket closed because of an error"
            : "pigpio socket closed",
        ),
      );
    }
  };

  socket.on("data", socket._onPigpioData);
  socket.on("error", socket._onPigpioError);
  socket.on("end", socket._onPigpioEnd);
  socket.on("close", socket._onPigpioClose);
}

function detachSocketReader(socket) {
  if (!socket) return;

  if (socket._onPigpioData) {
    socket.removeListener("data", socket._onPigpioData);
  }
  if (socket._onPigpioError) {
    socket.removeListener("error", socket._onPigpioError);
  }
  if (socket._onPigpioEnd) {
    socket.removeListener("end", socket._onPigpioEnd);
  }
  if (socket._onPigpioClose) {
    socket.removeListener("close", socket._onPigpioClose);
  }

  socket._onPigpioData = null;
  socket._onPigpioError = null;
  socket._onPigpioEnd = null;
  socket._onPigpioClose = null;
}

function readBytesAsync(socket, count) {
  if (!socket) {
    return Promise.reject(
      new PigpioSocketError("pigpio socket is not connected"),
    );
  }
  if (!Number.isInteger(count) || count < 0) {
    return Promise.reject(
      new RangeError("count must be a non-negative integer"),
    );
  }
  if (count === 0) return Promise.resolve(Buffer.alloc(0));

  if (socket._rxClosedError) {
    return Promise.reject(socket._rxClosedError);
  }

  if (socket._rxBuffer.length >= count) {
    const result = socket._rxBuffer.subarray(0, count);
    socket._rxBuffer = socket._rxBuffer.subarray(count);
    return Promise.resolve(result);
  }

  return new Promise((resolve, reject) => {
    socket._rxWaiters.push({ count, resolve, reject });
  });
}

// pigpio.cjs を require してから最初に呼び出す関数
// pi クラスを作成して初期化（pigpiodへ接続など）してからクラスのインスタンスを返す
// pi() の名前でエクスポート（書式を pigpio Python に準拠）
async function create_pi(
  host = process.env.PIGPIO_ADDR || "localhost",
  port = process.env.PIGPIO_PORT || 8888,
  show_errors = true,
) {
  const instance = new _pi();
  await instance._init(host, port, show_errors);
  return instance;
}

// PIクラスの定義
class _pi {
  constructor() {
    this.connected = false;
    this.sock_cmd = null; // コマンド用ソケット
    this._commandQueue = Promise.resolve(); // コマンドの割り込みを防ぐための Promise キュー
  }

  async _rxbuf(count) {
    return await readBytesAsync(this.sock_cmd, count);
  }

  async _init(host, port, show_errors) {
    if (!host) host = "localhost";
    if (typeof port === "string") port = parseInt(port, 10);

    let exception = 0;

    try {
      this.sock_cmd = await connectAsync(host, port);
      this.sock_cmd.setNoDelay(true);
      attachSocketReader(this.sock_cmd);
      this.sock_cmd.once("close", () => {
        this.connected = false;
      });
      this.connected = true;
    } catch (err) {
      // エラー内容に応じた分岐判定（簡易版）
      if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
        exception = 1;
        console.error(err);
      } else {
        exception = 2;
      }
    }

    if (exception !== 0) {
      this.connected = false;
      this.sock_cmd = null;

      if (show_errors) {
        const s = `Can't connect to pigpiod at ${host}(${port})`;
        console.log(_except_a);
        if (exception === 1) console.log(_except_1);
        else if (exception === 2) console.log(_except_2);
        else console.log(_except_3);
        console.log(_except_z);
      }
    } else {
      // プログラム正常終了時のクリーンアップ処理の登録
      process.on("exit", () => this.stop());
    }
  }

  // pigpiod から切断
  async stop() {
    this.connected = false;

    const socket = this.sock_cmd;
    this.sock_cmd = null;

    if (socket) {
      const error = new PigpioSocketError("pigpio connection stopped");
      if (!socket._rxClosedError) socket._rxClosedError = error;

      if (Array.isArray(socket._rxWaiters)) {
        const waiters = socket._rxWaiters.splice(0);
        for (const waiter of waiters) waiter.reject(error);
      }

      detachSocketReader(socket);
      socket.destroy();
    }
  }

  // コマンドを必ず一つずつ実行する。
  // 重要なのは「16 バイトの応答を読むところ」ではなく、追加データがある
  // コマンドなら、その追加データまで読み終えるところまでをキューで保護すること。
  _enqueueCommand(task) {
    const result = this._commandQueue.then(task, task);

    // 次のコマンドには必ず進める。ただし現在の呼び出し側には元の
    // Promise を返すので、個々のコマンドのエラーは失われない。
    this._commandQueue = result.catch(() => undefined);
    return result;
  }

  // pigpio コマンド送信。ここでは「16 バイトの標準レスポンス」までを読む。
  // 可変長レスポンスを持つコマンドは、このメソッドを直接キュー内から呼び、
  // 続けて _rxbuf() まで同じキューの中で実行する。
  async _pigpio_command(cmd, p1 = 0, p2 = 0, extents = []) {
    return this._enqueueCommand(async () => {
      return this._pigpio_cmd(cmd, p1, p2, extents);
    });
  }

  // pigpio コマンド送信関数実体
  // この関数自身はキューイングしない。呼び出し元が必要なトランザクション全体を
  // _enqueueCommand() で保護する。
  async _pigpio_cmd(cmd, p1, p2, extents = []) {
    if (!this.connected || !this.sock_cmd) {
      throw new PigpioSocketError("pigpio is not connected");
    }

    let p3 = 0;
    for (const x of extents) {
      if (!Buffer.isBuffer(x)) {
        throw new TypeError("pigpio command extent must be a Buffer");
      }
      p3 += x.length;
    }

    const header = Buffer.alloc(_SOCK_CMD_LEN);
    header.writeUInt32LE(cmd >>> 0, 0);
    header.writeUInt32LE(p1 >>> 0, 4);
    header.writeUInt32LE(p2 >>> 0, 8);
    header.writeUInt32LE(p3 >>> 0, 12);

    const sendBuf =
      extents.length === 0 ? header : Buffer.concat([header, ...extents]);

    // TCP の write() は「1 回の write = 1 回の受信」を意味しない。
    // 送信側では write()、受信側では readBytesAsync() がそれぞれストリームとして扱う。
    this.sock_cmd.write(sendBuf);

    const resBuf = await readBytesAsync(this.sock_cmd, _SOCK_CMD_LEN);
    return resBuf.readInt32LE(12);
  }

  // GPIOピンモード
  async set_mode(gpio, mode) {
    return _u2i(await this._pigpio_command(_PI_CMD_MODES, gpio, mode));
  }
  async get_mode(gpio) {
    return _u2i(await this._pigpio_command(_PI_CMD_MODEG, gpio));
  }
  async set_pull_up_down(gpio, pud) {
    return _u2i(await this._pigpio_command(_PI_CMD_PUD, gpio, pud));
  }

  // GPIOピン入力
  async read(gpio) {
    return _u2i(await this._pigpio_command(_PI_CMD_READ, gpio));
  }
  // GPIOピン出力
  async write(gpio, level) {
    return _u2i(await this._pigpio_command(_PI_CMD_WRITE, gpio, level));
  }

  // PWM
  async set_PWM_frequency(user_gpio, frequency) {
    return _u2i(await this._pigpio_command(_PI_CMD_PFS, user_gpio, frequency));
  }
  async set_PWM_dutycycle(user_gpio, dutycycle) {
    return _u2i(await this._pigpio_command(_PI_CMD_PWM, user_gpio, dutycycle));
  }
  async set_PWM_dutyratio(user_gpio, dutyratio) {
    // デューティ比をパーセンテージで指定：オリジナルの pigpio.py には存在しないので注意
    if (dutyratio < 0 || dutyratio > 100)
      throw new RangeError("dutyratio must be between 0 and 100");
    const dutycycle = Math.round((dutyratio * 255) / 100);
    return _u2i(await this._pigpio_command(_PI_CMD_PWM, user_gpio, dutycycle));
  }

  // サーボモータ
  async set_servo_pulsewidth(user_gpio, pulsewidth) {
    // pigpio 互換: 0 はサーボパルス出力を停止する特別な値。
    return _u2i(
      await this._pigpio_command(
        _PI_CMD_SERVO,
        user_gpio,
        Math.trunc(pulsewidth),
      ),
    );
  }

  // I2C
  async i2c_open(i2c_bus, i2c_address, i2c_flags = 0) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(i2c_flags, 0);
    return _u2i(
      await this._pigpio_command(_PI_CMD_I2CO, i2c_bus, i2c_address, [extBuf]),
    );
  }
  async i2c_close(handle) {
    return _u2i(await this._pigpio_command(_PI_CMD_I2CC, handle));
  }
  async i2c_read_byte(handle) {
    return _u2i(await this._pigpio_command(_PI_CMD_I2CRS, handle));
  }
  async i2c_write_byte_data(handle, reg, byte_val) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(byte_val, 0);
    return _u2i(
      await this._pigpio_command(_PI_CMD_I2CWB, handle, reg, [extBuf]),
    );
  }
  async i2c_read_byte_data(handle, reg) {
    return _u2i(await this._pigpio_command(_PI_CMD_I2CRB, handle, reg));
  }
  async i2c_write_word_data(handle, reg, word_val) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(word_val, 0);
    return _u2i(
      await this._pigpio_command(_PI_CMD_I2CWW, handle, reg, [extBuf]),
    );
  }
  async i2c_read_word_data(handle, reg) {
    return _u2i(await this._pigpio_command(_PI_CMD_I2CRW, handle, reg));
  }
  async i2c_write_i2c_block_data(handle, reg, data) {
    const extBuf = toPigpioBuffer(data);
    if (extBuf.length > 0) {
      return _u2i(
        await this._pigpio_command(_PI_CMD_I2CWI, handle, reg, [extBuf]),
      );
    } else {
      return 0;
    }
  }
  async i2c_read_i2c_block_data(handle, reg, count) {
    const extBuf = Buffer.alloc(4);
    extBuf.writeUInt32LE(count >>> 0, 0);

    return this._enqueueCommand(async () => {
      const bytes = u2i(
        await this._pigpio_cmd(_PI_CMD_I2CRI, handle, reg, [extBuf]),
      );

      const rdata = bytes > 0 ? await this._rxbuf(bytes) : Buffer.alloc(0);

      // Python版と同じく、read系の負値エラーはそのまま返す。
      return [bytes, rdata];
    });
  }
  async i2c_write_device(handle, data) {
    const extBuf = toPigpioBuffer(data);
    if (extBuf.length > 0) {
      return _u2i(
        await this._pigpio_command(_PI_CMD_I2CWD, handle, 0, [extBuf]),
      );
    } else {
      return 0;
    }
  }
  async serial_open(tty, baud, ser_flags = 0) {
    return _u2i(
      await this._pigpio_command(_PI_CMD_SERO, baud, ser_flags, [
        toPigpioBuffer(tty),
      ]),
    );
  }
  async serial_close(handle) {
    return _u2i(await this._pigpio_command(_PI_CMD_SERC, handle));
  }
  async serial_read(handle, count = 1000) {
    return this._enqueueCommand(async () => {
      const bytes = u2i(await this._pigpio_cmd(_PI_CMD_SERR, handle, count));

      const rdata = bytes > 0 ? await this._rxbuf(bytes) : Buffer.alloc(0);

      return [bytes, rdata];
    });
  }
  async serial_write(handle, data) {
    const extBuf = toPigpioBuffer(data);
    return _u2i(await this._pigpio_command(_PI_CMD_SERW, handle, 0, [extBuf]));
  }
  async serial_data_available(handle) {
    return _u2i(await this._pigpio_command(_PI_CMD_SERDA, handle));
  }

  // 指定秒数だけ処理を停止：オリジナルの pigpio.py には存在しないので注意（rgpio.py には似たような関数が存在する）
  sleep(seconds) {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
module.exports = {
  pi: create_pi,
  INPUT,
  OUTPUT,
  PUD_OFF,
  PUD_DOWN,
  PUD_UP,
};
