const path = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');


module.exports = (env, {
    mode
}) => ({
    entry: {
        'zen.js': path.resolve(__dirname, '../zen.ts')
    },
    context: path.resolve(__dirname, '../'),
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, '../')
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    node: {
        fs: 'empty'
    },
    optimization: {
        minimizer: [
            new UglifyPlugin({
                uglifyOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
});
