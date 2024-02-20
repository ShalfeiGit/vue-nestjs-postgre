const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const path = require('path')

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		main: './src/index.ts',
	},
	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
        test: /\.vue$/,
        loader: 'vue-loader'
      },
			{
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      },
			{
				test: /\.css$/i,
				use: [
					process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
				]
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					process.env.NODE_ENV !== 'production' ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
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
		extensions: ['*', '.js', '.ts']
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Startup',
			template: './src/vendor/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new VueLoaderPlugin(),
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
