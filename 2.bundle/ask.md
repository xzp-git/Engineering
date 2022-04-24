commonjs es module 导出的区别
一个是导出的引用
一个是导出的值


枪里没有子弹
index中使用esModule引入 也一样结果吗 
Dave
感觉 esmodule 不合理    
张仁阳



难忘记nice
commonjs如果到处的是对象呢 
难忘记nice
导出的是对象 
难忘记nice
commonjs如果导出的是对象，对象的值变了 会更新吗 
Dave
导出的是对象，但是他的对象是 先组起来再导出的  
难忘记nice
var a = {count: 0}
export.a = a
setTimeout(()=>{a.count++},1000) 
难忘记nice
这种 
LiuXi
哇。这首歌好爆 


chunkId
每个入口包括entry和动态加载的入口会有一个入口文件，此入口模块和它直接或间接依赖的模块会组成一个代码块
chunk,每个chunk都会有一个id
main

./src/hello.js
_src_hello_js
chunkId


15:14
路人乙
default 可以导出多个吗 不可能

15:21
清风
老师也就是说每一个模块中的内容都会变成chunk中的key为路径，value为代码内容吗 
模块跟代码块不是一个维度的


每个入口会变成一个代码块chunk
每个入口模块和它依赖的模块属于同一个代码块chunk\\

每个模块都会成为模块定义对象中的属性和值，属性名是模块的相对路径，值是一个函数，函数里的内容是模块代码内容

15:51
龙卷风
为什么promises是多个

因为有可能加载多个远程代码块


1 明白了 就是一个文件会变成modules中的一个 key:value 

一个chunk中包含多个module的关系 
入口1 和 入口2 共同的依赖呢 



加载完，文件，然后在触发 require 方法。这么怎么衔接的 .then 吗？ 
韦林
就是一个大文件。里面把所有依赖都打进取 
田
同一个方法， 多次打包嘛？ 不是吧 
是的



Leeo
公共模块提取
 
田
 那刚才k就不对了 
韦林
所有就有了处理公共代码啊 
韦林
抽离公共代码库 antd lodash 这样就不用每次都打入各个模块浪费资源 


各个模块应该用 cmd window 全局关键字的这种方式使用的把 
shine
一个模块内的 同一个依赖引入多次也会重复打包吗 不会。有缓存的
打包的时候缓存
modules=set



cache 忽略了 
韦林
这个缓存是调用多次把 require 多次 缓存 
