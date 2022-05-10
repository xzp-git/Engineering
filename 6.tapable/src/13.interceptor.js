// const { SyncHook } = require("./tapable");
const { SyncHook } = require("tapable");

const hook = new SyncHook(["name"]);
//拦截器是一个对象，通过intercept方法进行注册,对象里会有三种钩子函数，钩子函数会在合适的时间执行
hook.intercept({
  register(tapInfo) {
    //注册tapInfo拦截器会在你每次注册新的回调前触发
    console.log("intercept1 register", tapInfo.name);
  },
  call(name) {
    //当你调用call方法的时候执行一次，不管你有多少个回调，只执行一次
    console.log("intercept1 call", name);
  },
  tap(tapInfo) {
    //当你执行回调的时候执行，多个回调执行多次
    console.log("intercept1 tap", tapInfo.name);
  },
});
hook.intercept({
  register(tapInfo) {
    console.log("intercept2 register", tapInfo.name);
  },
  call(name) {
    console.log("intercept2 call", name);
  },
  tap(tapInfo) {
    console.log("intercept2 tap", tapInfo.name);
  },
});
hook.tap({ name: "A" }, (name) => {
  console.log("A", name);
});
hook.tap({ name: "B" }, (name) => {
  console.log("B", name);
});
hook.call("zhufeng");
