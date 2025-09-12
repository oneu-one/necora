const category_multimedia = [
  {
    kind: 'category',
    name: 'マルチメディア',
    cssConfig: {
      icon: 'customIcon fas fa-gamepad'
    },
    categorystyle: 'multimedia_category',
    contents: [
      {
        kind: 'label',
        "text": "色",
        "web-line": "4.0",
        "web-line-width": "200"
      },
      {
        kind: 'block',
        type: 'colour_picker'
      },
      {
        kind: "block",
        type: 'coupycolor_picker'
      }
    ]
  },
];
export { category_multimedia };