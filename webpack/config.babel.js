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

// Environment
export const NODE_ENV_DEVELOPMENT = 'development',
	NODE_ENV_STAGING = 'staging',
	NODE_ENV_PRODUCTION = 'production',
	env = process.env.NODE_ENV || NODE_ENV_DEVELOPMENT;

/**
 * Paths
 */
export const paths = {
	dest: path.resolve(__dirname + '/../build'),
	src: path.resolve(__dirname + '/../src'),
	utils: path.resolve(__dirname, '/../node_modules/koalition-utils/'),
};

/**
 * Entries
 */
export const entries = (() => {
	const entries = {},
		files = glob.sync(paths.src + '/**/entry.js');

	files.forEach(file => {
		let name = file
			.replace(paths.src, '')
			.split('entry.')[0]
			.replace('/', '');
		entries[name + 'index'] = ['@babel/polyfill', file];
	});

	return entries;
})();

/**
 * Webpack compiler configuration
 */
export default {
	mode: env === NODE_ENV_DEVELOPMENT ? 'development' : 'production',
	entry: entries,
	output: {
		path: paths.dest,
		filename: '[name].js',
		publicPath: '/',
	},

	module: {
		rules: [
			// Lints client javascript & jsx
			{
				enforce: 'pre',
				test: /\.js$/,
				include: paths.src,
				use: {
					loader: 'eslint-loader',
				},
			},
			// Loads client javascript & jsx
			{
				test: /\.jsx?$/i,
				include: [paths.src, path.resolve(__dirname, '../node_modules')],
				use: {
					loader: 'babel-loader',
				},
			},
			// Copies client cursors, icons, images, and fonts
			{
				test: /\.(cur|ico|png|jpe?g|gif|svg|woff2?|otf|ttf|eot)$/,
				include: paths.src,
				use: {
					loader: 'file-loader',
					options: {
						name: 'static/[name].[sha512:hash:base64:7].[ext]',
					},
				},
			},
			{
				test: /\.s?css$/,
				include: [paths.src],
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader?importLoaders=1',
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [require('autoprefixer')],
						},
					},
					{
						loader: 'sass-loader',
					},
				],
			},
		],
	},

	plugins: [
		// Create N HTML files, for each entry
		...(() => {
			const files = [];

			for (let key in entries) {
				files.push(
					new HtmlWebpackPlugin({
						title: key.substr(0, key.length - '/index'.length),
						template: paths.src + '/index.ejs',
						filename: paths.dest + '/' + key + '.html',
						chunks: [key],
					})
				);
			}

			return files;
		})(),

		// Create index file of all entries
		{
			apply(compiler) {
				compiler.plugin('done', function() {
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
					fs.writeFileSync(
						file,
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
										let path = key.substr(0, key.length - '/index'.length);
										items.push(`<li><a href="${path}">${path}</a></li>`);
									}
									return items.join('');
								})()}
								</ul>
						</html>`
					);
				});
			},
		},
	],
};
