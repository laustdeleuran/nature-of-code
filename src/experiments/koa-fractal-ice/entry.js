import Animator from '../../utils/animator';
import Canvas from '../../utils/canvas';
import Label from '../../utils/label';
import SimplexNoise from 'simplex-noise';
import convertRange from '../../utils/convert-range';
import roundTo from '../../utils/round-to';
// import normalizedRandom from '../../utils/normalized-random';
// import { bindResizeEvents } from '../../utils/resize';

import '../experiments.scss';
import './style.scss';



/**
 * Project label
 */
new Label({
	title: 'Holiday feels and acid flashbacks',
	desc: 'KOA - Fractal ice'
});



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext(),
	simplex = new SimplexNoise();



/**
 * Ice crack / branch
 */
class Branch {

	/**
	 * @constructor
	 */
	constructor({
		colors = {
			shadow: 'rgba(0, 4, 34, 0.33)',
			primary: 'rgba(124, 182, 227, 0.33)',
			highlight: 'rgba(255, 255, 255, 0.75)',
		},
		density = 0.5,
		direction = {
			x: roundTo(-1 + Math.random() * 2, 4),
			y: roundTo(-1 + Math.random() * 2, 4)
		},
		split = {
			chance: 0.5,
			minAge: 30,
			number: 2,
		},
		velocity = 30,
		x,
		y,
	}) {
		this._vars = {
			age: 0,
			colors: colors,
			density: density,
			direction: {
				...direction,
				variance: 0.5
			},
			increment: 0.1,
			offset: {
				directionX: Math.round(1000 * Math.random()),
				directionY: Math.round(1000 * Math.random()),
				velocityX: Math.round(1000 * Math.random()),
				velocityY: Math.round(1000 * Math.random()),
			},
			points: [{ x, y }],
			position: { x, y },
			split: split,
			velocity: velocity,
		};
	}

	_move() {
		const { direction, increment, offset, points, position, velocity } = this._vars;

		const { directionX: offsetDirectionX, directionY: offsetDirectionY, velocityX: offsetVelocityX, velocityY: offsetVelocityY } = offset;
		const { variance: directionVariance, x: directionX, y: directionY } = direction;

		// Variable x and y velocity
		let velocityX = convertRange(simplex.noise2D(offsetVelocityX, 0), -1, 1, 0, velocity);
		let velocityY = convertRange(simplex.noise2D(offsetVelocityY, 0), -1, 1, 0, velocity);

		// Variable direction
		let directionXVariance = convertRange(simplex.noise2D(offsetDirectionX, 0), -1, 1, -directionVariance, directionVariance);
		let directionYVariance = convertRange(simplex.noise2D(offsetDirectionY, 0), -1, 1, -directionVariance, directionVariance);

		// Update noise offsets
		offset.directionX = roundTo(offsetDirectionX + increment, 4);
		offset.directionY = roundTo(offsetDirectionY + increment, 4);
		offset.velocityX = roundTo(offsetVelocityX + increment, 4);
		offset.velocityY = roundTo(offsetVelocityY + increment, 4);

		// Update position
		position.x += (directionX + directionXVariance) * velocityX;
		position.y += (directionY + directionYVariance) * velocityY;

		points.push({ x: position.x, y: position.y });
	}

	_draw(context) {
		const { age, colors, density } = this._vars;
		const { shadow, primary, highlight } = colors;

		// const width = density * (age / 5 + 0.5);
		const width = 1;

		// this._drawStroke(shadow, width, { x: - width, y: - width }, context);
		this._drawStroke(primary, 2, { x: 0, y: 0 }, context);
		this._drawStroke(highlight, 1, { x: 1, y: 1 }, context);

	}

	_drawStroke(color, width, { x, y }, context) {
		const { points } = this._vars;

		context.beginPath();
		context.strokeStyle = color;

		for (let i = 1; i < points.length; i++) {
			let point = points[i];

			context.lineWidth = width;

			// Draw line between points
			if (i === 1) {
				let previousPoint = points[i - 1];
				context.moveTo(previousPoint.x + x, previousPoint.y + y);
			}

			context.lineTo(point.x + x, point.y + y);
		}

		context.stroke();
	}

	_end() {
		const { points, split } = this._vars;
		const { chance, minAge, number } = split;

		if (points.length > minAge && Math.random() < chance) {
			if (number < 1) return this._vars.branches = [];

			const position = points[points.length - 1];

			const branches = this._vars.branches = [];
			for (let i = 0; i < number; i++) {
				branches.push(new Branch({ ...position, split: { chance, minAge, number: 0 } }));
			}
		}
	}

	update(context, width, height) {
		const { branches, position } = this._vars;

		// Always draw our own branch
		this._draw(context);

		// Move sub branches if avail
		if (branches) branches.forEach(branch => branch.update(context, width, height));

		// Update age
		const ended = this._vars.ended =
			position.x > canvas.width ||
			position.x < 0 ||
			position.y > canvas.height ||
			position.y < 0 ||
			branches;
		if (!ended) this._vars.age++;

		// Bail out if we're totally done or we have sub branches
		else return;

		// Move and maybe split?
		this._move(width, height);
		this._end();
	}

}



// Init --------------------------------------------------------

// Set canvas render mode
context.globalCompositeOperation = 'lighter';

context.lineJoin = 'round';

// Set event listener
const element = canvas.element;
element.addEventListener('mousedown', event => {
	const { clientX: x, clientY: y } = event;

	let branch = new Branch({ x, y });

	animator.start(() => {
		const { width, height } = canvas;

		// Clear canvas
		context.clearRect(0, 0, width, height);

		// Show branch
		branch.update(context, width, height);
	});

	element.addEventListener('mouseup', () => {
		animator.stop();
	});
});
