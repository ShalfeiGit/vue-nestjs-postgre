﻿const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		main: './src/index.tsx',
		vendor: './src/vendor/vendor.tsx'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|tsx|ts)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
        test: /\.svg$/,
        use: [
          {
            loader: "babel-loader"
          },
          {
            loader: "react-svg-loader",
            options: {
              jsx: true // true outputs JSX tags
            }
          }
        ]
      },
			{
				test: /\.s[ac]ss$/i,
				use: [
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/i,
				type: 'asset/resource'
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource'
			}
		]
	},
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './src/components')
		},
		extensions: ['*', '.js', '.jsx', '.tsx', '.ts']
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Startup',
			template: './src/vendor/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		})
	],
	optimization: {
		removeAvailableModules: true,
		removeEmptyChunks: true,
		splitChunks: false,
		usedExports: true
	},
	performance: {
		hints: false,
 }
}
