import BASE from './base';
import vizualizer from 'rollup-plugin-visualizer';
import path from 'path';


export default args => {
  const config = {
    ...BASE,
    output: [
      // Standard export (importable by browser)
      {
        file: `build/zen.js`,
        format: 'umd',
        name: 'zen',
        exports: 'named',
        sourcemap: 'zen.js.map'
      },

      // ES6 module export
      {
        file: `build/zen.es.js`,
        format: 'es',
        name: 'zen',
        exports: 'named'
      }
    ]
  }
  config.plugins.push(
    vizualizer({
      filename: path.resolve(process.cwd(), 'build/stats.html'),
      // sourcemap: true
    })
  );

  return config;
};
