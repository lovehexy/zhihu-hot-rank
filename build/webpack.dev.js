const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const serverConfig = require('./server.config');
const { port, domain } = serverConfig.dev;
const path = require('path');

module.exports = webpackMerge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: `http://${domain}:${port}/`,
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: []
  },
  devServer: {
    historyApiFallback: true,
    staticOptions: {},
    stats: 'minimal'
  },
  plugins: []
});
