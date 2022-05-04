class Compilation{
    constructor(options){
        this.options = options
    }

    build(onCompiled){
        //真正的编译逻辑是在这个方法里写的
        //5. 根据配置中的entry找出入口文件
        onCompiled(null,{toJson(){}}, [])
    }
}

module.exports = Compilation