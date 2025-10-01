// 特殊カテゴリ
const category_special = [
  {
    kind: "category",
    name: "特殊",
    cssConfig: {
      icon: "customIcon fas fa-plug",
    },
    categorystyle: "special_category",
    contents: [
      {
        kind: "label",
        text: "データ",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="hextodec"><value name="hex"><shadow type="text"><field name="TEXT">ff</field></shadow></value></block>',
        type: "hextodec",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="bintodec"><value name="bin"><shadow type="text"><field name="TEXT">0000</field></shadow></value></block>',
        type: "bintodec",
      },
      {
        kind: "BLOCK",
        blockxml:
          '<block type="codechar"><value name="code"><shadow type="math_number"><field name="NUM">97</field></shadow></value></block>',
        type: "codechar",
      },
      {
        kind: "label",
        text: "制御",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "sleep",
        inputs: {
          sec: {
            shadow: {
              type: "math_number",
              fields: {
                NUM: "1",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "async_iife",
      },
      {
        kind: "label",
        text: "入出力",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        blockxml:
          '<block type="canvas_say"><value name="say"><shadow type="text"><field name="TEXT">コンニチワ！</field></shadow></value><field name="sec">2</field></block>',
        type: "canvas_say",
      },
      {
        kind: "block",
        type: "prompt",
        inputs: {
          ask: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "お名前は？",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "terminal_show",
      },
      {
        kind: "block",
        type: "terminal_write",
        inputs: {
          text: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "Hello, World!",
              },
            },
          },
        },
      },
      {
        kind: "block",
        blockxml:
          '<block type="control_button"><value name="label"><shadow type="text"><field name="TEXT">ボタン1</field></shadow></value><value name="textcolor"><shadow type="colour_picker"><field name="COLOUR">#ffffff</field></shadow></value><value name="bgcolor"><shadow type="colour_picker"><field name="COLOUR">#999999</field></shadow></value><value name="title"><shadow type="text"><field name="TEXT">ここをクリック</field></shadow></value></block>',
        type: "control_button",
      },
      {
        kind: "block",
        blockxml:
          '<block type="localstorage_save"><value name="keyValue"><shadow type="text"><field name="TEXT">abc</field></shadow></value><value name="keyName"><shadow type="text"><field name="TEXT">storage</field></shadow></value></block>',
        type: "localstorage_save",
      },
      {
        kind: "block",
        blockxml:
          '<block type="localstorage_load"><value name="keyName"><shadow type="text"><field name="TEXT">storage</field></shadow></value></block>',
        type: "localstorage_load",
      },
      {
        kind: "label",
        text: "特殊記号",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "text_cr",
      },
      {
        kind: "block",
        type: "text_lf",
      },
      {
        kind: "block",
        type: "text_null",
      },
      {
        kind: "block",
        type: "text_cursor",
      },
      {
        kind: "label",
        text: "開発用",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "console_log",
      },
      {
        kind: "block",
        type: "test_block",
      },

      {
        kind: "label",
        text: "_",
        "web-line": "4.0",
        "web-line-width": "200",
      },
    ],
  },
];
export { category_special };
