import { WIDTH, HEIGHT } from './settings';
import Vector from 'utils/vector';

/**
 * Vortex moving around screen based on attractors (random walker or pointer movement)
 */
export default class Vortex {
	constructor(
		x = Math.round(WIDTH * Math.random()),
		y = Math.round(HEIGHT * Math.random()),
		mass = Math.round(15),
		friction = 0.1
	) {
		this._position = new Vector(x, y);
		this._velocity = new Vector(0, 0);
		this._acceleration = new Vector(0, 0);
		this._mass = mass;
		this._friction = friction;
	}

	applyForce(vector) {
		vector = vector.divide(this._mass);
		this._acceleration.add(vector);
	}

	move() {
		this._velocity.multiply(0.1); // Friction

		this._velocity.add(this._acceleration);
		this._position.add(this._velocity);
		this._acceleration.multiply(0); // Reset acceleration
	}

	draw(context) {
		const { x, y } = this._position;
		context.beginPath();
		context.arc(x, y, this._mass, 0, Math.PI * 2);
		context.fill();
	}

	update(context) {
		this.move();
		if (context) this.draw(context);
	}

	get x() {
		return this._position.x;
	}

	get y() {
		return this._position.y;
	}
}
