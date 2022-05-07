const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode:'development',
    devtool: 'source-map',
    entry: './src/index.js',
    context:process.cwd().replace(/\\/g, '/'),
    output:{
        path:path.resolve('dist'),
        filename:'main.js'
    },
    resolveLoader:{
        modules:['my-loaders', 'node_modules']
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:["@babel/preset-env"]
                        }
                    }
                ]
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html'
        })
    ]
}