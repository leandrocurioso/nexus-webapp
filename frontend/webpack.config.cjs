const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",

  entry: "./assets/js/boot.js",

  output: {
    path: path.resolve(__dirname, "..", "backend", "public"),
    filename: "_bundle.js",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.SERVER_API_HOST": process.env.SERVER_API_HOST ? JSON.stringify(process.env.SERVER_API_HOST) : JSON.stringify("http://localhost:3010")
    }),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, "assets"), 
          to: path.resolve(__dirname, "..", "backend", "public", "assets") 
        },
      ],
    }),
  ],
};
