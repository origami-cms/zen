const path = require('path');
const PATH_SRC = path.resolve(__dirname, 'src');
const PATH_DIST = path.resolve(__dirname, 'dist');

module.exports = {
    entry: path.join(PATH_SRC, 'index.ts'),
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'ts-loader',
                exclude: /node_modules/
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
        filename: 'zen.js',
        path: PATH_DIST
    }
}
