/**
 * 	Webpack base config file, settings used across all build environments
 */

/**
 * 	Imports
 */
import fs from 'fs';
import path from 'path';
import glob from 'glob';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';



/**
 * Paths
 */
export const paths = {
	src: path.resolve(__dirname + '/../src'),
	dest: path.resolve(__dirname + '/../build')
};



/**
 * Host settings
 */
export const host = {
	name: 'localhost',
	port: '3000',
	protocol: 'http'
};
host.url = host.protocol + '://' + host.name + ':' + host.port;



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



/**
 * Entries
 */
export const entries = (() => {
	const entries = {},
		files = glob.sync(paths.src + '/**/entry.js');

	files.forEach(file => {
		let name = file.replace(paths.src, '').split('entry.')[0].replace('/', '');
		entries[name + 'index'] = [ ...alwaysInclude, file ];
	});

	return entries;
})();



/**
 * Webpack compiler configuration
 */
export default {
	entry: entries,
	output: {
		path: paths.dest,
		filename: '[name].js',
		publicPath: '/'
	},

	module: {
		rules: [
			// Lints client javascript & jsx
			{
				enforce: 'pre',
				test: /\.js$/,
				include: paths.src,
				use: {
					loader: 'eslint-loader'
				}
			},
			// Loads client javascript & jsx
			{
				test: /\.js$/,
				include: paths.src,
				use: {
					loader: 'babel-loader'
				}
			},
			// Copies client cursors, icons, images, and fonts
			{
				test: /\.(cur|ico|png|jpe?g|gif|svg|woff2?|otf|ttf|eot)$/,
				include: paths.src,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[sha512:hash:base64:7].[ext]'
					}
				}
			},
			{
				test: /\.s?css$/,
				include: [
					paths.src
				],
				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader?importLoaders=1'
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [require('autoprefixer')]
						}
					},
					{
						loader: 'sass-loader'
					}
				]
			}
		]
	},

	plugins: [
		// Shows a progress bar when building
		new ProgressBarPlugin(),

		// Create N HTML files, for each entry
		...(() => {
			const files = [];

			for (let key in entries) {
				files.push(new HtmlWebpackPlugin({
					title: key,
					filename: paths.dest + '/' + key + '.html',
					chunks: [key]
				}));
			}

			return files;
		})(),

		// Create index file of all entries
		{
			apply(compiler) {
				compiler.plugin('done', function () {
					const dir = paths.dest + '/',
						file = dir + 'index.html';

					// Make directory if it doesn't exist
					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir);
					}

					// Delete file if it already exists
					if (fs.existsSync(file)) {
						fs.unlinkSync(file);
					}

					// Create new index.html
					fs.writeFileSync(file,
						`<!DOCTYPE html>
						<html>
							<head>
								<meta charset="UTF-8">
								<title>Index</title>
							</head>
							<body>
								<h1>Index</h1>
								<ul>
								${(() => {
									let items = [];
									for (let key in entries) {
										items.push(`<li><a href="${key}">${key}</a></li>`);
									}
									return items.join('');
								})()}
								</ul>
						</html>`
					);
				});
			}
		}
	]
};
