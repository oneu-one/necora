const category_network = [
  {
    kind: "category",
    name: "ネットワーク",
    cssConfig: {
      icon: "customIcon fas fa-wifi",
    },
    categorystyle: "network_category",
    contents: [
      {
        kind: "label",
        text: "クライアント",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "network_axios_geturl",
        blockxml:
          '<block type="network_axios_geturl"><value name="url"><shadow type="text"><field name="TEXT">http://www.yahoo.co.jp/</field></shadow></value></block>',
      },
      {
        kind: "label",
        text: "サーバ",
        "web-line": "4.0",
        "web-line-width": "200",
      },
      {
        kind: "block",
        type: "network_httpserver",
        blockxml:
          '<block type="network_httpserver"><value name="url"><block type="variables_get"><field name="VAR" iid="TLZRpW`yXuYE3Z31)B=2">URL</field></block></value><value name="response"><shadow type="text"><field name="TEXT">Hello, world!</field></shadow></value></block>',
      },
      {
        kind: "block",
        type: "get_local_ip",
      },
    ],
  },
];
export { category_network };
