import BASE from './base';
import path from 'path';
import vizualizer from 'rollup-plugin-visualizer';

// ---------------------------------------------------------- Default build bases
export default args => {
  const {
    input
  } = args;
  const dist = path.resolve(process.cwd(), path.dirname(path.dirname(input)));
  console.log(dist);


  const file = input.split('/').pop();
  const filename = file.split('.').slice(0, -1).join('.');

  const config = {
    ...BASE,
    output: [{
        freeze: false,
        file: path.resolve(dist, `build/${filename}.js`),
        format: 'iife',
        name: 'zen',
        exports: 'named',
        sourcemap: `Zen${filename}.js.map`
      },
      {
        freeze: false,
        file: path.resolve(dist, `build/${filename}.es.js`),
        format: 'es',
        exports: 'named',
        sourcemap: `${filename}.es.js.map`
      },
    ],
  }
  config.plugins.push(
    vizualizer({
      filename: path.resolve(dist, 'build/stats.html'),
      sourcemap: true
    })
  );

  return config;
};
