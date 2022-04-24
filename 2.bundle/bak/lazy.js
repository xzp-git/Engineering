//初始化的是一个空的模块对象
var modules = {};
//已经加载过的模块
var cache = {};
//相当在浏览器里用于加载模块的polyfill
//这个缓存是在浏览器里执行的时候缓存的
function require(moduleId) {
  var cachedModule = cache[moduleId];
  if (cachedModule !== undefined) {
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {},
  });
  modules[moduleId](module, module.exports, require);
  return module.exports;
}
require.r = (exports) => {
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); //[object Module]
  Object.defineProperty(exports, "__esModule", { value: true }); //exports.__esModule=true
};
require.d = (exports, definition) => {
  for (var key in definition) {
    Object.defineProperty(exports, key, {
      get: definition[key],
    });
  }
};
require.f = {};
require.p = "";
require.u = (chunkId) => `${chunkId}.js`;
//已经安装好的代码块，main.js就是对应的main代码块。0表示已经加载成功，已经就绪
var installedChunks = { main: 0 };
function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = [];
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i];
    resolves.push(installedChunks[chunkId][0]);
    installedChunks[chunkId] = 0; //标记一下代码块已经加载完成了
  }
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId];
  }
  while (resolves.length) {
    resolves.shift()();
  }
}
require.l = function (url) {
  let script = document.createElement("script");
  script.src = url;
  document.head.appendChild(script);
};
require.f.j = function (chunkId, promises) {
  var installedChunkData;
  var promise = new Promise((resolve, reject) => {
    installedChunkData = installedChunks[chunkId] = [resolve, reject];
  });
  installedChunkData[2] = promise; //installedChunkData=[resolve, reject,promise]
  promises.push(promise);
  var url = require.p + require.u(chunkId); // src_hello_js.js
  require.l(url);
};
require.e = function (chunkId) {
  let promises = [];
  require.f.j(chunkId, promises);
  return Promise.all(promises);
};
var chunkGlobal = (window["chunkGlobal"] = []);
chunkGlobal.push = webpackJsonpCallback;
//1.先通过jsonp加载src_hello_js代码块对应的文件，加载回来后要在浏览器里执行此JS脚本
debugger;
require
  .e("src_hello_js")
  .then(require.bind(require, "./src/hello.js"))
  .then((result) => {
    console.log(result);
  });
