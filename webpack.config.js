const path = require('path');

module.exports = {
    entry: "/src/index.js",
    output:{
        path: __dirname + "dist",
        filename: "dist/bundle.js",
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

}