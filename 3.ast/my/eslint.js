const pathLib = require("path");
const babel = require("@babel/core");
const types = require("@babel/types");

const eslintPlugin = ({ fix }) => {
  return {
    pre(file) {
      file.set("errors", []);
    },
    visitor: {
      CallExpression(path, state) {
        const { node } = path;
        const errors = state.file.get("errors");
        if (node.callee.object.name === "console") {
          Error.stackTraceLimit = 0;
          errors.push(
            path.buildCodeFrameError(`代码中不能出现console语句`, Error)
          );
          if (fix) {
            path.parentPath.remove();
          }
        }
      },
    },
    post(file) {
      console.log(...file.get("errors"));
    },
  };
};

let sourceCode = `
 var a = 1;
 console.log(a);
 var b = 2;
`;

const result = babel.transform(sourceCode, {
  plugins: [eslintPlugin({ fix: true })],
});
console.log(result.code);
