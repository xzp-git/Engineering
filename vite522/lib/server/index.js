const connect = require('connect');
const resolveConfig = require('../config');
const serveStaticMiddleware = require('./middlewares/static');
const transformMiddleware = require('./middlewares/transform');
const { createOptimizeDepsRun } = require('../optimizer');
const {createPluginContainer} = require('./pluginContainer')

async function createServer() {
    const config = await resolveConfig()
    const middlewares = connect()
    const pluginContainer = await createPluginContainer(config);
    const server = {
        pluginContainer,
        async listen(port){
            await runOptimize(config, server)
            require('http').createServer(middlewares).listen(port, () => {
                console.log(`dev server running at http://localhost:${port}`)
            })

        }
    }
    for (const plugin of config.plugins) {
        if (plugin.configureServer)
        plugin.configureServer(server);
    }
    
    middlewares.use(transformMiddleware(server)) //负责转换内容
    middlewares.use(serveStaticMiddleware(config))

    return server
}


async function runOptimize(config, server) {
    const optimizeDeps = await createOptimizeDepsRun(config)
    server._optimizeDepsMetadata = optimizeDeps.metadata
    /**
     * {
        optimized: {
                vue: {
                src: 'D:/zhufeng/Engineering/vite522use/node_modules/vue/dist/vue.runtime.esm-bundler.js',
                file: 'D:/zhufeng/Engineering/vite522use/node_modules/.vite522/deps/vue.js'
                }
            }
        }
     */
}


exports.createServer = createServer