import '../experiments.scss';
import './style.scss';

import Animator from '../../utils/animator';
import Canvas from '../../utils/canvas';
import Color from 'color';
import Label from '../../utils/label';
import Pointer from '../koa-dust-motes/pointer';
import { bindResizeEvents } from '../../utils/resize';
// import convertRange from '../../utils/convert-range';
// import normalizedRandom from '../../utils/normalized-random';
import roundTo from '../../utils/round-to';



/**
 * Project label
 * Inspired by https://codepen.io/ge1doot/pen/QbQwPR/
 */
new Label({
	title: 'Flares in your eyes',
	desc: 'KOA - Lens flares'
});



/**
 * Basic setup
 */
const
	animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();

/**
 * Colors
 */
const
	colorPurple = Color('#b289ad'),
	colorPink = Color('#fdebe2');



/**
 * Draw helpers
 */
function circle(x, y, radius, fill) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.fillStyle = fill;
	context.fill();
	// context.stroke();
}

const getLens = (dist, scale, size, px, py, cx, cy) => ({
	radius: roundTo(size * scale, 2),
	x: roundTo((cx - px) / dist + cx, 2),
	y: roundTo((cy - py) / dist + cy, 2),
});

function createGradient(x, y, radius, color) {
	let gradient = context.createRadialGradient(x, y, radius, x, y, radius * 0.8);
	gradient.addColorStop(1, color.rgb());
	gradient.addColorStop(0.2, color.alpha(0).rgb());
	return gradient;
}

function lens(dist, scale, px, py, color, cx = canvas.width / 2, cy = canvas.height / 2, size = 128) {
	const { radius, x, y } = getLens(dist, scale, size, px, py, cx, cy);
	circle(x, y, radius, createGradient(x, y, radius, color));
}



// Init --------------------------------------------------------

// Set canvas render mode
// context.globalCompositeOperation = 'lighter';

// Set up mouse tracking
const pointer = new Pointer({
	acceleration: 0.05,
	position: {
		x: canvas.width / 2,
		y: canvas.height / 2
	}
});

// Loop
const init = () => {
	animator.stop();

	// Animation loop
	animator.start(() => {
		const { width, height } = canvas;

		// Clear canvas
		context.clearRect(0, 0, width, height);

		// Update pointer position
		pointer.update();
		const { x: pointerX, y: pointerY } = pointer.position;

		// Draw pointer
		// context.beginPath();
		// context.arc(pointerX, pointerY, 3, 0, 2 * Math.PI);
		// context.closePath();
		// context.fillStyle = '#000';
		// context.fill();

		// Lens flares
		lens(1, 1, pointerX, pointerY, colorPink.lighten(0.5).alpha(0.3));
		lens(2, 0.5, pointerX, pointerY, colorPink.alpha(0.3));
		lens(3, 0.25, pointerX, pointerY, colorPurple.lighten(0.3).alpha(0.3));
		lens(8, 1, pointerX, pointerY, colorPink.alpha(0.3));
		lens(-2, 0.5, pointerX, pointerY, colorPurple.alpha(0.3));
		lens(-4, 0.25, pointerX, pointerY, colorPink.lighten(0.3).alpha(0.3));
		lens(-5.5, 0.2, pointerX, pointerY, colorPink.lighten(0.8).alpha(0.3));

	});

};

bindResizeEvents(init);
init();
