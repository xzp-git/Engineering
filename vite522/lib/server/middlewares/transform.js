const { parse } = require('url');
const { isJSRequest } = require('../../utils');
 const send = require('../send');//express res.send
const transformRequest = require('../transformRequest')

function transformMiddleware(server) {

    return async function (req, res, next) {
        if (req.method !== 'GET') {
            // 只转换GET请求
            return next()
        }


        let url = parse(req.url).pathname // 取得路径名
        if (isJSRequest(url)) {
            //如果是一个JS请求
            const result = await transformRequest(url, server)
            if (result) {
                return send(req, res, result.code, 'js')
            }else{
                return next()
            }
        }else{
            return next()
        }
    }

    
}


module.exports = transformMiddleware