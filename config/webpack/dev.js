var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var postcssAssets = require('postcss-assets');
var postcssNext = require('postcss-cssnext');
var stylelint = require('stylelint');
var ManifestPlugin = require('webpack-manifest-plugin');
var CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname),
      'node_modules',
      'app',
      'app/redux'
    ],
    alias: {
      // for semantic: redirect theme access to our custom theme (https://medium.com/webmonkeys/webpack-2-semantic-ui-theming-a216ddf60daf)
      '../../theme.config$': path.join(__dirname, '../../src/app/theme/theme.config')
    }
  },

  entry: {
    app: [
      'webpack-hot-middleware/client?reload=true',
      './src/client.tsx',
      './src/vendor/main.ts'
    ]
  },

  output: {
    path: path.resolve('./build'),
    publicPath: '/',
    filename: '[name].js',
    pathinfo: true
  },

  module: {
    rules: [{
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'tslint-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'react-hot-loader!awesome-typescript-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve('./src/app'),
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[local]___[hash:base64:5]',
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                require('postcss-import')({
                  root: loader.resourcePath
                }),
                require('postcss-simple-vars')(),
              ]
            }
          },
        ]
      },
      {
        test: /\.css$/,
        exclude: path.resolve('./src/app'),
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          "style-loader",
          "css-loader",
          "less-loader"
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.inline.svg$/,
        loader: 'babel-loader!svg-react-loader'
      },

      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      },
      {
        test: /\.(woff|woff2)(\?.*)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
      },
      {
        test: /^(?!.*\.inline\.svg$).*\.svg$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
      }
    ]
  },

  plugins: [
    new CheckerPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        tslint: {
          failOnHint: true
        },
        postcss: function () {
          return [
            stylelint({
              files: './src/app/*.css'
            }),
            postcssNext(),
            postcssAssets({
              relative: true
            }),
          ];
        },
      }
    }),
    new ManifestPlugin({
      fileName: 'manifest.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
        VERSION: JSON.stringify('dev'),
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.ejs'
    }),
    new CopyWebpackPlugin([
      { from: './src/favicon.ico', to:"favicon.ico" },
    ])
  ],
  devServer: {
    hot: true,
    historyApiFallback: true,
  }
};

const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
}

createIfDoesntExist('./build');

module.exports = config;
