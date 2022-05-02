const types = require('@babel/types')


const babelPluginImport = () => {
    console.log("使用");
    return{
        visitor:{
            ImportDeclaration(path, state){
                const {node} = path;
                const {specifiers} = node
                const {libraryName, libraryDirectory} = state.opts
                if (node.source.value === libraryName && !types.isImportDefaultSpecifier(specifiers[0])) {
                    const importDeclarations = specifiers.map(specifier => {
                        const source = types.stringLiteral([libraryName, libraryDirectory, specifier.imported.name].filter(Boolean).join('/'))
                        return types.importDeclaration(
                            [types.importDefaultSpecifier(specifier.local)],
                            source
                        )
                    
                    })
                    path.replaceWithMultiple(importDeclarations)
                }
    
            }
        }
    }
}



module.exports = babelPluginImport