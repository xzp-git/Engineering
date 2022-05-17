class Scope {
  constructor(options = {}) {
    this.name = options.name; //作用域的名称，没有什么用
    this.parent = options.parent; //父作用域
    this.names = options.names || []; //此作用域内声明的变量
  }
  add(name) {
    this.names.push(name);
  }

  findDefiningScope(name) {
    // 如果这个作用域内声明了次变量返回自己
    if (this.names.includes(name)) {
      return this;
    } else if (this.parent) {
      //如果说自己没有此变量，但是有父作用域，用父作用域的方法找此变量
      return this.parent.findDefiningScope(name);
    } else {
      return null;
    }
  }
}
module.exports = Scope;
