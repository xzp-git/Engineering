// import build from './plugins/rollup-plugin-build.js';
// import polyfill from './plugins/rollup-plugin-polyfill.js';
// import babel from './plugins/rollup-plugin-babel.js';
//import generation from './plugins/rollup-plugin-generation.js';
// import dynamicImport from './plugins/rollup-plugin-dynamicImport.js';
// import resolveFileUrl from './plugins/rollup-plugin-resolveFileUrl.js';
import html from './plugins/rollup-plugin-html.js';
//import commonjs from '@rollup/plugin-commonjs';
//import commonjs from './plugins/rollup-plugin-commonjs.js';
//import resolve from '@rollup/plugin-node-resolve';
//import resolve from './plugins/rollup-plugin-node-resolve.js';
//import alias from '@rollup/plugin-alias';
// import alias from './plugins/rollup-plugin-alias.js';
export default {
  input: './src/index.js',
  output: {
    dir: 'dist'
  },
  plugins: [
    // build(),
    // polyfill(),
    //  babel({
    //    include: /src/,
    //    exclude: /node_modules/,
    //    extensions: ['.js', '.jsx']
    //  })
    // dynamicImport()
    // resolveFileUrl(),
    html()
    //commonjs()
    //resolve(),
    // alias({
    //   entries: [
    //     { find: /isArray/, replacement: './check-is-array.js' }
    //   ]
    // })
  ]
}