/*** VoiceVox で wavファイルを生成（キャッシュとして使用） ***/

const fs = require("fs");
const path = require("path");
const os = require("os");

const { createHash } = require("crypto");

// キャッシュディレクトリのパス
const cache_dir = path.join(os.homedir(), "necora", "cache", "voicevox");

module.exports = async function (text, speaker, cache = true) {
  // テキスト＋話者番号から生成したハッシュをキャッシュファイル名とする
  const hash = createHash("sha256")
    .update(text + speaker)
    .digest("hex");
  const fpath = path.join(cache_dir, hash) + ".wav";
  if (!fs.existsSync(fpath) || !cache) {
    // キャッシュがないか、使わない指定の場合は音声ファイルを生成
    if (!fs.existsSync(cache_dir))
      // キャッシュディレクトリがなければ作る(再帰的)
      fs.mkdirSync(cache_dir, { recursive: true });

    try {
      var res = await fetch(
        `http://localhost:50021/audio_query?text=${text}&speaker=${speaker}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("VoiceVoxサーバーに接続できませんでした。");
      _necora.fukidashi("VoiceVox が起動してないかも・・・", 10);
      throw error;
    }

    const query = await res.json();

    const sound_row = await fetch(
      `http://localhost:50021/synthesis?speaker=${speaker}&enable_interrogative_upspeak=true`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "audio/wav",
        },
        body: JSON.stringify(query),
      },
    );
    const buffer = Buffer.from(await sound_row.arrayBuffer());
    fs.writeFileSync(fpath, buffer);
  }
  return fpath;
};
