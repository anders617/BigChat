const HtmlWebPackPlugin = require('html-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');

module.exports = {
  devServer: {
    host: 'localhost',
    port: 3000,
  },
  entry: ['babel-polyfill', './src/index.jsx'],
	output: {
		path: __dirname + '/dist',
		filename: 'main.js',
	},
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
		new EncodingPlugin({
			encoding: 'ascii',
		}),
  ],
};
