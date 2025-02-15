'use strict'

const paths = require('./paths')
const path = require('path')
// style files regexes
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const getStyleLoaders = require('./util').getStyleLoaders

const webpackModule = {
  strictExportPresence: true,
  rules: [
    { parser: { requireEnsure: false } },
    {
      oneOf: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]'
          }
        },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            presets: [
              [
                require.resolve('@babel/preset-env'),
                {
                  modules: false
                }
              ],
              require.resolve('@babel/preset-react')
            ],
            plugins: [
              require.resolve('@babel/plugin-transform-runtime')
            ]
          }
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: getStyleLoaders({
            importLoaders: 1
          })
        },
        {
          test: /\.module\.css$/,
          use: getStyleLoaders({
            importLoaders: 1,
            modules: true,
            getLocalIdent: getCSSModuleLocalIdent
          })
        },
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              localIdentName: '[local]'
            },
            'less-loader'
          ),
          sideEffects: true
        },
        {
          test: /\.module\.less$/,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent
            },
            'less-loader'
          )
        },
        {
          exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]'
          }
        }
      ]
    }
  ]
}

module.exports = {
  stats: {
    children: false,
    entrypoints: false
  },
  mode: process.env.NODE_ENV,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../web')
    },
    extensions: paths.moduleFileExtensions
      .map(ext => `.${ext}`)
  },
  module: webpackModule,
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].css',
      chunkFilename: 'static/css/[name].chunk.css'
    })
  ],
  performance: false
}
