const esprima = require("esprima");
const estraverse = require("estraverse");
const escodegen = require("escodegen");
const code = `function ast(){}`;

//1 parse方法可以把源代码转成一个抽象语法树

const ast = esprima.parse(code);
let indent = 0;
const padding = () => " ".repeat(indent);
estraverse.traverse(ast, {
  enter(node) {
    console.log(padding() + node.type + "进入");
    indent += 2;
    if (node.type === "FunctionDeclaration") {
      node.id.name = "newAst";
    }
  },
  leave(node) {
    indent -= 2;
    console.log(padding() + node.type + "离开");
  },
});

const result = escodegen.generate(ast);
console.log(result);
