const { SyncLoopHook } = require('tapable');
const hook = new SyncLoopHook(['a', 'b']);
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
//Loop不断地执行回调函数，直到函数的返回值是undefined为目 
hook.tap('1', (name, age) => {
  console.log('1', 'counter1', counter1);
  if (++counter1 === 1) {
    counter1 = 0;
    return;
  }
  return true;
});
hook.tap('2', (name, age) => {
  console.log('2', 'counter2', counter2);
  if (++counter2 === 2) {
    counter2 = 0;
    return;
  }
  return true;
});
hook.tap('3', (name, age) => {
  console.log('3', 'counter3', counter3);
  if (++counter3 === 3) {
    counter3 = 0;
    return;
  }
  return true;
});
hook.call('zhufeng', 10);

//老师sync的返回值是不是没用 
