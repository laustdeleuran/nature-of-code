import Animator from 'utils/animator';
import Canvas from 'utils/canvas';
import Label from '../../helpers/label';
import SimplexNoise from 'simplex-noise';
import convertRange from 'utils/convert-range';
// import roundTo from 'utils/round-to';
// import normalizedRandom from 'utils/normalized-random';
// import { bindResizeEvents } from 'utils/resize';

import '../experiments.scss';
import './style.scss';



/**
 * Project label
 */
new Label({
	title: 'Holiday feels and acid flashbacks',
	desc: 'Fractal ice'
});



/**
 * Basic setup
 */
const
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
		canvas,
		context,
		init,
		canSplit = true,
		color = {
			r: 236,
			g: 248,
			b: 255,
		},
		lifespan = Infinity,
		offset = {
			x: {
				value: Math.round(1000 * Math.random()),
				offset: 0,
			},
			y: {
				value: Math.round(1000 * Math.random()),
				offset: 0,
			},
		},
	} = {}) {
		this._vars = {
			age: 0,
			animator: new Animator(),
			canSplit,
			canvas,
			children: [],
			color,
			context,
			increment: 0.0025,
			init,
			length: 50,
			lifespan,
			minSpeed: 0,
			offset,
			position: [],
		};

		this._vars.animator.start(() => {
			if (typeof init === 'function') init();

			this.update();
		});
	}

	_move() {
		const { age, canvas, increment, length, lifespan, minSpeed, offset, speed: lastSpeed, position } = this._vars;
		const { x: offsetX, y: offsetY } = offset;

		const point = {
			x: convertRange(simplex.noise2D(offsetX.value, offsetX.offset), -1, 1, 0, canvas.width),
			y: convertRange(simplex.noise2D(offsetY.value, offsetY.offset), -1, 1, 0, canvas.height)
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
			this._stop();
		}

		position.push(point);
		if (length < position.length) position.shift();

		this._vars.speed = speed;
		this._vars.age++;
		this._vars.offset = {
			x: {
				value: offsetX.value + increment,
				offset: offsetX.offset,
			},
			y: {
				value: offsetY.value + increment,
				offset: offsetY.offset,
			},
		};
	}

	_draw() {
		const { color, context, position, length } = this._vars;

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
		this._vars.animator.stop();
		this._vars.isStopped = true;
	}

	_split() {
		const { age, canvas, context, children, offset } = this._vars;

		children.push(new Comet({
			canvas,
			context,
			canSplit: false,
			lifespan: 50,
			offset: {
				x: { value: offset.x.value, offset: offset.x.offset + 0.001 * age },
				y: { value: offset.y.value, offset: offset.y.offset - 0.001 * age },
			}
		}));
	}

	update() {
		// console.log(this._vars.position[this._vars.position.length - 1]);
		if (!this._vars.isStopped) this._move();
		if (this._vars.canSplit && !this._vars.isStopped && Math.round(Math.random())) this._split();

		this._draw();
	}

}



// Init --------------------------------------------------------

// Set canvas render mode
// context.globalCompositeOperation = 'lighter';

context.lineJoin = 'round';

window.comet = new Comet({
	canvas, context, init: () => context.clearRect(0, 0, canvas.width, canvas.height)
});
