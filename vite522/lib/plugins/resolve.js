const fs = require("fs-extra");
const path = require("path");
const resolve = require("resolve");

// vite插件
function resolvePlugin(config) {
  return {
    name: "vite:resolve",
    resolveId(importee, importer) {
      if (importee.startsWith("/")) {
        //说明这个相对于项目根目录的绝对路径 /src/main.js
        return { id: path.resolve(config.root, importee.slice(1)) }; //项目根目录 /src/main.js
      }
      //如果已经是硬盘上的绝对路径了可以直接返回
      if (path.isAbsolute(importee)) {
        return { id: importee };
      }
      //说明这是一个相对路径
      if (importee.startsWith(".")) {
        const baseDir = path.dirname(importer);
        const fsPath = path.resolve(baseDir, importee);
        return { id: fsPath };
      }
      //其它就是第三方模块
      let res = tryNodeResolve(importee, importer, config);
      if (res) {
        return res;
      }
    },
  };
}

function tryNodeResolve(importee, importer, config) {
  const pkgPath = resolve.sync(`${importee}/package.json`, {
    basedir: config.root,
  });
  const pkgDir = path.dirname(pkgPath);
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const entryPoint = pkg.module; //包描述文件中的module属性执行此模块的es6版本代码
  const entryPointPath = path.join(pkgDir, entryPoint);
  return { id: entryPointPath };
}

module.exports = resolvePlugin;
