var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  
    entry: {
      'abonnement-js': './src/abonnement.ts',
      'abonnement-js.min': './src/abonnement.ts'
    },
    output: {
      path: path.resolve(__dirname, '_bundles'),
      filename: '[name].js',
      libraryTarget: 'umd',
      library: 'abonnement-js',
      umdNamedDefine: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [
      new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: true, include: /\.min\.js$/, }),
    ],
    module: {
      loaders: [{ test: /\.tsx?$/, loader: 'awesome-typescript-loader', exclude: /node_modules/, query: { declaration: false, }
      }]
    }
  }