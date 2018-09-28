import BASE from './base';


export default {
    ...BASE,
    output: [
        // Standard export (importable by browser)
        {
            file: `lib/zen.js`,
            format: 'umd',
            name: 'zen',
            exports: 'named',
            sourcemap: 'zen.js.map'
        },

        // ES6 module export
        {
            file: `lib/zen.es.js`,
            format: 'es',
            name: 'zen',
            exports: 'named'
        }
    ]
};
