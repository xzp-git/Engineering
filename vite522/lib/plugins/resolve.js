const fs = require('fs-extra')
const path = require('path')
const resolve = require('resolve')


// vite插件
function resolvePlugin(config) {
    return{
        name: 'vite:resolve',
        resolveId(importee, importer){
            if (importee.startsWith('/')) { //说明这个相对于项目根目录的绝对路径 /src/main.js
                return {id: path.resolve(config.root, importee.slice(1))} //项目根目录 /src/main.js
            }
            //如果已经是硬盘上的绝对路径了可以直接返回
            if (path.isAbsolute(importee)) {
                return {id: importee}
            }
        }
    }
}