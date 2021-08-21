const webpack = require('webpack');
const path = require('path');
const _ = require('lodash');

// variables
const isProduction = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './build');
const IS_STORYBOOK = process.env['IS_STORYBOOK'] === 'true';

// plugins
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const ASSET_PATH = '/';

module.exports = {
  context: sourcePath,
  entry: {
    app: './main.tsx'
  },
  output: {
    path: outPath,
    publicPath: ASSET_PATH,
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js'
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      // these must match tsconfig.json
      '@actions': path.resolve(__dirname, 'src/app/actions/'),
      '@components': path.join(__dirname, 'src/app/components/'),
      '@constants': path.join(__dirname, 'src/app/constants/'),
      '@containers': path.resolve(__dirname, 'src/app/containers'),
      '@utils': path.join(__dirname, 'src/app/utils/'),
      '@styles': path.join(__dirname, 'src/app/styles/'),
      '@testUtils': path.join(__dirname, 'test/utils/'),
    },
  },
  module: {
    rules: [
      // .ts, .tsx
      {
        test: /src\/.*\.tsx?$/,
        include: [sourcePath],
        use: [
          !isProduction && {
            loader: 'babel-loader',
            options: { plugins: ['react-hot-loader/babel'] }
          },
          'ts-loader'
        ].filter(Boolean)
      },
      // //js
      // {
      //   test: /src\/assets\/.*\.js$/,
      //   use: [ 'script-loader' ],
      // },
      // css
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: !isProduction,
              importLoaders: 1,
              localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-import')({ addDependencyTo: webpack }),
                require('postcss-url')(),
                require('postcss-preset-env')({
                  /* use stage 2 features (defaults) */
                  stage: 2,
                }),
                require('postcss-reporter')(),
                require('postcss-browser-reporter')({
                  disabled: isProduction
                })
              ]
            }
          }
        ]
      },
      // static assets
      // { test: /\.html$/, use: 'html-loader' }, // this is not compatible with HtmlWebpackPlugin
      { test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000' },
      { test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/, use: 'file-loader' }
    ]
  },
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        }
      }
    },
    runtimeChunk: true
  },
  plugins: _.compact([
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
      DEBUG: false,
      ENABLE_FULL_ROUTES: process.env.ENABLE_FULL_ROUTES,
      WS_HOST: process.env.WS_HOST,
    }),
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
      disable: !isProduction
    }),
    // don't use default index.html for storybook
    !IS_STORYBOOK && new HtmlWebpackPlugin({
      template: 'assets/index.html',
    }),
    new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ])
  ]),
  devServer: {
    contentBase: sourcePath,
    allowedHosts: ['node1.hawkguide.com', 'node1.hawkguide.com:4000', 'localhost'],
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4001/',
        secure: false
      }
    },
    stats: 'minimal',
    clientLogLevel: 'warning'
  },
  // https://webpack.js.org/configuration/devtool/
  devtool: isProduction ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
