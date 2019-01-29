// import minify from 'rollup-plugin-babel-minify';
// import commonjs from 'rollup-plugin-commonjs';
// import multiEntry from 'rollup-plugin-multi-entry';
// import resolve from 'rollup-plugin-node-resolve';
// import progress from 'rollup-plugin-progress';
// import replace from 'rollup-plugin-replace';
// import sourcemaps from 'rollup-plugin-sourcemaps';
// import vizualizer from 'rollup-plugin-visualizer';
// import ts from 'rollup-plugin-typescript2';
// import typescript from 'typescript';


// export default {
//   plugins: [
//     multiEntry(),
//     resolve({
//       module: true,
//       jsnext: true,
//       main: true,
//       browser: true,
//       modulesOnly: true,
//     }),
//     // babel({
//     //   presets: ['es2015-rollup'],
//     // }),
//     // commonjs(),
//     ts({
//       typescript,
//       useTsconfigDeclarationDir: true
//     }),
//     minify({
//       comments: false
//     }),
//     replace({
//       'process.env.NODE_ENV': JSON.stringify('production')
//     }),
//     sourcemaps(),
//     vizualizer({
//       filename: './build/stats.html',
//       sourcemap: true
//     }),
//     progress()
//   ]
// }

import minify from 'rollup-plugin-babel-minify';
import commonjs from 'rollup-plugin-commonjs';
import multiEntry from 'rollup-plugin-multi-entry';
import resolve from 'rollup-plugin-node-resolve';
import progress from 'rollup-plugin-progress';
import replace from 'rollup-plugin-replace';
import sourcemaps from 'rollup-plugin-sourcemaps';
import ts from 'rollup-plugin-typescript2';
import typescript from 'typescript';


export default {
  treeshake: {
    pureExternalModules: true,
    propertyReadSideEffects: false
  },
  plugins: [
    multiEntry(),
    commonjs(),
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      modulesOnly: false,
    }),
    ts({
      typescript,
      useTsconfigDeclarationDir: true
    }),
    minify({
      comments: false,
      // plugins: ['transform-object-rest-spread']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    sourcemaps(),
    progress()
  ]
}
