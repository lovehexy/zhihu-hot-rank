const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const helpers = require('./helpers');
const entrys = helpers.generateEntry();
const babelConfFile = path.resolve(__dirname, '..', '.babelrc');
const babelConf = JSON.parse(fs.readFileSync(babelConfFile, 'utf8'));
const _entrys = Object.assign({}, entrys);
const entryLength = helpers.getEntryPath().length;

for (let key in _entrys) {
  if (_entrys.hasOwnProperty(key)) {
    let element = _entrys[key];
    _entrys[key] = ['babel-polyfill', element];
  }
}

const config = {
  entry: _entrys,
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vue: 'vue/dist/vue.common.js',
      components: '../src/components',
      libs: '../src/libs',
      store: '../src/store',
      types: '../src/types',
      service: '../src/service'
    },
    modules: ['node_modules']
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: babelConf
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader',
        options: {
          name: `assets/[name].[ext]`,
          outputPath: 'static/',
          publicPath: function(url) {
            return url.replace(/^\.\/static\//, '');
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname
      }
    })
  ].concat(
    helpers.generateHtmlPlugin(entrys).concat([
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      })
    ])
  ),

  optimization: {
    runtimeChunk: {
      name: 'static/manifest'
    },
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        common: {
          name: 'static/common',
          minChunks: entryLength,
          priority: -20,
          reuseExistingChunk: true,
          chunks: 'initial'
        },
        vendors: {
          name: 'static/vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'all'
        }
      }
    }
  }
};

module.exports = config;
