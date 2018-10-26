import '../experiments.scss';
import './style.scss';

import { convertPosition } from './utils';
import { WIDTH, HEIGHT } from './settings';

import drawFlashlight from './flashlight';
import MultiVideoplayer from './video-player';



/**
 * @setup
 */
const players = [];
for (let i = 0; i < 4; i++) {
	let player = new MultiVideoplayer(
		(i  === 0 || i === 2) ? 'left' : 'right',
		(i  === 0 || i === 1) ? 'top' : 'bottom',
	);
	players.push(player);
	player.init();
}


/**
 * @draw
 */
import Animator from 'utils/animator';
import pointer from './pointer';

const animator = new Animator();

animator.start(() => {
	pointer.update();

	for (let p = 0; p < players.length; p++) {
		players[p].update(pointer.position);
	}

	drawFlashlight(convertPosition(pointer.position, WIDTH, HEIGHT));
});



/**
 * Project label
 */
import Label from '../../helpers/label';

new Label({
	title: 'Multi-CULT-ural',
	desc: 'Let me tell you how to live your life'
});

