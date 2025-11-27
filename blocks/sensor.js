import { settings } from "../index.mjs";

/************************** */
/** MPU6050 Inertial Sensor */
/************************** */
// 初期化
Blockly.defineBlocksWithJsonArray([
  {
    type: "inertial_init",
    tooltip:
      "3軸加速度・3軸ジャイロセンサー MPU-6050 との I2C 接続を開き、初期化します。",
    helpUrl: "",
    message0: "６軸慣性センサ（アドレス： %1 を %2 として開いて初期化 %3",
    args0: [
      {
        type: "field_dropdown",
        name: "addr",
        options: [
          ["0x68", "0x68"],
          ["0x69", "0x69"],
        ],
      },
      {
        type: "field_variable",
        name: "mpu6050",
        variable: "慣性センサ",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["inertial_init"] = function (
  block,
  generator
) {
  const dropdown_addr = block.getFieldValue("addr");
  const variable_mpu6050 = generator.getVariableName(
    block.getFieldValue("mpu6050")
  );
  Blockly.JavaScript.provideFunction_("require_mpu6050", [
    `const { MPU6050 } = require('@necora/mpu6050');`,
  ]);
  const code = `${variable_mpu6050} = new MPU6050();
  await ${variable_mpu6050}.init(${settings.data.i2cdev}, ${dropdown_addr});\n`;
  return code;
};
// 停止
Blockly.defineBlocksWithJsonArray([
  {
    type: "inertial_stop",
    tooltip: "3軸加速度・3軸ジャイロセンサー MPU-6050 との接続を閉じます。",
    helpUrl: "",
    message0: "慣性センサ %1 を停止 %2",
    args0: [
      {
        type: "input_value",
        name: "mpu6050",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["inertial_stop"] = function (
  block,
  generator
) {
  const value_mpu6050 = generator.valueToCode(
    block,
    "mpu6050",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_mpu6050}.stop();\n`;
  return code;
};
// 加速度データ取得
Blockly.defineBlocksWithJsonArray([
  {
    type: "inertial_get_accel",
    tooltip:
      "3軸加速度・3軸ジャイロセンサー MPU-6050 から加速度データを [x, y, z] のリストとして取得します。",
    helpUrl: "",
    message0: "慣性センサ %1 の加速度 %2",
    args0: [
      {
        type: "input_value",
        name: "mpu6050",
      },
      {
        type: "input_dummy",
        name: "NAM",
      },
    ],
    output: "Array",
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["inertial_get_accel"] = function (
  block,
  generator
) {
  const value_mpu6050 = generator.valueToCode(
    block,
    "mpu6050",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_mpu6050}.get_accel_data()`;
  return [code, javascript.Order.NONE];
};
// 角速度データ取得
Blockly.defineBlocksWithJsonArray([
  {
    type: "inertial_get_gyro",
    tooltip:
      "3軸加速度・3軸ジャイロセンサー MPU-6050 から角速度データを [x, y, z] のリストとして取得します。",
    helpUrl: "",
    message0: "慣性センサ %1 の角速度 %2",
    args0: [
      {
        type: "input_value",
        name: "mpu6050",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: "Array",
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["inertial_get_gyro"] = function (
  block,
  generator
) {
  const value_mpu6050 = generator.valueToCode(
    block,
    "mpu6050",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_mpu6050}.get_gyro_data()`;
  return [code, javascript.Order.NONE];
};

/**************************** */
/** Servo Moter Driver Module */
/**************************** */
// 初期化
Blockly.defineBlocksWithJsonArray([
  {
    type: "pca9685_start",
    tooltip: "PCA9685サーボモータドライバに接続し、使用できるようにします。",
    helpUrl: "",
    message0: "サーボドライバ（アドレス： %1 ）を %2 として開始 %3",
    args0: [
      {
        type: "field_dropdown",
        name: "addr",
        options: [
          ["0x40", "0x40"],
          ["0x41", "0x41"],
        ],
      },
      {
        type: "field_variable",
        name: "handle",
        variable: "サーボ",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["pca9685_start"] = function (
  block,
  generator
) {
  const dropdown_addr = block.getFieldValue("addr");
  const variable_handle = generator.getVariableName(
    block.getFieldValue("handle")
  );
  Blockly.JavaScript.provideFunction_("require_pca9685", [
    `const { PCA9685 } = require('@necora/pca9685');`,
  ]);

  const code = `${variable_handle} = new PCA9685();
  await ${variable_handle}.init(${settings.data.i2cdev}, ${dropdown_addr});
  await ${variable_handle}.setPWMFreq(50);\n`;
  return code;
};
// サーボモータドライバを停止
Blockly.defineBlocksWithJsonArray([
  {
    type: "pca9685_stop",
    tooltip: "pca9685 サーボモータドライバを停止し、接続を終了します。",
    helpUrl: "",
    message0: "サーボドライバ %1 を停止 %2",
    args0: [
      {
        type: "input_value",
        name: "handle",
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
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["pca9685_stop"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_handle}.stop();
  await ${value_handle}.close();\n`;
  return code;
};
// 回転
Blockly.defineBlocksWithJsonArray([
  {
    type: "pca9685_setangle",
    tooltip:
      "PCA9685 に接続したサーボモータを動かします。0° ～ 180° の範囲で指定します。",
    helpUrl: "",
    message0:
      "サーボドライバ %1 のチャンネル %2 のサーボモータの角度を %3 にする %4",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_value",
        name: "channel",
      },
      {
        type: "input_value",
        name: "angle",
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
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["pca9685_setangle"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const value_channel = generator.valueToCode(
    block,
    "channel",
    javascript.Order.ATOMIC
  );
  const value_angle = generator.valueToCode(
    block,
    "angle",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_handle}.setAngle(${value_channel}, ${value_angle}, ${settings.data.min_pulse}, ${settings.data.max_pulse});\n`;
  return code;
};

/*************** */
/** SSD1306 OLED */
/*************** */

// 初期化
Blockly.defineBlocksWithJsonArray([
  {
    type: "oled_init",
    tooltip: "I2C 接続の SSD1306 有機ELディスプレイを使えるようにします。",
    helpUrl: "",
    message0:
      "有機ELディスプレイ（アドレス %1 ，画面サイズ %2 ）を %3 として開いて初期化 %4",
    args0: [
      {
        type: "field_dropdown",
        name: "i2c_addr",
        options: [
          ["0x3c", "0x3c"],
          ["0x3d", "0x3d"],
        ],
      },
      {
        type: "field_dropdown",
        name: "disp_size",
        options: [
          ["128x64", "128x64"],
          ["128x32", "128x32"],
          ["96x16", "96x16"],
        ],
      },
      {
        type: "field_variable",
        name: "handle",
        variable: "oled",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["oled_init"] = function (
  block,
  generator
) {
  const dropdown_i2c_addr = block.getFieldValue("i2c_addr");
  const dropdown_disp_size = block.getFieldValue("disp_size");
  const variable_handle = generator.getVariableName(
    block.getFieldValue("handle")
  );
  Blockly.JavaScript.provideFunction_("require_oled", [
    `const {SSD1306} = require('@necora/ssd1306');`,
  ]);
  let size_x, size_y;
  [size_x, size_y] = dropdown_disp_size.split("x");
  const code = `${variable_handle} = new SSD1306({bus: ${settings.data.i2cdev},address: ${dropdown_i2c_addr}, width: ${size_x}, height: ${size_y}});
await ${variable_handle}.initialize();`;
  return code;
};
// 画面クリア
Blockly.defineBlocksWithJsonArray([
  {
    type: "oled_cleardisplay",
    tooltip: "有機ELディスプレイの画面を消去します。",
    helpUrl: "",
    message0: "有機ELディスプレイ %1 の画面をクリア %2",
    args0: [
      {
        type: "input_value",
        name: "handle",
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
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["oled_cleardisplay"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_handle}.clearDisplay(false);
await ${value_handle}.update();`;
  return code;
};
// 直線を描画
Blockly.defineBlocksWithJsonArray([
  {
    type: "oled_drawline",
    tooltip:
      "有機ELディスプレイに直線を表示します。「同期」を ☑ にすると、直ちに描画処理をします。",
    helpUrl: "",
    message0:
      "有機ELディスプレイ %1 に直線を描画：始点（ %2 , %3 ）終点 %4 , %5 ）色 %6 同期 %7 %8",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_value",
        name: "x0",
        check: "Number",
      },
      {
        type: "input_value",
        name: "y0",
        check: "Number",
      },
      {
        type: "input_value",
        name: "x1",
        check: "Number",
      },
      {
        type: "input_value",
        name: "y1",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "color",
        options: [
          ["白", "1"],
          ["黒", "0"],
        ],
      },
      {
        type: "field_checkbox",
        name: "sync",
        checked: true,
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["oled_drawline"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const value_x0 = generator.valueToCode(block, "x0", javascript.Order.ATOMIC);
  const value_y0 = generator.valueToCode(block, "y0", javascript.Order.ATOMIC);
  const value_x1 = generator.valueToCode(block, "x1", javascript.Order.ATOMIC);
  const value_y1 = generator.valueToCode(block, "y1", javascript.Order.ATOMIC);
  const dropdown_color = block.getFieldValue("color");
  const checkbox_sync = block.getFieldValue("sync");

  const code = `await ${value_handle}.drawLine(${value_x0}, ${value_y0}, ${value_x1}, ${value_y1}, ${dropdown_color}, ${checkbox_sync.toLowerCase()});`;
  return code;
};
// 表示を更新
Blockly.defineBlocksWithJsonArray([
  {
    type: "oled_update",
    tooltip:
      "有機ELディスプレイの画面を更新します。「同期」をアンチェックして実行した描画処理をまとめて表示します。",
    helpUrl: "",
    message0: "有機ELディスプレイ %1 の画面を更新 %2",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["oled_update"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_handle}.update();`;
  return code;
};
Blockly.defineBlocksWithJsonArray([
  {
    type: "oled_drawpixel",
    tooltip:
      "有機ELディスプレイに点を表示します。「同期」を ☑ にすると、直ちに描画処理をします。",
    helpUrl: "",
    message0:
      "有機ELディスプレイ %1 に点を描く：座標（ %2 , %3 ）色 %4 同期 %5 %6",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_value",
        name: "x",
        check: "Number",
      },
      {
        type: "input_value",
        name: "y",
        check: "Number",
      },
      {
        type: "field_dropdown",
        name: "color",
        options: [
          ["白", "1"],
          ["黒", "0"],
        ],
      },
      {
        type: "field_checkbox",
        name: "sync",
        checked: "FALSE",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["oled_drawpixel"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const value_x = generator.valueToCode(block, "x", javascript.Order.ATOMIC);
  const value_y = generator.valueToCode(block, "y", javascript.Order.ATOMIC);
  const dropdown_color = block.getFieldValue("color");
  const checkbox_sync = block.getFieldValue("sync");

  const code = `await ${value_handle}.drawPixel([${value_x},${value_y},${dropdown_color}],${checkbox_sync.toLowerCase()});`;
  return code;
};
// OLED に日本語フォントを表示 node-canvas, jspng 利用
Blockly.defineBlocksWithJsonArray([
  {
    type: "oled_drawJPfont",
    tooltip:
      "OLEDに日本語フォントで文字を描画します。始点は1文字目の左下の座標です。「同期」を ☑ にすると、直ちに描画処理をします。",
    helpUrl: "",
    message0:
      "有機ELディスプレイ %1 にテキスト %2 を表示：フォント %3 色 %4 %5 始点 ( %6 , %7 ) %8 同期 %9",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_value",
        name: "text",
        check: "String",
      },
      {
        type: "field_dropdown",
        name: "font",
        options: [
          ["美咲ゴシック(8x8)", "misaki_gothic,8"],
          ["PixelMplus(10x10)", "PixelMplus10-Regular,10"],
          ["PixelMplus(12x12)", "PixelMplus12-Regular,12"],
        ],
      },
      {
        type: "field_dropdown",
        name: "color",
        options: [
          ["白", "white"],
          ["黒", "black"],
        ],
      },
      {
        type: "input_dummy",
        name: "d1",
      },
      {
        type: "input_value",
        name: "x",
        check: "Number",
      },
      {
        type: "input_value",
        name: "y",
        check: "Number",
      },
      {
        type: "field_checkbox",
        name: "sync",
        checked: "FALSE",
      },
      {
        type: "input_dummy",
        name: "d2",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["oled_drawJPfont"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const value_text = generator.valueToCode(
    block,
    "text",
    javascript.Order.ATOMIC
  );
  const dropdown_font = block.getFieldValue("font");
  const dropdown_color = block.getFieldValue("color");
  const value_x = generator.valueToCode(block, "x", javascript.Order.ATOMIC);
  const value_y = generator.valueToCode(block, "y", javascript.Order.ATOMIC);
  const checkbox_sync = block.getFieldValue("sync");
  Blockly.JavaScript.provideFunction_("require_pngjs", [
    `const _PNGJS = require("pngjs").PNG;`,
  ]);
  Blockly.JavaScript.provideFunction_("require_text2png", [
    `const _text2png = require("@necora/text2png");`,
  ]);
  const oledfont = dropdown_font.split(",");
  const code = `await ${value_handle}.drawRGBAImage(_PNGJS.sync.read (_text2png(${value_text}, '${
    oledfont[0]
  }', ${
    oledfont[1]
  }, '${dropdown_color}')), ${value_x}, ${value_y}, ${checkbox_sync.toLowerCase()});`;
  return code;
};
/****************************** */
/** SFM-V1.7 Fingerprint Sensor */
/****************************** */

// // 初期化
// Blockly.defineBlocksWithJsonArray([
//   {
//     "type": "oc_sfmv17_init",
//     "message0": "指紋センサ（ポート %1 ）に接続",
//     "args0": [
//         {
//             "type": "input_value",
//             "name": "port",
//             "check": "String"
//         }
//     ],
//     "previousStatement": null,
//     "nextStatement": null,
//     "tooltip": "指紋センサ SFM-V1.7 とのシリアル通信を開始します。",
//     "helpUrl": "",
//     "style": "sensor_blocks"
// }]);
// javascript.javascriptGenerator.forBlock['oc_sfmv17_init'] = function (block, generator) {
//     var value_port = generator.valueToCode(block, 'port', javascript.Order.ATOMIC);
//     Blockly.JavaScript.provideFunction_(
//         'require_sfmv17', [`const _sfm = require('@ocoge/sfmv17');`]
//     );
//     var code = `await _sfm.init(_rg, ${value_port}, 115200);\n`;
//     return code;
// };

/********** */
/** PAJ7620 */
/********** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "gesture_init",
    tooltip: "PAJ7620 ジェスチャーセンサーを使用する準備をします。",
    helpUrl: "",
    message0:
      "ジェスチャーセンサー（アドレス： %1 ）を %2 として開いて初期化 %3",
    args0: [
      {
        type: "field_dropdown",
        name: "i2c_addr",
        options: [["0x73", "0x73"]],
      },
      {
        type: "field_variable",
        name: "paj7620",
        variable: "ジェスチャーセンサー",
      },
      {
        type: "input_dummy",
        name: "",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gesture_init"] = function (
  block,
  generator
) {
  const dropdown_i2c_addr = block.getFieldValue("i2c_addr");
  const variable_paj7620 = generator.getVariableName(
    block.getFieldValue("paj7620")
  );
  Blockly.JavaScript.provideFunction_("require_paj7620", [
    `const { PAJ7620 } = require('@necora/paj7620');`,
  ]);
  const code = `${variable_paj7620} = new PAJ7620();
await ${variable_paj7620}.init(${settings.data.i2cdev}, ${dropdown_i2c_addr});\n`;
  return code;
};

/****************** */
/** Gesture Read ** */
/****************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "gesture_read",
    tooltip: "センサーから現在のジェスチャーの値（０〜９）を読み込みます",
    helpUrl: "",
    message0: "ジェスチャーセンサー %1 の値 %2",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: "Number",
    inputsInline: true,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["gesture_read"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_handle}.return_gesture()`;
  return [code, javascript.Order.ATOMIC];
};

// var ugjGestureReadDefinition = {
//   type: "gesture_read",
//   message0: "ジェスチャーの値",
//   inputsInline: true,
//   output: "Number",
//   tooltip: "センサーから現在のジェスチャーの値（０〜９）を読み込みます",
//   helpUrl: "https://ocoge.club/sensors/paj7620.html",
//   style: "sensor_blocks",
// };
// Blockly.Blocks["gesture_read"] = {
//   init: function () {
//     this.jsonInit(ugjGestureReadDefinition);
//   },
// };
// javascript.javascriptGenerator.forBlock["gesture_read"] = function (
//   block,
//   generator
// ) {
//   var code = "await _paj7620.return_gesture()";
//   return [code, Blockly.JavaScript.ORDER_ATOMIC];
// };
/****************** */
/** Gesture Stop ** */
/****************** */
var ugjGestureStopDefinition = {
  type: "gesture_stop",
  message0: "ジェスチャーセンサーから切断",
  inputsInline: true,
  previousStatement: null,
  nextStatement: null,
  tooltip: "センサーとの接続を停止します。",
  helpUrl: "",
  style: "sensor_blocks",
};
Blockly.Blocks["gesture_stop"] = {
  init: function () {
    this.jsonInit(ugjGestureStopDefinition);
  },
};
javascript.javascriptGenerator.forBlock["gesture_stop"] = function (
  block,
  generator
) {
  var code = "await _paj7620.stop();\n";
  return code;
};

/******************* */
/** Init Grid-Eye ** */
/******************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_init",
    message0:
      "赤外線アレイセンサ（アドレス：  %1  ）を %2 として開いて初期化 %3",
    args0: [
      {
        type: "field_dropdown",
        name: "addr",
        options: [
          ["0x68", "0x68"],
          ["0x69", "0x69"],
        ],
      },
      {
        type: "field_variable",
        name: "grid_eye",
        variable: "グリッドアイ",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "赤外線アレイセンサ AMG8833 を開き、使用できるようにします。I2C アドレスはモジュールにより異なる場合があります。",
    helpUrl: "",
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_init"] = function (
  block,
  generator
) {
  var dropdown_addr = block.getFieldValue("addr");
  const variable_grid_eye = generator.getVariableName(
    block.getFieldValue("grid_eye")
  );
  Blockly.JavaScript.provideFunction_("import_amg8833", [
    `const {AMG8833} = require('@necora/amg8833');`,
  ]);
  const code = `${variable_grid_eye} = new AMG8833();
  await ${variable_grid_eye}.init(${settings.data.i2cdev}, ${dropdown_addr});\n`;
  return code;
};
/********************** */
/** Grid-Eye を閉じる ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_close",
    message0: "赤外線アレイセンサ %1 との接続を閉じる %2",
    tooltip: "AMG8833 との接続を閉じます。",
    helpUrl: "",
    args0: [
      {
        type: "input_value",
        name: "handle",
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
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_close"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `await ${value_handle}.close();
document.getElementById('display_area').removeChild(_grideye_canvas);
`;
  return code;
};

/********************** */
/** Grid-Eye 本体温度 ** */
/********************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_thermistor",
    message0: "赤外線アレイセンサ %1 の本体温度%2",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: "Number",
    tooltip: "AMG8833に内蔵されたサーミスタ（温度センサ）の値を取得します。",
    helpUrl: "",
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_thermistor"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `await ${value_handle}.read_thermistor()`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
/**************************** */
/** Read Temperature Array ** */
/**************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_read",
    message0: "赤外線アレイセンサ %1 の 8✕8 温度データ %2",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    inputsInline: true,
    output: "Array",
    tooltip: "AMG8833から読み取った温度データを、8x8の配列で取得します。",
    helpUrl: "",
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_read"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `await ${value_handle}.read_temp_array()`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

/****************************** */
/** サブキャンバス表示・ctx等取得 ** */
/******************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_canvas_show",
    message0: "赤外線アレイセンサデータ表示キャンバスを表示",
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "ディスプレイエリアにAMG8833データ表示用キャンバスを作成・表示します。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_canvas_show"] = function (
  block,
  generator
) {
  var code = `const _grideye_canvas = document.createElement('canvas');
_grideye_canvas.setAttribute('width', 8);
_grideye_canvas.setAttribute('height', 8);
_grideye_canvas.className = 'grideye_canvas';
document.getElementById('display_area').appendChild(_grideye_canvas);
const _grideye_ctx = _grideye_canvas.getContext('2d', {willReadFrequently: true});
const _grideye_imgData = _grideye_ctx.createImageData(8, 8);
`;
  return code;
};

/********************************************** */
/** Draw IR Array Data to Image Data ** */
/********************************************** */

Blockly.defineBlocksWithJsonArray([
  {
    type: "draw_grideyedata",
    message0:
      "赤外線アレイセンサ画像表示 %1 温度データ %2 温度範囲上限 %3 %4 温度範囲下限 %5 %6",
    args0: [
      {
        type: "input_dummy",
      },
      {
        type: "input_value",
        name: "amg8833data",
        check: "Array",
        align: "RIGHT",
      },
      {
        type: "field_colour",
        name: "color_high",
        colour: "#ff0000",
      },
      {
        type: "input_value",
        name: "temp_high",
        check: "Number",
        align: "RIGHT",
      },
      {
        type: "field_colour",
        name: "color_low",
        colour: "#3333ff",
      },
      {
        type: "input_value",
        name: "temp_low",
        check: "Number",
        align: "RIGHT",
      },
    ],
    inputsInline: false,
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "AMG8833の温度データを、画像としてキャンバスに描画します。「着色」をチェックすると、温度範囲で設定されている色をつけて表示します。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["draw_grideyedata"] = function (
  block,
  generator
) {
  var value_amg8833data = Blockly.JavaScript.valueToCode(
    block,
    "amg8833data",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var colour_color_high = block.getFieldValue("color_high");
  var value_temp_high = Blockly.JavaScript.valueToCode(
    block,
    "temp_high",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var colour_color_low = block.getFieldValue("color_low");
  var value_temp_low = Blockly.JavaScript.valueToCode(
    block,
    "temp_low",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var functionName = Blockly.JavaScript.provideFunction_("_mapVal", [
    "const " +
      Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      " = (val, inMin, inMax, outMin, outMax) => {",
    `return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;`,
    "}",
  ]);
  // 温度カラー
  let hr, hg, hb, lr, lg, lb;
  hr = "0x" + colour_color_high.slice(1, 3);
  hg = "0x" + colour_color_high.slice(3, 5);
  hb = "0x" + colour_color_high.slice(5, 7);
  lr = "0x" + colour_color_low.slice(1, 3);
  lg = "0x" + colour_color_low.slice(3, 5);
  lb = "0x" + colour_color_low.slice(5, 7);
  var code = `  const _color_range = [[${lr}, ${hr}], [${lg}, ${hg}], [${lb}, ${hb}]];
  let _grideye_data = ${value_amg8833data};//読み取りブロックを入力に直接接続できるようにする
  for (let raw = 0; raw < _grideye_canvas.height; raw++) {
      for (let col = 0; col < _grideye_canvas.width; col++) {
          for (let rgb = 0; rgb < 3; rgb++) {
              let pixel = ${functionName}(_grideye_data[raw][col], ${value_temp_low}, ${value_temp_high}, _color_range[rgb][0], _color_range[rgb][1]);
              _grideye_imgData.data[((raw * _grideye_canvas.width * 4) + col * 4) + rgb] = pixel;
          }
          _grideye_imgData.data[((raw * _grideye_canvas.width * 4) + col * 4) + 3] = 0xff;
      }
  }
  _grideye_ctx.putImageData(_grideye_imgData, 0, 0);
`;
  return code;
};

/**************************** */
/** Teachable Machine を開始** */
/**************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "teachable_machine",
    message0: "TensorFlow.jsによる画像分類器の準備",
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "TensorFlow.js に学習済モデル MobileNet, クラス分類器 KNN Classifier を読み込んで、画像認識（分類）を行う準備をします。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["teachable_machine"] = function (
  block,
  generator
) {
  Blockly.JavaScript.provideFunction_("import_ts", [
    `const _tf = require('@tensorflow/tfjs-node')`,
  ]);
  Blockly.JavaScript.provideFunction_("import_mobilenet", [
    `const _mobilenet = require('@tensorflow-models/mobilenet');`,
  ]);
  Blockly.JavaScript.provideFunction_("import_knn", [
    `const _knnClassifier = require('@tensorflow-models/knn-classifier');`,
  ]);
  var code = `  const _net = await _mobilenet.load({ version: 1, alpha: 0.25 }); // 高速・低精度
const _classifier = _knnClassifier.create();
console.log(_tf.getBackend());
`;
  return code;
};
/************************* */
/** GridEye で推論を行う ** */
/************************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_predict_class",
    message0: "赤外線アレイセンサの画像で推論を行う",
    inputsInline: true,
    output: "Number",
    tooltip:
      "キャンバスに表示されたAMG8833の画像を元に画像分類の推論を行います。推論の結果として定義済みのラベルを返します。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_predict_class"] = function (
  block,
  generator
) {
  var functionName = Blockly.JavaScript.provideFunction_(
    // left output にするための関数化
    "_predictClass",
    [
      `if (_confidence === undefined) var _confidence;`,
      `const ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_} = async (img, clsfr, mblnet) => {`,
      `if (clsfr.getNumClasses() > 0) {`,
      `const result = await clsfr.predictClass(mblnet.infer(img, 'conv_preds'));`,
      `_confidence = result.confidences[result.label];`,
      `return result.label;`,
      `}`,
      `else return 0;`,
      `}`,
    ]
  );
  var code = `await ${functionName}(_grideye_canvas, _classifier, _net)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
/******************************************** */
/** ラベルをつけて Example をデータセットに追加 ** */
/******************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "grideye_add_example",
    message0: "赤外線アレイセンサの画像にラベル %1 をつけてデータセットへ追加",
    args0: [
      {
        type: "input_value",
        name: "class_id",
        check: "Number",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip:
      "キャンバスに表示されているAMG8833の画像にラベル（クラス名）をつけてデータセットへ追加します。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["grideye_add_example"] = function (
  block,
  generator
) {
  var value_class_id = Blockly.JavaScript.valueToCode(
    block,
    "class_id",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `_classifier.addExample (_net.infer(_grideye_canvas, true), ${value_class_id});`;
  return code;
};
/*************************** */
/** 学習したクラスを文字列化 ** */
/*************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "tensorset_stringify",
    message0: "学習したクラスデータセットを文字列に変換",
    output: null,
    tooltip:
      "学習したクラスデータセットを文字列に変換して保存等ができるようにします。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["tensorset_stringify"] = function (
  block,
  generator
) {
  var code = `JSON.stringify( Object.entries(_classifier.getClassifierDataset()).map(([label, data])=>[label, Array.from(data.dataSync()), data.shape]) )`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
/***************************************** */
/** jsonをデータセットに戻して分類器にセット ** */
/***************************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "tensorset_parse",
    message0: "クラスデータ文字列 %1 を画像分類器にセット",
    args0: [
      {
        type: "input_value",
        name: "class_data_json",
        check: "String",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    tooltip: "JSONテキストをパースして画像分類器に戻します。",
    helpUrl: "",
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["tensorset_parse"] = function (
  block,
  generator
) {
  var value_class_data_json = Blockly.JavaScript.valueToCode(
    block,
    "class_data_json",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `_classifier.setClassifierDataset( Object.fromEntries( JSON.parse(${value_class_data_json}).map(([label, data, shape])=>[label, _tf.tensor(data, shape)]) ) );`;
  return code;
};

// amg8833用温度ブロック（ツールボックス上非表示）
Blockly.defineBlocksWithJsonArray([
  {
    type: "temp",
    message0: "%1",
    args0: [
      {
        type: "field_slider",
        name: "temp",
        value: 15,
        min: 0,
        max: 40,
        precision: 1,
      },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "",
    helpUrl: "",
    style: "math_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["temp"] = function (block, generator) {
  var number_temp = block.getFieldValue("temp");
  var code = `${number_temp}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/********* */
/** BME280 */
/********* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "bme280_init",
    tooltip:
      "温湿度・気圧センサ BME280 を開き、使用できるようにします。I2C アドレスはモジュールにより異なる場合があります。",
    helpUrl: "",
    message0:
      "温湿度・気圧センサ（アドレス：  %1  ）を %2 として開いて初期化 %3",
    args0: [
      {
        type: "field_dropdown",
        name: "addr",
        options: [
          ["0x76", "0x76"],
          ["0x77", "0x77"],
        ],
      },
      {
        type: "field_variable",
        name: "bme280",
        variable: "BME280センサ",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    helpUrl: "",
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["bme280_init"] = function (
  block,
  generator
) {
  var dropdown_addr = block.getFieldValue("addr");
  const variable_bme280 = generator.getVariableName(
    block.getFieldValue("bme280")
  );
  Blockly.JavaScript.provideFunction_("import_bme280", [
    `const {BME280} = require('@necora/bme280');`,
  ]);
  const code = `${variable_bme280} = new BME280();
  await ${variable_bme280}.init(${settings.data.i2cdev}, ${dropdown_addr});\n`;
  return code;
};
Blockly.defineBlocksWithJsonArray([
  {
    type: "bme280_data",
    message0: "温湿度・気圧センサ %1 の環境データ（リスト） %2",
    tooltip:
      "環境センサーBME280から環境データをリスト形式で取得します。1:気温（摂氏）、2:湿度（％）、3:気圧（hPa）です。",
    helpUrl: "",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: "Array",
    style: "sensor_blocks",
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["bme280_data"] = function (
  block,
  generator
) {
  // const value_handle = generator.getVariableName(block.getFieldValue("handle"));
  const value_handle = generator.valueToCode(
    block,
    "handle",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  const code = `await ${value_handle}.readSensorData()`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
// BME280との接続を閉じる
Blockly.defineBlocksWithJsonArray([
  {
    type: "bme280_close",
    tooltip: "",
    helpUrl: "",
    message0: "温湿度・気圧センサ %1 との接続を閉じる %2",
    args0: [
      {
        type: "input_value",
        name: "handle",
        check: "Number",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["bme280_close"] = function (
  block,
  generator
) {
  const value_handle = generator.valueToCode(
    block,
    "handle",
    javascript.Order.ATOMIC
  );
  const code = `await ${value_handle}.close();\n`;
  return code;
};

/*********************************** */
/*** サーボモータ (Hardware PWM 出力) ***/
/*********************************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "servo_start",
    tooltip: "使用できる GPIO 番号は次のコマンドで調査 : $ pinctl | grep PWM",
    helpUrl: "",
    message0: "サーボ出力を開始 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["servo_start"] = function (
  block,
  generator
) {
  Blockly.JavaScript.provideFunction_("require_servo", [
    `const {SERVO} = require('@necora/servo');`,
  ]);

  const code = `const _servo = new SERVO(${settings.data.pwmchip}, ${settings.data.pwmchan});
await _servo.start();`;
  return code;
};
/*** 停止 */
Blockly.defineBlocksWithJsonArray([
  {
    type: "servo_stop",
    tooltip: "サーボモータ使用後は必ず停止してください。",
    helpUrl: "",
    message0: "サーボモータを停止 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["servo_stop"] = function (
  block,
  generator
) {
  const code = `await _servo.stop();`;
  return code;
};
/*** 回転 */
registerFieldAngle();
Blockly.defineBlocksWithJsonArray([
  {
    type: "servo_angle",
    tooltip: "",
    helpUrl: "",
    message0: "サーボモータの角度を %1 にする %2",
    args0: [
      {
        type: "field_angle",
        name: "ang",
        value: 90,
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "sensor_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["servo_angle"] = function (
  block,
  generator
) {
  const angle_ang = block.getFieldValue("ang");
  const code = `await _servo.angle(${angle_ang});`;
  return code;
};
