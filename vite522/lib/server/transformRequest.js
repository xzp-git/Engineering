const fs = require('fs-extra');
/**
 * 针对所有的对js文件的请求核心处理逻辑就在这里
 * @param {*} url 
 * @param {*} server 
 */

async function transformRequest(url, server) {
    const { pluginContainer } = server
    //先只考虑第一次的请求 /src/main.js
    const { id } = await pluginContainer.resolveId(url) // 获取url地址的绝对路径
    const loadResult = await pluginContainer.load(id) //读取此文件的内容
    let code
    if (loadResult) {
        code = loadResult.code
    }else{
        code = await fs.readFile(id, 'utf8') //如果所有的插件的load钩子都没有返回内容，走默认的逻辑就是读硬盘上的文件
    }
    const transformedResult = await pluginContainer.transform(code, id)
    return transformedResult
}

module.exports = transformRequest