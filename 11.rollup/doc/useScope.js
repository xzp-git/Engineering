//acorn=esprima=@babel/parser

var a = 1;
function one() {
  var b = 2;
  function two() {
    var c = 3;
    console.log(a, b, c);
  }
}
//全局作用域
//one作用域.parent=全局作用域
//two作用域.parent=one作用域

let Scope = require('./scope');
let globalScope = new Scope({ name: '全局作用域', names: ['a'], parent: null })
let oneScope = new Scope({ name: 'one作用域', names: ['b'], parent: globalScope })
let twoScope = new Scope({ name: 'two作用域', names: ['c'], parent: oneScope })
console.log(twoScope.findDefiningScope('a'));
console.log(twoScope.findDefiningScope('b'));
console.log(twoScope.findDefiningScope('c'));