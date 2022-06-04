
const { normalizePath } = require('../utils');
const path = require('path');


async function createPluginContainer({ root, plugins }) {
    class PluginContext {
        async resolve(importee, importer = path.join(root, 'index.html')){
            return await container.resolveId(importee, importer)
        }
    }
    const container = {
        async resolveId(importee, importer){
            let ctx = new PluginContext()
            let resolveId = importee
            for(const plugin of plugins){
                if(!plugin.resolveId) continue
                const result = await plugin.resolveId.call(ctx, importee, importer)
                if (result) {
                    resolveId = result.id || result;
                    break;//只要有一个插件返回了resolveId,结束遍历
                }
            }
            return {
                id: normalizePath(resolveId)
            }
        },
        async load(id){
            let ctx = new PluginContext()
            for(const plugin of plugins){
                if(!plugin.load) continue
                const result = await plugin.load.call(ctx, id)
                if (result) {
                   return result
                }
            }
            return null
        },
        async transform (code, id){
            let ctx = new PluginContext()
            for(const plugin of plugins){
                if(!plugin.transform) continue
                const result = await plugin.transform.call(ctx, code, id)
                if (!result) {
                    continue
                }
                //如果在返回值，用当前插件的返回值传给下一个钩子
                code = result.code || result
            }
            return {code}
        }
    }   
    
    return container
}

exports.createPluginContainer = createPluginContainer