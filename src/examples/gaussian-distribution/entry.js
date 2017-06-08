import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';

import '../base.scss';



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();



/**
 * @source https://github.com/processing/p5.js/blob/master/src/math/random.js#L143
 */
const randomGaussian = {
	generate(mean = 0, sd = 1) {
		var y1,x1,x2,w;
		if (this._previous) {
			y1 = this._y2;
			this._previous = false;
		} else {
			do {
				x1 = Math.random() * 2 - 1;
				x2 = Math.random() * 2 - 1;
				w = x1 * x1 + x2 * x2;
			} while (w >= 1);
			w = Math.sqrt((-2 * Math.log(w))/w);
			y1 = x1 * w;
			this._y2 = x2 * w;
			this._previous = true;
		}
		return y1*sd + mean;
	}
};


/**
 * Gaussian walker
 */
class Gaussian {
	constructor(x = Math.floor(canvas.width/2), y = Math.floor(canvas.height/2), size = 30, color = 'rgba(255, 255, 255, 0.05)') {
		this.x = this.origX = x;
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
		this.x = randomGaussian.generate(this.origX, canvas.width / 3);
	}
}



// Get this show moving
var wlkr = new Gaussian();
animator.start(function() {
	wlkr.draw();
	wlkr.move();
});
