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
class Comet {

	/**
	 * @constructor
	 */
	constructor({
		lifespan = Infinity,
		color = {
			r: 236,
			g: 248,
			b: 255,
		},
	} = {}) {
		this._vars = {
			age: 0,
			color,
			increment: 0.0025,
			minSpeed: 2,
			lifespan,
			offset: {
				x: Math.round(1000 * Math.random()),
				y: Math.round(1000 * Math.random()),
			},
			position: [],
			length: 50,
		};
	}

	_move(width, height) {
		const { age, increment, length, lifespan, minSpeed, offset, speed: lastSpeed, position } = this._vars;
		const { x: offsetX, y: offsetY } = offset;

		const point = {
			x: convertRange(simplex.noise2D(offsetX, 0), -1, 1, 0, width),
			y: convertRange(simplex.noise2D(offsetY, 0), -1, 1, 0, height)
		};

		const lastPoint = position[position.length - 2];
		const speed = lastPoint ? Math.abs(point.x - lastPoint.x) + Math.abs(point.y - lastPoint.y) : 0 ;

		if (speed && speed < minSpeed) this._vars.isStopping = true;

		if (
			age > lifespan ||
			this._vars.isStopping &&
				(
					speed > lastSpeed
				)
		) {
			return this._stop();
		}

		position.push(point);
		if (length < position.length) position.shift();

		this._vars.speed = speed;
		this._vars.age++;
		this._vars.offset = {
			x: offsetX + increment,
			y: offsetY + increment,
		};
	}

	_draw(context) {
		const { color, position, length } = this._vars;

		position.forEach(({ x, y }, index) => {
			if (index === 0) return;

			const prev = position[index - 1];
			const decay = index / length;
			context.beginPath();
			context.moveTo(prev.x, prev.y);
			context.strokeStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + decay + ')';
			context.lineTo(x, y);
			context.stroke();
		});
	}

	_stop() {
		this._vars.isStopped = true;
	}

	update(context, width, height) {
		this._move(width, height);
		this._draw(context);
	}

}



// Init --------------------------------------------------------

// Set canvas render mode
// context.globalCompositeOperation = 'lighter';

context.lineJoin = 'round';

const init = () => {
	const { width, height } = canvas;

	// Clear any old animations
	context.clearRect(0, 0, width, height);
	animator.stop();

	// Set up comets
	let comets = [];
	for (let i = 0; i < 1; i++) { // Math.round(width * height / 30000)
		comets.push(new Comet());
	}

	animator.start(() => {
		context.clearRect(0, 0, width, height);

		comets.forEach(particle => particle.update(context, width, height));
	});
};
init();
