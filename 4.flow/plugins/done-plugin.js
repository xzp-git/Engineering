

class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('DonePlugin');
    });
  }
}
module.exports = DonePlugin;