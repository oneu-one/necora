const main = async () => {
  const _rg = require("@necora/rgpio");
  await _rg.start();
  const _sfm = require("@necora/sfmv17");
  await _sfm.init("/dev/ttyS0", 115200);

  await _sfm.setRingColor(0x06, 0x01, 1 * 1000);

  const userCount = await _sfm.getUserCount();
  console.log("User Count:", userCount);
};
main();
