import { toolbox } from "./toolbox/index.js";
import "./blocks/index.js"; // カスタムブロック定義

class Settings {
  constructor() {
    this.data = {
      version: 3,
      wsfname: "workspace.xml",
      host: "localhost",
      port: "8889",
      gpiodev: "4",
      min_pulse: "130",
      max_pulse: "540",
      i2cdev: "1",
      mascot: "./img/necora.png",
    };
  }
  saveToLS() {
    let s = JSON.stringify(this.data);
    localStorage.setItem("necora_settings.json", s);
  }
  loadFromLS() {
    let s = localStorage.getItem("necora_settings.json");
    if (s) {
      let data = JSON.parse(s);
      if (data.version != this.data.version) {
        fukidashi(
          "バージョンアップのため設定が初期化されました。\n設定を確認してください。",
          10
        );
        showSettings();
      } else {
        this.data = data;
      }
    }
  }
}
var settings = new Settings();

//============ ユーティリティメソッド ===============

// サウンド再生
const playSound = (sound_name) => {
  const fpath = "./sound/" + sound_name + ".wav";
  const audioElement = new Audio(fpath);
  audioElement.addEventListener("canplaythrough", (event) => {
    audioElement.play();
  });
};

// OK,Cancel ２択のダイアログを表示
function confirmdlg(title, message, callback) {
  CustomDialog.show(title, message, {
    showOkay: true,
    onOkay: () => callback(true),
    showCancel: true,
    onCancel: () => callback(false),
  });
}
// 入力ダイアログ
function inputdlg(title, message, defaultValue, callback) {
  CustomDialog.show(title, message, {
    showInput: true,
    showOkay: true,
    onOkay: function () {
      callback(CustomDialog.inputField.value);
    },
    showCancel: true,
    onCancel: function () {
      callback(null);
    },
  });
  CustomDialog.inputField.value = defaultValue;
}

// 新規ワークスペース
const newWorkspace = () => {
  confirmdlg(
    "新規ワークスペース",
    "保存していない内容はすべて破棄されます。よろしいですか？",
    (okey) => {
      if (okey) {
        workspace.clear();
        settings.data.wsfname = "workspace.xml";
      }
    }
  );
};

// HTMLエンティティのエスケープ
function htmlEntities(str) {
  return String(str)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;"); //.replace(/&/g, '&amp;').replace(/ /g, '&nbsp;');
}
// ファイルパス連結
// Usage: path.join([path1, path2, path3, ...])
const path = {
  join: function (pathes) {
    const removeTrailingSlash = (path) =>
      path.endsWith("/") ? path.substr(0, path.length - 1) : path;
    let result = removeTrailingSlash(pathes[0]);
    for (let i = 1; i < pathes.length; i++) {
      result += "/" + removeTrailingSlash(pathes[i]);
    }
    return result;
  },
};

/******** コード生成関連 ********/
// 関数呼び出しに await を挿入（ブロック定義自体を上書き？）
javascript.javascriptGenerator.forBlock["procedures_callreturn"] = function (
  block,
  generator
) {
  // Call a procedure with a return value.
  var funcName = generator.nameDB_.getName(
    block.getFieldValue("NAME"),
    Blockly.PROCEDURE_CATEGORY_NAME
  );
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] =
      generator.valueToCode(block, "ARG" + i, javascript.Order.NONE) || "null";
  }
  var code = "await " + funcName + "(" + args.join(", ") + ")";
  return [code, javascript.Order.AWAIT];
};

// コード生成
function generateCode() {
  let code;
  try {
    code = javascript.javascriptGenerator
      .workspaceToCode(workspace)
      .replace(/(?<=^|\n)function \w+\(.*\)/g, "async $&"); // .replace: function に async 付加
  } catch (e) {
    window.alert("Javascript コード生成に失敗\n" + e.message);
    code = "";
  }
  return code;
}

// コードフォーマッティング
function formatCode(code) {
  return js_beautify(code, { indent_size: 2 });
}

// ブロックスクリプト実行
async function runCode(async) {
  document.activeElement.blur(); //実行ボタンからフォーカスを外す：エンターキー押下が悪さをするため
  let btnel = document.getElementById("runbtn");
  btnel.disabled = true;
  let code = generateCode();
  let AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  let fn = new AsyncFunction(code);
  await fn().catch((e) => {
    window.alert(e);
  });
  console.log("Code Execution done.");
  btnel.disabled = false;
}

