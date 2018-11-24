const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

exports.getEntryPath = () => {
  let result = [];
  try {
    result = fs
      .readdirSync('./src/pages')
      .filter(item => item.indexOf('.') !== 0)
      .map(item => `./src/pages/${item}/index.ts`);
  } catch (e) {}
  return result;
};

exports.generateEntry = () => {
  const entry = {};
  const entrys = this.getEntryPath();
  entrys.forEach(entryJs => {
    let key = entryJs.replace('./src/pages', 'static').replace('.js', '');
    key = key
      .replace(new RegExp(`${path.basename(key)  }$`), '')
      .replace(/\/$/, '');
    entry[key] = entryJs;
  });
  return entry;
};

exports.generateHtmlPlugin = entrys => {
  const plugins = [];
  for (const key in entrys) {
    const htmlPath = path.dirname(entrys[key]);
    const basename = path.basename(entrys[key], '.ts');
    const template = `${htmlPath}/${basename}.html`;
    const filename = `${key.replace('static/', '')  }.html`;
    plugins.push(
      new HtmlWebpackPlugin({
        filename,
        template,
        inject: 'body',
        chunks: [key, 'static/common', 'static/vendors', 'static/manifest']
      })
    );
  }
  return plugins;
};
