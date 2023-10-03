const fs = require('fs');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	target: 'web',
	// mode: 'development',
	mode: 'production',
	entry: {
		'weed-client-sdk': path.resolve(__dirname, 'src', 'index.ts'),
	},
	output: {
		path: path.resolve(__dirname, 'dist/'),
		filename: '[name].min.js',
		library: 'WeedClientSDK',
		libraryTarget: 'window',
		//    libraryTarget: 'umd',
		//    umdNamedDefine: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules|node/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						babelrc: false,
						presets: [
							[
								"@babel/preset-env",
								{
									"modules": "umd"
								}
							]
						],
						plugins: [
							"@babel/transform-runtime"
						]
					}
				}
			},
			{
				test: /\.ts$/,
				use: 'ts-loader',
				include: path.resolve(__dirname, 'src')
			}
		]
	},
	resolve: {
      extensions: [ '.ts', '.js' ],
    },
	plugins: [
	],
	devtool: false,
	optimization: {
		/*
	minimizer: [
	  new TerserPlugin({
		include: /\.min\.js$/,
		parallel: true,
		sourceMap: true,
		cache: true,
	  })
	],
	*/
		splitChunks: {
			cacheGroups: {
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: 2
				},
				vendor: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
					priority: 10,
					enforce: true
				}
			},
		},
	},
}
