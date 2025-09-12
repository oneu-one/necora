/******** デフォルトツールボックス ********/
// var toolbox = {
//   kind: "categoryToolbox",
//   contents: [
const toolbox_default = [
  {
    kind: "category",
    name: "論理",
    cssConfig: {
      icon: "customIcon fas fa-random",
    },
    categorystyle: "logic_category",
    contents: [
      {
        kind: "block",
        type: "controls_if",
      },
      {
        kind: "block",
        type: "controls_if",
        extraState: {
          hasElse: "true",
        },
      },
      {
        kind: "block",
        type: "controls_if",
        extraState: {
          hasElse: "true",
          elseIfCount: 1,
        },
      },
      {
        kind: "block",
        type: "logic_compare",
      },
      {
        kind: "block",
        type: "logic_operation",
      },
      {
        kind: "block",
        type: "logic_negate",
      },
      {
        kind: "block",
        type: "logic_boolean",
      },
      {
        kind: "block",
        type: "logic_null",
      },
      {
        kind: "block",
        type: "logic_ternary",
      },
    ],
  },
  {
    kind: "category",
    name: "ループ",
    cssConfig: {
      icon: "customIcon fas fa-redo-alt",
    },
    categorystyle: "loop_category",
    contents: [
      {
        kind: "block",
        type: "controls_repeat_ext",
        inputs: {
          TIMES: {
            block: {
              type: "math_number",
              fields: {
                NUM: 10,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "controls_whileUntil",
      },
      {
        kind: "block",
        type: "controls_for",
        fields: {
          VAR: {
            name: "番号",
          },
        },
        inputs: {
          FROM: {
            block: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          TO: {
            block: {
              type: "math_number",
              fields: {
                NUM: 10,
              },
            },
          },
          BY: {
            block: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "controls_forEach",
        fields: {
          VAR: {
            name: "項目",
          },
        },
      },
      {
        kind: "block",
        type: "controls_flow_statements",
      },
    ],
  },
  {
    kind: "category",
    name: "数・計算",
    cssConfig: {
      icon: "customIcon fas fa-calculator",
    },
    categorystyle: "math_category",
    contents: [
      {
        kind: "block",
        type: "math_number",
        fields: {
          NUM: 123,
        },
      },
      {
        kind: "block",
        type: "math_arithmetic",
        fields: {
          OP: "ADD",
        },
      },
      {
        kind: "block",
        type: "math_single",
        fields: {
          OP: "ROOT",
        },
      },
      {
        kind: "block",
        type: "math_trig",
        fields: {
          OP: "SIN",
        },
      },
      {
        kind: "block",
        type: "math_constant",
        fields: {
          CONSTANT: "PI",
        },
      },
      {
        kind: "block",
        type: "math_number_property",
        extraState: '<mutation divisor_input="false"></mutation>',
        fields: {
          PROPERTY: "EVEN",
        },
      },
      {
        kind: "block",
        type: "math_round",
        fields: {
          OP: "ROUND",
        },
      },
      {
        kind: "block",
        type: "math_on_list",
        extraState: '<mutation op="SUM"></mutation>',
        fields: {
          OP: "SUM",
        },
      },
      {
        kind: "block",
        type: "math_modulo",
      },
      {
        kind: "block",
        type: "math_constrain",
        inputs: {
          LOW: {
            block: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          HIGH: {
            block: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_random_int",
        inputs: {
          FROM: {
            block: {
              type: "math_number",
              fields: {
                NUM: 1,
              },
            },
          },
          TO: {
            block: {
              type: "math_number",
              fields: {
                NUM: 100,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "math_random_float",
      },
      {
        kind: "block",
        type: "math_atan2",
      },
    ],
  },
  {
    kind: "category",
    name: "テキスト",
    cssConfig: {
      icon: "customIcon fas fa-font",
    },
    categorystyle: "text_category",
    contents: [
      {
        kind: "block",
        type: "text",
      },
      {
        kind: "block",
        type: "text_print",
        inputs: {
          TEXT: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "こんにちは！",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_join",
      },
      {
        kind: "block",
        type: "text_length",
        inputs: {
          VALUE: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "abc",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_indexOf",
        inputs: {
          VALUE: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "text",
              },
            },
          },
          FIND: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "ex",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "text_charAt",
      },
      {
        kind: "block",
        type: "text_getSubstring",
      },
    ],
  },
  {
    kind: "category",
    name: "リスト",
    cssConfig: {
      icon: "customIcon fas fa-list-ol",
    },
    categorystyle: "list_category",
    contents: [
      {
        kind: "block",
        type: "lists_create_empty",
      },
      {
        kind: "block",
        type: "lists_create_with",
        extraState: {
          itemCount: 3,
        },
      },
      {
        kind: "block",
        type: "lists_repeat",
        inputs: {
          NUM: {
            block: {
              type: "math_number",
              fields: {
                NUM: 5,
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "lists_length",
      },
      {
        kind: "block",
        type: "lists_isEmpty",
      },
      {
        kind: "block",
        type: "lists_indexOf",
        fields: {
          END: "FIRST",
        },
      },
      {
        kind: "block",
        type: "lists_getIndex",
        fields: {
          MODE: "GET",
          WHERE: "FROM_START",
        },
      },
      {
        kind: "block",
        type: "lists_setIndex",
        fields: {
          MODE: "SET",
          WHERE: "FROM_START",
        },
      },
      {
        kind: "block",
        type: "lists_split",
      },
      {
        kind: "block",
        type: "lists_sort",
      },
    ],
  },
  {
    kind: "category",
    name: "変数",
    cssConfig: {
      icon: "customIcon fas fa-bars",
    },
    categorystyle: "variable_category",
    custom: "VARIABLE",
  },
  {
    kind: "category",
    name: "関数",
    cssConfig: {
      icon: "customIcon fas fa-yin-yang",
    },
    categorystyle: "procedure_category",
    custom: "PROCEDURE",
  },
  {
    kind: "sep",
  },
];

export { toolbox_default };
