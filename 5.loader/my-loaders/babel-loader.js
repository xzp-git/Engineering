const babel = require('@babel/core')
const path = require('path')
function loader (source){
    let options = this.getOptions()
    const {code} = babel.transformSync(source, options)
    return code
}


module.exports = loader