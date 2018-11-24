const path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.dev');
const opn = require('opn');
const helpers = require('./helpers');
const serverConfig = require('./server.config');
const { port, domain } = serverConfig.dev;
const protocol = 'http';

const openFilename = helpers
  .getEntryPath()[0]
  .split('/')
  .slice(-2)[0]
  .replace(/\..*/, '');

for (const key in webpackConfig.entry) {
  if (webpackConfig.entry.hasOwnProperty(key)) {
    let element = webpackConfig.entry[key];
    if (element instanceof Array) {
      element = element.unshift(
        `webpack-dev-server/client?http://localhost:${port}/`
      );
    } else {
      webpackConfig.entry[key] = [
        `webpack-dev-server/client?http://localhost:${port}/`,
        element
      ];
    }
  }
}

const compiler = Webpack(webpackConfig);

const server = new WebpackDevServer(compiler, {
  compress: true,
  port,
  https: protocol === 'https',
  publicPath: '/',
  allowedHosts: [domain, 'localhost'],
  stats: {
    colors: true
  },
  open: true
});

server.listen(port, '127.0.0.1', () => {
  console.log(
    `[WDS]Started webpack-dev-server on ${protocol}://localhost:${port}`
  );
  opn(`${protocol}://${domain}:${port}/${openFilename}.html`);
});
