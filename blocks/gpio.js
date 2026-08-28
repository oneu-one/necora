import { settings } from "../index.mjs";

/******************************* */
/** Connect to the rgpiod daemon */
/******************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "rgpio_sbc",
    tooltip:
      "rgpio ライブラリをロードし、SBC の rgpiod（デーモン）との接続を確立します",
    helpUrl: "",
    message0: "rgpio に接続 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["rgpio_sbc"] = function () {
  Blockly.JavaScript.provideFunction_("import_gpio", [
    `const _rgpio = require("${settings.data.mod_dir}rgpio.cjs");`,
  ]);
  const code = `if (global._sbc === undefined) { //Necora
  global._sbc =await _rgpio.sbc("${settings.data.host}", "${settings.data.port}");
  if (_sbc.connected == false) {
    _sbc = undefined;
    _necora.fukidashi(String('接続エラー'), 5);
    return;
  }
}
\n`;
  return code;
};
/************************************ */
/** Disconnect from the rgpiod daemon */
/************************************ */
Blockly.defineBlocksWithJsonArray([
  {
    type: "sbc_stop",
    tooltip: "rgpiod（デーモン）との接続を切断します。",
    helpUrl: "",
    message0: "rgpio から切断 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["sbc_stop"] = function () {
  const code = `await _sbc.stop();
_sbc = undefined;
`;
  return code;
};

/**************** */
/** GPIOChip Open */
/**************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "gpiochip_open",
    tooltip: "GPIOChip デバイスを開きます。",
    helpUrl: "",
    message0: "GPIO の操作ができるようにする %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gpiochip_open"] = function (
  block,
  generator,
) {
  const code = `const _gpio = await _sbc.gpiochip_open(${settings.data.gpiodev});\n`;
  return code;
};
/***************** */
/** GPIOChip Close */
/***************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "gpiochip_close",
    message0: "GPIOChip デバイスとの接続を閉じる",
    previousStatement: null,
    nextStatement: null,
    tooltip: "GPIOChip デバイスとの接続を閉じます。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gpiochip_close"] = function (
  block,
  generator,
) {
  var code = "await _sbc.gpiochip_close(_gpio);\n";
  return code;
};
/********************** */
/** GPIO Claim Input ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "gpio_claim_input",
    message0: "GPIO %1 を入力モードにして %2",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "lflag",
        options: [
          ["プルしない", "PULL_NONE"],
          ["プルアップ", "PULL_UP"],
          ["プルダウン", "PULL_DOWN"],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "GPIO を入力モードに設定します。Raspberry Pi では内蔵プルアップ/ダウンの設定が可能です。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gpio_claim_input"] = function (
  block,
  generator,
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var dropdown_lflag = block.getFieldValue("lflag");
  var code = `await _sbc.gpio_claim_input(_gpio, ${value_gpio}, _rgpio.SET_${dropdown_lflag});\n`;
  return code;
};
/*********************** */
/** GPIO Claim Output ** */
/*********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "gpio_claim_output",
    message0: "GPIO %1 を出力モードにする",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    tooltip: "GPIO を出力モードに設定します。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gpio_claim_output"] = function (
  block,
  generator,
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var code = `await _sbc.gpio_claim_output(_gpio, ${value_gpio});\n`;
  return code;
};

/********************* */
/** Read GPIO Value ** */
/***********************/
Blockly.defineBlocksWithJsonArray([
  {
    type: "gpio_read",
    message0: "GPIO %1 の値",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "GPIO端子の値をデジタル値（0または1）で読み取ります。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gpio_read"] = function (
  block,
  generator,
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var code = `await _sbc.gpio_read(_gpio, ${value_gpio})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/*******************************************/
/** GPIO Write Value - Common GPIO on/off **/
/*******************************************/
Blockly.defineBlocksWithJsonArray([
  {
    type: "gpio_write",
    message0: "GPIO %1 の値を %2 にする",
    args0: [
      {
        type: "input_value",
        name: "gpio",
      },
      {
        type: "field_dropdown",
        name: "level",
        options: [
          ["0", "0"],
          ["1", "1"],
        ],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip: "GPIO端子の値をデジタル値（0または1）で出力します。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gpio_write"] = function (
  block,
  generator,
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var dropdown_level = block.getFieldValue("level");
  var code = `await _sbc.gpio_write(_gpio, ${value_gpio}, ${dropdown_level});\n`;
  return code;
};

/****************** */
/** Software PWM ** */
/****************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "tx_pwm",
    tooltip: "GPIO にソフトウェア PWM を出力します。",
    helpUrl: "",
    message0: "GPIO %1 に周波数 %2 Hz , デューティ比 %3 % のパルス波を出力 %4",
    args0: [
      {
        type: "input_value",
        name: "gpio",
      },
      {
        type: "input_value",
        name: "freq",
        check: "Number",
      },
      {
        type: "input_value",
        name: "duty",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["tx_pwm"] = function (
  block,
  generator,
) {
  const value_gpio = generator.valueToCode(
    block,
    "gpio",
    javascript.Order.ATOMIC,
  );
  const value_freq = generator.valueToCode(
    block,
    "freq",
    javascript.Order.ATOMIC,
  );
  const value_duty = generator.valueToCode(
    block,
    "duty",
    javascript.Order.ATOMIC,
  );
  const code = `await _sbc.tx_pwm(_gpio, ${value_gpio}, ${value_freq}, ${value_duty});\n`;
  return code;
};
/********************* */
/** Open I2C Device ** */
/********************* */
Blockly.Blocks["i2c_open"] = {
  init: function () {
    this.appendValueInput("addr").setCheck("Number").appendField("アドレス");
    this.appendDummyInput()
      .appendField("の I2C デバイスを")
      .appendField(new Blockly.FieldVariable("I2Cデバイス"), "i2c_hand")
      .appendField("として開く");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("I2C接続されたデバイスに名前をつけて通信を開始します。");
    this.setHelpUrl("");
    this.setStyle("gpio_blocks");
  },
};
javascript.javascriptGenerator.forBlock["i2c_open"] = function (
  block,
  generator,
) {
  var value_addr = Blockly.JavaScript.valueToCode(
    block,
    "addr",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var variable_i2c_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("i2c_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var code = `${variable_i2c_hand} = await _sbc.i2c_open(${settings.data.i2cdev}, ${value_addr}, 0);\n`;
  return code;
};

/********************** */
/** Close I2C Device ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_close",
    tooltip: "指定した I2C デバイスとの通信を切断します。",
    helpUrl: "",
    message0: "I2Cデバイス %1 を閉じる %2",
    args0: [
      {
        type: "input_value",
        name: "i2c_hand",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["i2c_close"] = function (
  block,
  generator,
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC,
  );
  const code = `await _sbc.i2c_close(${value_i2c_hand});\n`;
  return code;
};

/****************************************************************** */
/** Read a single byte from the specified resister of the device ** */
/****************************************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_read_byte_data",
    tooltip: "I2C デバイスの指定されたレジスタから1バイトを読み込みます。",
    helpUrl: "",
    message0: "I2Cデバイス %1 のレジスタ %2 の値 %3",
    args0: [
      {
        type: "input_value",
        name: "i2c_hand",
        check: "Number",
      },
      {
        type: "input_value",
        name: "reg",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: "Number",
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["i2c_read_byte_data"] = function (
  block,
  generator,
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC,
  );
  const value_reg = generator.valueToCode(
    block,
    "reg",
    javascript.Order.ATOMIC,
  );
  const code = `await _sbc.i2c_read_byte_data(${value_i2c_hand}, ${value_reg})`;
  return [code, javascript.Order.ATOMIC]; //Blockly.JavaScript.ORDER_ATOMIC
};

/****************************************************************** */
/** Writes a single byte to the specified register of the device ** */
/****************************************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_write_byte_data",
    tooltip:
      "I2C デバイスの指定されたレジスタに1バイトのデータ（数値）を書き込みます。",
    helpUrl: "",
    message0: "I2Cデバイス %1 のレジスタ %2 に１バイト %3 を書き込む %4",
    args0: [
      {
        type: "input_value",
        name: "i2c_hand",
        check: "Number",
      },
      {
        type: "input_value",
        name: "reg",
        check: "Number",
      },
      {
        type: "input_value",
        name: "byte_val",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["i2c_write_byte_data"] = function (
  block,
  generator,
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC,
  );
  const value_reg = generator.valueToCode(
    block,
    "reg",
    javascript.Order.ATOMIC,
  );
  const value_byte_val = generator.valueToCode(
    block,
    "byte_val",
    javascript.Order.ATOMIC,
  );
  const code = `await _sbc.i2c_write_byte_data(${value_i2c_hand}, ${value_reg}, ${value_byte_val});\n`;
  return code;
};

/***************************************************************** */
/** Writes up to 32 bytes to the specified register of the device. */
/***************************************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_write_i2c_block_data",
    tooltip:
      "I2C デバイスの指定されたレジスタに最大32バイトのテキストデータを書き込みます。",
    helpUrl: "",
    message0: "I2Cデバイス %1 のレジスタ %2 に文字列 %3 を書き込む %4",
    args0: [
      {
        type: "input_value",
        name: "i2c_hand",
        check: "Number",
      },
      {
        type: "input_value",
        name: "reg",
        check: "Number",
      },
      {
        type: "input_value",
        name: "data",
        check: "String",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["i2c_write_i2c_block_data"] = function (
  block,
  generator,
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC,
  );
  const value_reg = generator.valueToCode(
    block,
    "reg",
    javascript.Order.ATOMIC,
  );
  const value_data = generator.valueToCode(
    block,
    "data",
    javascript.Order.ATOMIC,
  );
  const code = `await _sbc.i2c_write_i2c_block_data (${value_i2c_hand}, ${value_reg}, ${value_data});`;
  return code;
};

// Serial

/********************** */
/** Open Serial Port ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_open",
    message0: "ポート %1 のシリアルデバイスを %2 として速度 %3 で開く",
    args0: [
      {
        type: "input_value",
        name: "port",
        check: "String",
      },
      {
        type: "field_variable",
        name: "ser_hand",
        variable: "シリアルデバイス",
      },
      {
        type: "field_dropdown",
        name: "baud",
        options: [
          ["9600bps", "9600"],
          ["19200bps", "19200"],
          ["115200bps", "115200"],
        ],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip: "シリアルデバイスに名前をつけて開きます。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["serial_open"] = function (
  block,
  generator,
) {
  var value_port = Blockly.JavaScript.valueToCode(
    block,
    "port",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var variable_ser_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("ser_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var dropdown_baud = block.getFieldValue("baud");
  var code = `${variable_ser_hand} = await _sbc.serial_open(${value_port}, ${dropdown_baud});\n`;
  return code;
};

/*********************** */
/** Close Serial Port ** */
/*********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_close",
    message0: "%1 を閉じる",
    args0: [
      {
        type: "field_variable",
        name: "ser_hand",
        variable: "シリアルデバイス",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip: "シリアルデバイスとの通信を切断します。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["serial_close"] = function (
  block,
  generator,
) {
  var variable_ser_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("ser_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var code = `await _sbc.serial_close(${variable_ser_hand});\n`;
  return code;
};

/************************ */
/** Read Data from Serial */
/************************ */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_read",
    message0: "%1 %2 から %3 文字受け取る",
    args0: [
      {
        type: "field_variable",
        name: "ser_hand",
        variable: "シリアルデバイス",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "count",
        check: "Number",
      },
    ],
    inputsInline: true,
    output: null,
    tooltip:
      "シリアルデバイスから指定したバイト数のデータを受け取ります。バイト数がわからない場合は十分に大きな数字（1000など）を入れましょう。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["serial_read"] = function (
  block,
  generator,
) {
  var variable_ser_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("ser_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var value_count = Blockly.JavaScript.valueToCode(
    block,
    "count",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  var code = `(await _sbc.serial_read(${variable_ser_hand}, ${value_count}))[1]`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

/************************** */
/** Write Data to Serial ** */
/************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_write",
    message0: "%1 %2  に %3 を送信する",
    args0: [
      {
        type: "field_variable",
        name: "ser_hand",
        variable: "シリアルデバイス",
      },
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "data",
        check: "String",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip: "シリアルデバイスにデータを送信します。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["serial_write"] = function (
  block,
  generator,
) {
  var variable_ser_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("ser_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var value_data = Blockly.JavaScript.valueToCode(
    block,
    "data",
    Blockly.JavaScript.ORDER_ATOMIC,
  );
  // TODO: Assemble JavaScript into code variable.
  var code = `await _sbc.serial_write(${variable_ser_hand}, ${value_data});\n`;
  return code;
};
/******************************************************************* */
/** Returns the number of bytes available to be read from the device */
/******************************************************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_data_available",
    message0: "%1 から読み取り可能なデータのバイト数",
    args0: [
      {
        type: "field_variable",
        name: "ser_hand",
        variable: "シリアルデバイス",
      },
    ],
    inputsInline: true,
    output: null,
    tooltip:
      "シリアルデバイスから現在読み取り可能なデータのバイト数を返します。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["serial_data_available"] = function (
  block,
  generator,
) {
  var variable_ser_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("ser_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var code = `await _sbc.serial_data_available(${variable_ser_hand})`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "rgpiod_start",
    tooltip:
      "rgpio ライブラリをロードし、SBC の rgpiod（デーモン）との接続を確立します",
    helpUrl: "",
    message0: "GPIO に接続 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
]);
Blockly.defineBlocksWithJsonArray([
  {
    type: "rgpiod_stop",
    tooltip: "rgpiod（デーモン）との接続を切断します。",
    helpUrl: "",
    message0: "GPIO から切断 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
]);
