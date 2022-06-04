const fs = require('fs-extra')
const path = require('path')
const htmlTypesRE = /\.html$/
const { createPluginContainer } = require('../server/pluginContainer');//运行vite插件的容器
const resolvePlugin = require('../plugins/resolve')
const {normalizePath} = require('../utils')
const scriptModuleRE = /<script\s+type="module"\s+src\="(.+?)"><\/script>/;
const JS_TYPES_RE = /\.js$/;


async function esBuildScanPlugin(config, depImports) {
    config.plugins = [resolvePlugin(config)]
    const container = await createPluginContainer(config)
    //此方法第一次执行的时候 importee = C:\vite522use\index.html
    const resolve = async (importee, importer = path.join(root, 'index.html')) => {
        return await container.resolveId(importee, importer)
    }

    return {
        name: 'vite:dep-scan',
        setup(build){
            // 用来解析路径
            build.onResolve({filter: htmlTypesRE}, async ({path, importer}) => {
                const resolved = await resolve(path, importer)
                if (resolved) {
                    return {
                        path: resolved.id || resolved,
                        namespace: 'html'
                    }
                }
            })

            //读取文件内容
            build.onLoad({filter:htmlTypesRE, namespace: 'html'}, async ({path}) => {
                const html = fs.readFileSync(path, 'utf-8') // 读取 index.html的内容
                const [, scriptSrc] = html.match(scriptModuleRE)
                const js = `import ${JSON.stringify(scriptSrc)}` // import "/src/main.js"
                return{ //我这个index.html文件它的内容等同于import "/src/main.js" 文件类型就是js
                    contents: js,
                    loader:'js'
                }
            })
            //path = /src/main.js importer=index.html
            build.onResolve({filter: /.*/}, async({path, importer}) => {
                const resolved = await resolve(path, importer) //path=vue
                if (resolved) {
                    const id = resolved.id || resolved
                    const included = id.includes('node_modules')
                    if (included) {
                        depImports[path] = normalizePath(id)
                        return{
                            path: id,
                            external: true
                        }
                    }
                    return {path: id}
                }
            })

            //path已经是绝对路径了
            build.onLoad({filter: JS_TYPES_RE}, async ({path: id}) => {
                let ext = path.extname(id).slice(1)
                let contents = fs.readFileSync(id, 'utf-8')
                return {
                    contents, //import {createApp} from 'vue'
                    loader: ext
                }
            })
        }
    }
}


module.exports = esBuildScanPlugin