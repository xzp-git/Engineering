const { SyncWaterfallHook } = require("tapable");
const hook = new SyncWaterfallHook(["a", "b"]);
//events tap 注册 call触发
hook.tap("1", (name, age) => {
  console.log("1", name, age);
  return "1";
});
hook.tap("2", (name, age) => {
  console.log("2", name, age);
  return "2";
});
hook.tap("3", (name, age) => {
  console.log("3", name, age);
});
hook.call("zhufeng", 10);

//老师sync的返回值是不是没用
