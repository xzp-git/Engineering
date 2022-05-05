

const Compiler = require('./Compiler')

function webpack(options) {
  // 初始参数 从配置文件和 shell语句中读取并合并参数 得出最终的配置对象
  const argv = process.argv.slice(2)
  const shellOptions = argv.reduce((memo, options) => {
    const [key, value] = options.split('=')

    memo[key.slice(2)] = value
    return memo
  }, {})
  const finalOptions = {...options, ...shellOptions}
  //2.用上一步得到的参数进行初始化 Compiler对象
  const compiler = new Compiler(finalOptions)


  //3. 加载所有配置的插件
  const {plugins = []} = finalOptions
  for (const plugin of plugins){
    plugin.apply(compiler)
  }
  return compiler
}


module.exports = webpack