const pathLib = require("path");
const babel = require("@babel/core");
const types = require("@babel/types");

const loggerPlugin = {
  visitor: {
    CallExpression(path, state) {
      const { node } = path;
      if (types.isMemberExpression(node.callee)) {
        if (node.callee.object.name === "console") {
          if (
            ["log", "info", "warn", "error"].includes(node.callee.property.name)
          ) {
            const { line, column } = node.loc.start;
            const filename = state.file.opts.filename;
            const relativeName = pathLib
              .relative(__dirname, filename)
              .replace(/\\/g, "/");
            node.arguments.unshift(
              types.stringLiteral(`${relativeName}:${line}:${column}`)
            );
          }
        }
      }
    },
  },
};

//希望能够扫描所有的console.log warn error debug 自动给方法添加参数
// log 所在的文件名 行 列

let sourceCode = `
  function sum(a,b){
    console.log('日志');
    return a+b;
  }
`;

const result = babel.transform(sourceCode, {
  filename: "sum.js",
  plugins: [loggerPlugin],
});

console.log(result.code);
