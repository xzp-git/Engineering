require('esbuild').buildSync({
    entryPoints: ['main.js'],
    outfile: 'out.js'
})