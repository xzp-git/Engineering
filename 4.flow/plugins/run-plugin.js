

class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('RunPlugin1');
    });
    compiler.hooks.run.tap('RunPlugin', () => {
      console.log('RunPlugin2');
    });
  }
}
module.exports = RunPlugin;