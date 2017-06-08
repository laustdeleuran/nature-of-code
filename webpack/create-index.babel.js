import fs from 'fs';

/**
 * Create index file
 */
export default {
	apply(compiler) {
		console.log(compiler);

		//fs.writeFile(paths.dest + '/index.html',
		//`<!DOCTYPE html>
		//<html>
		//<head>
		//	<title>Index</title>
		//</head>
		//<body>
		//	<ul>
		//		${(() => {
		//			let items = '';
		//			for (let key in entries) {
		//				items += `<li><a href="${key}.html">${key}</a></li>`;
		//			}
		//			return items;
		//		})()}
		//	</ul>
		//</body>
		//</html>`, err => err && console.log(err));
	}
};
