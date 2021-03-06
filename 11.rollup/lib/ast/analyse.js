const walk = require('./walk');
const Scope = require('./scope');
const { hasOwnProperty } = require('../utils');

/**
 * 
 * 对语法树进行分析， 找到模块声明的变量和使用到的变量
 * @param {*} ast 
 * @param {*} code 
 * @param {*} module 
 */
function analyse(ast, code, module) {
    let currentScope = new Scope({name: "全局作用域"})
    // 创建作用域链，为了知道我在此模块中声明哪些变量， 这些变量的声明节点是哪个
    ast.body.forEach(statement => {
        function addToScope(name, isBlockDeclaration) {
            currentScope.add(name) //把name变量放入到当前的作用域
            if (!currentScope.parent || (currentScope.isBlock && !isBlockDeclaration)) { //如果没有父作用域，说明这是一个顶级作用域
                statement._defines[name] = true //在一级节点定义一个变量name _defines.say=true
            }
        }
        
        Object.defineProperties(statement, {
            _source:{value: code.snip(statement.start, statement.end)},
            _defines: {value: {}},//此节点上定义的变量
            _modifies:{value:{}},
            _module: { value: module },
            _dependsOn:{value:{}}//此节点读取了哪些变量
        })
        walk(statement, {
            enter(node){
                
                let newScope
                switch (node.type) {
                    case 'FunctionDeclaration':
                        addToScope(node.id.name)
                        const names = node.params.map(param => param.name)
                        newScope = new Scope({name:node.id.name, parent: currentScope, names})
                        break;
                    case 'VariableDeclaration':
                        node.declarations.forEach(declaration => {
                            if (node.kind === 'let' || node.kind === 'const') {
                                addToScope(declaration.id.name, true)
                            }else{
                                addToScope(declaration.id.name, true)
                            }
                        })
                        break
                    case 'BlockStatement':
                        newScope = new Scope({parent: currentScope, isBlock: true})
                        break
                    default:
                        break;
                }
                if (newScope) {
                    Object.defineProperty(statement, '_scope', {value: newScope})
                    currentScope = newScope
                }
            },
            leave(node){
                if (hasOwnProperty(node, '_scope')) {
                    currentScope = currentScope.parent
                }
            }
        })
    })
    // 开始第二次循环 收集每个语句依赖的变量， 读取的变量
    ast.body.forEach(statement => { 
        function checkForReads(node) {
            if (node.type === 'Identifier') {
                // 此语句依赖的或者说读取哪些变量
                statement._dependsOn[node.name] = true
            }
        }
        function checkForWrites(node) {
            function addNode(node) {
                //statement._modifies.age = true
                statement._modifies[node.name] = true
            }
            if (node.type === 'AssignmentExpression') {
                addNode(node.left)
            }else if (node.type === 'UpdateExpression') {
                addNode(node.argument)
            }
        }
        walk(statement, {
            enter(node){
                if (hasOwnProperty(node, '_scope')) {
                    currentScope = node._scope
                }
                checkForReads(node)
                checkForWrites(node)
            },
            leave(node){
                if (hasOwnProperty(node, '_scope')) {
                    currentScope = currentScope.parent
                }
            }
        })
    })


    ast.body.forEach(statement => {
        Object.keys(statement._defines).forEach(name => {
            module.definitions[name] = statement
        })
        Object.keys(statement._modifies).forEach(name => {
            if (!hasOwnProperty(module.modifications, name)) {
                module.modifications[name] = []
            }
            module.modifications.push(statement)
        })
    })
}

module.exports = analyse