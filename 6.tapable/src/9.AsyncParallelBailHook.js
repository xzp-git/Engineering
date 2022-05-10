const { AsyncParallelBailHook } = require('tapable');
const hook = new AsyncParallelBailHook(['name', 'age']);
console.time('cost');
hook.tapPromise('1', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('1', name, age);
      resolve();
    }, 1000);
  });
});
hook.tapPromise('2', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2', name, age);
      resolve('2错误');
      //reject('2错误');
    }, 2000);
  });
});
hook.tapPromise('3', (name, age) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('3', name, age);
      resolve();
    }, 3000);
  });
});
//call方法只有同步钩子才有，异步是没有
//hook.call('zhufeng', 10);
hook.promise('zhufeng', 10).then((err) => {
  console.log('done');
  console.timeEnd('cost');
}, error => {
  console.timeEnd('cost');
  console.log(error);
});

//老师sync的返回值是不是没用 
