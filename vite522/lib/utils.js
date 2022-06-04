

function normalizePath(id) {
  return id.replace(/\\/g, '/');
}
exports.normalizePath = normalizePath;


const knownJsSrcRE = /\.js/;
//http://localhost:3000/src/main.js => url=/src/main.js
const isJSRequest = (url) => {
  return knownJsSrcRE.test(url)
}
exports.isJSRequest = isJSRequest;