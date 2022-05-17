const acorn = require("acorn");
const walk = require("./walk");
const sourceCode = `import $ from "jquery"`;

const ast = acorn.parse(sourceCode, {
  locations: true,
  ranges: true,
  sourceType: "module",
  ecmaVersion: 8,
});
let indent = 0;

const padding = () => " ".repeat(indent);
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      if (node.type) {
        console.log(padding() + "进入" + node.type);
        indent += 2;
      }
    },
    leave(node) {
      if (node.type) {
        indent -= 2;
        console.log(padding() + "离开" + node.type);
      }
    },
  });
});
