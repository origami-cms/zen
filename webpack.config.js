const path = require('path');
const PATH_SRC = path.resolve(__dirname, 'src');
const PATH_DIST = path.resolve(__dirname, '_bundles');

module.exports = {
    entry: {
        "zen": path.join(PATH_SRC, 'index.ts'),
        // "Element": path.join(PATH_SRC, 'lib/Element.ts'),
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                query: {
                    // declaration: false
                }
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            },
            {
                test: /\.scss/,
                loader: 'css-loader!sass-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts'],
        alias: {
            'icons': path.resolve(__dirname, 'node_modules/origami-icons')
        }
    },
    output: {
        filename: '[name].js',
        path: PATH_DIST,
        libraryTarget: 'umd',
        library: 'zen',
        umdNamedDefine: true
    }
}
