const pathLib = require('path')
const babel = require('@babel/core')
const types = require('@babel/types')
const uglifyPlugin = () => {
    return {
        pre(file) {
            file.set('errors', [])
        },
        visitor: {
            Scopable(path) {
                Object.entries(path.scope.bindings).forEach(([key, bindings]) => {
                    const newName = path.scope.generateUid('a')
                    bindings.path.scope.rename(key, newName)
                })
            }
        },
        post(file) {
            console.log(...file.get('errors'))
        }
    }
}
let sourceCode = `
  function getAge(){
      var age = 12;
      console.log(age);
      var name = 'zhufeng';
      console.log(name);
  }
`;
const result = babel.transform(sourceCode, {
    parserOpts: { plugins: ['typescript'] },
    plugins: [uglifyPlugin()]
})
console.log(result.code);
