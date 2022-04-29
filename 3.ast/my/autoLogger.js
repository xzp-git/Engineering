const importModule = require("@babel/helper-module-imports");
const babel = require("@babel/core");
const types = require("@babel/types");
const template = require("@babel/template");
const autoLoggerPlugin = ({ libName }) => {
  return {
    visitor: {
      //用来保证模块内一定会引入一个日志的模块，如果源代码中已经有logger模块引入了，直接用就可以，如果没有引用一下logger
      //state 就是一个用来暂存数据的对象
      Program(path, state) {
        let loggerId;
        path.traverse({
          ImportDeclaration(path) {
            const { node } = path;
            if (libName === node.source.value) {
              //如果层级比较浅直接去很方便，
              //const specifier = path.get('specifiers.0').node
              //如果层级比较深 get比较好
              const specifier = node.specifiers[0];
              loggerId = specifier.local.name;
              path.stop(); //跳出剩下的遍历
            }
          },
        });

        //如果loggerId是undefined没有值，那说明源代码没有导入此模块
        if (!loggerId) {
          loggerId = importModule.addDefault(path, "logger", {
            //生成一个变量名 logger内部会保证同一作用域内生成的变量名不会重名
            nameHint: path.scope.generateUid(libName),
          }).name;

          //在Program这个路径下增加一个默认导入，导入logger模块，本地的变量名叫logger
          /*  looggerId = path.scope.generateUid(libName);
          const importDeclaratio = types.importDeclaratio(
            [types.importDefaultSpecifier(types.identifier(loggerId))],
            types.stringLiteral(libName)
          );
          path.node.body.unshift(importDeclaratio); */
        }

        //这样创建一个节点很长 使用模板语法回简单
        // state.logger = types.expressionStatement(types.callExpression(types.identfier(loggerId), []))
        state.logger = template.statement(`${loggerId}()`)();
      },
      "FunctionDeclaration|ArrowFunctionExpression|FunctionExpression|ClassMethod"(
        path,
        state
      ) {
        const { node } = path;
        if (types.isBlockStatement(node.body)) {
          //节点属性都是节点
          node.body.body.unshift(state.logger);
        } else {
          const newBody = types.blockStatement([
            state.logger,
            types.returnStatement(node.body),
          ]);
          //path.get 返回的都是路径
          path.get("body").replaceWith(newBody);
        }
      },
    },
  };
};

let sourceCode = `
  function sum(a,b){
      return a+b
  };
  const minus = (a,b)=>a-b

  const multiply = function(a,b){
      return a*b
  };
  class Calculator{
      divide(a,b){
          return a/b;
      }
  };
`;

const result = babel.transform(sourceCode, {
  plugins: [autoLoggerPlugin({ libName: "logger" })],
});
console.log(result.code);
