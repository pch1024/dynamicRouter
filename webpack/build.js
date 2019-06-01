const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const config = require('./config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin

module.exports = merge(config, {
    output: {
        filename: 'js/app.js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: './'
    },
    module: {
        rules: [{
            test: /\.(sa|sc|c|le)ss$/,
            // exclude: /node_modules/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: '../'
                    }
                },
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'), // 根目录
            verbose: true, // 开启在控制台输出信息
            dry: false // 启用删除文件
        }),
        new MiniCssExtractPlugin({
            filename: 'css/app.css'
        }),
        new BundleAnalyzerPlugin()
    ],
    // devtool: 'source-map', // enum
    devtool: 'none', // enum
    mode: 'production'
})