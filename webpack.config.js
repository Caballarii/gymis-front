const path = require('path');
const webpack = require('webpack');
var babelpolyfill = require("babel-polyfill");

module.exports = {
    entry: "./src/index.jsx",
    output:{
        path: __dirname + "/",
        filename: "./dist/bundle.js",
    },
    module:{
        rules:[
            {
                test:/\.js[x]$/,
                loader:"babel-loader"
            },{
                test:/\.css$/,
                loader:"style-loader!css-loader"
            },{
                test:/\.less$/,
                loader:"style-loader!css-loader!less-loader"
            }
        ]
    },
    resolve: {extensions:['.js','.jsx']},
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.optimize.UglifyJsPlugin({

        //})
    ],

    devServer: {
        port: 3000, //监听的Server端口
        historyApiFallback: true,
        proxy: {
            '/api/v1/*': {
                target: 'http://localhost:9977',
                secure: true,
                changeOrigin: true
            }
        }
    }
}