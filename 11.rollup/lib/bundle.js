const Module = require("./module");
const MagicString = require("magic-string");

const fs = require("fs");
class Bundle {
  constructor(options) {
    this.entryPath = options.entry; // 输入的文件的路径 C:\11.rollup\src\main.js
  }
  build(filename) {
    // 1.打包编译  2.输出到filename里
    let entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expendAllStatements();
    const { code } = this.generate();
    fs.writeFileSync(filename, code);
    console.log("done!");
  }

  fetchModule(importee) {
    const route = importee;
    if (route) {
      let code = fs.readFileSync(route, "utf8");
      const module = new Module({ code, path: route, bundle: this });
      return module;
    }
  }
  generate() {
    let bundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      bundle.addSource({
        content: statement._source,
        separator: "\n",
      });
    });
    return { code: bundle.toString() };
  }
}

module.exports = Bundle;
