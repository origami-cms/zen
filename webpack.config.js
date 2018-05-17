const path = require('path');
const PATH_SRC = path.resolve(__dirname, 'src');
const PATH_DIST = path.resolve(__dirname, '_bundles');

const BitBarPlugin = require('bitbar-webpack-progress-plugin');

module.exports = {
    entry: {
        "zen": path.join(PATH_SRC, 'index.ts')
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
        extensions: ['.ts', '.js', '.json'],
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
    },
    node: {
        fs: "empty"
    },
    plugins: [
        new BitBarPlugin()
    ]
}