// コードをダイアログで表示
function showCode() {
  const dialog = document.getElementById("codeDlg");
  const content = document.getElementById("code");
  const btn_close = document.getElementById("dlgClose");

  let code = generateCode(); // コード生成

  content.innerHTML = htmlEntities(formatCode(code));
  content.setAttribute("class", "language-javascript");
  Prism.highlightElement(content);

  dialog.showModal();

  const close_cb = () => {
    dialog.close();
    btn_close.removeEventListener("click", close_cb);
  };
  btn_close.addEventListener("click", close_cb);
}

// 設定ダイアログ表示
function showSettings() {
  const dialog = document.getElementById("settingsDlg");
  const btn_save = document.getElementById("settingsDlgSave");
  const btn_cancel = document.getElementById("settingsDlgCancel");

  const fld_host = document.getElementById("host");
  const fld_port = document.getElementById("port");
  const fld_gpiochip = document.getElementById("gpiodev");
  const fld_min_pulse = document.getElementById("min_pulse");
  const fld_max_pulse = document.getElementById("max_pulse");
  const fld_i2cdev = document.getElementById("i2cdev");
  const fld_mascot = document.getElementById("mascot");

  fld_host.value = settings.data.host;
  fld_port.value = settings.data.port;
  fld_gpiochip.value = settings.data.gpiodev;
  fld_min_pulse.value = settings.data.min_pulse;
  fld_max_pulse.value = settings.data.max_pulse;
  fld_i2cdev.value = settings.data.i2cdev;
  fld_mascot.value = settings.data.mascot;

  dialog.showModal();

  const close_cb = (e) => {
    if (e.srcElement.id == "settingsDlgSave") {
      // if (pybtn.checked) settings.data.lang = "py";
      // else settings.data.lang = "js";
      if (fld_host.value) settings.data.host = fld_host.value;
      if (fld_port.value) settings.data.port = fld_port.value;
      if (fld_gpiochip.value) settings.data.gpiodev = fld_gpiochip.value;
      if (fld_min_pulse.value) settings.data.min_pulse = fld_min_pulse.value;
      if (fld_max_pulse.value) settings.data.max_pulse = fld_max_pulse.value;
      if (fld_i2cdev.value) settings.data.i2cdev = fld_i2cdev.value;
      if (fld_mascot.value) settings.data.mascot = fld_mascot.value;
    }
    dialog.close();
    btn_save.removeEventListener("click", close_cb);
    btn_cancel.removeEventListener("click", close_cb);
  };

  btn_save.addEventListener("click", close_cb);
  btn_cancel.addEventListener("click", close_cb);
}

