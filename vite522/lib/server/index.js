const connect = require('connect');
const { createOptimizeDepsRun } = require('../optimizer');
async function createServer() {
    const config = await resolveConfig()

    const middlewares = connect()
    const server = {
        async listen(port){
            await runOptimize(config, server)
            require('http').createServer(middlewares).listen(port, () => {
                console.log(`dev server running at http://localhost:${port}`)
            })

        }
    }

    return server
}


async function runOptimize(config, server) {
    const optimizeDeps = await createOptimizeDepsRun(config)

}


exports.createServer = createServer