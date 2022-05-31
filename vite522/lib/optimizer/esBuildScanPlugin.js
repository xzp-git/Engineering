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
    //此方法第一次执行的时候 import
}


module.exports = esBuildScanPlugin