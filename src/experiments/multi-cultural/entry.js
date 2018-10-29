import '../experiments.scss';
import './style.scss';

import { convertPosition } from './utils';
import { WIDTH, HEIGHT } from './settings';
import Vector from 'utils/vector';
import constrain from 'utils/constrain';

import drawFlashlight from './flashlight';
import MultiVideoplayer from './video-player';
import { OVERLAY_CANVAS } from './settings';
import bindGamepad from './gamepad';



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
 * Pointer
 */
let activePointer;
const MULTIPLIER = 4;
const pointer = {
	x: WIDTH / 2,
	y: HEIGHT / 2,
};
let lastSeenBtns;

bindGamepad(({ axis, buttons }) => {
	if (axis.x !== 0 || axis.y !== 0) {
		pointer.x = constrain(pointer.x + axis.x * MULTIPLIER, 0, window.innerWidth);
		pointer.y = constrain(pointer.y + axis.y * MULTIPLIER, 0, window.innerHeight);
		activePointer = pointer;
	}

	if (buttons.a === true && lastSeenBtns.a !== true) players[0].start();
	if (buttons.b === true && lastSeenBtns.b !== true) players[1].start();
	if (buttons.x === true && lastSeenBtns.x !== true) players[2].start();
	if (buttons.y === true && lastSeenBtns.y !== true) players[3].start();

	lastSeenBtns = buttons;
});



/**
 * @draw
 */
import Animator from 'utils/animator';
import Vortex from './vortex';
import Attractor from './attractor';

const animator = new Animator();
const attractor = new Attractor();
attractor.update(OVERLAY_CANVAS); // , OVERLAY_CONTEXT
const vortex = new Vortex();

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

	if (x < 1 && y < 1 && activePointer) activePointer = null;

	vortex.applyForce(new Vector(x, y));
	vortex.update(); // OVERLAY_CONTEXT
	const position = { x: vortex.x, y: vortex.y };

	for (let p = 0; p < players.length; p++) {
		players[p].update(position);
	}

	drawFlashlight(convertPosition(position, WIDTH, HEIGHT));
});



/**
 * Fullscreen
 */
const requestFullScreen = (elem = document.documentElement) => {
	if (elem.requestFullscreen) elem.requestFullscreen();
	else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
	else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
	else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
};

document.addEventListener('keydown', event => {
	if (event.key === 'f') requestFullScreen();
});







/**
 * Project label
 */
import Label from '../../helpers/label';

new Label({
	title: 'Let me tell you how to live your life',
	desc: 'Do you even believe, bro?'
});

