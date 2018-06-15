import Label from '../../utils/label';
import convertRange from '../../utils/convert-range';
import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
import Vector from '../../utils/vector';
// import PerlinNoise from '../../utils/perlin-noise';
// import Pointer from '../../utils/pointer';
import Stats from 'stats.js';
import { bindResizeEvents } from '../../utils/resize';

import '../experiments.scss';
import './style.scss';



/**
 * Project label
 */
new Label({
	title: 'Vector field and particles',
	desc: 'KOA - Website experiments'
});



/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext(),
	stats = new Stats();

stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);
// context.fillStyle = 'rgba(0, 0, 0, 0.0625)';



/**
 * Particle
 */
class Particle {
	constructor({
		color = '#fff',
		diameter = Math.random() * 2 + 0.5,
		position: { x, y },
	}) {
		this.color = color;
		this.diameter = diameter;
		this.position = { x, y };
	}

	get x() { return this.position.x; }
	get y() { return this.position.y; }

	move(velocity) {
		let { x, y } = this.position;
		x += velocity.x;
		y += velocity.y;
		this.position = { x, y };
	}

	draw(context = context) {
		const { color, diameter, position } = this;
		var { x, y } = position;
		var radius = diameter / 2;

		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2, false);
		context.closePath();
		context.fill();
	}
}



/**
 * Draw
 */
const PARTICLES = 700;
const COORDINATE_FACTOR = 8;
const COLOR_PURPLE = { r: 249, g: 176, b: 208 };
const COLOR_PINK = { r: 255, g: 180, b: 176 };

const getColorFromPosition = ({ x, y }, length = new Vector(canvas.width, canvas.height).magnitude) => {
	const magnitude = new Vector(x, y).magnitude;
	return {
		r: convertRange(magnitude, 0, length, COLOR_PINK.r, COLOR_PURPLE.r),
		g: convertRange(magnitude, 0, length, COLOR_PINK.g, COLOR_PURPLE.g),
		b: convertRange(magnitude, 0, length, COLOR_PINK.b, COLOR_PURPLE.b),
	};
};

const convertPosition = ({ x, y }, { width, height } = canvas) => ({
	x: convertRange(x, 0, width, -COORDINATE_FACTOR, COORDINATE_FACTOR),
	y: convertRange(y, 0, height, -COORDINATE_FACTOR, COORDINATE_FACTOR),
});

const isOutOfBounds = ({ x, y }, { width, height } = canvas) =>
	x < 0 ||
	x > width ||
	y < 0 ||
	y > height;

// const getVelocity = position => ({
// 	x: -2 * (Math.floor(Math.abs(position.y)) % 2) + 1,
// 	y: -2 * (Math.floor(Math.abs(position.x)) % 2) + 1,
// });
const getVelocity = position => ({
	x: position.x,
	y: position.x / new Vector(position.x, position.y).magnitude,
});

let particles;

const init = () => {
	animator.stop();

	particles = [];
	for (let p = 0; p < PARTICLES; p++) {
		particles.push(new Particle({ position: {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height
		} }));
	}

	const length = new Vector(canvas.width, canvas.height).magnitude;

	// Animation loop
	animator.start(() => {

		stats.begin();

		// Overlay canvas with semi-transparent gradient
		const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, 'rgba(149, 76, 178, 0.35)');
		gradient.addColorStop(1, 'rgba(255, 80, 126, 0.35)');
		context.fillStyle = gradient;
		context.fillRect(0, 0, canvas.width, canvas.height);

		for (let p = 0; p < particles.length; p++) {
			let particle = particles[p];
			let velocity = getVelocity(convertPosition(particle.position));
			if (isOutOfBounds(particle.position) || Math.abs(velocity.x) + Math.abs(velocity.y) <= 0.001) {
				particle.position = {
					x: canvas.width * Math.random(),
					y: canvas.height * Math.random(),
				};
				particles[p] = particle;
				velocity = getVelocity(convertPosition(particle.position));
			}

			const { r, g, b } = getColorFromPosition(particle.position, length);
			particle.color = `rgb(${r}, ${g}, ${b})`;

			particle.move(velocity);
			particle.draw(context);
		}

		stats.end();
	});

};

bindResizeEvents(init);
init();
