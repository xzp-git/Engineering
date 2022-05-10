const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
class SyncHookCodeFactory extends HookCodeFactory {
  content() {
    return this.callTapsSeries();
  }
}

const factory = new SyncHookCodeFactory();
class SyncHook extends Hook {
  compile(options) {
    factory.setup(this, options); // this._x = [fn1, fn2, fn3]
    return factory.create(options);
  }
}
module.exports = SyncHook;
