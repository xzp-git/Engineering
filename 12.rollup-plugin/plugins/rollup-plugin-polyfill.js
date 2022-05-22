
const POLYFILL_ID = '\0polyfill';
const PROXY_SUFFIX = '?inject-polyfill-proxy';
function injectPolyfillPlugin() {
    return{
        name: 'inject-polyfill',
        async resolveId(source, importer, options){
            if (source === POLYFILL_ID) {
                return {id: POLYFILL_ID, moduleSideEffects: true}
            }
            // 如果此模块是入口模块
            if (options.isEntry) {
                const resolution = await this.resolve(source, importer, {skipSelf:true, ...options})
                if (!resolution || resolution.external) {
                    return resolution
                }
                // 根据模块路径或得模块信息
                const moduleInfo = await this.load(resolution)
                //are side effects of the module observed 说明有副作用，不能进行 tree shaking
                moduleInfo.moduleSideEffects = true;
                // /C:\12.rollup-plugin\src\index.js?inject-polyfill-proxy 入口模块的绝对路径?inject-polyfill-proxy
                //返回的这个就是模块ID
                return `${resolution.id}${PROXY_SUFFIX}`
            }
        },
        async load(id){
            if (id === POLYFILL_ID) {
                return  'console.log("这就是真正的polyfill代码了")';
            }
            if (id.endsWith(PROXY_SUFFIX)) {
                const entryId = id.slice(0, -PROXY_SUFFIX.length)
                let code = `import ${JSON.stringify(POLYFILL_ID)};\n export * from ${JSON.stringify(entryId)};\n`
                
                const {hasDefaultExport} = this.getModuleInfo(entryId)
                
                if (hasDefaultExport) {
                    code += `export {default} from ${JSON.stringify(extryId)};\n`
                } 
                return code
            }
            return null
        }
    }
}

export default injectPolyfillPlugin;