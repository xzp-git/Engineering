class Hook {
  constructor(args) {
    this.args = Array.isArray(args) ? args : []; //参数列表 ['name', 'age']
    this.taps = [];
    this.call = CALL_DELEGATE;
    this.callAsync = CALL_ASYNC_DELEGATE;
    this.promise = PROMISE_DELEGATE;
    this._x = null;
    this.interceptors = [];
  }

  tap(options, fn) {
    this._tap("sync", options, fn); //type = sync 注册的是同步回调函数 fn
  }

  tapAsync(options, fn) {
    this._tap("async", options, fn);
  }

  tapPromise(options, fn) {
    this._tap("promise", options, fn);
  }

  _tap(type, options, fn) {
    // 如果传入的是字符串，包装成对象
    if (typeof options === "string") {
      options = { name: options };
    }
    const tapInfo = { ...options, type, fn };
    // this.runRegisterInterceptors
    this._insert(tapInfo);
  }
  _insert(tapInfo) {
    this.taps.push(tapInfo);
  }
  compile(options) {
    throw new Error("此方法是抽象方法，需要子类的实现");
  }
  _createCall(type) {
    return this.compile({
      taps: this.taps, //tapInfo
      args: this.args, //形参数组['name', 'age']
      type,
      interceptors: this.interceptors,
    });
  }
}

const CALL_DELEGATE = function (...args) {
  this.call = this._createCall("sync"); //动态创建call方法

  return this.call(...args); //arg=['zhunfeng', 12]
};

const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async");
  return this.callAsync(...args);
};

const PROMISE_DELEGATE = function (...args) {
  //name,age zhufeng 13
  this.promise = this._createCall("promise"); //动态创建call方法
  return this.promise(...args); //args=['zhufeng',12]
};
module.exports = Hook;
