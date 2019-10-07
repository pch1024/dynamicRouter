const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mainjs = path.resolve(__dirname, '../src/demo/main.js')
// const mainjs = path.resolve(__dirname, '../src/dynamicRouter/main.js');

module.exports = {
    entry: mainjs,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
            },
            {
                test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: 'assets/images/networkSecuritySituation.[name].[ext]', // 源文件
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    limit: 10000,
                    name: 'assets/font/networkSecuritySituation.[name].[ext]', // 源文件
                },
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
        extensions: ['*', '.js', '.vue', '.json'],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            hash: true,
            inject: true,
            filename: 'index.html',
            title: '网络安全态势',
            template: 'index.ejs',
        }),
    ],
};
