const resolvePlugin = require('./resolve');
const importAnalysisPlugin = require('./importAnalysis');
const preAliasPlugin = require('./preAlias');
async function resolvePlugins(config) {
  return [
    preAliasPlugin(config),//轮不到它执行
    resolvePlugin(config),//resolveId 它能匹配所有的模块名，绝对 相对 第三方 肯定 能返回一个路径
    importAnalysisPlugin(config)//transform
  ]
}
exports.resolvePlugins = resolvePlugins;