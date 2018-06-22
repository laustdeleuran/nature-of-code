import compiler, { host, paths } from './config.babel';

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
	'webpack-dev-server/client?' + host.url,

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
	contentBase: paths.dest,
	hot: true,
	inline: true,
	port: host.port,
	public: host.name + ':' + host.port
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
			// browse to http://localhost:3100/ during development
			host: config.domain,
			port: 3000,
			// proxy the Webpack Dev Server endpoint
			// through BrowserSync
			proxy: 'http://' + config.domain + ':3100',
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
