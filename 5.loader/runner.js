const { runLoaders } = require('loader-runner');
const path = require('path');
const entryFile = path.resolve(__dirname, 'src/index.js');
const request = `inline1-loader!inline2-loader!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ['normal1-loader', 'normal2-loader']
  },
  {
    test: /\.js$/,
    enforce: 'pre',//是不是pre跟loader本身没有关系，跟你写在配置文件里的时候，enforce的值有关系
    use: ['pre1-loader', 'pre2-loader']
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post1-loader', 'post2-loader']
  }
]


let parts = request.replace(/^-?!+/, '').split('!')
let resource = parts.pop()//把目标文件弹出，只剩下行内loader
let inlineLoaders = parts
//loader的叠加顺序 = post（后置）+inline（内联）+normal(正常) + pre（前置） 厚脸挣钱

let preLoaders = [], postLoaders