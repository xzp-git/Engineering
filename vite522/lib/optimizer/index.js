const scanImports = require('./scan.js')


async function createOptimizeDepsRun(config) {
    // 分析依赖，找出来我的项目依赖了那些第三方模块
    const deps = await scanImports(config)
}




exports.createOptimizeDepsRun = createOptimizeDepsRun



