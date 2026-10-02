import { settings } from "../index.mjs";

// Color Picker : ビルトインのブロックがウチの環境でどうもうまく働かないので自作
registerFieldColour();
Blockly.defineBlocksWithJsonArray([
  {
    type: "colour_picker",
    message0: "%1",
    output: "Colour",
    tooltip: "パレットから色を選んでください",
    helpUrl: "",
    style: "colour_blocks",
    args0: [
      {
        type: "field_colour",
        name: "COLOUR",
        colour: "#ff0000",
      },
    ],
  },
]);
javascript.javascriptGenerator.forBlock["colour_picker"] = function (
  block,
  generator,
) {
  const code = generator.quote_(block.getFieldValue("COLOUR"));
  return [code, javascript.Order.ATOMIC];
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "coupycolor_picker",
    message0: "クーピー30色: %1",
    output: "Colour",
    tooltip: "サクラクーピーペンシル30色のカラーチャートによる",
    helpUrl:
      "https://www.craypas.co.jp/products/painting-school/013/0031/182945.html#color-chart",
    style: "colour_blocks",
    args0: [
      {
        type: "field_colour",
        name: "COLOUR",
        colour: "#E281A0",
        colourOptions: [
          "#F5ED68",
          "#F6E92B",
          "#EEB818",
          "#EA9D13",
          "#F2C198",
          "#FBF5C5",
          "#7E422A",
          "#B8591F",
          "#CD9711",
          "#4F371D",
          "#D83A2F",
          "#D61242",
          "#E281A0",
          "#A41759",
          "#E0BED6",
          "#1D2973",
          "#1794CE",
          "#0FA275",
          "#8ABC29",
          "#0C834D",
          "#0C834D",
          "#0A68AE",
          "#096CB0",
          "#0F3460",
          "#9CA5A4",
          "#277565",
          "#3F3939",
          "#FFFFFF",
          "#AE901E",
          "#A5AEB3",
        ],
        colourTitles: [
          "レモンいろ",
          "きいろ",
          "やまぶきいろ",
          "だいだいいろ",
          "うすだいだい",
          "たまごいろ",
          "ちゃいろ",
          "あかちゃいろ",
          "おうどいろ",
          "こげちゃいろ",
          "しゅいろ",
          "あか",
          "ももいろ",
          "あかむらさき",
          "うすむらさき",
          "むらさき",
          "みずいろ",
          "エメラルドいろ",
          "きみどり",
          "みどり",
          "ふかみどり",
          "あお",
          "ぐんじょういろ",
          "あいいろ",
          "ねずみいろ",
          "はいみどり",
          "くろ",
          "しろ",
          "きんいろ",
          "ぎんいろ",
        ],
        columns: 5,
      },
    ],
  },
]);
javascript.javascriptGenerator.forBlock["coupycolor_picker"] = function (
  block,
  generator,
) {
  const code = generator.quote_(block.getFieldValue("COLOUR"));
  return [code, javascript.Order.ATOMIC];
};

