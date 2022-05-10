const { SyncHook } = require("../tapable");
// const { SyncHook } = require("tapable");

debugger;
const hook = new SyncHook(["a", "b"]);
const fn1 = (name, age) => {
  console.log("1", name, age);
};
hook.tap("1", fn1);
const fn2 = (name) => {
  console.log("2", name);
};
hook.tap({ name: "2" }, fn2);
const fn3 = (name, age) => {
  console.log("3", name, age);
};
hook.tap("3", fn3);
debugger;
hook.call("zhufeng", 10);
