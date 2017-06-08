/**
 * Check if given link has local hostname
 * @param {Element} link
 * @return {bool}
 */
function isLocalHostname(link) {
	return link.hostname ? location.hostname === link.hostname : true;
}

/**
 * Compare given URLs domain name to local domain to determine if URL is external
 * @param {string} url
 * @return {bool}
 */
export function isExternalUrl(url) {
	let link = document.createElement('a');
	link.href = url;
	return !isLocalHostname(link);
}

/**
 * Get local path from fully qualified URL if on the same domain name.
 * @param {string} url
 * @return {string}
 */
export function getLocalPath(url, force = false) {
	let link = document.createElement('a');
	link.href = url;
	if (force || isLocalHostname(link) && url.indexOf('mailto:') !== 0) {
		let path = link.pathname + link.search + link.hash;
		path = path.substr(0, 1) === '/' ? path : '/' + path;
		return path;
	}
	return url;
}

/**
 * Add given name and value to given url
 * @param {string} url
 * @param {string} name
 * @param {string} value
 * @return {string} url
 */
export function addQueryParam(url, name, value) {
	if (name && value) {
		let seperator = url.indexOf('?') === -1 ? '?' : '&';
		url += `${seperator}${name}=${value}`;
	}
	return url;
}
