/******************* */
/** バイナリデータへ変換 */
/******************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "uint8array_from",
    tooltip:
      "数値・テキスト・配列などをバイナリデータ (Uint8Array) に変換します。",
    helpUrl: "",
    message0: "%1 をバイナリに変換 %2",
    args0: [
      {
        type: "input_value",
        name: "arrayLike",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: null,
    inputsInline: true,
    style: "list_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["uint8array_from"] = function (
  block,
  generator
) {
  const value_arraylike = generator.valueToCode(
    block,
    "arrayLike",
    javascript.Order.ATOMIC
  );
  const code = `Uint8Array.from(${value_arraylike})`;
  return [code, javascript.Order.ATOMIC];
};
/****************** */
/** 16進数▶10進数変換 */
/****************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "hextodec",
    message0: "0x %1",
    args0: [
      {
        type: "input_value",
        name: "hex",
        check: "String",
      },
    ],
    inputsInline: true,
    output: "Number",
    tooltip: "16進数を10進数に変換します。",
    helpUrl: "",
    style: "math_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["hextodec"] = function (
  block,
  generator
) {
  var value_hex = Blockly.JavaScript.valueToCode(
    block,
    "hex",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `parseInt (${value_hex}, 16)`;
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
python.pythonGenerator.forBlock["hextodec"] = function (block, generator) {
  var value_hex = Blockly.Python.valueToCode(
    block,
    "hex",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `int(${value_hex}, 16)`;
  return [code, Blockly.Python.ORDER_NONE];
};

/***************** */
/** 2進数▶10進数変換 */
/***************** */
Blockly.Blocks["bintodec"] = {
  init: function () {
    this.appendValueInput("bin").setCheck("String").appendField("0b");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip("２進数を10進数に変換します");
    this.setHelpUrl("");
    this.setStyle("math_blocks");
  },
};
javascript.javascriptGenerator.forBlock["bintodec"] = function (
  block,
  generator
) {
  var value_bin = Blockly.JavaScript.valueToCode(
    block,
    "bin",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `parseInt (${value_bin}, 2)`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
python.pythonGenerator.forBlock["bintodec"] = function (block, generator) {
  var value_bin = Blockly.Python.valueToCode(
    block,
    "bin",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `int(${value_bin}, 2)`;
  return [code, Blockly.Python.ORDER_NONE];
};

/******************* */
/** 文字コード▶文字変換 */
/******************* */
var ugjCodecharDefinition = {
  type: "codechar",
  message0: "コード %1 の文字",
  args0: [
    {
      type: "input_value",
      name: "code",
      check: "Number",
    },
  ],
  inputsInline: true,
  output: "String",
  tooltip: "文字コードを文字に変換します。",
  helpUrl: "",
  style: "text_blocks",
};
Blockly.Blocks["codechar"] = {
  init: function () {
    this.jsonInit(ugjCodecharDefinition);
  },
};
javascript.javascriptGenerator.forBlock["codechar"] = function (
  block,
  generator
) {
  var value_code = Blockly.JavaScript.valueToCode(
    block,
    "code",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `String.fromCharCode(${value_code})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
python.pythonGenerator.forBlock["codechar"] = function (block, generator) {
  var value_code = Blockly.Python.valueToCode(
    block,
    "code",
    Blockly.Python.ORDER_ATOMIC
  );
  var code = `chr(${value_code})`;
  return [code, Blockly.Python.ORDER_NONE];
};

/************* */
/** Soft Sleep */
/************* */
Blockly.defineBlocksWithJsonArray([
  {
    type: "sleep",
    message0: "%1 秒待つ",
    args0: [
      {
        type: "input_value",
        name: "sec",
        check: "Number",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    tooltip: "指定した秒数だけ処理を中断します。",
    helpUrl: "",
    style: "special_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["sleep"] = function (block, generator) {
  var value_sec = Blockly.JavaScript.valueToCode(
    block,
    "sec",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  // var functionName = Blockly.JavaScript.provideFunction_("_sleep", [
  //   "const " + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ + " = sec =>",
  //   "new Promise(r => setTimeout(r, sec * 1000));",
  // ]);
  Blockly.JavaScript.provideFunction_("import_sleep", 'const { _sleep } = require("@necora/sleep");');
  // var code = `await ${functionName}(${value_sec});\n`;
  var code = `await _sleep(${value_sec});\n`;
  return code;
};
python.pythonGenerator.forBlock["sleep"] = function (block, generator) {
  var value_sec = Blockly.Python.valueToCode(
    block,
    "sec",
    Blockly.Python.ORDER_ATOMIC
  );
  Blockly.Python.provideFunction_("import_sleep", ["from utime import sleep"]);
  var code = `sleep(${value_sec})\n`;
  return code;
};

/****************** */
/** 非同期即時関数 ** */
/****************** */
Blockly.defineBlocksWithJsonArray([
  {
    type: "async_iife",
    tooltip:
      "ステートメントを非同期で実行します。即時関数を生成するのでスコープに注意しましょう",
    helpUrl: "",
    message0: "非同期で実行 %1 %2 ▼ %3",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
      {
        type: "input_statement",
        name: "do",
      },
      {
        type: "input_dummy",
        name: "NAME2",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    style: "special_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["async_iife"] = function (
  block,
  generator
) {
  const statement_do = generator.statementToCode(block, "do");
  const code = `(async () => {
${statement_do}
})();
`;
  return code;
};

/**************************** */
/** Say while some seconds ** */
/**************************** */
Blockly.Blocks["canvas_say"] = {
  init: function () {
    this.appendValueInput("say").setCheck(null);
    this.appendDummyInput()
      .appendField("と")
      .appendField(new FieldSlider(2, 0, 30, 1), "sec")
      .appendField("秒言う ▼");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle("multimedia_blocks");
    this.setTooltip("キャンバスにフキダシを作ります。※非同期");
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["canvas_say"] = function (
  block,
  generator
) {
  var value_say = Blockly.JavaScript.valueToCode(
    block,
    "say",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_sec = block.getFieldValue("sec");
  var code = [
    `_necora.fukidashi(String(${value_say}), ${value_sec});`,
    "",
  ].join("\n");
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "prompt",
    tooltip:
      "質問をして答えを待ちます。入力欄でキーボードのエンターキーが入力されるか、チェックマークボタンが押されると実行されます。",
    helpUrl: "",
    message0: "%1 ときいて %2 を待つ %3 %4 ▼ %5",
    args0: [
      {
        type: "input_value",
        name: "ask",
        check: "String",
      },
      {
        type: "field_variable",
        name: "answer",
        variable: "答え",
      },
      {
        type: "input_dummy",
        name: "DUM1",
      },
      {
        type: "input_statement",
        name: "do",
      },
      {
        type: "input_dummy",
        name: "DUM2",
        align: "RIGHT",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "special_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["prompt"] = function (
  block,
  generator
) {
  const value_ask = generator.valueToCode(
    block,
    "ask",
    javascript.Order.ATOMIC
  );
  const variable_answer = generator.getVariableName(
    block.getFieldValue("answer")
  );
  const statement_do = generator.statementToCode(block, "do");
  const code = `_necora.fukidashi(${value_ask}, 0);
  _inputForm = document.getElementById('inputForm');
  _inputBox = document.getElementById('inputBox');
  _inputForm.style.display = 'inline-block';
  _inputBox.focus();
  const _inputFunc = async () => {
    if (_inputBox.value.length > 0) {
      ${variable_answer} = _inputBox.value;
      _inputForm.style.display = "none";
      _inputBox.value = '';
      document.getElementById('canvas').getContext('2d').clearRect(_necora.fdRecentBox.x,_necora.fdRecentBox.y,_necora.fdRecentBox.w,_necora.fdRecentBox.h);
      ${statement_do}
      console.log('Removing listener...');
      _inputForm.removeEventListener('submit', _inputFunc );
    }
  };
  _inputForm.addEventListener('submit', _inputFunc );
`;
  return code;
};

/***************************** */
/** Terminal'ish' text area ** */
/***************************** */
// Show terminal
Blockly.defineBlocksWithJsonArray([
  {
    type: "terminal_show",
    tooltip: "ターミナルっぽいテキスト表示エリア",
    helpUrl: "",
    message0: "ターミナルを表示 %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "special_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["terminal_show"] = function () {
  const code = `const _termEl = document.getElementById("terminal");
_termEl.style.display = "inline-block";\n`;
  return code;
};
// Write to terminal
Blockly.defineBlocksWithJsonArray([
  {
    type: "terminal_write",
    tooltip:
      "ターミナルっぽいテキスト表示エリアに文字を表示します。☑を入れると最後に改行を挿入します",
    helpUrl: "",
    message0: "ターミナルに %1 を表示 %2 改行 %3",
    args0: [
      {
        type: "input_value",
        name: "text",
      },
      {
        type: "field_checkbox",
        name: "return",
        checked: "TRUE",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    inputsInline: true,
    style: "special_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["terminal_write"] = function (
  block,
  generator
) {
  let value_text = generator.valueToCode(
    block,
    "text",
    javascript.Order.ATOMIC
  );
  const checkbox_return = block.getFieldValue("return");
  if (checkbox_return === "TRUE") value_text += " + '\\n'";
  const code = `_termEl.value += ${value_text};
_termEl.scrollTop = _termEl.scrollHeight;\n`;
  return code;
};

/******************* */
/** Create Button ** */
/******************* */
Blockly.Blocks["control_button"] = {
  init: function () {
    this.appendValueInput("label")
      .setCheck("String")
      .appendField("ボタンを作成：ラベル");
    this.appendValueInput("textcolor").setCheck("Colour").appendField("文字色");
    this.appendValueInput("bgcolor").setCheck("Colour").appendField("背景色");
    this.appendValueInput("title")
      .setCheck("String")
      .appendField("ツールチップ");
    this.appendStatementInput("do").setCheck(null);
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("▼");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      'ディスプレイカラムにボタンを作成し、クリックのイベントリスナを定義します。テキストデータをひとつ、"title"属性値として設定・取り出しが可能です。保存したデータはマウスオーバーで確認できます。'
    );
    this.setHelpUrl("");
    this.setStyle("special_blocks");
  },
};
javascript.javascriptGenerator.forBlock["control_button"] = function (
  block,
  generator
) {
  var value_label = Blockly.JavaScript.valueToCode(
    block,
    "label",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_textcolor = Blockly.JavaScript.valueToCode(
    block,
    "textcolor",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_bgcolor = Blockly.JavaScript.valueToCode(
    block,
    "bgcolor",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_title = Blockly.JavaScript.valueToCode(
    block,
    "title",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var statements_do = Blockly.JavaScript.statementToCode(block, "do");
  var code = [
    `( async () => {`,
    `let el = document.createElement('button');`,
    `el.innerText = ${value_label};`,
    `el.style.color = ${value_textcolor};`,
    `el.style.backgroundColor = ${value_bgcolor};`,
    `el.title = ${value_title};`,
    `el.className = 'toolbarButton ocgButton';`,
    `document.getElementById('dispColumn').appendChild(el);`,
    `el.addEventListener('click', async ev => {`,
    statements_do,
    `});`,
    `})();`,
    "",
  ].join("\n");
  return code;
};

/********************************* */
/** Save TextData to Local Storage */
/********************************* */
Blockly.Blocks["localstorage_save"] = {
  init: function () {
    this.appendValueInput("keyValue").setCheck("String");
    this.appendValueInput("keyName")
      .setCheck("String")
      .appendField("をローカルストレージ");
    this.appendDummyInput().appendField("に保存する");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setStyle("special_blocks");
    this.setTooltip(
      "テキストデータをローカルストレージに名前を付けて保存します。名前は半角アルファベットと数字だけで指定してください。"
    );
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["localstorage_save"] = function (
  block,
  generator
) {
  var value_keyvalue = Blockly.JavaScript.valueToCode(
    block,
    "keyValue",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var value_keyname = Blockly.JavaScript.valueToCode(
    block,
    "keyName",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `localStorage.setItem(${value_keyname}, ${value_keyvalue});\n`;
  return code;
};
/*********************************** */
/** Load Textdata from Local Storage */
/*********************************** */
Blockly.Blocks["localstorage_load"] = {
  init: function () {
    this.appendValueInput("keyName")
      .setCheck("String")
      .appendField("ローカルストレージ");
    this.appendDummyInput().appendField("の内容");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
    this.setStyle("special_blocks");
    this.setTooltip("ローカルストレージからテキストデータを読み込みます。");
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["localstorage_load"] = function (
  block,
  generator
) {
  var value_keyname = Blockly.JavaScript.valueToCode(
    block,
    "keyName",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var code = `localStorage.getItem(${value_keyname})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

/********************* */
/** Carriage Return ** */
/********************* */
Blockly.Blocks["text_cr"] = {
  init: function () {
    this.appendDummyInput().appendField("CR");
    this.setOutput(true, "String");
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
    this.setColour(Blockly.Msg.TEXTS_HUE);
    this.setTooltip("特殊記号（キャリッジリターン）");
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["text_cr"] = function (
  block,
  generator
) {
  var code = "'\\r'";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
python.pythonGenerator.forBlock["text_cr"] = function (block, generator) {
  var code = "'\\r'";
  return [code, Blockly.Python.ORDER_ATOMIC];
};
/*************** */
/** Line Feed ** */
/*************** */
Blockly.Blocks["text_lf"] = {
  init: function () {
    this.appendDummyInput().appendField("LF");
    this.setOutput(true, "String");
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
    this.setColour(Blockly.Msg.TEXTS_HUE);
    this.setTooltip("特殊記号（ラインフィード）");
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["text_lf"] = function (
  block,
  generator
) {
  var code = "'\\n'";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
/******* */
/** Null */
/******* */
Blockly.Blocks["text_null"] = {
  init: function () {
    this.appendDummyInput().appendField("NULL");
    this.setOutput(true, "String");
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
    this.setColour(Blockly.Msg.TEXTS_HUE);
    this.setTooltip("特殊記号（ヌル文字）");
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["text_null"] = function (
  block,
  generator
) {
  var code = "'\\0'";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
/********* */
/** Cursor */
/********* */
Blockly.Blocks["text_cursor"] = {
  init: function () {
    this.appendDummyInput().appendField("カーソル");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
    this.setColour(Blockly.Msg.TEXTS_HUE);
    this.setTooltip("特殊記号（カーソル）");
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["text_cursor"] = function (
  block,
  generator
) {
  var code = "'&#9611;'";
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

/******** 開発用ツール ********/
// console.log()
Blockly.defineBlocksWithJsonArray([
  {
    type: "console_log",
    tooltip: "デベロッパーツールを開いてコンソールにテキストを表示します",
    helpUrl: "",
    message0: "コンソールに %1 を表示 %2",
    args0: [
      {
        type: "input_value",
        name: "text",
        // check: "String",
      },
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: "special_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["console_log"] = function (
  block,
  generator
) {
  const value_text = generator.valueToCode(
    block,
    "text",
    javascript.Order.ATOMIC
  );
  const code = `require("electron").ipcRenderer.send('open_devtools');
console.log(${value_text});`;
  return code;
};

Blockly.defineBlocksWithJsonArray([
  {
    type: "test_block",
    tooltip: "",
    helpUrl: "",
    message0: "テストブロック %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 225,
    inputsInline: true,
  },
]);
javascript.javascriptGenerator.forBlock["test_block"] = function () {
  // TODO: Assemble javascript into the code variable.
  const code = `

  
`;
  return code;
};
