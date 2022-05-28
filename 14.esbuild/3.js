const envPlugin = {
    name: 'env',
    setup(build){ //build = Compiler
        //rollup 插件里的resolveId, 决定如何查找文件路径
        //拦截名 为env的导入路径， 以使esbuild不把他们映射到文件的系统里
        //用 env-ns 命名空间来标记他们，以便使后面的插件可以插件可以处理他们
        build.onResolve({filter: /^env$/, namespace: 'file'}, args => {
            return {
                path: args.path, //代表此模块的路径 env
                namespace: 'env-xxx'
            }
        })

        build.onLoad({filter: /.*/, namespace: 'env-xxx'}, () => {
            return {
                contents:JSON.stringify(process.env),//用于指定模块的内容，如果有了，就走后面的onLoad回调和默读处理逻辑
                loader: 'json'
            }
        })

    }
}



require('esbuild').build({
    entryPoints: ['main.js'],
  bundle: true,
  plugins: [envPlugin],
  outfile: 'out.js'
})