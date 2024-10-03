const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  // other webpack configurations...
  resolve: {
    fallback: {
      process: require.resolve("process/browser"),
    },
  },
  plugins: [
    new Dotenv(),
    // No changes needed here for process polyfill
  ],
};
