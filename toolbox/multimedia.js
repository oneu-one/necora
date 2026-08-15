const category_multimedia = [
  {
    kind: "category",
    name: "マルチメディア",
    cssConfig: {
      icon: "customIcon fas fa-gamepad",
    },
    categorystyle: "multimedia_category",
    contents: [
      {
        kind: "label",
        text: "色",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "colour_picker",
      },
      {
        kind: "block",
        type: "coupycolor_picker",
      },
      {
        kind: "label",
        text: "サウンド",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "play_sound",
      },
      {
        kind: "block",
        type: "voicevox",
        inputs: {
          text: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "音声合成のテストをしているのだ！",
              },
            },
          },
        },
      },
      {
        kind: "block",
        type: "yukkuri",
        inputs: {
          text: {
            shadow: {
              type: "text",
              fields: {
                TEXT: "漢字も読めます。",
              },
            },
          },
        },
      },
      {
        kind: "label",
        text: "顔認識",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "face_init",
      },
      {
        kind: "block",
        type: "face_display",
      },
      {
        kind: "block",
        blockxml:
          '<block type="face_detect"><value name="preditions"><block type="variables_get"><field name="VAR" iid="TLZRpW`yXuYE3Z31)B=2">検出結果</field></block></value></block>',
        type: "face_detect",
      },
      {
        kind: "block",
        type: "face_location",
        blockxml:
          '<block type="face_location"><field name="member">topLeft[0]</field><value name="prediction"><block type="lists_getIndex"><mutation statement="false" at="true"></mutation><field name="MODE">GET</field><field name="WHERE">FROM_START</field><value name="VALUE"><block type="variables_get"><field name="VAR" iid="_W]y2e!_~suF]yM;LQ1~">検出結果</field></block></value><value name="AT"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></value></block>',
      },
      {
        kind: "block",
        type: "face_drawbox",
        blockxml:
          '<block type="face_drawbox"><field name="with_landmark">TRUE</field><value name="prediction"><block type="lists_getIndex"><mutation statement="false" at="true"></mutation><field name="MODE">GET</field><field name="WHERE">FROM_START</field><value name="VALUE"><block type="variables_get"><field name="VAR" iid="E-Bsl~,RZG]E)v`k![_p">検出結果</field></block></value><value name="AT"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></value></block>',
      },
    ],
  },
];
export { category_multimedia };
