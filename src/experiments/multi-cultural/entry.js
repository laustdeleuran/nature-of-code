import '../experiments.scss';
import './style.scss';

import { convertPosition } from './utils';
import { WIDTH, HEIGHT } from './settings';
import Vector from 'utils/vector';

import drawFlashlight from './flashlight';
import MultiVideoplayer from './video-player';
import { OVERLAY_CANVAS } from './settings';


/**
 * @setup
 */
const players = [];
for (let i = 0; i < 4; i++) {
	let player = new MultiVideoplayer(
		(i	=== 0 || i === 2) ? 'left' : 'right',
		(i	=== 0 || i === 1) ? 'top' : 'bottom',
	);
	players.push(player);
	player.init();
}


/**
 * @draw
 */
import Animator from 'utils/animator';
import Vortex from './vortex';
import Attractor from './attractor';

let activePointer;
const
	getPointerEventPosition = event => {
		let x, y;

		// Get pointer position from event
		if (event.touches && event.touches[0]) {
			x = event.touches[0].clientX;
			y = event.touches[0].clientY;
		} else {
			x = event.clientX;
			y = event.clientY;
		}

		return { x, y };
	},
	pointerListener = event => {
		activePointer = getPointerEventPosition(event);
	};
document.addEventListener('mousemove', pointerListener, { passive: true });
document.addEventListener('touchmove', pointerListener, { passive: true });

const animator = new Animator();
const attractor = new Attractor();
attractor.update(OVERLAY_CANVAS); // , OVERLAY_CONTEXT
const vortex = new Vortex();

const requestFullScreen = (elem = document.documentElement) => {
	if (elem.requestFullscreen) elem.requestFullscreen();
	else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
	else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
	else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
};

document.addEventListener('keydown', event => {
	if (event.key === 'f') requestFullScreen();
});

animator.start(() => {
	// Get attractor
	let x, y;
	if (activePointer) {
		x = activePointer.x;
		y = activePointer.y;
	} else {
		attractor.update(OVERLAY_CANVAS); // , OVERLAY_CONTEXT
		x = attractor.x;
		y = attractor.y;
	}

	x -= vortex.x;
	y -= vortex.y;

	if (x < 1 && y < 1 && activePointer) {
		activePointer = null;
	}

	vortex.applyForce(new Vector(x, y));
	vortex.update(); // OVERLAY_CONTEXT
	const position = { x: vortex.x, y: vortex.y };

	for (let p = 0; p < players.length; p++) {
		players[p].update(position);
	}

	drawFlashlight(convertPosition(position, WIDTH, HEIGHT));
});



/**
 * Project label
 */
import Label from '../../helpers/label';

new Label({
	title: 'Multi-CULT-ural',
	desc: 'Let me tell you how to live your life'
});

