const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const path = require('path');
const shell = require('shelljs');

shell.rm('-rf', path.resolve(__dirname, '../', 'dist'));

module.exports = webpackMerge(commonConfig, {
  mode: 'production',
  devtool: false,
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: []
  },
  plugins: []
});
