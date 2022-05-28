const connect = require('connect');

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


exports.createServer = createServer