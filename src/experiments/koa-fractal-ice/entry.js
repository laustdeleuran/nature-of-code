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
		colors = {
			shadow: 'rgba(0, 4, 34, 0.33)',
			primary: 'rgba(124, 182, 227, 0.33)',
			highlight: 'rgba(255, 255, 255, 0.75)',
		},
	} = {}) {
		this._vars = {
			colors: colors,
			increment: 0.005,
			offset: {
				x: Math.round(1000 * Math.random()),
				y: Math.round(1000 * Math.random()),
			},
			position: [],
			length: 50,
		};
	}

	_move(width, height) {
		const { increment, length, offset } = this._vars;
		const { x: offsetX, y: offsetY } = offset;

		this._vars.position.push({
			x: convertRange(simplex.noise2D(offsetX, 0), -1, 1, 0, width),
			y: convertRange(simplex.noise2D(offsetY, 0), -1, 1, 0, height)
		});

		if (length < this._vars.position.length) this._vars.position.shift();

		this._vars.offset = {
			x: offsetX + increment,
			y: offsetY + increment,
		};
	}

	_draw(context) {
		const { position } = this._vars;

		position.forEach(({ x, y }, index) => {
			if (index === 0) return;

			const prev = position[index - 1];
			const decay = index / position.length;
			context.beginPath();
			context.moveTo(prev.x, prev.y);
			context.strokeStyle = 'rgba(236, 248, 255, ' + decay + ')';
			context.lineTo(x, y);
			context.stroke();
		});
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
