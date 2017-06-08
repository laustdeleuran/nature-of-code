import res from 'res';



/**
 * Get window size with site settings constraints
 *
 * @return {object}
 */
export function getWindowSize() {
	const { innerHeight, innerWidth } = window;
	const { offsetWidth, offsetHeight } = document.documentElement;

	const dppx = res.dppx();

	// Get total browser width, taking scroll bars into account
	const width = innerWidth > offsetWidth ? offsetWidth : innerWidth,
		height = innerHeight;

	return { height, width, innerHeight, innerWidth, offsetWidth, offsetHeight, dppx };
}


/**
 * Bind resize events
 *
 * @param {function}
 */
import debounce from 'lodash/debounce';

export function bindResizeEvents(fn, threshold = 200) {
	const listener = threshold ? debounce(fn, threshold) : fn;

	window.addEventListener('orientationchange', listener);
	window.addEventListener('resize', listener);

	return listener;
}



/**
 * Bind resize events
 *
 * @param {function}
 */
export function unBindResizeEvents(listener) {
	window.removeEventListener('orientationchange', listener);
	window.removeEventListener('resize', listener);
}
