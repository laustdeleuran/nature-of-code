import compiler, { host, paths } from './config.babel';

import webpack from 'webpack';
import OpenBrowserPlugin from 'open-browser-webpack-plugin';

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
