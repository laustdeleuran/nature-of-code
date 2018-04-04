import Label from '../../utils/label';
import convertRange from '../../utils/convert-range';
import log from '../../utils/log';
import Animator from '../../utils/animator';
import SimplexNoise from 'simplex-noise';
import { bindResizeEvents, unBindResizeEvents } from '../../utils/resize';
import dat from 'dat-gui';

import '../experiments.scss';
import './style.scss';



/**
 * Feature detection
 */
import 'browsernizr/test/css/pointerevents';
import Modernizr from 'browsernizr';




/**
 * Project label
 */
new Label({
	title: 'Pencil scratch hover',
	desc: 'KOA - DSDH'
});



/**
 * Project markup
 */
import addMarkup from './markup';
const labels = addMarkup(['Raku', 'Valgfag', 'Rendyrket nydelse', 'DSDH', 'Den Skandinaviske Designhøjskole']);



/**
 * Noise walker
 */
const simplex = new SimplexNoise();
class Walker {
	constructor(increment) {
		this._increment = increment;
		this._xOff = Math.round(1000 * Math.random());
		this._yOff = Math.round(1000 * Math.random());

		this.update();
	}

	update(width, height) {
		this.x = convertRange(simplex.noise2D(this._xOff, 0), -1, 1, 0, width);
		this.y = convertRange(simplex.noise2D(this._yOff, 0), -1, 1, 0, height);

		this._xOff += this._increment.x;
		this._yOff += this._increment.y;
	}

	display(context) {
		context.beginPath();
		context.arc(this.x, this.y, 5, 0, Math.PI * 2);
		context.fill();
	}
}



/**
 * Default perlin increment
 */
const DEFAULT_NOISE_INCREMENT = 0.1;

/**
 * Scratch class
 */
class Scratch {

	/**
	 * Constructor
	 * @param {Element} element
	 * @param {object} settings
	 *   @prop {string} color
	 *   @prop {number} density
	 *   @prop {object} increment - perlin increment
	 *     @prop {number} x
	 *     @prop {number} y
	 *   @prop {number} maxPoints
	 *   @prop {number} padding
	 *   @prop {number} squiggliness
	 *   @prop {number} stroke
	 */
	constructor(
		element,
		{
			color = 'rgba(255,89,71,0.9)',
			density = 1.5,
			increment = { x: DEFAULT_NOISE_INCREMENT, y: DEFAULT_NOISE_INCREMENT },
			maxPoints = 75,
			padding = 0,
			squiggliness = 0,
			stroke = 5,
		} = {}
	) {
		if (!Modernizr.csspointerevents) {
			log.debug('Scratch.constructor() - Pointer events not support, no scratch overlays possible.');
			return;
		}

		if (!element) {
			log.debug('Scratch.constructor() - No valid target element provided');
			return;
		}

		// Setup DOM
		const canvas = document.createElement('canvas');
		canvas.className = 'scratch';
		document.body.appendChild(canvas);
		const context = canvas.getContext('2d');

		// Initialize animator
		const animator = new Animator();
		const walker = new Walker(increment);
		const points = [];

		// Save settings
		this._vars = {
			animator,
			canvas,
			color,
			context,
			density,
			element,
			increment,
			maxPoints,
			padding,
			points,
			squiggliness,
			stroke,
			walker,
		};

		// Place canvas
		this._place();
	}

	_bindResize() {
		this._vars.resizeListener = bindResizeEvents(this._place);
	}

	_unbindResize() {
		if (this._vars.resizeListener) {
			unBindResizeEvents(this._vars.resizeListener);
			delete this._vars.resizeListener;
		}
	}

