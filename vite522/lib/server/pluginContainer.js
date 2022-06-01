

async function createPluginContainer(params) {
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
                const result = await plugin.resolveId.call(ctx, importee, importor)
            }
        }
    }   
    
    return container
}

module.exports = createPluginContainer