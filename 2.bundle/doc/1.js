console.log(Object.prototype.toString.call("foo"));
console.log(Object.prototype.toString.call([]));
console.log(Object.prototype.toString.call(3));
console.log(Object.prototype.toString.call(true));
console.log(Object.prototype.toString.call(undefined));
console.log(Object.prototype.toString.call(null));

let myExports = {}
//myExports[Symbol.toStringTag] = { value: 'Module' };
Object.defineProperty(myExports, Symbol.toStringTag, { value: 'Module' });
console.log(Object.prototype.toString.call(myExports));