	_place = () => {
		const { canvas, context, density, element, padding } = this._vars;
		const rect = this._vars.rect = element.getBoundingClientRect();
		const { pageXOffset, pageYOffset } = window;

		canvas.style.top = (rect.y + pageYOffset - padding) + 'px';
		canvas.style.left = (rect.x + pageXOffset - padding) + 'px';
		const width = (rect.width + padding * 2);
		canvas.width = width * density;
		canvas.style.width = width + 'px';
		const height = (rect.height + padding * 2);
		canvas.height = height * density;
		canvas.style.height = height + 'px';

		context.translate(0.5, 0.5);

		this._clearCanvas();
	}

	_clearCanvas() {
		const { canvas, context } = this._vars;
		context.clearRect(-10, -10, canvas.width + 10, canvas.height + 10);
	}

	_animate = () => {
		const { animator, canvas, density, maxPoints, points, stroke, squiggliness, walker } = this._vars;

		const realStrokeWidth = stroke * density,
			halfRealStrokeWidth = realStrokeWidth / 2;

		walker.update(canvas.width - realStrokeWidth, canvas.height - realStrokeWidth);
		// walker.display(context);

		if (points.length < maxPoints) {
			points.push({ x: walker.x + halfRealStrokeWidth, y: walker.y + halfRealStrokeWidth });
		} else if (squiggliness === 0) {
			animator.stop();
			return;
		}

		this._clearCanvas();
		this._drawLine();
	}

	_drawLine() {
		const { color, context, density, points, squiggliness, stroke } = this._vars;

		context.lineJoin = 'round';
		context.lineWidth = stroke * density;
		context.strokeStyle = color;
		context.beginPath();

		for (let i = 1; i < points.length; i++) {
			let point = points[i];

			// Draw line between points
			if (i === 1) {
				let previousPoint = points[i - 1];
				context.moveTo(previousPoint.x + Math.random() * squiggliness, previousPoint.y + Math.random() * squiggliness);
			}

			context.lineTo(point.x + Math.random() * squiggliness, point.y + Math.random() * squiggliness);
		}

		context.stroke();
	}

	start = () => {
		const { animator } = this._vars;
		this._vars.points = [];
		animator.stop();
		animator.start(this._animate);
	};

	stop = () => {
		const { animator } = this._vars;
		animator.stop();
		this._clearCanvas();
	};

	destroy() {
		this._unbindResize();

		const { animator, canvas } = this._vars;
		canvas.parentNode.removeChild(canvas);

		animator.stop();

		delete this._vars;
	}
}



/**
 * Init scratches!
 */

// Default settings
let settings = {
	color: 'rgba(255,89,71,0.9)',
	density: 1.5,
	increment: { x: 0.1, y: 0.1 },
	maxPoints: 75,
	padding: 5,
	squiggliness: 0,
	stroke: 5
};

let scratches = [];

// Initialize scratches (reusable for dat.GUI hookup)
const init = () => {

	// Remove already initialized scrateches
	if (scratches.length) {
		scratches.forEach(scratch => {
			scratch._vars.element.removeEventListener('mouseenter', scratch.start);
			scratch._vars.element.removeEventListener('mouseleave', scratch.stop);
			scratch.destroy();
		});
	}

	scratches = [];

	// Create new scratches with new settings
	labels.forEach(element => {
		const scratch = new Scratch(element, settings);

		element.addEventListener('mouseenter', scratch.start);
		element.addEventListener('mouseleave', scratch.stop);

		scratches.push(scratch);
	});
};

// Initial run
init();

// Set up dat.GUI
const gui = new dat.GUI();
gui.addColor(settings, 'color', 1, 2).onChange(init);
gui.add(settings, 'density', 1, 2).name('canvasPixelDensity').onChange(init);
gui.add(settings, 'maxPoints', 10, 200).onChange(init);
gui.add(settings.increment, 'x', 0, 2).name('noiseIncrementX').onChange(init);
gui.add(settings.increment, 'y', 0, 2).name('noiseIncrementY').onChange(init);
gui.add(settings, 'padding', 0, 10).onChange(init);
gui.add(settings, 'squiggliness', 0, 30).onChange(init);
gui.add(settings, 'stroke', 0, 30).onChange(init);
