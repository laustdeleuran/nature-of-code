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
	colorPink = Color('#fdebe2'),
	baseRadius = 128;



/**
 * Draw helpers
 */
function circle(x, y, radius, fill) {
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI);
	context.fillStyle = fill;
	context.fill();
}

const getLensPosition = (distance, pointerX, pointerY, centerX, centerY) => ({
	x: roundTo((centerX - pointerX) / distance + centerX, 2),
	y: roundTo((centerY - pointerY) / distance + centerY, 2),
});

const createSpotGradient = (x, y, radius, color) => {
	// We need the second circle to be slightly offset from the first to avoid this bug:
	// https://stackoverflow.com/questions/49640841/canvas-createradialgradient-not-working-as-expected-in-chrome-v65
	const gradient = context.createRadialGradient(x, y, radius, x + 0.001, y, radius > 20 ? radius * 0.8 : radius * 0.25);
	gradient.addColorStop(1, color.rgb());
	gradient.addColorStop(0, color.alpha(0).rgb());
	return gradient;
};

const createHaloGradient = (x, y, radius, color) => {
	const width = 20 / radius;

	// We need the second circle to be slightly offset from the first to avoid this bug:
	// https://stackoverflow.com/questions/49640841/canvas-createradialgradient-not-working-as-expected-in-chrome-v65
	const gradient = context.createRadialGradient(x, y, radius, x + 0.001, y, radius * 0.8);
	gradient.addColorStop(0 + width * 3, color.alpha(0).rgb());
	gradient.addColorStop(0 + width, color.rgb());
	gradient.addColorStop(0, color.alpha(0).rgb());
	return gradient;
};

const createGradient = (x, y, radius, color, isHalo) => isHalo ?
	createHaloGradient(x, y, radius, color) : createSpotGradient(x, y, radius, color);

/**
 * @param settings {object}
 *   @prop centerX {number}
 *   @prop centerY {number}
 *   @prop color {Color}
 *   @prop distance {number} - Must not be 0. Works best between 1 and 10.
 *                             The higher the number, the more the calculated centering point
 *                             will tend towards the center provided.
 *   @prop isHalo {bool}
 *   @prop pointerX {number}
 *   @prop pointerY {number}
 *   @prop radius {number}
 */
function lens({ centerX, centerY, color, distance, isHalo, pointerX, pointerY, radius }) {
	const { x, y } = getLensPosition(distance, pointerX, pointerY, centerX, centerY);
	circle(x, y, radius, createGradient(x, y, radius, color, isHalo));
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
		const centerX = width / 2;
		const centerY = height / 2;

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
		const lensSettings = {
			centerX,
			centerY,
			pointerX,
			pointerY,
		};

		lens({
			distance: 1,
			radius: 1 * baseRadius,
			color: colorPink.lighten(0.5).alpha(0.3),
			...lensSettings,
		});
		lens({
			distance: 2,
			radius: 0.5 * baseRadius,
			color: colorPink.alpha(0.3),
			...lensSettings,
		});
		lens({
			distance: 3,
			radius: 0.25 * baseRadius,
			color: colorPurple.lighten(0.3).alpha(0.3),
			...lensSettings,
		});
		lens({
			distance: 8,
			radius: 1 * baseRadius,
			color: colorPink.alpha(0.3),
			...lensSettings,
		});
		lens({
			distance:9,
			radius: 1.1 * baseRadius,
			color: colorPurple.alpha(0.3),
			isHalo: true,
			...lensSettings,
		});
		lens({
			distance: -2,
			radius: 0.5 * baseRadius,
			color: colorPurple.alpha(0.3),
			...lensSettings,
		});
		lens({
			distance: -4,
			radius: 0.25 * baseRadius,
			color: colorPink.lighten(0.3).alpha(0.3),
			...lensSettings,
		});
		lens({
			distance: -5.5,
			radius: 0.2 * baseRadius,
			color: colorPink.lighten(0.8).alpha(0.3),
			...lensSettings,
		});

	});

};

bindResizeEvents(init);
init();
