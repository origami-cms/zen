const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DIST = path.resolve(__dirname, '../dist');
module.exports = {
    entry: [
        path.resolve(__dirname, '../src/index.ts')
    ],
    output: {
        filename: 'zen.js',
        path: DIST,
        publicPath: '/'
    },
    devtool: 'source-map',
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
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HTMLPlugin({
            template: path.resolve(__dirname, '../test/index.html')
        }),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, '../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js')
            }
        ]),
    ]
};
