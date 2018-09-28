import BASE from './base';

// ---------------------------------------------------------- Default build bases
export default args => {
    const {input} = args;
    const file = input.split('/').pop();
    const filename = file.split('.').slice(0, -1).join('.');

    return {
        ...BASE,
        output: [{
                file: `lib/${filename}.js`,
                format: 'cjs',
                exports: 'named',
                sourcemap: `${filename}.js.map`
            },
            {
                file: `lib/${filename}.es.js`,
                format: 'es',
                exports: 'named',
                sourcemap: `${filename}.es.js.map`
            }
        ],
    }
};
