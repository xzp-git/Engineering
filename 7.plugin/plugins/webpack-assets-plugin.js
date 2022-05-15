/**
 * 用来打印编译完成后，打印本次产出的代码块和文件
 */

class WebpackAssetsPlugin {
    apply(compiler){
        // 每当compiler创建一个新的compilation的时候，会执行回调，参数就是新的compilation
        compiler.hooks.compilation.tap('WebpackAssetsPlugin', (compilation) => {
            compilation.hooks.chunkAsset.tap('WebpackAssetsPlugin', (chunk, filename) => {
                //chunk.name=main filename=main.js
                console.log(chunk.name || chunk.id, filename);
            })
        })
    }
}

module.exports = WebpackAssetsPlugin