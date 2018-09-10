import deepmerge from 'deepmerge';
import path from 'path';
import DEFAULT_BUILD from './base';


export default deepmerge(DEFAULT_BUILD, {
    input: path.resolve(__dirname, '../origami-zen.ts'),
    output: [
        // Standard export (importable by browser)
        {
            format: 'iife',
            name: 'zen',
            exports: 'named',
            file: path.resolve(__dirname, '../dist/zen.js'),
        },
        // ES6 module export
        {
            file: path.resolve(__dirname, '../dist/zen.es.js'),
            format: 'es',
            name: 'zen',
            exports: 'named'
        }
    ]
});
