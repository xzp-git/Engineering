const { AsyncParallelHook } = require("../tapable");
// const { AsyncParallelHook } = require("tapable");

const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");
hook.tapAsync("1", (name, age, callback) => {
  setTimeout(() => {
    console.log("1", name, age);
    callback();
  }, 1000);
});
hook.tapAsync("2", (name, age, callback) => {
  setTimeout(() => {
    console.log("2", name, age);
    callback();
  }, 2000);
});
hook.tapAsync("3", (name, age, callback) => {
  setTimeout(() => {
    console.log("3", name, age);
    callback();
  }, 3000);
});
//call方法只有同步钩子才有，异步是没有
debugger;
hook.callAsync("zhufeng", 10, (err) => {
  console.log("done");
  console.timeEnd("cost");
});

//老师sync的返回值是不是没用
