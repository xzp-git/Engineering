const { runLoaders } = require("./loader-runner");
const path = require("path");
const fs = require("fs");
const entryFile = path.resolve(__dirname, "src/index.js");
const request = `inline1-loader!inline2-loader!${entryFile}`;
let rules = [
  {
    test: /\.js$/,
    use: ["normal1-loader", "normal2-loader"],
  },
  {
    test: /\.js$/,
    enforce: "pre", //是不是pre跟loader本身没有关系，跟你写在配置文件里的时候，enforce的值有关系
    use: ["pre1-loader", "pre2-loader"],
  },
  {
    test: /\.js$/,
    enforce: "post",
    use: ["post1-loader", "post2-loader"],
  },
];

let parts = request.replace(/^-?!+/, "").split("!");
let resource = parts.pop(); //把目标文件弹出，parts只剩下行内loader   resource 是${entryFile}
let inlineLoaders = parts;
//loader的叠加顺序 = post（后置）+inline（内联）+normal(正常) + pre（前置） 厚脸挣钱

let preLoaders = [],
  postLoaders = [],
  normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce === "post") {
      postLoaders.push(...rule.use);
    } else if (rule.enforce === "pre") {
      preLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}

let loaders = [];
//noPrePostAutoLoaders	不要前后置和普通 loader,只要内联 loader
if (request.startsWith("!!")) {
  loaders.push(...inlineLoaders);
} else if (request.startsWith("-!")) {
  //不要前置和普通Loader
  loaders.push(...postLoaders, ...inlineLoaders);
} else if (request.startsWith("!")) {
  //不要普通loader
  loaders.push(...postLoaders, ...inlineLoaders, ...preLoaders);
} else {
  loaders.push(
    ...postLoaders,
    ...inlineLoaders,
    ...normalLoaders,
    ...preLoaders
  );
}

loaders = loaders.map((loader) => path.resolve(__dirname, "loaders", loader));
runLoaders(
  {
    resource,
    loaders,
    context: { age: 15 }, //默认的上下文对象,不传的话默认就是空对象，此对象将会成为loader执行时的this指针，是的getOptions
    readResource: fs.readFile,
  },
  (err, result) => {
    console.log(result);
  }
);
