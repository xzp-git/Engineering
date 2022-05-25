dynamicImportPolyfill('./title-013f5190.js',import.meta.url).then((res) => {
    console.log(res);
});


/**
 * 
 * @param {*} filename  导入的模块
 * @param {*} url 
 */
function dynamicImportPolyfill(filename, url) {
    console.log(filename); //./title-1c517c5b.js
  console.log(url);     //http://127.0.0.1:8080/index.js

  return new Promise((resolve, reject) => {
      let script = document.createElement('script')
      script.type = 'module'
      script.onload = () => {
        resolve(window.mod)
      }
      const absURL = new URL(filename, url).href
      const blob = new Blob([
          `import * mod from '${absURL}';\n`,
          `window.mod = mod;\n`
      ], {type: 'text/javascript'})
      script.src = URL.createObjectURL(blob)
      document.head.appendChild(script)
  })
}