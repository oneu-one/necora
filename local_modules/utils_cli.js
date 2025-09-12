// スリープ
const sleep = (sec) => new Promise((r) => setTimeout(r, sec * 1000));

// ファイルパス連結
// Usage: path.join([path1, path2, path3, ...])
const path = {
  join: function (pathes) {
    const removeTrailingSlash = (path) =>
      path.endsWith("/") ? path.substr(0, path.length - 1) : path;
    let result = removeTrailingSlash(pathes[0]);
    for (let i = 1; i < pathes.length; i++) {
      result += "/" + removeTrailingSlash(pathes[i]);
    }
    return result;
  },
};

export { sleep, path };
