const scanImports = require('./scan.js')
const path = require('path')
const fs = require('fs-extra')
const { normalizePath } = require('../utils.js')
const { build } = require('esbuild')

async function createOptimizeDepsRun(config) {
    // 分析依赖，找出来我的项目依赖了那些第三方模块
    const deps = await scanImports(config)
    /**
     * {
        vue: 'D:/zhufeng/Engineering/vite522use/node_modules/vue/dist/vue.runtime.esm-bundler.js'
        }
     */
    // 确定查找我们的缓存目录 node_modules\.vite522
    const {cacheDir} = config
    const depsCacheDir = path.resolve(cacheDir, 'deps') //node_modules\.vite\deps
    const metadataPath = path.join(depsCacheDir, '_metadata.json')
    const metadata = {
        optimized: {}
    }
    for(const id in deps){
        const entry = deps[id]
        //entry是一个源文件的绝对路径，在文件里存的是相对路径
        //对象里存的是绝对路径, 但是硬盘上写入的文件时相对路径，是相对于deps目录的相对路径
        const file = normalizePath(path.resolve(depsCacheDir, id + '.js'))
        metadata.optimized[id] = {
            src: entry,
            file
        }
        await build({
            absWorkingDir: process.cwd(),
            entryPoints:[deps[id]],
            outfile:file,
            bundle:true,
            write:true,
            format:'esm'
        })
    }

    await fs.ensureDir(depsCacheDir) //创建缓存下的deps目录
    await fs.writeFile(metadataPath, JSON.stringify(metadata, (key, value) => {
        if (key === 'file' || key === 'src') {
            return normalizePath(path.relative(depsCacheDir, value))
        }
        return value
    }, 2))
    return {metadata}
}




exports.createOptimizeDepsRun = createOptimizeDepsRun



