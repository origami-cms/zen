const path = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const components = [
    'Autocomplete',
    'Button',
    'ButtonGroup',
    'Checkbox',
    'CheckboxIcons',
    'Form',
    'FormRow',
    'Icon',
    'IconSet',
    'Input',
    'InputDropdown',
    'Link',
    'Loading',
    'Radio',
    'Router',
    'RadioIcons',
    'RadioTabs',
    'Select',
    'Tooltip',
    'InputFile',
    'InputColor'
].reduce((obj, cur) => {
    obj[`./packages/components/${cur}/${cur}.js`] = `./packages/components/${cur}/${cur}.ts`;
    return obj
}, {});


module.exports = (env, {mode}) => ({
    entry: {
        ...components,
        'zen.js': './zen.ts',
        'API/index.js': './packages/lib/API'
    },
    context: path.resolve('./'),
    output: {
        filename: '[name]',
        path: path.resolve('./')
    },
    module: {
        rules: [
            {test: /\.ts/, loader: 'awesome-typescript-loader'},
            // {
            //     test: /\.ts/,
            //     exclude: /components/,
            //     loader: 'ts-loader',
            //     // options: {
            //     //     baseDir: './'
            //     // }
            // }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
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
