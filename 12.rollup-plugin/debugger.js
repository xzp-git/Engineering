import { rollup, watch } from 'rollup';
import InputOptions from './rollup.config.js';
(async function () {
  //打包阶段 Build Hooks在构建阶段运行
  //它们主要负责在rollup处理输入文件之前定位、提供和转换输入文件
  //主要用来定位文件，找到文件的绝对路径，读取文件内容，转换文件内容
  const bundle = await rollup(InputOptions);
  //生成阶段
  await bundle.generate(InputOptions.output);
  //写入阶段
  await bundle.write(InputOptions.output);
  const watcher = watch(InputOptions);
  watcher.on('event', event => {
    //console.log(event);
  })
  setTimeout(() => {
    watcher.close();
  }, 1000)
  //关闭阶段
  await bundle.close();
})();