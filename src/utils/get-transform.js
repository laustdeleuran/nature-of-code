/**
 * Get transform prop
 * @src http://stackoverflow.com/questions/8889014/setting-vendor-prefixed-css-using-javascript
 */
export const transformProp = (function () {
	const testEl = document.createElement('div');
	if (testEl.style.transform == null) {
		const vendors = ['Webkit', 'Moz', 'ms'];
		for (const vendor in vendors) {
			if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
				return vendors[vendor] + 'Transform';
			}
		}
	}
	return 'transform';
})();

/**
 * Standard transform object
 */
const getTransform = value => ({ [transformProp]: value });
export default getTransform;
