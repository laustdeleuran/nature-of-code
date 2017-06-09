import Label from '../../utils/label';
import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
import Gaussian from '../../utils/gaussian';

import '../examples.scss';



/**
 * Project label
 */
new Label({
	title: 'Gaussian walker',
	desc: 'I.5 - Nature of Code'
});



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
	constructor(x = Math.floor(canvas.width/2), y = Math.floor(canvas.height/2), size = 2, color = 'rgba(255, 255, 255, 0.5)') {
		this.x = x;
		this.y = y;
		this.size = size;
		this.color = color;
		this.gaussian = new Gaussian(0, 3);
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
		this.x += this.gaussian.generate();
		this.y += this.gaussian.generate();
	}
}



// Get this show moving
var wlkr = new Walker();
animator.start(function() {
	wlkr.draw();
	wlkr.move();
});
