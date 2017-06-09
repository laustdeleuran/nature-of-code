import Label from '../../utils/label';
import convertRange from '../../utils/convert-range';
import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
import Vector from '../../utils/vector';
import PerlinNoise from '../../utils/perlin-noise';

import '../experiments.scss';
import './style.scss';



/**
 * Project label
 */
new Label({
	title: 'Pencil draw with color and trails',
	desc: 'KOA - Website experiments'
});


/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();



/**
 * Vortex moving around screen based on attractors (random walker or pointer movement)
 */
class Vortex {
	constructor(
		x = Math.round(canvas.width * Math.random()),
		y = Math.round(canvas.height * Math.random()),
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

	update() {
		this._velocity.multiply(0.1); // Friction

		this._velocity.add(this._acceleration);
		this._position.add(this._velocity);
		this._acceleration.multiply(0); // Reset acceleration
	}

	display() {
		const { x, y } = this._position;
		context.beginPath();
		context.arc(x, y, this._mass, 0, Math.PI * 2);
		context.fill();
	}

	get x() {
		return this._position.x;
	}

	get y() {
		return this._position.y;
	}
}



/**
 * Perlin noise walker
 */
class Attractor {
	constructor (increment) {
		increment = increment || 0.025;

		this.increment = increment;
		this.perlin = new PerlinNoise(2);
		this.xOff = Math.round(1000 * Math.random());
		this.yOff = Math.round(1000 * Math.random());

		this.update();
	}

	update() {
		this.x = convertRange(this.perlin.noise(this.xOff), 0, 1, 0, canvas.width);
		this.y = convertRange(this.perlin.noise(this.yOff), 0, 1, 0, canvas.height);

		this.xOff += this.increment;
		this.yOff += this.increment;
	}

	display() {
		context.beginPath();
		context.arc(this.x, this.y, 50, 0, Math.PI * 2);
		context.fill();
	}
}



/**
 * Pointer listeners
 */
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
canvas.element.addEventListener('mousemove', pointerListener, { passive: true });
canvas.element.addEventListener('touchmove', pointerListener, { passive: true });


/**
 * Draw
 */
const attractor = new Attractor(),
	vortex = new Vortex(),
	points = [],
	POINTS_MAX = 200,
	LINE_COLOR = [170, 240, 174],
	CONNECTOR_DISTANCE = 10000,
	CONNECTOR_POINTS = 20;

context.fillStyle = 'rgba(0, 0, 0, 0.0625)';

animator.start(() => {
	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Get attractor
	let x, y;
	if (activePointer) {
		x = activePointer.x;
		y = activePointer.y;
	} else {
		attractor.update();
		x = attractor.x;
		y = attractor.y;
	}

	x -= vortex.x;
	y -= vortex.y;

	if (x < 1 && y < 1 && activePointer) {
		activePointer = null;
	}

	vortex.applyForce(new Vector(x, y));

	// attractor.display();

	vortex.update();
	// vortex.display();

	// Create point trail
	points.push({ x: vortex.x, y: vortex.y });
	if (points.length > POINTS_MAX) {
		points.shift();
	}

	var pointsLength = points.length,
		point,
		previousPoint,
		color,
		decay;
	for (var i = 0; i < pointsLength; i++) {
		point = points[i];
		previousPoint = points[i - 1];
		decay = 1 - i / pointsLength;
		color = Math.round(LINE_COLOR[0] * decay) + ', ' + Math.round(LINE_COLOR[1] * decay) + ', ' + Math.round(LINE_COLOR[2] * decay);

		// Draw line between points
		if (previousPoint) {
			context.strokeStyle = 'rgba(' + color + ', ' + decay + ')';
			context.beginPath();
			context.moveTo(previousPoint.x, previousPoint.y);
			context.lineTo(point.x, point.y);
			context.stroke();

			// Calculate distance to n = CONNECTOR_POINTS points before this point
			for (var t = i < CONNECTOR_POINTS ? 0 : i - CONNECTOR_POINTS; t < i; t++) {
				previousPoint = points[t];

				var dx = point.x - previousPoint.x,
					dy = point.y - previousPoint.y,
					d = dx * dx + dy * dy;

				if (d < CONNECTOR_DISTANCE) {
					context.beginPath();
					context.strokeStyle = 'rgba(' + color + ', ' + t / i * 0.05 + ')';
					context.moveTo(previousPoint.x, previousPoint.y);
					context.lineTo(point.x, point.y);
					context.stroke();
				}
			}
		}
	}
});
