/***
スリープ JS 実装
停止時間を秒で指定
Usage: await sleep(sec);
 */

const sleep = sec =>
    new Promise(r => setTimeout(r, sec * 1000));

module.exports = { sleep, _sleep: sleep };