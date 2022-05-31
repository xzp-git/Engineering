const {build} = require("esbuild")
const esBuildScanPlugin = require('./esBuildScanPlugin')
const path = require('path')



const scanImports = async (config) => {
    const depImports = {}
    // esBuild 打包收集第三方依赖的插件
    const esPlugin = await esBuildScanPlugin(config, depImports)

    await build({
        absWorkingDir:config.root, //工作目录是当前项目的根目录
        entryPoints: [path.resolve('./index.html')], //打包的入口
        bundle:true,
        format: 'esm',
        outfile: 'dist/index.js',//我们目前其实是在找依赖的第三方模块，并不是真正的打包和编译，所以其实并不需要输出到结果到文件
        write:false,
        plugins: [esPlugin]
    })
    return depImports
}


module.exports = scanImports