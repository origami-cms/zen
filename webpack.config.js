const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DIST = path.resolve(__dirname, 'build');
module.exports = {
    entry: [
        './src/index.ts'
    ],
    output: {
        filename: 'zen.min.js',
        path: DIST,
        publicPath: '/'
    },
    devServer: {
        contentBase: DIST,
        compress: true,
        port: 9000,
        publicPath: DIST,
        inline: true,
        hot: true,
        watchOptions: {
            poll: true
        }
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
            'icons': path.resolve(__dirname, 'node_modules/origami-icons'),
            'util': path.resolve('./src/util'),
            'lib': path.resolve('./src/lib')
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
        new ForkTsCheckerWebpackPlugin(),
        new HTMLPlugin({
            template: './test/index.html'
        }),
        new CopyPlugin([
            {
                from: path.resolve(__dirname, './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js')
            }
        ]),
    ]
};
