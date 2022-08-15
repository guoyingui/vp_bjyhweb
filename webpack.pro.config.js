const path = require("path");
const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.base.config.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const es3ifyWebpackPlugin = require("es3ify-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;

const copy_list = process.env.MODE ? [{
    from: path.join(__dirname, './static'),
    to: path.join(__dirname, '../')
}, {
    from: path.join(__dirname, './src/devstatic'),
    to: path.join(__dirname, '../')
}] : [{
    from: path.join(__dirname, './src/devstatic'),
    to: path.join(__dirname, '../')
}];

const proConfig = {
    output: {
        path: path.join(__dirname, './webapp/' + baseConfig.appname),
        filename: '[name].[hash:6].' + baseConfig.version + '.js',
        chunkFilename: '[name].[chunkhash:6].' + baseConfig.version + '.js',
        publicPath: `../${baseConfig.appname}/`
    },
    module: {
		postLoaders: [{
			test: /\.(jsx|js)$/,
            loaders: ['export-from-ie8/loader'],
            include: path.join(__dirname, 'src')
        }]
    },
    plugins: [
        new es3ifyWebpackPlugin(),
        new CleanWebpackPlugin([`./webapp/*`]),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            IS_DEVELOPMETN: false,
        }),
        new UglifyJSPlugin({
            mangle: {
                screw_ie8: false
            },
            mangleProperties: {
                screw_ie8: false
            },
            compress: {
                screw_ie8: false,
				warnings: false,
				drop_debugger: false,  // 是否开启debugger
				drop_console: true    // 是否开启console
            },
            output: {
                screw_ie8: false
            },
			sourceMap: true    // 定位错误消息位置
        }),
        new OptimizeCssAssetsPlugin({
            cssProcessorOptions:{
                safe: true
            }
        }),
        new copyWebpackPlugin(copy_list),
        new CSSSplitWebpackPlugin({
            size: 3000,
            filename: '[name]-[part].[hash:5].[ext]'
        }),
        // new BundleAnalyzerPlugin({
        //     //  可以是`server`，`static`或`disabled`。
        //     //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
        //     //  在“静态”模式下，会生成带有报告的单个HTML文件。
        //     //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
        //     analyzerMode: 'server',
        //     //  将在“服务器”模式下使用的主机启动HTTP服务器。
        //     analyzerHost: '127.0.0.1',
        //     //  将在“服务器”模式下使用的端口启动HTTP服务器。
        //     analyzerPort: 8889, 
        //     //  路径捆绑，将在`static`模式下生成的报告文件。
        //     //  相对于捆绑输出目录。
        //     reportFilename: 'report.html',
        //     //  模块大小默认显示在报告中。
        //     //  应该是`stat`，`parsed`或者`gzip`中的一个。
        //     //  有关更多信息，请参见“定义”一节。
        //     defaultSizes: 'parsed',
        //     //  在默认浏览器中自动打开报告
        //     openAnalyzer: true,
        //     //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
        //     generateStatsFile: false, 
        //     //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
        //     //  相对于捆绑输出目录。
        //     statsFilename: 'stats.json',
        //     //  stats.toJson（）方法的选项。
        //     //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
        //     //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
        //     statsOptions: null,
        //     logLevel: 'info' //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
        // })
    ]
};

module.exports = merge(baseConfig, proConfig);