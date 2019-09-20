const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = "development";

module.exports = {
    entry: "./src/index",
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html"
          })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    }
}