const less = require('less')

function loader(lessSource) {
    let cssSource

    less.render(lessSource, {
        filename:this.resource
    }, (err, output) => {
        cssSource = output.css
    })

    return `module.exports=${JSON.stringify(cssSource)}`
}

module.exports = loader