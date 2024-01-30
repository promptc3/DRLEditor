const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: {
		app: './editor.js',
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js'
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			name: "drlEditor",
			type: "umd"
		}
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	devServer: {
		static: {
			directory: path.join(__dirname, '')
		},
		compress: true,
		port: 9000
	},
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()]
	}
};