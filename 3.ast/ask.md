16:35
ganlu
this是怎么实现的呢 
韦林
ArrowFunctionExpression是规定名称吧 
AST语法对上的每个节点类型都是定死的，都有规范

shine
所以插件就是改变语法树某些属性而已？ 是的
我赌你的枪里没有子弹
要修改哪个节点 就要写哪个类型 是的
韦林
节点类型 

韦林撤回了一条消息
韦林
ArrowFunctionExpression是规定名称吧 节点类型 是的
肉包子
源代码--ast ---改变ast ---生成新代码 这样吗 是的


16:45
韦林
id 是变量名 init 是变量值？ 

是的

16:54
韦林
先把预期写出来放到解析解析，转换方法参考 预期解析的结构写 


17:05
shine
感觉能写eslint了 
韦林
prototype.setName 来个 
shine
如果我是想在代码中插入代码呢？ 
replaceWith



感觉需要对常用的API要了解， 有没有相关手册和好的文章 
