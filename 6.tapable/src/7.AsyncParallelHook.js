const { AsyncParallelHook } = require("../tapable");
const hook = new AsyncParallelHook(["name", "age"]);
console.time("cost");
hook.tapPromise("1", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("1", name, age);
      resolve();
    }, 3000);
  });
});
hook.tapPromise("2", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("2", name, age);
      resolve();
    }, 2000);
  });
});
hook.tapPromise("3", (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("3", name, age);
      resolve();
    }, 1000);
  });
});
//call方法只有同步钩子才有，异步是没有
//hook.call('zhufeng', 10);
debugger;
hook.promise("zhufeng", 10).then((err) => {
  console.log("done 999");
  console.timeEnd("cost");
});

//老师sync的返回值是不是没用
