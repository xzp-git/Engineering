require('esbuild').buildSync({
  entryPoints: ['main.js'],
  bundle: true,
  loader: { '.js': 'jsx' },
  outfile: 'out.js'
});