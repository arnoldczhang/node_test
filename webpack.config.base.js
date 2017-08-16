var webpack = require('webpack');
var path = require('path');
module.exports = function (config) {
  config = config || {};
  return {
    entry: {
      app: './src/js/app.js'
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '/',
      filename: '[name].min.js'
    },

    plugins: config.uglify ? [
      new webpack.optimize.UglifyJsPlugin({
        mangle: config.mangle || false,
        compress: {warnings: false}
      }),
      new webpack.HotModuleReplacementPlugin()
    ] : [
      new webpack.HotModuleReplacementPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.less\.module$/,
          loader: 'style-loader!css-loader?modules&localIdentName=[local]___[hash:base64:5]!postcss-loader!less-loader'
        }
      ]
    },
    node: {
      net: 'empty'
    }
  };
};
