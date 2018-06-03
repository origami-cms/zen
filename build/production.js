const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DIST = path.resolve(__dirname, '../');
module.exports = {
    entry: {
        'zen.min': path.resolve(__dirname, '../src/index.ts'),
        'decorators': path.resolve(__dirname, '../src/util/decorators.ts')
    },
    output: {
        filename: '[name].js',
        path: DIST,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            }, {
                test: /\.scss/,
                loaders: [
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'compressed'
                        }
                    }
                ],
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.html', '.scss'],
        alias: {
            'icons': path.resolve(__dirname, '../node_modules/origami-icons'),
            'util': path.resolve(__dirname, '../src/util'),
            'lib': path.resolve(__dirname, '../src/lib')
        }
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
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin()
    ]
};
