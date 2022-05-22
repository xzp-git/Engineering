const Module = require("./module");
const MagicString = require("magic-string");
const path = require('path')
const fs = require("fs");
const { hasOwnProperty, replacementIdentifiers } = require('./utils');
class Bundle {
  constructor(options) {
    this.entryPath = options.entry; // 输入的文件的路径 C:\11.rollup\src\main.js
  }
  build(filename) {
    // 1.打包编译  2.输出到filename里
    let entryModule = this.fetchModule(this.entryPath);
    this.statements = entryModule.expendAllStatements();
    this.deconflict();
    const { code } = this.generate();
    fs.writeFileSync(filename, code);
    console.log("done!");
  }
  deconflict() {
    const defines = {};//定义的变量
    const conflicts = {};//变量名冲突的变量
    this.statements.forEach(statement => {
      Object.keys(statement._defines).forEach(name => {
        if (hasOwnProperty(defines, name)) {
          if (!hasOwnProperty(conflicts, name)) {
            conflicts[name] = true;//此问题已经出现过了，或者说定义过了，把它标记为变量冲突
          }
        } else {
          defines[name] = [];//defines.age = [];
        }
        //把此声明变量的语句，对应的模块添加到数组里
        defines[name].push(statement._module);
      });
    });
    Object.keys(conflicts).forEach(name => {
      const modules = defines[name];//获取定义此变量名的模块的数组
      modules.pop();//最后一个模块不需要重命名,保留 原来的名称即可 [age1,age2]
      modules.forEach((module, index) => {
        let replacement = `${name}$${modules.length - index}`;
        if (hasOwnProperty(defines, replacement)) {
          replacement = `${replacement}$${modules.length - index}`;
        }
        module.rename(name, replacement);//module age=>age$2
      });
    });
  }

  fetchModule(importee, importer) {
    let route
    if (!importer) {
      route = importee
    }else{
      if (path.isAbsolute(importee)) {
        route = importee
      }else{
        route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '')+'.js')
      }
    }

    if (route) {
      let code = fs.readFileSync(route, "utf8");
      const module = new Module({ code, path: route, bundle: this });
      return module;
    }
  }
  generate() {
    let bundle = new MagicString.Bundle();
    this.statements.forEach((statement) => {
      let replacements = {}
      Object.keys(statement._dependsOn).concat(Object.keys(statement._defines)).forEach(name => {
        debugger
        const canonicalName = statement._module.getCanonicalName(name);
        if (name !== canonicalName) {
          replacements[name] = canonicalName;
        }
      })
      const source = statement._source.clone()
      if (statement.type === 'ExportNamedDeclaration') {
        source.remove(statement.start, statement.declaration.start)
      }
      replacementIdentifiers(statement, source, replacements);
      bundle.addSource({
        content: source,
        separator: "\n",
      });
    });
    return { code: bundle.toString() };
  }
}

module.exports = Bundle;
