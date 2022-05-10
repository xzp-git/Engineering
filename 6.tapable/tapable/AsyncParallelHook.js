const Hook = require("./Hook");
const HookCodeFactory = require("./HookCodeFactory");
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content({ onDone }) {
    return this.callTapsParallel({ onDone });
  }
}

const factory = new AsyncParallelHookCodeFactory();
class AsyncParallelHook extends Hook {
  compile(options) {
    factory.setup(this, options); // this._x = [fn1, fn2, fn3]
    return factory.create(options);
  }
}
module.exports = AsyncParallelHook;
