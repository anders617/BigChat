const HtmlWebPackPlugin = require('html-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devServer: {
    host: 'localhost',
    port: 3000,
  },
	entry: {
		vendor: 'babel-polyfill',
		index: './src/index.jsx',
		background: './src/rpc/background.js',
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
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
    new HtmlWebPackPlugin({
      template: './src/popup.html',
      filename: './popup.html',
    }),
		new EncodingPlugin({
			encoding: 'ascii',
		}),
		new CopyPlugin([
			{from: './src/contentscript.js', to: 'contentscript.js'},
			{from: './manifest.json', to: 'manifest.json'},
		]),
  ],
};
