const {SyncHook} = require('tapable')
const path = require('path')
const fs = require('fs')
const { Compilation } = require('./Compilation')




class Compiler{
    constructor(options){
        this.options = options
        this.hooks = {
            run :new SyncHook(),
            done: new SyncHook()
        }
    }

    run(callback){
        this.hooks.run.call();
        const onCompiled = (err, stats, fileDependencies) => {
            callback(err, stats)
            //会遍历依赖的文件，对这些文件进行监听，当这些文件发生变化后会重新开始一次新的编译
            fileDependencies.forEach(fileDependency => {
                fs.watch(fileDependency, () => this.compile(onCompiled))
            })
            this.hooks.done,call()
        }
        //调用this.compile方法开始真正的编译，编译成功后会执行onCompiled回调
        this.compile(onCompiled)
    }

    //每次调用compile方法，都会创建一个新的Compilation
    compile(callback){
        const compilation = new Compilation(this.options)

        //调用compilation的build方法开始编译
        compilation.build(callback)
    }


    
}


module.export = Compiler