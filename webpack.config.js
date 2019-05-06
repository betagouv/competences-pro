const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';
const situations = ['controle', 'inventaire', 'tri'];

function upperFirst (nom) {
  return `${nom[0].toUpperCase()}${nom.substring(1)}`;
}

const entriesSituations = situations.reduce(function (entries, situation) {
  entries[`situation${upperFirst(situation)}`] = path.resolve(__dirname, `src/app/situation${upperFirst(situation)}.js`);
  return entries;
}, {});

const aliasSituations = situations.reduce(function (alias, situation) {
  alias[situation] = path.resolve(__dirname, `src/situations/${situation}/`);
  return alias;
}, {});

const templatesSituations = situations.map(function (situation) {
  return new HtmlWebpackPlugin({
    filename: `${situation}.html`,
    hash: true,
    template: path.resolve(__dirname, 'src/public/template_index.html'),
    chunks: [`situation${upperFirst(situation)}`],
    inject: 'head'
  });
});

module.exports = {
  entry: {
    competencesPro: path.resolve(__dirname, 'src/app/index.js'),
    ...entriesSituations
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].js',
    publicPath: '/' // public URL of the output directory when referenced in a browser
  },
  resolve: {
    alias: {
      accueil: path.resolve(__dirname, 'src/situations/accueil/'),
      commun: path.resolve(__dirname, 'src/situations/commun/'),
      src: path.resolve(__dirname, 'src/'),
      ...aliasSituations
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, 'src/app')],
        loader: 'babel-loader',

        options: {
          plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-object-rest-spread'],

          presets: [
            [
              '@babel/env',
              {
                modules: false
              }
            ]
          ]
        },

        test: /\.js$/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|mp3|svg|woff|woff2|ttf|eot)(\?.*$|$)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[sha512:hash:base64:7].[ext]',
              outputPath: 'assets'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      template: path.resolve(__dirname, 'src/public/template_index.html'),
      chunks: ['competencesPro'],
      inject: 'head'
    }),
    ...templatesSituations,
    new webpack.ProvidePlugin({ jQuery: 'jquery' }),
    new webpack.EnvironmentPlugin(['URL_SERVEUR']),
    new FaviconsWebpackPlugin('./src/public/favicon.svg')
  ],
  devServer: {
    contentBase: './src/public',
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 7700
  }
};
