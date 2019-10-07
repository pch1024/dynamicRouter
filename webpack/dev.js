const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const config = require('./config');

module.exports = merge(config, {
    output: {
        filename: 'js/networkSecuritySituation.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(sa|sc|c|le)ss$/,
                // exclude: /node_modules/,
                use: [
                    'style-loader', // 将 JS 字符串生成为 style 节点
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        index: 'index.html',
        hot: true,
        // host:'192.168.0.101',
        open: true,
        port: 1024,
        overlay: {
            warnings: true,
            errors: true,
        },
    },
    devtool: 'source-map', // enum
    mode: 'development',
});
