import log from 'koalition-utils/log';

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
	`M${x},${y + height - 7}L${x + width - 6},${y}c3.4,0,21.2,18.1,21.2,28.2
		l0,${height - 25}c0,3.4-3.8,11.2-7.2,11.2
		H${x + 30}C${x + 17.6},${y + height + 15},
		${x},${y + height - 4},${x},${y + height - 7}z`;

// x = -100; y = -50
// M-100,42.9L93.9-50c3.4,0,21.2,18.1,21.2,28.2
//   v75.6c0,3.4-3.8,11.2-7.2,11.2H-69.7
//   C-82.4,65-99.9,46.2-100,42.9z

// x = 0; y = 0
// M0,92.9L193.9,0c3.4,0,21.2,18.1,21.2,28.2
//   v75.6c0,3.4-3.8,11.2-7.2,11.2H30.3
//   C17.6,115,0.1,96.2,0,92.9z

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
 * Canvas helpers
 */
const lineToAngle = (context, x1, y1, length, angle) => {
	angle *= Math.PI / 180;

	const x2 = x1 + length * Math.cos(angle);
	const y2 = y1 + length * Math.sin(angle);

	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);

	return { x: x2, y: y2 };
};

/**
 * Button
 */
const BUTTON_STATE_HIDDEN = 'BUTTON_STATE_HIDDEN';
const BUTTON_STATE_APPEAR = 'BUTTON_STATE_APPEAR';
const BUTTON_STATE_IDLE = 'BUTTON_STATE_IDLE';
const BUTTON_STATE_SELECT = 'BUTTON_STATE_SELECT';
const BUTTON_STATE_SELECT_DISAPPEAR = 'BUTTON_STATE_SELECT_DISAPPEAR';
const BUTTON_STATE_UNSELECT = 'BUTTON_STATE_UNSELECT';
const BUTTON_STATE_UNSELECT_DISAPPEAR = 'BUTTON_STATE_UNSELECT_DISAPPEAR';

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

		element.appendChild(canvas);

		this._vars = {
			canvas,
			colorFace,
			colorShadow,
			context,
			element,
			margin,
			shadow,
			step: 0,
		};

		this._state = BUTTON_STATE_HIDDEN;

		this.resize();
	}

	/**
	 * Step by step drawing function for animation
	 */
	draw() {
		const { width, height } = this._size;
		if (!width || !height) {
			log.warn('Button.draw() - Invalid size detected, draw disabled');
			return;
		}

		const {
			colorFace,
			colorShadow,
			context,
			facePath,
			shadowPath,
			step,
		} = this._vars;

		if (!facePath || !shadowPath) {
			log.warn('Button.draw() - No paths available, draw disabled');
			return;
		}

		// Clear canvas
		context.clearRect(0, 0, width, height);

		// Draw shadow
		context.fillStyle = colorShadow;
		context.fill(shadowPath);

		// Draw button rect
		context.fillStyle = colorFace;
		context.fill(facePath);

		// Draw shine
		this.drawShine();

		// Count frames for animation purposes
		this._vars.step = step + 1;
	}

	/**
	 * Draw shine
	 */
	drawShine() {
		const { width, height } = this._size;

		const { context, facePath, margin, shadow, step } = this._vars;

		const fps = 60;
		const transition = 0.67; // seconds;
		const wait = 2; // seconds
		const seconds = (step / fps) % (transition + wait);

		if (seconds < transition) {
			const pct = seconds / transition;
			const innerWidth = width - margin * 2;
			const angle = 80 * (shadow === 'right' ? 1 : -1);
			const y = shadow === 'right' ? 0 : height;
			// const innerHeight = height - margin * 2;

			context.save();

			context.clip(facePath);
			context.globalCompositeOperation = 'screen';

			let x = width * 1.5 * pct - width * 0.25;
			context.strokeStyle = 'rgba(255, 255, 255, 0.3)';

			context.lineWidth = Math.round(innerWidth * 0.2);
			lineToAngle(context, x, y, height, angle);
			context.stroke();

			context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
			context.lineWidth = Math.round(innerWidth * 0.05);
			lineToAngle(context, x + innerWidth * 0.175, y, height, angle);
			context.stroke();

			context.restore();
		}
	}

	/**
	 * Resize button based on container size.
	 */
	resize() {
		const { canvas, context, element } = this._vars;
		const { width, height } = element.getBoundingClientRect();

		this._size = {
			width,
			height,
			x: width * -0.5,
			y: height * -0.5,
		};

		canvas.width = width;
		canvas.height = height;

		context.setTransform(1, 0, 0, 1, 0, 0); // Reset transformation matrix
		context.translate(width * 0.5, height * 0.5); // Set 0-0 to center of canvas

		this.createPaths();
	}

	/**
	 * Create paths
	 */
	createPaths() {
		const { margin, shadow } = this._vars;
		const { height, width, x, y } = this._size;

		if (!width || !height) {
			log.warn(
				'Button.createPaths() - Invalid size detected, couldnt create paths'
			);
			return;
		}

		const shadowMethod =
			shadow === 'right' ? createSvgShadowPathRight : createSvgShadowPathLeft;

		const innerWidth = width - margin * 2;
		const innerHeight = height - margin * 2;

		this._vars.shadowPath = new Path2D(
			shadowMethod(x + margin, y + margin, innerWidth, innerHeight)
		);
		this._vars.facePath = new Path2D(
			createSvgRectPath(x + margin, y + margin, innerWidth, innerHeight)
		);
	}

	/**
	 * Set state
	 * @param {enum} state
	 */
	setState(state) {
		this._state = state;

		clearTimeout(this._vars.stateTimer);
		if (state === BUTTON_STATE_APPEAR)
			this._vars.stateTimer = setTimeout(
				() => this.setState(BUTTON_STATE_IDLE),
				333
			);
		// else if (state === BUTTON_STATE_SELECT)
		// 	this._vars.stateTimer = setTimeout(
		// 		() => this.setState(BUTTON_STATE_SELECT_DISAPPEAR),
		// 		333
		// 	);
		else if (state === BUTTON_STATE_UNSELECT)
			this._vars.stateTimer = setTimeout(
				() => this.setState(BUTTON_STATE_UNSELECT_DISAPPEAR),
				250
			);
		else if (state === BUTTON_STATE_SELECT_DISAPPEAR)
			this._vars.stateTimer = setTimeout(
				() => this.setState(BUTTON_STATE_HIDDEN),
				500
			);
		else if (state === BUTTON_STATE_UNSELECT_DISAPPEAR)
			this._vars.stateTimer = setTimeout(
				() => this.setState(BUTTON_STATE_HIDDEN),
				250
			);
	}
}
