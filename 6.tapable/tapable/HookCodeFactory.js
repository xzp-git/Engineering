class HookCodeFactory {
  setup(hookInstance, options) {
    //钩子hook._x[]
    hookInstance._x = options.taps.map((tapInfo) => tapInfo.fn);
  }

  init(options) {
    this.options = options;
  }
  deInit() {
    this.options = null;
  }
  args(options = {}) {
    const { after, before } = options;
    let allArgs = this.options.args || [];
    if (before) {
      allArgs = [before, ...allArgs];
    }
    if (after) {
      allArgs = [...allArgs, after];
    }
    return allArgs.join(",");
  }
  header() {
    let code = "";
    code += `var _x = this._x;\n`;
    const { interceptors = [] } = this.options;
    if (interceptors.length > 0) {
      code += `var _taps = this.taps;\n`;
      code += `var _interceptors = this.interceptors;\n`;
      for (let i = 0; i < interceptors.length; i++) {
        const interceptor = interceptors[i];
        if (interceptor.call) {
          code += `_interceptors[${i}].call(${this.args()});\n`;
        }
      }
    }
    return code;
  }

  create(options) {
    this.init(options);
    let fn;
    // this.options.type 一共三种 sync  async  promise

    switch (this.options.type) {
      case "sync":
        fn = new Function(this.args(), this.header() + this.content());
        break;
      case "async":
        fn = new Function(
          this.args({ after: "_callback" }),
          this.header() + this.content({ onDone: () => `_callback();\n` })
        );
        break;
      case "promise":
        let tapsContent = this.content({ onDone: () => `_resolve();\n` });
        let content = `
          return new Promise((function(_resolve, _reject){
            ${tapsContent}
          }))
        `;
        fn = new Function(this.args(), this.header() + content);
        break;
      default:
        break;
    }
    this.deInit();

    return fn;
  }
  callTapsSeries() {
    let code = "";
    for (let i = 0; i < this.options.taps.length; i++) {
      const content = this.callTap(i);
      code += content;
    }
    return code;
  }
  callTapsParallel({ onDone }) {
    const taps = this.options.taps;
    let code = `var _counter = ${taps.length};\n`;
    code += `
      var _done = (function () {
        ${onDone()}
      });\n
    `;
    for (let i = 0; i < taps.length; i++) {
      const content = this.callTap(i);
      code += content;
    }
    return code;
  }

  callTap(tapIndex) {
    let code = "";
    const { interceptors = [] } = this.options;
    // if (interceptors.length > 0) {
    //   code += `var _tap`
    // }
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n`; //var _fn0 = _x[0]
    let tapInfo = this.options.taps[tapIndex]; //{type, fn, name}
    switch (tapInfo.type) {
      case "sync":
        code += `_fn${tapIndex}(${this.args()});\n`; //fn0(name, age)
        break;
      case "async":
        code += `
          _fn${tapIndex}(${this.args()}, (function () {
            if (--_counter === 0) _done();
          }));\n
        `;
        break;
      case "promise":
        code += `
          var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
          _promise${tapIndex}.then((function () {
            if (--_counter === 0) _done();
          }));\n
        `;
        break;
      default:
        break;
    }
    return code;
  }
}
module.exports = HookCodeFactory;
