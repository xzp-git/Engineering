const path = require('path');
const RunPlugin = require('./plugins/run-plugin');
const DonePlugin = require('./plugins/done-plugin');
module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, 'loaders/logger1-loader.js'),
          path.resolve(__dirname, 'loaders/logger2-loader.js')
        ]
      }
    ]
  },
  plugins: [
    new RunPlugin(),//希望在编译开始的时候运行run插件
    new DonePlugin()//在编译 结束的时候运行done插件
  ]
}