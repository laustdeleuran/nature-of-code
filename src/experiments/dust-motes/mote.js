import roundTo from 'utils/round-to';
import normalizedRandom from 'utils/normalized-random';



/**
 * Dust mote
 * @source https://codepen.io/bionicoz/pen/xCIDH
 */
export default class Mote {

	/**
	 * @constructor
	 */
	constructor({
		color = {
			h: 195 + Math.random() * 10,
			s: 40 + Math.random() * 10,
			l: 10 + Math.random() * 30,
			a: 0.5 * Math.random(),
		},
		radius = normalizedRandom(20, 10),
		scale = 0.5 + Math.random() * 1, // Scale between 0.5 and 1.5
		rotation = Math.PI / 4 * Math.random(),
		x,
		y
	} = {}) {
		// Create color strings
		const { h, s, l, a } = color;
		this._colors = {
			primary: 'hsla(' + h + ',' + s + '%,' + l + '%,'  + roundTo(a) + ')',
			shadow: 'hsla(' + h + ',' + s + '%,' + l + '%,'  + 0 + ')'
		};

		// Set up size and rotation
		this._radius = radius;
		this._scale = scale;
		this._rotation = rotation;

		// Set up position and direction
		this._pos = { x, y };
		this._direction = {
			x: -1 + Math.random() * 2,
			y: -1 + Math.random() * 2
		};
		this._velocity = {
			x: (2 * Math.random() + 4) * .01 * this._radius,
			y: (2 * Math.random() + 4) * .01 * this._radius,
			a: 0.01 * Math.random() - 0.02
		};
	}

	/**
	 * Create gradient on given context
	 * @private
	 */
	_createGradient(context) {
		const { primary, shadow } = this._colors;

		let gradient = context.createRadialGradient(0, 0, this._radius, 0, 0, 0);
		gradient.addColorStop(1, primary);
		gradient.addColorStop(0, shadow);

		return gradient;
	}

	/**
	 * Move dust mote
	 * @public
	 */
	move() {
		let { x, y } = this._pos;
		const { x: vx, y: vy, a: va } = this._velocity;
		const { x: dx, y: dy } = this._direction;

		x += vx * dx;
		y += vy * dy;

		this._rotation += va;
		this._pos = { x, y };
	}

	/**
	 * Move dust mote
	 * @public
	 * @param {string} axis - must be either 'x' or 'y';
	 */
	switchDirection(axis = 'x') {
		this._direction[axis] *= -1;
		this._velocity.a *= -1;
	}

	/**
	 * Check boundary
	 */
	boundaryCheck(width, height, threshold = .2) {
		const { x, y } = this._pos;
		if (x > width * (1 + threshold) || x < width * (- threshold)) {
			this.switchDirection('x');
		}

		if (y > height * (1 + threshold) || y < height * (- threshold)) {
			this.switchDirection('y');
		}
	}

	/**
	 * Draw
	 * @public
	 */
	draw(context, { x: modX = 0, y: modY = 0 } = {}) {
		context.save();

		const { x, y } = this._pos;
		context.translate(x + modX * this._radius, y + modY * this._radius);
		context.rotate(this._rotation);
		context.scale(1, this._scale);

		const gradient = this._createGradient(context);
		context.beginPath();
		context.fillStyle = gradient;
		context.arc(0, 0, this._radius, 0, Math.PI * 2, false);
		context.fill();

		context.restore();
	}
}
