/***
 * 文字列を PNG 画像に変換する
 * JS 純正の Canvas ではフォントにアンチエイリアスがかかるのを防ぐことができないため
 * 代わりに node-canvas を使用する。Cairo とか依存関係が増えてしまうが仕方なし
 * Usage: text2png(text, font, fontsize, color)
 ***/

const nodecanvas = require("canvas");

module.exports = function (text, font, size, color) {
  nodecanvas.registerFont(`./fonts/${font}.ttf`, {
    family: font,
  });
  const canvas = nodecanvas.createCanvas(text.length * size, size);
  const ctx = canvas.getContext("2d");
  ctx.antialias = "none";
  ctx.font = `${size.toString()}px ${font}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  ctx.fillText(text, 0, 0);
  return canvas.toBuffer();
};