/******** ワークスペース入出力 ********/
// ワークスペースをローカルストレージに保存・読込
function wsToLocal() {
  let xml = Blockly.Xml.workspaceToDom(workspace);
  let xml_text = Blockly.utils.xml.domToText(xml);
  localStorage.setItem("workspace.xml", xml_text);
}
function wsFromLocal() {
  let xml_text = localStorage.getItem("workspace.xml");
  if (xml_text !== null) {
    if (xml_text.length != 0) {
      let xml = Blockly.utils.xml.textToDom(xml_text);
      Blockly.Xml.domToWorkspace(xml, workspace);
    }
  }
}
// ワークスペースをファイルからロード
async function loadWorkspaceFromFile() {
  try {
    if ("showOpenFilePicker" in window) {
      // showOpenFilePicker は使えるかしら？
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "necora Workspace XML Files",
            accept: {
              "text/xml": [".xml"],
            },
          },
        ],
      });
      const file = await handle.getFile();
      const xml_text = await file.text();
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(xml_text),
        workspace
      );
      settings.data.wsfname = file.name;
    } else {
      throw new Error("Chrome (Chromium) で実行してください。");
    }
  } catch (e) {
    // ユーザキャンセルなどもこっち
    console.log(e);
  }
}
// ワークスペースをファイルに保存
async function saveWorkspaceAs() {
  try {
    if ("showSaveFilePicker" in window) {
      // showSaveFilePicker は使える？
      const xml_text = Blockly.utils.xml.domToText(
        Blockly.Xml.workspaceToDom(workspace)
      );
      const handle = await window.showSaveFilePicker({
        suggestedName: settings.data.wsfname,
        types: [
          {
            description: "necora Workspace XML Files",
            accept: {
              "text/xml": [".xml"],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(xml_text);
      await writable.close();
      settings.data.wsfname = handle.name;
      console.log("File saved successfully.");
    } else {
      throw new Error("Chrome (Chromium) で実行してください。");
    }
  } catch (error) {
    console.error(error);
  }
}

/******** 各種イベントリスナ ********/
// ウィンドウロード時実行
window.onload = () => {
  // 設定復元
  settings.loadFromLS();
  // loadSettingsFromLS();
  // ワークスペース復元
  wsFromLocal();
  // // 背景canvas
  canvasBgImg(settings.data.mascot, -1, -1);
};
// ウィンドウアンロード時実行
window.addEventListener("beforeunload", () => {
  // ワークスペース記憶
  wsToLocal();
  // 設定記憶
  settings.saveToLS();
  // saveSettingsToLS();
});

/******** DOM 操作 ********/
//背景canvasとマスコットの準備
function canvasBgImg(imgSrc, x, y) {
  //x,y == -1: center or middle
  let el = document.getElementById("canvas_bg");
  let ctx = el.getContext("2d");
  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, 480, 360);
  let img = new Image();
  img.src = imgSrc;
  img.onload = () => {
    if (x < 0) {
      //センタリング
      let w = img.width;
      if (w >= 480) x = 0;
      else x = Math.floor((480 - w) / 2);
    }
    if (y < 0) {
      //縦中寄せ
      let h = img.height;
      if (h >= 360) y = 0;
      else y = Math.floor((360 - h) / 2);
    }
    ctx.drawImage(img, x, y);
  };
}

/******** ブロックプログラムから呼び出される関数 ********/
// フキダシ
let fdTimeoutID = null;
let fdRecentBox = null;
function fukidashi(text, sec) {
  // Canvas Context
  const context = document.getElementById("canvas").getContext("2d");
  // 吹き出しを消去する関数
  const clearFd = (x, y, w, h) => context.clearRect(x, y, w, h);
  // 前回の思い出を忘れる
  if (fdRecentBox !== null) {
    clearFd(fdRecentBox.x, fdRecentBox.y, fdRecentBox.w, fdRecentBox.h);
    clearTimeout(fdTimeoutID);
    fdRecentBox = null;
  }

  // 基本設定
  let rtopX = 170; // フキダシ右上 X座標
  let rtopY = 40; // フキダシ右上 Y座標
  let boxWidth = 140;
  let padding = 5;
  let radius = 5; // 円弧の半径

  // 吹き出しの背景色
  context.fillStyle = "#b7e6ff";

  // テキスト設定
  let limitedWidth = boxWidth - padding * 2;
  let size = 14;
  context.font = size + "px ''";

  // テキスト調整　行に分解
  let lineTextList = text.split("\n");
  let newLineTextList = [];
  lineTextList.forEach((lineText) => {
    if (context.measureText(lineText).width > limitedWidth) {
      let characterList = lineText.split(""); // 1文字ずつ分割
      let preLineText = "";
      lineText = "";
      characterList.forEach((character) => {
        lineText += character;
        if (context.measureText(lineText).width > limitedWidth) {
          newLineTextList.push(preLineText);
          lineText = character;
        }
        preLineText = lineText;
      });
    }
    newLineTextList.push(lineText);
  });
  let lineLength = newLineTextList.length;

  // 角丸
  let width = boxWidth; // 枠の幅
  let height = size * lineLength + padding * 3; // 枠の高さ
  let toRadianCoefficient = Math.PI / 180; // 角度からラジアンへの変換係数
  // 角丸原点（左上座標）
  let boxOrigin = {
    x: rtopX - width,
    y: rtopY,
  };
  // 円弧から円弧までの直線は自動で引かれます、角度は回り方によって変わります。
  // arc(中心x, 中心y, 半径, 開始角度, 終了角度, 反時計回り)
  context.beginPath();
  context.arc(
    boxOrigin.x + radius,
    boxOrigin.y + radius,
    radius,
    180 * toRadianCoefficient,
    270 * toRadianCoefficient,
    false
  ); // 左上
  context.arc(
    boxOrigin.x + width - radius,
    boxOrigin.y + radius,
    radius,
    270 * toRadianCoefficient,
    0,
    false
  ); // 右上
  context.arc(
    boxOrigin.x + width - radius,
    boxOrigin.y + height - radius,
    radius,
    0,
    90 * toRadianCoefficient,
    false
  ); // 右下
  context.arc(
    boxOrigin.x + radius,
    boxOrigin.y + height - radius,
    radius,
    90 * toRadianCoefficient,
    180 * toRadianCoefficient,
    false
  ); // 左下
  context.closePath();
  context.fill();

  // 矢印（ヒゲ）
  let arrow = {
    x: rtopX - width / 2 + 40,
    y: rtopY + height + 10,
    width: 10,
    height: 10,
  };
  context.beginPath();
  context.moveTo(arrow.x, arrow.y);
  context.lineTo(arrow.x, arrow.y - arrow.height);
  context.lineTo(arrow.x - arrow.width, arrow.y - arrow.height);
  context.fill();

  // テキスト描画
  context.fillStyle = "#000000";
  newLineTextList.forEach((lineText, index) => {
    context.fillText(
      lineText,
      boxOrigin.x + padding,
      boxOrigin.y + padding + size * (index + 1)
    );
  });

  // 描画した吹き出しの位置情報を保存
  fdRecentBox = {
    x: boxOrigin.x,
    y: boxOrigin.y,
    w: width,
    h: height + arrow.height,
  };
  // 指定時間後に消去（0以下で自動消去なし）
  if (sec > 0) {
    fdTimeoutID = setTimeout(() => {
      clearFd(boxOrigin.x, boxOrigin.y, width, height + arrow.height);
    }, sec * 1000);
  }

  // return [boxOrigin.x, boxOrigin.y, width, height+arrow.height];
  // https://qiita.com/horikeso/items/95595f379a8dfa63c34a
}

// スリープ
// const sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000));

// GPIOモジュールリセット
function rgreset() {
  if (typeof require === "function") require("@necora/rgpio").stop();
}

/******** モジュール ********/
// 一部の関数/変数をエクスポート
export {
  showSettings,
  showCode,
  runCode,
  newWorkspace,
  loadWorkspaceFromFile,
  saveWorkspaceAs,
  fukidashi,
  playSound,
  rgreset,
  settings,
  fdRecentBox,
};

//============ 以下、Blockly 表示関連 =================================================================================

//============ カスタマイズ ここから ===============
// カスタムブロックカラー定義
Blockly.utils.colour.setHsvSaturation(0.55);
Blockly.utils.colour.setHsvValue(0.75);
// Blockly.HSV_SATURATION = 0.55;
// Blockly.HSV_VALUE = 0.75;
var gpio_color = "0";
var sensor_color = "20";
var multimedia_color = "240";
var network_color = "340";
var special_color = "40";
var rp2_color = "180";
// テーマ
var theme = Blockly.Theme.defineTheme("necora", {
  base: Blockly.Themes.Classic,
  startHats: true,
  fontStyle: {
    family: "VL PGothic",
    style: "regular",
  },
  componentStyles: {
    toolboxBackgroundColour: "aliceblue",
    flyoutBackgroundColour: "lavender",
    toolboxForegroundColour: "white",
    flyoutForegroundColour: "steelblue",
  },
  blockStyles: {
    gpio_blocks: {
      colourPrimary: gpio_color,
    },
    sensor_blocks: {
      colourPrimary: sensor_color,
    },
    multimedia_blocks: {
      colourPrimary: multimedia_color,
    },
    colour_blocks: {
      colourPrimary: multimedia_color,
    },
    network_blocks: {
      colourPrimary: network_color,
    },
    special_blocks: {
      colourPrimary: special_color,
    },
    rp2_blocks: {
      colourPrimary: rp2_color,
    },
  },
  categoryStyles: {
    gpio_category: {
      colour: gpio_color,
    },
    sensor_category: {
      colour: sensor_color,
    },
    multimedia_category: {
      colour: multimedia_color,
    },
    network_category: {
      colour: network_color,
    },
    special_category: {
      colour: special_color,
    },
    rp2_category: {
      colour: rp2_color,
    },
  },
});

// ビルトインブロックの変な日本語をカスタマイズ
Blockly.Msg["CONTROLS_IF_MSG_THEN"] = "ならば";
Blockly.Msg["CONTROLS_REPEAT_INPUT_DO"] = "";
Blockly.Msg["CONTROLS_FOR_TITLE"] =
  "%1 を %2 から %3 まで %4 ずつ増やし（減らし）て";
Blockly.Msg["CONTROLS_FOR_TOOLTIP"] =
  "インデックス番号を決められた数ずつ増やし（減らし）ながら、ステートメントを実行します。";
Blockly.Msg["CONTROLS_FOREACH_TITLE"] = "リスト%2の各%1について";
Blockly.Msg["CONTROLS_FOREACH_TOOLTIP"] =
  "リストの各項目について、その項目を変数「項目」としてステートメントを実行します。";
Blockly.Msg["MATH_CHANGE_TITLE"] = "変数 %1 を %2 増やす";
Blockly.Msg["VARIABLES_SET"] = "変数 %1 を %2 にする";
// Blockly.Msg["TEXT_PRINT_TITLE"] = "ダイアログに %1 を表示";
Blockly.Msg["LOGIC_BOOLEAN_FALSE"] = "偽";
Blockly.Msg["LOGIC_BOOLEAN_TOOLTIP"] = "真 または 偽 を返します。";
Blockly.Msg["LOGIC_BOOLEAN_TRUE"] = "真";

// ツールボックスのカスタマイズ
class CustomCategory extends Blockly.ToolboxCategory {
  /** Constructor for a custom category. @override */
  constructor(categoryDef, toolbox, opt_parent) {
    super(categoryDef, toolbox, opt_parent);
  }
  /** @override */
  addColourBorder_(colour) {
    this.rowDiv_.style.backgroundColor = colour;
  }
  /** @override */
  setSelected(isSelected) {
    // We do not store the label span on the category, so use getElementsByClassName.
    var labelDom = this.rowDiv_.getElementsByClassName(
      "blocklyToolboxCategoryLabel"
    )[0];
    if (isSelected) {
      // Change the background color of the div to white.
      this.rowDiv_.style.backgroundColor = "white";
      // Set the colour of the text to the colour of the category.
      labelDom.style.color = this.colour_;
      this.iconDom_.style.color = this.colour_;
    } else {
      // Set the background back to the original colour.
      this.rowDiv_.style.backgroundColor = this.colour_;
      // Set the text back to white.
      labelDom.style.color = "white";
      this.iconDom_.style.color = "white";
    }
    // This is used for accessibility purposes.
    Blockly.utils.aria.setState(
      /** @type {!Element} */ (this.htmlDiv_),
      Blockly.utils.aria.State.SELECTED,
      isSelected
    );
  }
}
Blockly.registry.register(
  Blockly.registry.Type.TOOLBOX_ITEM,
  Blockly.ToolboxCategory.registrationName,
  CustomCategory,
  true
);

//============ カスタマイズ ここまで ===============

//============ Blockly 定義 ======================
// Toolbox カスタムカテゴリ追加
// toolbox.contents = toolbox.contents.concat(custom_categories);

// Blockly 表示
var blocklyArea = document.getElementById("blocklyArea");
var blocklyDiv = document.getElementById("blocklyDiv");

var workspace = Blockly.inject("blocklyDiv", {
  media: "./node_modules/blockly/media/",
  toolbox: toolbox,
  theme: theme,
  renderer: "thrasos",

  scrollbars: true,
  grid: {
    spacing: 20,
    length: 1,
    colour: "#888", //888
    snap: true,
  },
  zoom: { startScale: 1.0, controls: true },
  trashcan: true,
});
// window リサイズ時に workspace もリサイズ
var onresize = function (e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  // Position blocklyDiv over blocklyArea.
  blocklyDiv.style.left = x + "px";
  blocklyDiv.style.top = y + "px";
  blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
  blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
  Blockly.svgResize(workspace);
};
window.addEventListener("resize", onresize, false);
onresize();
Blockly.svgResize(workspace);
