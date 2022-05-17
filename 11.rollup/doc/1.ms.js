const MagicString = require("magic-string");
const sourceCode = `export var name = "zhangsan"`;
const ms = new MagicString(sourceCode);
console.log(ms);
console.log(ms.snip(0, 6).toString());
console.log(ms.remove(0, 7).toString());

let bundle = new MagicString.Bundle();

bundle.addSource({
  content: "var a = 1",
  separator: "\n",
});

bundle.addSource({
  content: "var b = 2",
  separator: "\n",
});
console.log(bundle.toString());
