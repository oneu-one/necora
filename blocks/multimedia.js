// Color Picker : ビルトインのブロックがウチの環境でどうもうまく働かないので自作
registerFieldColour();
Blockly.defineBlocksWithJsonArray([
    {
        type: 'colour_picker',
        message0: '%1',
        "output": "Colour",
        "tooltip": "パレットから色を選んでください",
        "helpUrl": "",
        "style": "colour_blocks",
        args0: [
            {
                type: 'field_colour',
                name: 'COLOUR',
                colour: '#ff0000',
            },
        ],
    },
]);
javascript.javascriptGenerator.forBlock['colour_picker'] = function (block, generator) {
    const code = generator.quote_(block.getFieldValue('COLOUR'));
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.defineBlocksWithJsonArray([
    {
        type: 'coupycolor_picker',
        message0: 'クーピー30色: %1',
        "output": "Colour",
        "tooltip": "サクラクーピーペンシル30色のカラーチャートによる",
        "helpUrl": "https://www.craypas.co.jp/products/painting-school/013/0031/182945.html#color-chart",
        "style": "colour_blocks",
        args0: [
            {
                type: 'field_colour',
                name: 'COLOUR',
                colour: '#E281A0',
                colourOptions: [
                    '#F5ED68',
                    '#F6E92B',
                    '#EEB818',
                    '#EA9D13',
                    '#F2C198',
                    '#FBF5C5',
                    '#7E422A',
                    '#B8591F',
                    '#CD9711',
                    '#4F371D',
                    '#D83A2F',
                    '#D61242',
                    '#E281A0',
                    '#A41759',
                    '#E0BED6',
                    '#1D2973',
                    '#1794CE',
                    '#0FA275',
                    '#8ABC29',
                    '#0C834D',
                    '#0C834D',
                    '#0A68AE',
                    '#096CB0',
                    '#0F3460',
                    '#9CA5A4',
                    '#277565',
                    '#3F3939',
                    '#FFFFFF',
                    '#AE901E',
                    '#A5AEB3',
                ],
                colourTitles: [
                    'レモンいろ',
                    'きいろ',
                    'やまぶきいろ',
                    'だいだいいろ',
                    'うすだいだい',
                    'たまごいろ',
                    'ちゃいろ',
                    'あかちゃいろ',
                    'おうどいろ',
                    'こげちゃいろ',
                    'しゅいろ',
                    'あか',
                    'ももいろ',
                    'あかむらさき',
                    'うすむらさき',
                    'むらさき',
                    'みずいろ',
                    'エメラルドいろ',
                    'きみどり',
                    'みどり',
                    'ふかみどり',
                    'あお',
                    'ぐんじょういろ',
                    'あいいろ',
                    'ねずみいろ',
                    'はいみどり',
                    'くろ',
                    'しろ',
                    'きんいろ',
                    'ぎんいろ',
                ],
                columns: 5,
            },
        ],
    },
]);
javascript.javascriptGenerator.forBlock['coupycolor_picker'] = function (block, generator) {
    const code = generator.quote_(block.getFieldValue('COLOUR'));
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
