let webpack = require('webpack'),
	config = require('../config'),
	merge = require('webpack-merge'),
	baseWebpackConfig = require('./webpack.base.conf'),
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
	path = require('path');

function assetsPath(_path) {
	var assetsSubDirectory = config.build.assetsSubDirectory
	return path.posix.join(assetsSubDirectory, _path)
}

let webpackConfig = merge(baseWebpackConfig, {
	devtool: config.build.productionSourceMap ? '#source-map' : false,
	output: {
		path: config.build.assetsRoot,
		filename: assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: assetsPath('js/[id].[chunkhash].js')
	},
	plugins: [
		// http://vuejs.github.io/vue-loader/en/workflow/production.html
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': config.build.env
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			sourceMap: true
		}),
		// extract css into its own file
		new ExtractTextPlugin({
			filename: assetsPath('css/[name].[contenthash].css')
		}),
		// Compress extracted CSS. We are using this plugin so that possible
		// duplicated CSS from different components can be deduped.
		new OptimizeCSSPlugin(),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: process.env.NODE_ENV === 'testing'
				? 'index.html'
				: config.build.index,
			template: './app/index.html',
			title: '滚动',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
		// split vendor js into its own file
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module, count) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, '../node_modules')
					) === 0
				)
			}
		}),
		// extract webpack runtime and module manifest to its own file in order to
		// prevent vendor hash from being updated whenever app bundle is updated
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor']
		})
	]
})

if (config.build.productionGzip) {
	let CompressionWebpackPlugin = require('compression-webpack-plugin')

	webpackConfig.plugins.push(
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(' +
				config.build.productionGzipExtensions.join('|') +
				')$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	)
}

if (config.build.bundleAnalyzerReport) {
	var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
	webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
