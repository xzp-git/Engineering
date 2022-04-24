//模块定义
var modules = {
  './src/title.js': (module, exports, require) => {
    //标识此exports是一个es module的导出
    require.r(exports);
    require.d(exports, {
      'default': () => _DEFAULT_EXPORT_,
      'age': () => age
    });
    const _DEFAULT_EXPORT_ = ('title_name');
    const age = 'title_age'
  }
}

var cache = {};
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = cache[moduleId] = {
    exports: {}
  };
  modules[moduleId](module, module.exports, require);
  return module.exports;
}

require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });//[object Module]
  Object.defineProperty(exports, '__esModule', { value: true });//exports.__esModule=true
}
require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key]
    });
  }
}
let title = require('./src/title.js');
console.log(title);
console.log(title.age);