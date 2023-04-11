
/**
 * Webpack Config
 */
const path = require('path');
const fs = require('fs');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const publicPath = "/";
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

// environment variables for Firebase configuration
const dotenv = require('dotenv');
const webpack = require('webpack');
// call dotenv and it will return an Object with a parsed key 
const env = dotenv.config().parsed;
// reduce it to a nice object, the same as before
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

const pathsToClean = [
    'dist',
    'build'
];

const cleanOptions = {
    root: __dirname,
    verbose: false,
    dry: false
};

module.exports = (env, argv) => ({
  entry: ["babel-polyfill", "react-hot-loader/patch", "./src/index.js"],
  output: {
      path: resolveApp('dist'),
      filename: 'assets/js/[name].[hash:8].js',
      chunkFilename: 'assets/js/[name].[hash:8].chunk.js',
      publicPath: argv.mode === 'production'
           ? '/tract/'
           : '/',
      hotUpdateChunkFilename: 'hot/hot-update.js',
      hotUpdateMainFilename: 'hot/hot-update.json'
  },
  devServer: {
      contentBase: './src/index.js',
      compress: true,
      port: 3005, // port number
      historyApiFallback: true,
      quiet: true,
    //   host: '0.0.0.0',
    //   disableHostCheck: true
  },
  resolve: {
      alias: {
          Components: path.resolve(__dirname, 'src/components/'),
          Containers: path.resolve(__dirname, 'src/containers/'),
          Assets: path.resolve(__dirname, 'src/assets/'),
          Util: path.resolve(__dirname, 'src/util/'),
          Routes: path.resolve(__dirname, 'src/routes/'),
          Constants: path.resolve(__dirname, 'src/constants/'),
          Redux: path.resolve(__dirname, 'src/redux/'),
          Data: path.resolve(__dirname, 'src/data/')
      }
  },
  module: {
      rules: [
          {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                  loader: "babel-loader"
              }
          },
          {
              test: /\.html$/,
              use: [
                  {
                      loader: "html-loader",
                      options: { minimize: true }
                  }
              ]
          },
          {
              test: /\.css$/,
              use: [MiniCssExtractPlugin.loader, "css-loader"]
          },
          {
              test: /\.scss$/,
              use: [
                  {
                    loader: MiniCssExtractPlugin.loader
                  },
                  {
                    loader: "css-loader",
                    options: {
                        url: false
                    }
                  },
                  {
                    loader: "sass-loader",
                    options: {
                        data: `$publicPath: ' ';` // dev empty baseref
                        //data: `$publicPath: '/tract';` // production baseref
                        //data: `$publicPath : ${argv.mode === 'production' ? '/tract' : ' '};`,
                    }
                  }
              ]
          },
          {
            test: /\.(png|jpe?g|gif)$/i,
            use: [
              {
                loader: 'file-loader',
              },
            ],
          },
      ]
  },
  optimization: {
      minimizer: [
          new UglifyJsPlugin({
              cache: true,
              parallel: true,
              uglifyOptions: {
                  compress: false,
                  ecma: 6,
                  mangle: true
              },
              sourceMap: true
          }),
          new OptimizeCSSAssetsPlugin({})
      ]
  },
  performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false
  },
  plugins: [
    new CopyWebpackPlugin([
        {from:'src/assets/img',to:'assets/img'},{from:'src/assets/fonts',to:'assets/fonts'}
    ]),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
        favicon: './public/favicon.ico'
    }),
    new MiniCssExtractPlugin({
        filename: "assets/css/[name].[hash:8].css"
    }),
    new HtmlWebpackTagsPlugin({ tags: ["assets/fonts/simple-line-icons/css/simple-line-icons.css", "assets/fonts/iconsmind/style.css"], append: true }),
    new webpack.DefinePlugin(envKeys)
  ]
});
