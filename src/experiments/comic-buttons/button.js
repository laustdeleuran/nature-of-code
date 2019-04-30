import rough from 'roughjs/dist/rough.umd';

/**
 * SVG path helpers
 */

/**
 * Create button shadow to the left
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @return {string} - svg path
 */
const createSvgShadowPathLeft = (x, y, width, height) =>
	`M${x + width - 30},${y + height + 15}H${x - 8}c-3.4,0-7.2-7.8-7.2-11.2
	V${y + 28}C${x - 15},${y + 18},${x + 2.8},${y},${x + 6.2},${y}l${width -
		6},${height - 7}
	C${x + width},${y + height - 4},${x + width - 18},${y + height + 15},${x +
		width -
		30},${y + height + 15}z`;

/**
 * Create button shadow to the right
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @return {string} - svg path
 */
const createSvgShadowPathRight = (x, y, width, height) =>
	`M${x},${height - 7}L${x + width - 6},${y}c3.4,0,21.2,18.1,21.2,28.2
		l0,${height - 25}c0,3.4-3.8,11.2-7.2,11.2
		H${x + 30}C${x + 17.6},${y + height + 15},${x},${y + height - 4},${x},${y +
		height -
		7}z`;

/**
 * Create button rect
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @return {string} - svg path
 */
const createSvgRectPath = (x, y, width, height) =>
	`M${x + width - 26.16},${y + height}H${x + 6.16}C${x + 2.76},${y +
		height},${x},${y + height - 3.76},${x},${y + height - 7.16}V${y +
		7.16}C${x},${y + 3.76},${x + 2.76},${y},${x + 6.16},${y}H${x +
		width -
		6.16}c3.4,0,6.16,3.76,6.16,7.16V${y + height - 7.16}C${x + width},${y +
		height -
		3.76},${x + width - 2.76},${y + height},${x + width - 6.16},${y + height}Z`;

/**
 * Button
 */
export default class Button {
	/**
	 * @constructor
	 * @param {object} settings
	 *   @prop {string} colorFace
	 *   @prop {string} colorShadow
	 *   @prop {DOMElement} element
	 *   @prop {number} margin
	 *   @prop {string} shadow
	 */
	constructor({
		colorFace = '#1ac1ed',
		colorShadow = '#0049b8',
		element,
		margin = 20,
		shadow,
	}) {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		const rc = rough.canvas(canvas);

		element.appendChild(canvas);

		this._vars = {
			canvas,
			colorFace,
			colorShadow,
			context,
			element,
			margin,
			rc,
			shadow,
		};

		this.resize();
	}

	/**
	 * Step by step drawing function for animation
	 */
	draw() {
		const { colorFace, colorShadow, margin, shadow, rc } = this._vars;
		const { height, width } = this._size;
		const shadowMethod =
			shadow === 'right' ? createSvgShadowPathRight : createSvgShadowPathLeft;

		const innerWidth = width - margin * 2;
		const innerHeight = height - margin * 2;

		// Draw shadow
		rc.path(shadowMethod(margin, margin, innerWidth, innerHeight), {
			roughness: 0.25,
			fill: colorShadow,
			fillStyle: 'solid',
			stroke: colorShadow,
		});

		// Draw button rect
		rc.path(createSvgRectPath(margin, margin, innerWidth, innerHeight), {
			roughness: 0.25,
			fill: colorFace,
			fillStyle: 'solid',
			stroke: colorFace,
		});
	}

	/**
	 * Resize button based on container size.
	 */
	resize() {
		const { canvas, element } = this._vars;
		const { width, height } = element.getBoundingClientRect();

		this._size = {
			width,
			height,
		};

		canvas.width = width;
		canvas.height = height;
	}
}
