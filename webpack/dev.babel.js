import compiler, { host, paths } from './config.babel';

import webpack from 'webpack';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';

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

	// Opens the browser with the url webpack-dev-server is running on
	new OpenBrowserPlugin({
		url: host.url
	}),

	// Adds hot module relacement
	new webpack.HotModuleReplacementPlugin()
];



export default compiler;
