const path = require("path");
const nodeExternals = require("webpack-node-externals");

const NodemonPlugin = require("nodemon-webpack-plugin"); // Ding

module.exports = {
  mode: "development",
  target: "node", // in order to ignore built-in modules like path, fs, etc.
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },

  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new NodemonPlugin(), // Dong
  ],
};
