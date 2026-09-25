import { settings } from "../index.mjs";

/******************************* */
/** Connect to the pigpio daemon */
/******************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "pigpio_pi",
    tooltip: "pigpio デーモンに接続し、GPIO 操作ができるようにします",
    helpUrl: "",
    message0: "GPIO を使えるようにする %1",
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
javascript.javascriptGenerator.forBlock["pigpio_pi"] = function (
  block,
  generator,
) {
  generator.provideFunction_("require_gpio", [
    `const pigpio = require("${settings.data.mod_dir}${settings.data.gpiolib}.cjs");`,
  ]);
  const code = `if (global.pi === undefined) { //Necora
    pi =await pigpio.pi("${settings.data.host}");
    if (pi.connected == false) {
      pi = undefined;
      necora.fukidashi(String('接続エラー'), 5);
      return;
    }
  }
  \n`;
  return code;
};
/************************************ */
/** Disconnect from the pigpio daemon */
/************************************ */
Blockly.defineBlocksWithJsonArray([
  {
    type: "stop",
    tooltip: "pigpio（デーモン）との接続を切断します。",
    helpUrl: "",
    message0: "GPIO の片付けをする %1",
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
javascript.javascriptGenerator.forBlock["stop"] = function () {
  const code = `await pi.stop();
pi = undefined;
`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "set_mode",
    tooltip:
      "GPIO の出力/入力を設定します。入力の場合プルアップ/プルダウンの設定をすることができます。",
    helpUrl: "",
    message0: "GPIO %1 を %2 に設定",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "mode",
        options: [
          ["出力", "OUTPUT"],
          ["入力", "INPUT"],
        ],
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: "gpio_blocks",
    mutator: "set_mode_mutator",
  },
]);

Blockly.Extensions.registerMutator(
  "set_mode_mutator",
  {
    // --------------------------------------------------
    // 1. 保存処理 (シリアライズ)
    // --------------------------------------------------
    saveExtraState: function () {
      return {
        selectedType: this.getFieldValue("mode") || "NONE",
      };
    },

    // --------------------------------------------------
    // 2. 復元処理 (デシリアライズ)
    // --------------------------------------------------
    loadExtraState: function (state) {
      if (state && state["selectedType"]) {
        this.updateShape_(state["selectedType"]);
      }
    },

    // --------------------------------------------------
    // 3. フィールド追加・削除の共通ロジック
    // --------------------------------------------------
    updateShape_: function (type) {
      // 既に同じタイプが描画されている場合は何もしない (重複処理・値のリセット防止)
      if (this.currentType_ === type) {
        return;
      }
      this.currentType_ = type;

      // 既存の動的インプットがあれば削除
      if (this.getInput("EXTRA_INPUT")) {
        this.removeInput("EXTRA_INPUT");
      }

      // タイプに応じてフィールドを追加
      if (type === "INPUT") {
        this.appendDummyInput("EXTRA_INPUT")
          .appendField("プル設定:")
          .appendField(
            new Blockly.FieldDropdown([
              ["なし", "PUD_OFF"],
              ["プルダウン", "PUD_DOWN"],
              ["プルアップ", "PUD_UP"],
            ]),
            "pull_up_down",
          );
      }
    },
  },

  // --------------------------------------------------
  // 第3引数：ブロックの初期化処理
  // --------------------------------------------------
  function () {
    var block = this;
    var dropdown = this.getField("mode");

    if (dropdown) {
      dropdown.setValidator(function (newValue) {
        // ユーザーが手動でドロップダウンを変えた時だけ setTimeout で更新する
        setTimeout(function () {
          block.updateShape_(newValue);
        }, 0);

        return newValue;
      });
    }
  },
);
javascript.javascriptGenerator.forBlock["set_mode"] = function (
  block,
  generator,
) {
  var gpio = generator.valueToCode(block, "gpio", javascript.Order.ATOMIC);
  var mode = block.getFieldValue("mode");
  var pull = block.getFieldValue("pull_up_down");
  var code = `await pi.set_mode(${gpio}, pigpio.${mode});\n`;
  if (pull) code += `await pi.set_pull_up_down(${gpio}, pigpio.${pull});\n`;
  return code;
};
/********************* */
/** Read GPIO Value ** */
/***********************/
Blockly.defineBlocksWithJsonArray([
  {
    type: "read",
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
javascript.javascriptGenerator.forBlock["read"] = function (block, generator) {
  var value_gpio = generator.valueToCode(
    block,
    "gpio",
    javascript.Order.ATOMIC,
  );
  var code = `await pi.read(${value_gpio})`;
  return [code, javascript.Order.NONE]; //Blockly.JavaScript.ORDER_NONE
};

/*******************************************/
/** GPIO Write Value - Common GPIO on/off **/
/*******************************************/
Blockly.defineBlocksWithJsonArray([
  {
    type: "write",
    message0: "GPIO %1 の値を %2 にする",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
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
javascript.javascriptGenerator.forBlock["write"] = function (block, generator) {
  var value_gpio = generator.valueToCode(
    block,
    "gpio",
    javascript.Order.ATOMIC,
  );
  var dropdown_level = block.getFieldValue("level");
  var code = `await pi.write(${value_gpio}, ${dropdown_level});\n`;
  return code;
};

/********* */
/** PWM ** */
/********* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "pwm_freq",
    message0: "GPIO %1 のPWM周波数を %2 Hz に設定",
    tooltip: "GPIO端子のPWM周波数を設定します。",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
      {
        type: "input_value",
        name: "freq",
        check: "Number",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["pwm_freq"] = function (
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
  const code = `await pi.set_PWM_frequency(${value_gpio}, ${value_freq});\n`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "pwm_duty",
    message0: "GPIO %1 にデューティ比 %2 % のパルス波を出力",
    helpUrl: "",
    tooltip:
      "GPIO端子にPWM（Pulse Width Modulation：パルス幅変調）信号を出力します。デューティ比は0〜100の範囲で指定します。0: OFF, 100: Full ON",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
      {
        type: "input_value",
        name: "duty",
        check: "Number",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["pwm_duty"] = function (
  block,
  generator,
) {
  const value_gpio = generator.valueToCode(
    block,
    "gpio",
    javascript.Order.ATOMIC,
  );
  const value_duty = generator.valueToCode(
    block,
    "duty",
    javascript.Order.ATOMIC,
  );
  const code = `await pi.set_PWM_dutyratio(${value_gpio}, ${value_duty});\n`;
  return code;
};

/**************** */
/** サーボモータ ** */
/**************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "servo",
    message0: "GPIO %1 にパルス幅 %2 μs の信号を出力 %3",
    helpUrl: "",
    tooltip:
      "GPIO端子にサーボモータ用のPWM信号を出力します。パルス幅：停止=0, 中央=1500, 左端=500, 右端=2500。\nこの範囲外の値を入力するとサーボモータを破損することがあります。",
    args0: [
      {
        type: "input_value",
        name: "gpio",
        check: "Number",
      },
      {
        type: "input_value",
        name: "pulsewidth",
        check: "Number",
        value: 1500, // 初期値
        min: 500, // 最小値
        max: 2500, // 最大値
        precision: 1, // 精度（1にすると整数のみ。0.1なら小数第一位まで）
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
javascript.javascriptGenerator.forBlock["servo"] = function (block, generator) {
  const value_gpio = generator.valueToCode(
    block,
    "gpio",
    javascript.Order.ATOMIC,
  );
  const value_pulsewidth = generator.valueToCode(
    block,
    "pulsewidth",
    javascript.Order.ATOMIC,
  );
  const code = `await pi.set_servo_pulsewidth(${value_gpio}, ${value_pulsewidth});\n`;
  return code;
};

/********************** */
/** I2C デバイスを開く ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_open",
    message0: "アドレス %1 の I2C デバイスを %2 として開く",
    tooltip: "I2C接続されたデバイスに名前をつけて通信を開始します。",
    args0: [
      {
        type: "input_value",
        name: "addr",
        check: "Number",
      },
      {
        type: "field_variable",
        name: "i2c_hand",
        variable: "I2Cデバイス",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["i2c_open"] = function (
  block,
  generator,
) {
  const value_address = generator.valueToCode(
    block,
    "addr",
    javascript.Order.ATOMIC,
  );
  const variable_handle = generator.nameDB_.getName(
    block.getFieldValue("i2c_hand"),
    Blockly.VARIABLE_CATEGORY_NAME,
  );
  const code = `${variable_handle} = await pi.i2c_open(${settings.data.i2cdev}, ${value_address});\n`;
  return code;
};

/********************** */
/** Close I2C Device ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_close",
    message0: "I2Cデバイス %1 を閉じる",
    tooltip: "指定した I2C デバイスとの通信を切断します。",
    helpUrl: "",
    args0: [
      {
        type: "input_value",
        name: "i2c_hand",
        check: "Number",
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
  const code = `await pi.i2c_close(${value_i2c_hand});\n`;
  return code;
};

/****************************************************************** */
/** Read a single byte from the specified resister of the device ** */
/****************************************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_read_byte_data",
    message0: "I2Cデバイス %1 のレジスタ %2 の値",
    tooltip: "I2C デバイスの指定されたレジスタから1バイトを読み込みます。",
    helpUrl: "",
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
  const code = `await pi.i2c_read_byte_data(${value_i2c_hand}, ${value_reg})`;
  return [code, javascript.Order.ATOMIC];
};

/****************************************************************** */
/** Writes a single byte to the specified register of the device ** */
/****************************************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "i2c_write_byte_data",
    message0: "I2Cデバイス %1 のレジスタ %2 に１バイト %3 を書き込む",
    tooltip:
      "I2C デバイスの指定されたレジスタに1バイトのデータ（数値）を書き込みます。",
    helpUrl: "",
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
        check: "Number",
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
  const code = `await pi.i2c_write_byte_data(${value_i2c_hand}, ${value_reg}, ${value_byte_val});\n`;
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
  const code = `await pi.i2c_write_i2c_block_data(${value_i2c_hand}, ${value_reg}, ${value_data});`;
  return code;
};

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
  var value_port = generator.valueToCode(
    block,
    "port",
    javascript.Order.ATOMIC,
  );
  var variable_ser_hand = generator.nameDB_.getName(
    block.getFieldValue("ser_hand"),
    Blockly.Names.NameType.VARIABLE,
  );
  var dropdown_baud = block.getFieldValue("baud");
  var code = `${variable_ser_hand} = await pi.serial_open(${value_port}, ${dropdown_baud});\n`;
  return code;
};

/*********************** */
/** Close Serial Port ** */
/*********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_close",
    message0: "シリアルデバイス %1 を閉じる",
    args0: [
      {
        type: "input_value",
        name: "ser_hand",
        check: "Number",
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
  var value_ser_hand = generator.valueToCode(
    block,
    "ser_hand",
    javascript.Order.ATOMIC,
  );
  var code = `await pi.serial_close(${value_ser_hand});\n`;
  return code;
};

/************************ */
/** Read Data from Serial */
/************************ */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_read",
    message0: "シリアルデバイス %1 から %2 文字受け取る",
    args0: [
      {
        type: "input_value",
        name: "ser_hand",
        check: "Number",
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
  var value_ser_hand = generator.valueToCode(
    block,
    "ser_hand",
    javascript.Order.ATOMIC,
  );
  var value_count = generator.valueToCode(
    block,
    "count",
    javascript.Order.ATOMIC,
  );
  var code = `(await pi.serial_read(${value_ser_hand}, ${value_count}))[1]`;
  return [code, javascript.Order.ATOMIC];
};

/************************** */
/** Write Data to Serial ** */
/************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_write",
    message0: "シリアルデバイス %1 に %2 を書き込む",
    args0: [
      {
        type: "input_value",
        name: "ser_hand",
        check: "Number",
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
    tooltip: "シリアルデバイスにデータを書き込みます。",
    helpUrl: "",
    style: "gpio_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["serial_write"] = function (
  block,
  generator,
) {
  var value_ser_hand = generator.valueToCode(
    block,
    "ser_hand",
    javascript.Order.ATOMIC,
  );
  var value_data = generator.valueToCode(
    block,
    "data",
    javascript.Order.ATOMIC,
  );
  var code = `await pi.serial_write(${value_ser_hand}, ${value_data});\n`;
  return code;
};

/******************************************************************* */
/** Returns the number of bytes available to be read from the device */
/******************************************************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "serial_data_available",
    message0: "シリアルデバイス %1 から読み取り可能なデータのバイト数",
    args0: [
      {
        type: "input_value",
        name: "ser_hand",
        check: "Number",
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
  var value_ser_hand = generator.valueToCode(
    block,
    "ser_hand",
    javascript.Order.ATOMIC,
  );
  var code = `await pi.serial_data_available(${value_ser_hand})`;
  return [code, javascript.Order.ATOMIC];
};
