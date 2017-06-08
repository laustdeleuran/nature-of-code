import { getWindowSize, bindResizeEvents, unbindResizeEvents } from './resize';



export default class Canvas {

	/**
	 * Create canvas element
	 * @static
	 */
	static createCanvas(container = document.body) {
		const canvas = document.createElement('canvas');
		container.appendChild(canvas);
		return canvas;
	}

	/**
	 * @contructor
	 * @param {object} settings
	 * @prop {HTMLElement} canvas
	 * @prop {HTMLElement} container
	 * @prop {bool} hasResize
	 * @return {object} this - class instance
	 */
	constructor({ canvas = null, container = document.body, hasResize = true } = {}) {
		canvas = canvas || Canvas.createCanvas(container);

		this._vars = {
			canvas
		};

		this.settings = {
			hasResize
		};

		this._setup();

		return this;
	}

	/**
	 * Set up resize listener
	 * @private
	 */
	_setup() {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas._setup() - Trying to set up canvas with no canvas available.');
		}

		// Add resize listener
		const { hasResize } = this.settings;
		if (hasResize) {
			const listener = () => this.resize();
			bindResizeEvents(listener);
			this._vars.resizeListener = listener;
		}

		// Set initial canvas size
		this.resize();
	}

	/**
	 * Resize canvas to fit to screen
	 * @return {object} size
	 */
	resize() {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.resize() - Trying to resize canvas with no canvas available.');
		}

		const size = getWindowSize();
		canvas.width = size.width;
		canvas.height = size.height;

		return size;
	}

	/**
	 * Resize canvas to fit to screen
	 * @param {string} type - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
	 * @param {object} attributes - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
	 * @return {RenderingContext} context
	 */
	getContext(type = '2d', attributes) {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.getContext() - Trying to get context with no canvas available.');
		}

		return canvas.getContext(type, attributes);
	}

	/**
	 * Destroy
	 */
	destroy() {
		const { canvas, resizeListener } = this._vars;

		// Remove canvas
		canvas.parentNode.removeChild(canvas);
		this._vars.canvas = null;

		// Unbind listeners
		if (resizeListener) {
			unbindResizeEvents(resizeListener);
			this._vars.resizeListener = null;
		}
	}

	/**
	 * Get canvas HTMLElement
	 * @return {HTMLElement} canvas
	 */
	get element() {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.element - Trying to get canvas element with no canvas available.');
		}

		return canvas;
	}

	/**
	 * Get width of canvas HTMLElement
	 * @return {number} width
	 */
	get width() {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.width - Trying to get width with no canvas available.');
		}

		return canvas.width;
	}

	/**
	 * Get height of canvas HTMLElement
	 * @return {number} width
	 */
	get height() {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.height - Trying to get height with no canvas available.');
		}

		return canvas.height;
	}

	/**
	 * Set width of canvas HTMLElement
	 * @param {number} value
	 * @return {number} width
	 */
	set width(value) {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.width - Trying to set width with no canvas available.');
		}

		return canvas.width = value;
	}

	/**
	 * Set height of canvas HTMLElement
	 * @param {number} value
	 * @return {number} width
	 */
	set height(value) {
		const { canvas } = this._vars;

		if (!canvas) {
			throw Error('Canvas.height - Trying to set height with no canvas available.');
		}

		return canvas.height = value;
	}
}
