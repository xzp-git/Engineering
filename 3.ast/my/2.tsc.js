const pathLib = require('path');
const babel = require('@babel/core');
const types = require('@babel/types');


function transformType(type) {
    switch (type) {
        case 'TSNumberKeyword':
        case 'NumberTypeAnnotation':
            return 'number';
        case 'TSStringKeyword':
        case 'StringTypeAnnotation':
            return 'string'
        case 'TSBooleanKeyword':
        case 'BooleanTypeAnnotation':
            return 'boolean'
    }
}


const tscCheckPlugin = () => {
    return {
        pre(file){
            file.set('errors', []);
        },
        visitor:{
            CallExpression(path, state){
                const errors = state.file.get('errors');
                /**
                 * [TSNumberKeyword, TSStringKeyword] => [number, string]
                 * 1.得到传给泛型的数组
                 */
                const trueTypes = path.node.typeParameters.params.map(param => {
                    const type = param.type;
                    return transformType(type);
                })
                //2. 获取实参类型数组
                const argumentsTypes = path.get('arguments').map( arg => transformType(arg.getTypeAnnotation().type))

                //3. 计算泛型的类型
                const genericMap = new Map()
                const funcName = path.get('callee').node.name //join
                const calleePath = path.scope.getBinding(funcName).path
                calleePath.node.typeParameters.params.map((param, index) => {
                    genericMap.set(param.name, trueTypes[index])
                })

                //4.计算形参的类型
                const paramTypes = calleePath.get('params').map((param, index) => {
                    const typeAnnotation = param.getTypeAnnotation().typeAnnotation
                    if (typeAnnotation.type === 'TSTypeReference') { //如果这个形参的类型是一个泛型
                        return genericMap.get(typeAnnotation.typeName.name)
                    }else {
                        return transformType(typeAnnotation.type)
                    }
                })

                paramTypes.forEach((type, index) => {
                    if (type !== argumentsTypes[index]) {
                        Error.stackTraceLimit = 0
                        errors.push(path.get('init').buildCodeFrameError(`无法把${argumentsTypes[index]}赋值给${type}`, Error))
                    }
                })

            }
        },
        post(file){
            console.log(...file.get('errors'))
        }
    }
}










let sourceCode = `
function join<T, W>(a:T,b:W) { }
join<string, number>('1', '2');
`;

const result = babel.transform(sourceCode, {
    parserOpts: { plugins: ['typescript'] },
    plugins: [tscCheckPlugin()]
})
console.log(result.code);