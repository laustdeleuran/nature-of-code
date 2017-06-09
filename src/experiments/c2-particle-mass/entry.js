import Label from '../../utils/label';
import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
import Vector from '../../utils/vector';

import '../experiments.scss';



/**
 * Project label
 */
new Label({
	title: 'Particles, mass and forces',
	desc: '2.2 - Nature of Code'
});



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext(),
	clear = () => context.clearRect(0, 0, canvas.width, canvas.height);





/**
 * Particle class
 */
class Particle {

	constructor(x = canvas.width / 2, y = canvas.height / 2, mass = 1) {
		this._position = new Vector(x, y);
		this._velocity = new Vector(0, 0);
		this._acceleration = new Vector(0, 0);
	}

	applyForce(force = new Vector(0, 0)) {
		return this._acceleration.add(force.copy());
	}

	draw() {

	}

	move() {
		this._velocity.add(this._acceleration);
		this._position.add(this._velocity);
		this._acceleration.multiply(0);
	}

}



// Get this show moving
const particles = [];



animator.start(() => particles.forEach(particle => {
	particle.move();
	particle.draw();
}));
