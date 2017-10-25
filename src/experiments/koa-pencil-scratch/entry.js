import Label from '../../utils/label';
import convertRange from '../../utils/convert-range';
import log from '../../utils/log';
import Animator from '../../utils/animator';
import SimplexNoise from 'simplex-noise';
import { bindResizeEvents, unBindResizeEvents } from '../../utils/resize';

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
 * Perlin noise walker
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
const DEFAULT_PERLIN_INCREMENT = 0.1;

/**
 * Scratch class
 */
class Scratch {

	/**
	 * Constructor
	 * @param {Element} element
	 * @param {object} settings
	 *   @prop {object} color
	 *     @prop {number} r
	 *     @prop {number} g
	 *     @prop {number} b
	 *     @prop {number} a
	 *   @prop {number} density
	 *   @prop {object} increment - perlin increment
	 *     @prop {number} x
	 *     @prop {number} y
	 *   @prop {number} padding
	 *   @prop {number} stroke
	 *   @prop {number} maxPoints
	 */
	constructor(
		element,
		{
			color = { r: 255, g: 89, b: 71, a: 0.9 },
			density = 1.5,
			increment = { x: DEFAULT_PERLIN_INCREMENT, y: DEFAULT_PERLIN_INCREMENT },
			maxPoints = 200,
			padding = 0,
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
			stroke,
			walker,
		};

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

		canvas.style.top = (rect.y - padding) + 'px';
		canvas.style.left = (rect.x - padding) + 'px';
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
		const { animator, canvas, maxPoints, points, walker } = this._vars;

		walker.update(canvas.width, canvas.height);
		// walker.display(context);

		points.push({ x: walker.x, y: walker.y });
		if (points.length > maxPoints) {
			animator.stop();
			return;
		}

		this._clearCanvas();
		this._drawLine();
	}

	_drawLine() {
		const { color, context, density, points, stroke } = this._vars;

		context.lineJoin = 'round';
		context.lineWidth = stroke * density;
		context.strokeStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
		context.beginPath();

		for (let i = 0; i < points.length; i++) {
			let point = points[i];

			// Draw line between points
			if (i > 1) {
				if (i === 1) {
					let previousPoint = points[i - 1];
					context.moveTo(previousPoint.x, previousPoint.y);
				}

				context.lineTo(point.x, point.y);
			}
		}

		context.stroke();
	}

	enter = () => {
		const { animator } = this._vars;
		this._vars.points = [];
		animator.stop();
		animator.start(this._animate);
	};

	exit = () => {
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
labels.forEach(element => {
	const scratch = new Scratch(element, { padding: 5 });

	element.addEventListener('mouseenter', scratch.enter);
	element.addEventListener('mouseleave', scratch.exit);
});
