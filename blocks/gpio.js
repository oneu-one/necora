import { settings } from "../index.mjs";
// const import_gpio_code = [`const _rg = require('@necora/rgpio');`];
// const gpio_chip_open_code = [
//   `const _gpiochip_hand = await _rg.gpiochip_open(${settings.data.gpiodev});`,
// ];

/******************************* */
/** Connect to the rgpiod daemon */
/******************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "rgpiod_start",
    tooltip:
      "rgpio ライブラリをロードし、rgpiod（デーモン）への接続を確立します",
    helpUrl: "",
    message0: "GPIO を開始 %1",
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
javascript.javascriptGenerator.forBlock["rgpiod_start"] = function () {
  const code = `const _rg = require('@necora/rgpio');
await _rg.start("${settings.data.host}", "${settings.data.port}", ${settings.data.gpiodev});\n`;
  return code;
};
/************************************ */
/** Disconnect from the rgpiod daemon */
/************************************ */
Blockly.defineBlocksWithJsonArray([
  {
    type: "rgpiod_stop",
    tooltip: "rgpiod（デーモン）との接続を切断します。",
    helpUrl: "",
    message0: "GPIO を停止 %1",
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
javascript.javascriptGenerator.forBlock["rgpiod_stop"] = function () {
  const code = `_rg.stop();\n`;
  return code;
};

// /**************** */
// /** GPIOChip Open */
// /**************** */
// Blockly.defineBlocksWithJsonArray([
//   {
//     type: "gpiochip_open",
//     tooltip: "GPIOChipデバイスへ接続します。",
//     helpUrl: "",
//     message0: "GPIO を開く %1",
//     args0: [
//       {
//         type: "input_dummy",
//         name: "NAME",
//       },
//     ],
//     previousStatement: null,
//     nextStatement: null,
//     inputsInline: true,
//     style: "gpio_blocks",
//   },
// ]);
// javascript.javascriptGenerator.forBlock["gpiochip_open"] = function (
//   block,
//   generator
// ) {
//   Blockly.JavaScript.provideFunction_("import_gpio", import_gpio_code);
//   const code = `const _gpiochip_hand = await _rg.gpiochip_open(${settings.data.gpiodev});\n`;
//   return code;
// };
// python.pythonGenerator.forBlock["gpiochip_open"] = function (block, generator) {
//   Blockly.Python.provideFunction_("import_pin", ["from machine import Pin"]);
//   var code = `_pin = {}\n`; //
//   return code;
// };
// /***************** */
// /** GPIOChip Close */
// /***************** */
// Blockly.defineBlocksWithJsonArray([
//   {
//     type: "gpiochip_close",
//     message0: "GPIOChip デバイスとの接続を閉じる",
//     previousStatement: null,
//     nextStatement: null,
//     tooltip: "GPIOChip デバイスとの接続を閉じます。",
//     helpUrl: "",
//     style: "gpio_blocks",
//   },
// ]);
// javascript.javascriptGenerator.forBlock["gpiochip_close"] = function (
//   block,
//   generator
// ) {
//   var code = "await _rg.gpiochip_close(_gpiochip_hand);\n";
//   return code;
// };
// python.pythonGenerator.forBlock["gpiochip_close"] = function (
//   block,
//   generator
// ) {
//   var code = "";
//   return code;
// };
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
  generator
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var dropdown_lflag = block.getFieldValue("lflag");
  var code = `await _rg.gpio_claim_input(${value_gpio}, _rg.SET_${dropdown_lflag});\n`;
  return code;
};
python.pythonGenerator.forBlock["gpio_claim_input"] = function (
  block,
  generator
) {
  var value_gpio = Blockly.Python.valueToCode(
    block,
    "gpio",
    Blockly.Python.ORDER_ATOMIC
  );
  var dropdown_lflag = block.getFieldValue("lflag");
  let lflag;
  if (dropdown_lflag == "PULL_NONE") {
    lflag = "None";
  } else {
    lflag = `Pin.${dropdown_lflag}`;
  }
  var code = `_pin[${value_gpio}] = Pin(${value_gpio}, Pin.IN, ${lflag})\n`;
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
  generator
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `await _rg.gpio_claim_output(${value_gpio});\n`;
  return code;
};
python.pythonGenerator.forBlock["gpio_claim_output"] = function (
  block,
  generator
) {
  var value_gpio = Blockly.Python.valueToCode(
    block,
    "gpio",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `_pin[${value_gpio}] = Pin(${value_gpio}, Pin.OUT)\n`;
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
  generator
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `await _rg.gpio_read(${value_gpio})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
python.pythonGenerator.forBlock["gpio_read"] = function (block, generator) {
  var value_gpio = Blockly.Python.valueToCode(
    block,
    "gpio",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `_pin[${value_gpio}].value()`;
  return [code, Blockly.Python.ORDER_NONE];
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
  generator
) {
  var value_gpio = Blockly.JavaScript.valueToCode(
    block,
    "gpio",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var dropdown_level = block.getFieldValue("level");
  var code = `await _rg.gpio_write(${value_gpio}, ${dropdown_level});\n`;
  return code;
};
python.pythonGenerator.forBlock["gpio_write"] = function (block, generator) {
  var value_gpio = Blockly.Python.valueToCode(
    block,
    "gpio",
    Blockly.Python.ORDER_ATOMIC
  );
  var dropdown_level = block.getFieldValue("level");
  var code = `_pin[${value_gpio}].value(${dropdown_level})\n`;
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
  generator
) {
  var value_addr = Blockly.JavaScript.valueToCode(
    block,
    "addr",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var variable_i2c_hand = Blockly.JavaScript.nameDB_.getName(
    block.getFieldValue("i2c_hand"),
    Blockly.Names.NameType.VARIABLE
  );
  var code = `${variable_i2c_hand} = await _rg.i2c_open(${settings.data.i2cdev}, ${value_addr}, 0);\n`;
  return code;
};
python.pythonGenerator.forBlock["i2c_open"] = function (block, generator) {
  var value_addr = Blockly.Python.valueToCode(
    block,
    "addr",
    Blockly.Python.ORDER_ATOMIC
  );
  var variable_i2c_hand = Blockly.Python.nameDB_.getName(
    block.getFieldValue("i2c_hand"),
    Blockly.Names.NameType.VARIABLE
  );
  Blockly.Python.provideFunction_("import_pin", ["from machine import Pin"]);
  Blockly.Python.provideFunction_("import_i2c", ["from machine import I2C"]);
  var code = `if ${variable_i2c_hand} == None:
  ${variable_i2c_hand} = {'hand': I2C(0,sda=Pin(0),scl=Pin(1)), 'addr': ${value_addr}}
else:
  ${variable_i2c_hand}['addr'] = ${value_addr}
\n`;
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
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC
  );
  const code = `await _rg.i2c_close(${value_i2c_hand});\n`;
  return code;
};
python.pythonGenerator.forBlock["i2c_close"] = function (block, generator) {
  var code = ``;
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
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC
  );
  const value_reg = generator.valueToCode(
    block,
    "reg",
    javascript.Order.ATOMIC
  );
  const code = `await _rg.i2c_read_byte_data(${value_i2c_hand}, ${value_reg})`;
  return [code, javascript.Order.ATOMIC]; //Blockly.JavaScript.ORDER_ATOMIC
};
python.pythonGenerator.forBlock["i2c_read_byte_data"] = function (
  block,
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    python.Order.ATOMIC
  );
  const value_reg = generator.valueToCode(block, "reg", python.Order.ATOMIC);
  const code = `\n`;
  return [code, python.Order.ATOMIC];
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
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC
  );
  const value_reg = generator.valueToCode(
    block,
    "reg",
    javascript.Order.ATOMIC
  );
  const value_byte_val = generator.valueToCode(
    block,
    "byte_val",
    javascript.Order.ATOMIC
  );
  const code = `await _rg.i2c_write_byte_data(${value_i2c_hand}, ${value_reg}, ${value_byte_val});\n`;
  return code;
};
python.pythonGenerator.forBlock["i2c_write_byte_data"] = function (
  block,
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    python.Order.ATOMIC
  );
  const value_reg = generator.valueToCode(block, "reg", python.Order.ATOMIC);
  const value_byte_val = generator.valueToCode(
    block,
    "byte_val",
    python.Order.ATOMIC
  );
  const code = `${value_i2c_hand}['hand'].writeto_mem(${value_i2c_hand}['addr'], ${value_reg}, (${value_byte_val}).to_bytes(1,'big'))\n`;
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
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    javascript.Order.ATOMIC
  );
  const value_reg = generator.valueToCode(
    block,
    "reg",
    javascript.Order.ATOMIC
  );
  const value_data = generator.valueToCode(
    block,
    "data",
    javascript.Order.ATOMIC
  );
  const code = `await _rg.i2c_write_i2c_block_data (${value_i2c_hand}, ${value_reg}, ${value_data});`;
  return code;
};
python.pythonGenerator.forBlock["i2c_write_i2c_block_data"] = function (
  block,
  generator
) {
  const value_i2c_hand = generator.valueToCode(
    block,
    "i2c_hand",
    python.Order.ATOMIC
  );
  var value_reg = Blockly.Python.valueToCode(block, "reg", python.Order.ATOMIC);
  var value_data = Blockly.Python.valueToCode(
    block,
    "data",
    python.Order.ATOMIC
  );
  const code = `if type(${value_data}) is str:
  _bytedata = ${value_data}.encode()
elif type(${value_data}) is list:
  _bytedata = bytes(${value_data})
else:
  _bytedata = ${value_data}
${value_i2c_hand}['hand'].writeto_mem(${value_i2c_hand}['addr'], ${value_reg}, _bytedata)\n`;
  return code;
};
