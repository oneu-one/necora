// ローカルIPアドレス取得
Blockly.defineBlocksWithJsonArray([
  {
    type: "get_local_ip",
    tooltip: "このマシンのローカル IP アドレスを取得します",
    helpUrl: "",
    message0: "ローカル IP アドレス %1",
    args0: [
      {
        type: "input_dummy",
        name: "NAME",
      },
    ],
    output: null,
    inputsInline: true,
    style: "network_blocks",
  },
]);
javascript.javascriptGenerator.forBlock["get_local_ip"] = function () {
  var functionName = Blockly.JavaScript.provideFunction_("_getIP", [
    `const ${Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_} = () => Object.values(require('os').networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat(i.family==='IPv4' && !i.internal && i.address || []), [])), [])[0];`,
  ]);
  const code = `_getIP()`;
  return [code, javascript.Order.NONE];
};

/************** */
/** HTTP Server */
/************** */
Blockly.Blocks["network_httpserver"] = {
  init: function () {
    this.appendValueInput("url")
      .setCheck("Variable")
      .appendField("Webサーバを起動してアクセスを待ち、");
    this.appendDummyInput().appendField("へアクセスがあったら");
    this.appendStatementInput("do").setCheck(null);
    this.appendValueInput("response").setCheck(null).appendField("最後に");
    this.appendDummyInput().appendField("を返してアクセス待ちに戻る");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("HTTPサーバを起動します。ポートは3000固定です。");
    this.setHelpUrl("");
    this.setStyle("network_blocks");
  },
};
javascript.javascriptGenerator.forBlock["network_httpserver"] = function (
  block,
  generator
) {
  var value_url = Blockly.JavaScript.valueToCode(
    block,
    "url",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  // var variable_url = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('URL'), Blockly.Variables.NAME_TYPE);
  var statements_do = Blockly.JavaScript.statementToCode(block, "do");
  var value_response = Blockly.JavaScript.valueToCode(
    block,
    "response",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  Blockly.JavaScript.provideFunction_("require_http", [
    `const _http = require('http');`,
  ]);
  var code = [
    `let _req, _res;`,
    `_http.createServer(async (_req, _res) => {`,
    `_res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });`,
    `${value_url} = _req.url;`,
    statements_do,
    // `_res.write('<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"></head><body>');`,
    `_res.end(${value_response});`,
    `}).listen(3000);`,
    "",
  ].join("\n");
  return code;
};

/******************** */
/** axios HTTP client */
/******************** */
// Get URL
Blockly.Blocks["network_axios_geturl"] = {
  init: function () {
    this.appendValueInput("url").setCheck("String").appendField("URL");
    this.appendDummyInput().appendField("の内容");
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND);
    this.setStyle("network_blocks");
    this.setTooltip(
      "URLにGETリクエストを送信し、レスポンスを取得します。エラーの場合、HTTPステータスコードを返します。"
    );
    this.setHelpUrl("");
  },
};
javascript.javascriptGenerator.forBlock["network_axios_geturl"] = function (
  block,
  generator
) {
  var value_url = Blockly.JavaScript.valueToCode(
    block,
    "url",
    Blockly.JavaScript.ORDER_ATOMIC
  );
  var functionName = Blockly.JavaScript.provideFunction_("_getUrl", [
    `const axios = require('axios');`,
    "const " +
      Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      " = async url => {",
    "let res, ret;",
    "try {",
    `res = await axios.get(url);`,
    "ret = res.data;",
    "} catch (error) {",
    "if (error.response) {",
    "ret = error.response.status;",
    "} else {",
    "ret = 999;",
    "}",
    "}",
    "return ret;",
    "}",
  ]);
  var code = `await ${functionName}(${value_url})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