/************ */
/** サウンド ** */
/************ */
Blockly.defineBlocksWithJsonArray([
  {
    type: "play_sound",
    tooltip: "音を鳴らします。",
    helpUrl: "",
    message0: "%1 の音を鳴らす %2",
    args0: [
      {
        type: "field_dropdown",
        name: "sound",
        options: [["ニャー", "meow"]],
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["play_sound"] = function (block) {
  const dropdown_sound = block.getFieldValue("sound");
  const code = `necora.playSound('${dropdown_sound}');\n`;
  return code;
};

/************** */
/** VoiceVox ** */
/************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "voicevox",
    tooltip:
      "無料で使える中品質なテキスト読み上げ・歌声合成ソフトウェア「VOICEVOX」を使用しておしゃべりします。\n音声の生成には VOICEVOX が起動している必要があります。\n音声の生成には時間がかかります。「キャッシュ」にチェックを入れると、同一文章の２回目以降の読み上げが高速になります。\n「キャッシュ」のチェックを外すと音声を強制的に再生成します。",
    helpUrl: "",
    message0: "%1 で %2 と言う %3 キャッシュ %4",
    args0: [
      {
        type: "field_dropdown",
        name: "speacker",
        options: [
          ["ずんだもん（ノーマル）", "3"],
          ["ずんだもん（ささやき）", "22"],
          ["四国めたん（あまあま）", "0"],
        ],
      },
      {
        type: "input_value",
        name: "text",
        check: "String",
      },
      {
        type: "field_checkbox",
        name: "cache",
        checked: true,
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["voicevox"] = function (
  block,
  generator,
) {
  const dropdown_speacker = block.getFieldValue("speacker");
  const value_text = generator.valueToCode(
    block,
    "text",
    javascript.Order.ATOMIC,
  );
  const checkbox_cache = block.getFieldValue("cache");
  Blockly.JavaScript.provideFunction_("require_voicevox", [
    `const voicevox = require('./neco/voicevox.cjs');`,
  ]);
  const cache_value = checkbox_cache === "TRUE" ? "true" : "false";

  const code = `const fpath = await voicevox(${value_text}, ${dropdown_speacker}, ${cache_value});
await necora.playSoundFile(fpath);
`;
  return code;
};

/****************** */
/** ゆっくりボイス ** */
/****************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "yukkuri",
    tooltip:
      "日本語音声合成プログラム「AquesTalk Player」を使用してしゃべります。",
    helpUrl: "",
    message0: "ゆっくりで %1 とおしゃべりする %2",
    args0: [
      {
        type: "input_value",
        name: "text",
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
    style: "multimedia_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["yukkuri"] = function (
  block,
  generator,
) {
  const value_text = generator.valueToCode(
    block,
    "text",
    javascript.Order.NONE,
  );
  Blockly.JavaScript.provideFunction_("require_execFileAsync", [
    'const execFileAsync = require("util").promisify(require("child_process").execFile);',
  ]);
  const code = `await execFileAsync("/Applications/AquesTalkPlayer.app/Contents/MacOS/AquesTalkPlayer -T ${value_text}", { shell: true });\n`;
  return code;
};
// ./bin/aquestalkpi/AquesTalkPi -g 50 ${value_text} | aplay
/******************** */
/** Face Detection ** */
/******************** */
Blockly.Blocks["face_init"] = {
  init: function () {
    this.appendDummyInput().appendField("顔検出を開始");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle("multimedia_blocks");
    this.setTooltip(
      "Face Detection モデルによる顔検出を開始します。最初に実行してください",
    );
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["face_init"] = function (
  block,
  generator,
) {
  Blockly.JavaScript.provideFunction_("require_tfjs", [
    `const tf = require('@tensorflow/tfjs');`,
  ]);
  Blockly.JavaScript.provideFunction_("import_backend", [
    `const backend = require('@tensorflow/tfjs-backend-${settings.data.tfjs_backend}');`,
  ]);
  Blockly.JavaScript.provideFunction_("require_faceDetection", [
    `const faceDetection = require('@tensorflow-models/face-detection');`,
  ]);
  var code = `const videoEl = document.createElement("video");
videoEl.setAttribute('autoplay', '');
videoEl.setAttribute('muted', '');
videoEl.style.visibility = 'hidden';
videoEl.width = 160;
videoEl.height = 120;
videoEl.style.width = '160px';
videoEl.style.height = '120px';
videoEl.style.position = 'absolute';
videoEl.style.right = '12px';
videoEl.style.bottom = '12px';
videoEl.style.border = '4px solid white';
videoEl.style.borderRadius = '4px';
document.getElementById('display_area').appendChild(videoEl);
const displaySize = { width: videoEl.width, height: videoEl.height };
const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: displaySize });
videoEl.srcObject = stream;
await tf.setBackend('${settings.data.tfjs_backend}');
const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
const detectorConfig = {
  runtime: 'tfjs',
}
const detector = await faceDetection.createDetector(model, detectorConfig);
`;
  return code;
};
Blockly.Blocks["face_display"] = {
  init: function () {
    this.appendDummyInput().appendField("顔検出ビデオを表示");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle("multimedia_blocks");
    this.setTooltip(
      "カメラの映像を画像エリアに表示します。必須ではないブロックです。",
    );
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["face_display"] = function (
  block,
  generator,
) {
  var code = `videoEl.style.visibility = 'visible';
const overlay = document.createElement('canvas');
overlay.setAttribute('width', videoEl.width);
overlay.setAttribute('height', videoEl.height);
overlay.style.width = '160px';
overlay.style.height = '120px';
overlay.style.position = 'absolute';
overlay.style.right = '12px';
overlay.style.bottom = '12px';
overlay.style.border = '4px solid white';
overlay.style.borderRadius = '4px';
document.getElementById('display_area').appendChild(overlay);
const overlay_ctx = overlay.getContext('2d');
`;
  return code;
};
Blockly.Blocks["face_detect"] = {
  init: function () {
    this.appendValueInput("preditions")
      .setCheck("Variable")
      .appendField("顔検出を実行し、結果をリスト");
    this.appendDummyInput().appendField("に代入する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "顔検出を実行します。検出結果はリストになります。顔の位置は「顔の座標」ブロックで参照します。",
    );
    this.setHelpUrl("");
    this.setStyle("multimedia_blocks");
  },
};
javascript.javascriptGenerator.forBlock["face_detect"] = function (
  block,
  generator,
) {
  var value_preditions = Blockly.JavaScript.valueToCode(
    block,
    "preditions",
    javascript.Order.ATOMIC,
  );
  var code = `${value_preditions} = await detector.estimateFaces(videoEl);\n`;
  return code;
};
Blockly.Blocks["face_location"] = {
  init: function () {
    this.appendValueInput("prediction").setCheck("Array").appendField("顔");
    this.appendDummyInput()
      .appendField("の")
      .appendField(
        new Blockly.FieldDropdown([
          ["左座標", "box.xMin"],
          ["上座標", "box.yMin"],
          ["右座標", "box.xMax"],
          ["下座標", "box.yMax"],
        ]),
        "member",
      );
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip("顔検出結果の座標を参照します。");
    this.setHelpUrl("");
    this.setStyle("multimedia_blocks");
  },
};
javascript.javascriptGenerator.forBlock["face_location"] = function (
  block,
  generator,
) {
  var value_prediction = Blockly.JavaScript.valueToCode(
    block,
    "prediction",
    javascript.Order.NONE,
  );
  var dropdown_member = block.getFieldValue("member");
  var code = `${value_prediction}.${dropdown_member}`;
  return [code, javascript.Order.NONE];
};
Blockly.Blocks["face_drawbox"] = {
  init: function () {
    this.appendValueInput("prediction").setCheck("Variable").appendField("顔");
    this.appendDummyInput()
      .appendField("を描画：")
      .appendField(new Blockly.FieldCheckbox("TRUE"), "with_landmark")
      .appendField("ランドマーク");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      "顔検出結果をビデオ画面に描画します。「ビデオを表示」ブロックが必要です。",
    );
    this.setHelpUrl("");
    this.setStyle("multimedia_blocks");
  },
};
javascript.javascriptGenerator.forBlock["face_drawbox"] = function (
  block,
  generator,
) {
  var value_prediction = Blockly.JavaScript.valueToCode(
    block,
    "prediction",
    javascript.Order.NONE,
  );
  var checkbox_with_landmark = block.getFieldValue("with_landmark") === "TRUE";
  var code = `overlay_ctx.clearRect(0, 0, displaySize.width, displaySize.height)
  overlay_ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  overlay_ctx.fillRect(${value_prediction}.box.xMin, ${value_prediction}.box.yMin, ${value_prediction}.box.width, ${value_prediction}.box.height);
  if (${checkbox_with_landmark}) {
    const landmarks = ${value_prediction}.keypoints;
    overlay_ctx.fillStyle = 'skyblue';
    for (let j = 0; j < landmarks.length; j++) {
        const x = landmarks[j].x;
        const y = landmarks[j].y;
        overlay_ctx.fillRect(x-2, y-2, 4, 4);
    }
  }
  `;
  return code;
};
