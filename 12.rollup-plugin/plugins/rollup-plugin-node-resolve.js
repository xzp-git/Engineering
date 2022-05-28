import path from path
import Module from 'module'


function resolvePlugin(params) {
    return {
        name:'commonjs',
        async resolveId(importee, importer){
            if (importee[0] === '.' || path.isAbsoulte(importee)) {
                return n
            }
            let location = Module.createRequire(path.dirname(importer)).resolve(importee)
            return location
        }
    }

}

export default resolvePlugin