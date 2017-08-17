var webpack = require('webpack');
var path = require('path');
module.exports = function (config) {
  config = config || {};
  return {
    entry: {
      app: './src/js/app.js',
      client: [
        './src/js/client.js'
      ],
      vendor: [
        'react',
        'react-dom'
      ]
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: "/dist/",
      filename: '[name].min.js'
    },

    plugins: config.uglify ? [
      new webpack.optimize.UglifyJsPlugin({
        mangle: config.mangle || false,
        compress: {warnings: false}
      }),
    ] : [
    ],
    module: {
      rules: [
        {
          test: /\.less\.module$/,
          loader: 'style-loader!css-loader?modules&localIdentName=[local]___[hash:base64:5]!postcss-loader!less-loader'
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: './tsconfig.json',
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_module/
        }
      ]
    },
    resolve: {
      alias: {
      },
      extensions: [".ts", ".tsx", ".js", ".json"],
    },
    node: {
      net: 'empty',
      http: 'empty'
    }
  };
};
