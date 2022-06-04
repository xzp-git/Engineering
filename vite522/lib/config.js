const { normalizePath } = require('./utils');
const path = require('path');
const { resolvePlugins } = require('./plugins');


async function resolveConfig() {
    const root = normalizePath(process.cwd())
    const cacheDir = normalizePath(path.resolve(`node_modules/.vite522`))
    let config = {
        root,
        cacheDir //缓存目录，存放预编译后的文件和metadata.json
    }

    const plugins = await resolvePlugins(config);
    config.plugins = plugins;
    return config
}

module.exports = resolveConfig;