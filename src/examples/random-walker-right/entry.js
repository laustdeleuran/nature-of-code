import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
import random from '../../utils/random';

import '../base.scss';


/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();



/**
 * Gaussian walker
 */
class Walker {
	constructor(x = Math.floor(canvas.width/2), y = Math.floor(canvas.height/2), size = 1, color = '#fff') {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
	}

	draw() {
		const radius = this.size / 2;

		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
		context.closePath();
		context.fill();
	}

	move() {
		this.x += random({ value: 1, prob: 0.6 }, -1);
		this.y += random(1, -1);
	}
}



// Get this show moving
var wlkr = new Walker();
animator.start(function() {
	wlkr.draw();
	wlkr.move();
});
