const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLESS = new ExtractTextPlugin('[name].css', {
	allChunks: true,
	disable: false
});
const manifest = require('./vendor-manifest.json');

const appname = "bjyhweb";

const baseConfig = {
	appname: appname,
	version: (new Date()).getTime(),
	entry: {
		main: ["es5-shim", "es5-shim/es5-sham", 'vpreact', 'vpbusiness', path.join(__dirname, "src/index.js")],
	},
	output: {
		path: path.join(__dirname, "./webapp"),
		filename: '[name].js',
		chunkFilename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.(jsx|js)$/,
			loaders: ['babel-loader?cacheDirectory'],
			include: path.join(__dirname, 'src')
		}, {
			test: /\.(png|jpg|gif|eot|svg|ttf|woff|woff2)\??.*$/,
			loader: 'url-loader?limit=8192&name=images/[hash:5].[name].[ext]'
		}, {
			test: /\.(css|less)$/,
			loaders: ['style-loader', extractLESS.extract(['css-loader', 'less-loader'])]
		},{
            test: /\.json$/,
            loader: "json-loader"
        }]
	},
	plugins: [
		extractLESS,
		new htmlWebpackPlugin({
			template: path.join(__dirname, "src/index.html"),
			chunks: ['main']
		}),
		new webpack.DllReferencePlugin({
			context: __dirname,
			manifest
		}),
		new webpack.DefinePlugin({
			'env': JSON.stringify('env'),
			"entryId": JSON.stringify(appname)
		})
	],
	resolve: {
		extensions: ['', '.js', '.jsx', '.jpg', '.png'],
		alias: {
			vpstatic: path.join(__dirname, 'static/vpstatic'),
			localemsg: path.join(__dirname, 'src/assets/localemsg'),
			utils: path.join(__dirname, 'src/script'),
			reduxs: path.join(__dirname, 'src/assets/redux'),
			dynamic: path.join(__dirname, 'src/pages/dynamicIndex'),
			pages: path.join(__dirname, 'src/pages'),
			devstatic:path.join(__dirname, 'src/devstatic'),
			'dom-align': path.join(__dirname, 'static/vpstatic/js/dom-align/lib')
		}
	}
}

module.exports = baseConfig;
