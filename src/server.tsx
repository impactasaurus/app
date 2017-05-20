const appConfig = require('../config/main');

import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

const express = require('express');
const path = require('path');
const compression = require('compression');
const Chalk = require('chalk');

const app = express();

app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack/dev');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

app.use('/public', express.static(path.join(__dirname, 'public')));


app.get('*', function(_, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(appConfig.port, appConfig.host, (err) => {
  if (err) {
    console.error(Chalk.bgRed(err));
  } else {
    console.info(Chalk.black.bgGreen(
      `\n\n💂  Listening at http://${appConfig.host}:${appConfig.port}\n`,
    ));
  }
});
