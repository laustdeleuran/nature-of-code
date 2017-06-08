import Label from '../../utils/label';
import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
import Gaussian from '../../utils/gaussian';

import '../base.scss';



/**
 * Project label
 */
new Label({
	title: 'Paint splatter',
	desc: 'I.4 - Nature of Code'
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
  constructor(x = Math.floor(canvas.width/2), y = Math.floor(canvas.height/2), size = 10) {
    this.pos = {
      x,
      y
    };
    this.size = size;
    this.color = {
      r: new Gaussian(255/2, 30),
      g: new Gaussian(255/2, 30),
      b: new Gaussian(255/2, 30)
    };
    this.gaussian = {
      x: new Gaussian(x, this.size * 4),
      y: new Gaussian(y, this.size * 4)
    };
  }

  draw() {
    const radius = this.size / 2;

		context.fillStyle = 'rgba(' + Math.round(this.color.r.generate()) + ', ' + Math.round(this.color.g.generate()) + ', ' + Math.round(this.color.b.generate()) + ', 0.6)';
		context.beginPath();
		context.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2, false);
		context.closePath();
		context.fill();
  }

  move() {
    this.pos = {
      x: this.gaussian.x.generate(),
      y: this.gaussian.y.generate()
    };
  }
}



// Get this show moving
var wlkr = new Walker();
animator.start(function() {
	wlkr.draw();
	wlkr.move();
});
