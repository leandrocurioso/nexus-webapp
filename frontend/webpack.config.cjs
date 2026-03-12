const webpack = require('webpack');
const path = require('path');

module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),

    ],
    entry: path.resolve(__dirname, 'assets', 'js', 'boot.js'),
    output: {
        filename: '_bundle.js',
        path: path.resolve(__dirname, 'assets', 'js')
    },
    mode: 'production',
};
