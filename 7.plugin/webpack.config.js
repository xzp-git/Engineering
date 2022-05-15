const path = require('path')

const DonePlugin = require('./plugins/done-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackAssetsPlugin = require('./plugins/webpack-assets-plugin')
const WebpackAutoExternalPlugin = require('./plugins/webpack-auto-external-plugin')

module.exports = {
    mode: 'development',
    devtool: false,
    entry:{
        main: './src/index.js'
    },
    output:{
        path:path.resolve('dist'),
        filename:'main.js'
    },
    plugins:[
        new WebpackAssetsPlugin(),
        new DonePlugin({ name: 'done' }),
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        }),
        new WebpackAutoExternalPlugin({
            jquery: {
                variable: '$',//CDN引入后的全局变量名
                url: 'https://cdn.bootcss.com/jquery/3.1.0/jquery.js'//CDN脚本地址
              },
              lodash: {
                variable: '_',
                url: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js'
              }
        })
    ]
}