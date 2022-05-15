class DonePlugin{
    constructor(options){
        this.options = options
    }
    apply(compiler){
        compiler.hooks.done.tap('DonePlugin', () => {
            console.log('done1', this.options.name);
        })
        compiler.hooks.done.tapAsync('DonePlugin', (stats, callback) => {
            console.log('done2', this.options.name);
            callback();
        });
    }
}

module.exports = DonePlugin