const MagicString = require("magic-string");
const acorn = require("acorn");
const analyse = require('./ast/analyse');
class Module {
  constructor({ code, path, bundle }) {
    this.path = path //当前模块对应的绝对路径 
    this.bundle = bundle
    this.code = new MagicString(code, { filename: path });
    this.ast = acorn.parse(code, { ecmaVersion: 8, sourceType: "module" });
    this.ast = acorn.parse(code, {ecmaVersion: 8, sourceType: 'module'})
    //存放本模块导入了哪些变量
    this.imports = {}
    // 存放本模块导出了哪些变量
    this.exports = {}
    //存放本模块的变量定义语句
    this.definitions = {}
    
    // 此变量存放所有的变量修改语句
    this.modifications = {} // {name:[name+='jiagou'], age: ['age++']}

    //进行语法分析
    this.analyse()
  }
  analyse(){
    this.ast.body.forEach(statement => {
      // import {name, age} from './msg'
      if (statement.type === 'ImportDeclaration') {
        let source = statement.source.value
        statement.specifiers.forEach(specifier => {
          let importName = specifier.imported.name //导入的变量名
          let localName = specifier.local.name //本地的变量名
          //this.imports.name = {'./msg', 'name'}
          this.imports[localName] = {source, importName}
        })
      }else if (statement.type === 'ExportNameDeclaration') {
        const declaration = statement.declaration
        const specifiers = statement.specifiers
        if (declaration && declaration.type === 'VariableDeclaration') {
          const declarations = declaration.declarations
          declarations.forEach(variableDeclarator => {
            const localName = variableDeclarator.id.name
            const exportName = localName
            this.exports[exportName] = {localName}
          })
        }else if (specifiers) {
          specifiers.forEach(exportSpecifier => {
            let localName = exportSpecifier.local.name //本地的变量名
            let exportName = specifiers.exported.name //导出的变量名
            this.exports[exportName] = {localName}
          })
        }
      }
    })
    analyse(this.ast, this.code, this)
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
