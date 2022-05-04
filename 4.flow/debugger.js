const webapack = require('./webpack')
const webpackConfig = require('./webpack.config')

//这是编译器对象代表整个编译过程
const compiler = webapack(webpackConfig)


//4. 执行对象的run方法开始执行编译
compiler.run((err, stats) => {
    console.log(err)
    //stats是一个对象，记录了整个编译的过程 和产出的内容
    console.log(stats.toJson({
        assets:true, //输出打包出来的文件或者说资源 main.js
        chunks: true, //生成的代码块
        modules:true // 打包的模块
    }))
})