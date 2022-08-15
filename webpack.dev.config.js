const path = require("path");
const merge = require('webpack-merge');
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const baseConfig = require('./webpack.base.config.js');

const PORT = 8100;
// const PORT = 8083;

const devappname="frameweb";

const devConfig = {
	devtool: 'cheap-module-eval-source-map ',
	plugins: [
		new ProgressBarPlugin(),
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8101,
			ghostMode: false,
			//proxy: `http://localhost:${PORT}/${baseConfig.appname}/`
			proxy: `http://localhost:${PORT}/${devappname}/`
		})
	],
	devServer: {
		//publicPath: `/${baseConfig.appname}/`,
		publicPath: `/${devappname}/`,
		contentBase: [
			path.join(__dirname, "./static"),
			path.join(__dirname, "./src/devstatic")
		],
		port: PORT,
		noInfo: true,
		disableHostCheck: true
	},
};

module.exports = merge(baseConfig, devConfig);