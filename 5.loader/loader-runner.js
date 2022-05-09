const fs = require("fs");

/**
 * 根据loader模块的绝对路径得到loader对象
 * @param {*} loader
 */
function createLoaderObject(loader) {
  const normal = require(loader);
  const pitch = normal.pitch;

  return {
    path: loader,
    normal,
    pitch,
    raw: normal.raw, //如果raw为true 那么normal参数就是Buffer
    data: {}, //每个loader对象都会有个自定义data对象
    pitchExecuted: false, //此loader的pitch函数已经执行过了吗
    normalExecuted: false, //此loader的normal函数已经执行过了吗
  };
}

function runLoaders(options, finalCallback) {
  const {
    resource,
    loaders = [],
    context = {},
    readResource = fs.readFile,
  } = options;

  const loaderObject = loaders.map(createLoaderObject);

  const loaderContext = context; // 会成为loader执行过程中的this指针
  loaderContext.resource = resource;
  loaderContext.readResource = readResource;
  loaderContext.loaders = loaderObject;
  loaderContext.loaderIndex = 0; //当前正在执行的loader的索引
  loaderContext.callback = null; //调用callback可以让当前的loader执行结束，并且像后续的loader传递多个值
  loaderContext.sync = null; // 是内置方法， 可以把loader的执行从同步变成异步
  // 全量的loader        loader1!loader2!loader3!file.js
  Object.defineProperty(loaderContext, "request", {
    get() {
      return loaderContext.loaders
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });
  //剩下的loader  loader3!file.js
  Object.defineProperty(loaderContext, "remainingRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex + 1)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  //现在正在执行的的loader  loader2!loader3!file.js
  Object.defineProperty(loaderContext, "currentRequest", {
    get() {
      return loaderContext.loaders
        .slice(loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  //已经执行完的loader  loader1
  Object.defineProperty(loaderContext, "previousRequest", {
    get() {
      return loaderContext.loaders
        .slice(0, loaderContext.loaderIndex)
        .map((loader) => loader.path)
        .concat(loaderContext.resource)
        .join("!");
    },
  });

  Object.defineProperty(loaderContext, "data", {
    get() {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });

  let processOptions = {
    resourceBuffer: null, //存放着要加载的模块的原始内容
    readResource, // 读取文件的方法， 默认值是fs.readfile
  };

  //开始从左向右迭代执行loader的pitch PitchingCallback
  iteratePitchingLoaders(processOptions, loaderContext, (err, result) => {
    finalCallback(err, {
      result,
      resourceBuffer: processOptions.resourceBuffer,
    });
  });
}

function processResource(processOptions, loaderContext, pitchingCallback) {
  processOptions.readResource(loaderContext.resource, (err, resourceBuffer) => {
    processOptions.resourceBuffer = resourceBuffer;
    loaderContext.loaderIndex--; //减一后会指向最后一个loader
    iterateNormalLoaders(
      processOptions,
      loaderContext,
      [resourceBuffer],
      pitchingCallback
    );
  });
}
function converArgs(args, raw) {
  if (raw && !Buffer.isBuffer(args[0])) {
    args[0] = Buffer.from(args);
  } else if (!raw && Buffer.isBuffer(args[0])) {
    args[0] = args[0].toString("utf8");
  }
}

function iterateNormalLoaders(
  processOptions,
  loaderContext,
  args,
  pitchingCallback
) {
  if (loaderContext.loaderIndex < 0) {
    return pitchingCallback(null, args);
  }
  const currentLoader = loaderContext.loaders[loaderContext.loaderIndex];
  if (currentLoader.normalExecuted) {
    loaderContext.loaderIndex--;
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      args,
      pitchingCallback
    );
  }
  let normalFn = currentLoader.normal;
  currentLoader.normalExecuted = true;
  converArgs(args, currentLoader.raw);

  runSyncOrAsync(normalFn, loaderContext, args, (err, ...returnArgs) => {
    if (err) return pitchingCallback(err);
    return iterateNormalLoaders(
      processOptions,
      loaderContext,
      returnArgs,
      pitchingCallback
    );
  });
}

function iteratePitchingLoaders(
  processOptions,
  loaderContext,
  pitchingCallback
) {
  //如果越界了 证明 pitch阶段执行完毕了 就去读取文件的内容
  if (loaderContext.loaderIndex >= loaderContext.loaders.length) {
    return processResource(processOptions, loaderContext, pitchingCallback);
  }

  const currentLoader = loaderContext.loaders[loaderContext.loaderIndex];

  if (currentLoader.pitchExecuted) {
    loaderContext.loaderIndex++;
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }
  let pitchFn = currentLoader.pitch;
  //不管pitch函数有没有， 都把这个pitchExecuted设置为true
  currentLoader.pitchExecuted = true;
  //如果pitch函数不存在，则递归iteratePitchingLoaders
  if (!pitchFn) {
    return iteratePitchingLoaders(
      processOptions,
      loaderContext,
      pitchingCallback
    );
  }
  //如果pitchFn有值 以同步或者异步调用pitchFn方法，以loaderContext为this指针

  runSyncOrAsync(
    pitchFn,
    loaderContext,
    [
      loaderContext.remainingRequest,
      loaderContext.previousRequest,
      loaderContext.data,
    ],
    (err, ...args) => {
      //判断有没有返回值， 如果有返回值，需要掉头执行前一个loader的normal
      if (args.length > 0 && args.some((item) => item)) {
        loaderContext.loaderIndex--;
        iterateNormalLoaders(
          processOptions,
          loaderContext,
          args,
          pitchingCallback
        );
      } else {
        return iteratePitchingLoaders(
          processOptions,
          loaderContext,
          pitchingCallback
        );
      }
    }
  );
}
function runSyncOrAsync(fn, loaderContext, args, runCallback) {
  let isSync = true; //默认loader的执行是同步的
  let isDone = false; //表示此函数已经完成
  loaderContext.callback = (err, ...args) => {
    if (isDone) {
      throw new Error("async(): The callback was already called");
    }
    isDone = true;
    runCallback(err, ...args);
  };

  loaderContext.async = () => {
    isSync = false; //把isSync 是否同步执行的标志 从同步变成异步

    return loaderContext.callback;
  };
  let result = fn.apply(loaderContext, args);
  if (isSync) {
    //如果isSync是同步的话，由本方法直接调用 runCallback，用来执行下一个loader
    isDone = true;
    runCallback(null, result);
  }
}
exports.runLoaders = runLoaders;
