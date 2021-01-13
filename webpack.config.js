const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
        publicPath:'/assets/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.csv$/,
                type: 'asset/resource'
            },
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 5000,
        hot: true
    }
};