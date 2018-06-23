import compiler, { paths } from './config.babel';

import webpack from 'webpack';

import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

// Add dev stuff to every entry

/**
 * Modules to include in all entries
 */
const alwaysInclude = [
	// bundle the client for webpack-dev-server
	// and connect to the provided endpoint
	'webpack-dev-server/client?http://localhost:3100',

	// bundle the client for hot reloading
	// only- means to only hot reload for successful updates
	'webpack/hot/only-dev-server'
];

for (let key in compiler.entry) {
	compiler.entry[key] = [ ...alwaysInclude, ...compiler.entry[key] ];
}



compiler.mode = 'development';



// Watch
compiler.watch = true;



// Setup dev server
compiler.devServer = {
	hot: true,
	inline: true,
	// clientLogLevel: "none",
	contentBase: paths.dest,
	port: 3100,
	disableHostCheck: true,
	stats: {
		// Add asset Information
		assets: false,
		// Sort assets by a field
		assetsSort: 'field',
		// Add information about cached (not built) modules
		cached: false,
		// Add children information
		children: false,
		// Add chunk information (setting this to `false` allows for a less verbose output)
		chunks: false,
		// Add built modules information to chunk information
		chunkModules: false,
		// Add the origins of chunks and chunk merging info
		chunkOrigins: false,
		// Sort the chunks by a field
		chunksSort: 'field',
		// Context directory for request shortening
		context: paths.src,
		// `webpack --colors` equivalent
		colors: true,
		// Add errors
		errors: true,
		// Add details to errors (like resolving log)
		errorDetails: true,
		// Add the hash of the compilation
		hash: false,
		// Add built modules information
		modules: false,
		// Sort the modules by a field
		modulesSort: 'field',
		// Add public path information
		publicPath: false,
		// Add information about the reasons why modules are included
		reasons: false,
		// Add the source code of modules
		source: false,
		// Add timing information
		timings: true,
		// Add webpack version information
		version: false,
		// Add warnings
		warnings: true
	}
};



// Set dev tool
compiler.devtool = 'source-map';



// Add extra plugins for dev
compiler.plugins = [
	...compiler.plugins,

	// set 'development' environment
	new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify('development')
		}
	}),

	// Shows a progress bar when building
	new ProgressBarPlugin(),

	// Add named modules plugin
	new webpack.NamedModulesPlugin(),

	// Add browser sync plugin
	new BrowserSyncPlugin(
		{
			// browse to http://localhost:1337/ during development
			host: 'localhost',
			port: 1337,
			// proxy the Webpack Dev Server endpoint
			// through BrowserSync
			proxy: 'http://localhost:3100',
			// Don't minify the client-side JS
			minify: false
		},
		// plugin options
		{
			// prevent BrowserSync from reloading the page
			// and let Webpack Dev Server take care of this
			reload: false
		}
	),

	// Adds hot module relacement
	new webpack.HotModuleReplacementPlugin()
];



export default compiler;
