const MagicString = require("magic-string");
const acorn = require("acorn");
const analyse = require('./ast/analyse');
const { hasOwnProperty } = require("./utils");
const SYSTEMS = ['console', 'log'];
class Module {
  constructor({ code, path, bundle }) {
    this.path = path //当前模块对应的绝对路径 
    this.bundle = bundle
    this.code = new MagicString(code, { filename: path });
    this.ast = acorn.parse(code, {ecmaVersion: 8, sourceType: 'module'})
    //存放本模块导入了哪些变量
    this.imports = {}
    // 存放本模块导出了哪些变量
    this.exports = {}
    //存放本模块的变量定义语句
    this.definitions = {}
    
    // 此变量存放所有的变量修改语句
    this.modifications = {} // {name:[name+='jiagou'], age: ['age++']}

    //记录重命名的变量{key老的变量名： value新的变量名}
    this.canonicalNames = {} 
    //进行语法分析
    this.analyse()
  }
  analyse(){
    debugger
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
      }else if (statement.type === 'ExportNamedDeclaration') {
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
      if(statement.type === 'ImportDeclaration' || statement.type === 'VariableDeclaration') return
      let statements = this.expandStatement(statement);
      allStatements.push(...statements);
    });
    return allStatements;
  }
  expandStatement(statement) {
    statement._included = true; //这是一个标记， 标记此语句定会包含在输出语句里
    let result = [];
    
    //获取到此节点的依赖的变量
    const dependencies = Object.keys(statement._dependsOn) //['name']
    dependencies.forEach(name => {
      //找到每个变量的定义语句
      let definitions = this.define(name)
      result.push(...definitions)
    })
    result.push(statement);
    //找到此语句定义的变量
    const defines = Object.keys(statement._defines)
    defines.forEach(name => {
      //找到定义的变量依赖的修改的语句
      const modifications = hasOwnProperty(this.modifications, name) && this.modifications[name];
      if (modifications) {
        //把修改语句也展开放到结果里
        modifications.forEach(statement => {
          if (!statement._included) {
            let statements = this.expandStatement(statement)
            result.push(...statements)
          }
        })
      }
    })


    return result;
  }
  rename(name, replacement) {
    this.canonicalNames[name] = replacement;
  }
  getCanonicalName(name) {
    return this.canonicalNames[name] || name;
  }

  define(name){
    //先判断此变量是外部导入的还是模块内声明的
    if (hasOwnProperty(this.imports, name)) {
      //说明此变量不是模块内声明的，而是外面导入的
      const {source, importName} = this.imports[name]
      const importModule = this.bundle.fetchModule(source, this.path)

      debugger
      const {localName} = importModule.exports[importName] 
      return importModule.define(localName) //name
    } else { //如果是模块的变量的话
      let statement = this.definitions[name]
      if (statement) {
        if (statement._included) {
          return []
        } else {
          return this.expandStatement(statement)
        }
      }else{
        if (SYSTEMS.includes(name)) {
          return []
        }else{
          return new Error(`${name} is not defined`)
        }
      }

    }
  }
}
module.exports = Module;


// //存放本模块导入了哪些变量
// this.imports = {};
// // 存放本模块导出了哪些变量
// this.exports = {};
// //存放本模块的变量定义语句
// this.definitions = {};

// //对于msg.js
// this.exports = {
//   'n3': { localName: 'name', exportName: 'name' },
//   'age': { localName: 'age', exportName: 'age' }
// };
// //本模块中定义变量的语句
// this.definitions = {
//   name: `var name = 'zhufeng';`,
//   age: `var age = 12;`
// }
// //对于main.js
// this.imports = {
//   'n': { importName: 'n3', source: './msg' },
//   'age': { importName: 'age', source: './msg' }
// };
// this.definitions = {
//   say: `function say(){}`,
// }