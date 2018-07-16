const path = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

const components = [
    'Autocomplete',
    'Button',
    'ButtonGroup',
    'Checkbox',
    'Form',
    'FormRow',
    'Icon',
    'IconSet',
    'Input',
    'InputDropdown',
    'Link',
    'Loading',
    'Radio',
    'RadioIcons',
    'RadioTabs',
    'Router',
    'Select',
    'Tooltip',
    'InputFile',
    'Router',
    'InputColor'
].reduce((obj, cur) => {
    obj[`./packages/components/${cur}/${cur}.js`] = `./packages/components/${cur}/${cur}.ts`;
    return obj
}, {});


module.exports = (env, {
    mode
}) => ({
    entry: {
        ...components
    },
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
