const Bundle = require("./bundle");

/**
 * 从入口entry 打成结果， 把结果写入到输出的filename中
 *
 * @param {*} entry
 * @param {*} filename
 */
function rollup(entry, filename) {
  const bundle = new Bundle({ entry });
  bundle.build(filename);
}
module.exports = rollup;
