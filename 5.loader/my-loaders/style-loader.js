const path = require('path')

function loader(cssSource) {
    
}


loader.pitch = function (remainingRequest) {

    //remainingRequest是一个字符串， loader的绝对路径加上要加载的文件的绝对路径，用!拼接在一起
    let script = `
        let style = document.createElement("style")
        style.innerHTML = require(${stringifyRequest(this, "!!" + remainingRequest)})
        document.head.appendChild(style)
    `
    return script
}


function stringifyRequest(loaderContext, request) {
    const prefixReg = /^-?!+/
    const prefixRequest = request.match(prefixReg)
    const prefix = prefixRequest? prefixRequest[0] : ''

    const splitted = request.replace(prefixReg, '').split('!')
    //[C:/5.loader\my-loaders\less-loader.js,C:\5.loader\src\index.less]
    const {context} = loaderContext //loaderContext.context指的是项目的根目录
    // "!!./my-loaders/less-loader.js!./src/index.less"
    return JSON.stringify(prefix+splitted.map(part =>{
        part = path.relative(context, part) //获取此文件路径相对于项目根目录的相对路径
        if (part[0] !== '.') part = './' + part
        return part.replace(/\\/g, '/')
    }).join('!'))
}

module.exports = loader