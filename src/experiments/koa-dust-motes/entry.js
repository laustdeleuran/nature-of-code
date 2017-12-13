import Animator from '../../utils/animator';
import Canvas from '../../utils/canvas';
import Label from '../../utils/label';
import roundTo from '../../utils/round-to';
import normalizedRandom from '../../utils/normalized-random';
import { bindResizeEvents } from '../../utils/resize';

import '../experiments.scss';
import './style.scss';



/**
 * Project label
 */
new Label({
	title: 'Dust motes on in the upside down',
	desc: 'KOA - Dust motes'
});



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();



/**
 * Dust mote
 * @source https://codepen.io/bionicoz/pen/xCIDH
 */
class Mote {

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
			shadow: 'hsla(' + h + ',' + s + '%,' + l + '%,'  + roundTo(a - 0.55) + ')'
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



/**
 * Pointer tracking
 */
class Pointer {

	/**
	 * @constructor
	 */
	constructor({ acceleration = 0.0125, friction = 0.15, decimals = 2, position } = {}) {
		this._settings = { acceleration, friction, decimals };

		this._position = position;

		this._velocity = { x: 0, y: 0 };

		document.addEventListener('touchmove', this.onMove);
		document.addEventListener('mousemove', this.onMove);
	}

	/**
	 * Update
	 */
	update() {
		if (!this._target) return;
		if (!this._position) {
			this._position = this._target;
		}

		const { acceleration, friction, decimals } = this._settings;

		const { x: targetX, y: targetY } = this._target;
		let { x: currentX, y: currentY } = this._position;
		let { x: velocityX, y: velocityY } = this._velocity;

		// Do math to animate
		let distanceX = targetX - currentX;
		velocityX *= friction;
		velocityX += distanceX * acceleration;
		currentX += velocityX;
		velocityX = roundTo(velocityX, decimals);
		currentX = roundTo(currentX, decimals);

		let distanceY = targetY - currentY;
		velocityY *= friction;
		velocityY += distanceY * acceleration;
		currentY += velocityY;
		velocityY = roundTo(velocityY, decimals);
		currentY = roundTo(currentY, decimals);

		this._position = {
			x: currentX,
			y: currentY
		};

		this._velocity = {
			x: velocityX,
			y: velocityY
		};
	}

	/**
	 * Event listener
	 */
	onMove = event => this._target =
		event.touches && event.touches[0] ?
			{
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			} :
			{
				x: event.clientX,
				y: event.clientY
			};

	/**
	 * Get x position
	 */
	get x() {
		return this._position.x;
	}

	/**
	 * Get y position
	 */
	get y() {
		return this._position.y;
	}

	/**
	 * Get position
	 */
	get position() {
		return this._position;
	}

	/**
	 * Destroy
	 */
	destroy() {
		document.removeEventListener('touchmove', this.onMove);
		document.removeEventListener('mousemove', this.onMove);
	}
}



// Init --------------------------------------------------------
let particles = [];

// Set canvas render mode
context.globalCompositeOperation = 'lighter';

// Set up mouse tracking
const pointer = new Pointer({
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2
	}
});

const init = () => {
	animator.stop();

	// Create particles
	const particleCount = Math.round(canvas.width * canvas.height / 3000);
	particles = [];
	for (let i = 0; i < particleCount; i++) {
		particles.push(new Mote({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
		}));
	}

	// Animation loop
	animator.start(() => {
		const { width, height } = canvas;

		// Clear canvas
		context.clearRect(0, 0, width, height);

		// Update pointer position
		pointer.update();
		const { x: pointerX, y: pointerY } = pointer.position;
		let
			modX = (pointerX - width / 2) / -40,
			modY = (pointerY - height / 2) / -40;

		// Draw particles
		particles.forEach(particle => {
			particle.move();
			particle.draw(context, { x: modX, y: modY });
			particle.boundaryCheck(width, height);
		});
	});

};

bindResizeEvents(init);
init();

