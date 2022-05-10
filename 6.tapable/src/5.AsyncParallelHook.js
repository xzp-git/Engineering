const { AsyncParallelHook } = require('tapable');
const hook = new AsyncParallelHook(['name', 'age']);
hook.tap('1', (name, age) => {
  console.log('1', name, age);
  return '1';
});
hook.tap('2', (name, age) => {
  console.log('2', name, age);
});
hook.tap('3', (name, age) => {
  console.log('3', name, age);
});
debugger
hook.callAsync('zhufeng', 10, (err) => {
  console.log('done');
});
