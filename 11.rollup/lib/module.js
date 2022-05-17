const MagicString = require("magic-string");
const acorn = require("acorn");
class Module {
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.ast = acorn.parse(code, { ecmaVersion: 8, sourceType: "module" });
  }
  expendAllStatements() {
    let allStatements = [];
    this.ast.body.forEach((statement) => {
      statement._source = this.code.snip(statement.start, statement.end);
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true; //这是一个标记， 标记此语句定会包含在输出语句里
    let result = [];
    result.push(statement);
    return result;
  }
}
module.exports = Module;
