const path = require('path');
const fs = require('fs');
const parser = require('@babel/parser');
const types = require('babel-types');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
function normalizePath(path) {
    return path.replace(/\\/g, '/');//统一成linux的路径分隔符
  }
  const baseDir = normalizePath(process.cwd());
class Compilation{
    constructor(options){
        this.options = options
        this.fileDependencies = new Set();
        this.modules = [];
        this.chunks = [];
        this.assets = {};//输出列表
    }

    build(onCompiled){
        //真正的编译逻辑是在这个方法里写的
        //5. 根据配置中的entry找出入口文件
        let entry = {}
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry //如果字符串，其实入口的名字叫main
        } else {
            entry = this.options.entry  //否则 就是一个对象
        }
        //6. 从入口文件出发，调用所有配置的loader对模块进行编译
        for(let entryName in entry){
            //得到入口文件的绝对路径
            const entryFilePath = path.posix.join(baseDir, entry[entryName])
            this.fileDependencies.add(entryFilePath)
            const entryModule = this.buildModule(entryName, entryFilePath)
            //8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
            const chunk = {
                name:entryName, //代码块的名称就是入口的名称
                entryModule,//入口的模块
                modules:this.modules.filter(module => module.names.includes(entryName))
            }
            this.chunks.push(chunk)
        }

        //9. 再把每个 Chunk转换成一个单独的文件加入到输出列表
        this.chunks.forEach(chunk => {
            const filename = this.options.output.filename.replace('[name]', chunk.name)
            this.assets[filename] = getSource(chunk)
        })

        onCompiled(null,{
            chunks: this.chunks,
            module: this.modules,
            assets: this.assets
          }, this.fileDependencies)
    }
    /**
     * 编译模块
     */
    buildModule = (name, modulePath) => {
        // 读取模块的源代码
        const sourceCode = fs.readFileSync(modulePath, 'utf8')
        //读取配置的loader
        const {rules} = this.options.module
        const loaders = []
        rules.forEach(rule => {
            const {test} = rule
            if (modulePath.match(test)) {
                loaders.push(...rule.use)
            }
        });
        //使用配置的loader 对源码进行转换，得到最后的结果
        const transformedSourceCode = loaders.reduceRight((sourceCode, loader) => {
            return require(loader)(sourceCode)
        }, sourceCode)
        //创建一个当前模块的模块
        const moduleId = './' + path.posix.relative(baseDir, modulePath)
        /**
         * module chunk bundle
         * 入口模块和他依赖的模块组成一个代码块，entry.js ttile.js entry1的代码开chunk
         * 每个代码块会生成一个bundle，也就是一个文件entry.js
         * 因为一个模块可能会属于多个入口，多个代码块，而模块不想重复编译的，所以一个模块可能会names对应于它的代码块名称的数组
         */
        const module = {id: moduleId, dependencies:[], names:[name]}
        const ast = parser.parse(transformedSourceCode, {sourceType:'module'})

        //7. 再找出该模块依赖的模块， 再递归本步骤知道所有入口依赖的文件都经过了本步骤的处理
        traverse(ast, {
            CallExpression:({node}) => {    
                //说明这是要依赖或者说加载别模块了
                if (node.callee.name === 'require') {
                    //依赖的模块的相对于当前模块的相对路径
                    const depModuleName = node.arguments[0].value
                    //先找到当前模块所在目录
                    const dirname = path.posix.dirname(modulePath)
                    //得到依赖的模块的绝对路径
                    const depModulePath = this.tryExtension(path.posix.join(dirname, depModuleName))

                    this.fileDependencies.add(depModulePath)
                    //模块ID不管是本地的还是第三方的都会转成相对项目根目录的相对路径，而且是添加过后缀的
                    const depModuleId = './' + path.posix.relative(baseDir, depModulePath)
                    //修改ast语法树上的require节点
                    node.arguments = [types.stringLiteral(depModuleId)]
                    //给当前的模块添加模块依赖
                    module.dependencies.push({depModuleId, depModulePath})
                }
            }
        })
        //根据改造后语法树重新生成源代码
        const { code } = generator(ast)
        module._source = code
        //找到这个模块依赖的模块数组，进行循环，编译这些依赖的模块
        module.dependencies.forEach(({depModuleId, depModulePath}) => {
            //先在已经编译 好的模块数组中找一找有没有这个模块
            const existModule = this.modules.find(module => module.id === depModuleId)
            if (existModule) { //
                existModule.names.push(name)
            }else{
                let depModule = this.buildModule(name, depModulePath)
                this.modules.push(depModule)
            }
        })
        return module
    }

    tryExtension = (modulePath) => {
        //如果文件存在，说明require模块的时候已经添加了后缀了， 直接返回
        if (fs.existsSync(modulePath)) {
            return modulePath
        }
        let extensions = ['.js']

        if (this.options.resolve && this.options.resolve.extensions) {
            extensions = this.options.resolve.extensions
        }

        for(let i = 0; i < extensions.length; i++){
            let filePath = modulePath + extensions[i]
            if (fs.existsSync(filePath)) {
                return filePath
            }
        }
        throw new Error(`${modulePath}未找到`)
    }
}
function getSource(chunk) {
    return `
      (() => {
      var modules = ({
        ${chunk.modules.map(module => `
          "${module.id}":(module,exports,require)=>{
            ${module._source}
          }
        `)
      }
      });
      var cache = {};
      function require(moduleId) {
        var cachedModule = cache[moduleId];
        if (cachedModule !== undefined) {
          return cachedModule.exports;
        }
        var module = cache[moduleId] = {
          exports: {}
        };
        modules[moduleId](module, module.exports, require);
        return module.exports;
      }
      var exports = {};
      ${chunk.entryModule._source}
      })()
      ;
    `;
  }
module.exports = Compilation