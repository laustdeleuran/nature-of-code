import Animator from '../../utils/animator';
import Canvas from '../../utils/canvas';
import Label from '../../utils/label';
import SimplexNoise from 'simplex-noise';
import convertRange from '../../utils/convert-range';
// import roundTo from '../../utils/round-to';
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
		direction = {
			x: -1 + Math.random() * 2,
			y: -1 + Math.random() * 2
		},
		velocity = 0.5,
		x,
		y
	}) {
		this._position = { x, y };
		this._direction = direction;

		this._velocity = {
			noiseIncrement: 0.1,
			noiseOffset: Math.round(1000 * Math.random()),
			base: velocity,
		};
	}

	_updateVelocity() {
		const { base, noiseOffset } = this._velocity;

		this._velocity.value = convertRange(simplex.noise2D(noiseOffset, 0), -1, 1, 0, base * 2);
		this._velocity.noiseOffset += this._velocity.noiseIncrement;
	}

	move() {
		this._updateVelocity();

	}

	draw(context) {

	}

}



// Init --------------------------------------------------------

// Set canvas render mode
context.globalCompositeOperation = 'lighter';

// Set event listener
canvas.element.addEventListener('mousedown', event => {
	const { clientX: x, clientY: y } = event;

	let branch = new Branch({ x, y });

	animator.start(() => {
		branch.move();
		branch.draw(context);
		// branch.split();
	});

	// canvas.addEventListener('mouseup', event => {
	// 	branch
	// })
});
