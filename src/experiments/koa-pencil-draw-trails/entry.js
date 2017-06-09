import Label from '../../utils/label';
import convertRange from '../../utils/convert-range';
import Canvas from '../../utils/canvas';
import Animator from '../../utils/animator';
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
 * Perlin noise walker
 */
class Walker {
	constructor (increment) {
		increment = increment || 0.005;

		this.increment = increment;
		this.perlin = new PerlinNoise(6);
		this.xOff = Math.round(1000 * Math.random());
		this.yOff = Math.round(1000 * Math.random());

		this.move();
	}

	move() {
		const { x, y } = this;

		this.x = convertRange(this.perlin.noise(this.xOff), 0, 1, 0, canvas.width);
		this.y = convertRange(this.perlin.noise(this.yOff), 0, 1, 0, canvas.height);

		this.xOff += this.increment;
		this.yOff += this.increment;

		if (Math.abs(this.x - x) > 0.9 || Math.abs(this.y - y) > 0.9) {
			draw(this.x, this.y);
		}
	}
}


/**
 * Basic setup
 */
const animator = new Animator(),
	canvas = new Canvas(),
	context = canvas.getContext();



/**
 * Resize canvas
 */
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	points = [];
	clearCanvas(canvas.getContext());
}
canvas.resizeListener = resizeCanvas;



/**
 * Settings and trackers
 */
const
	CONNECTOR_DISTANCE = 10000,
	CONNECTOR_POINTS = 20,
	LINE_COLOR = [170, 240, 174],
	POINTS_MAX = 200,
	walker = new Walker(),
	WALKER_TIMEOUT = 5000;
let
	points = [],
	walkerTimer;


/**
 * Restart walker
 */
function restartWalker() {
	stopWalker();
	walkerTimer = setTimeout(startWalker, WALKER_TIMEOUT);
}

/**
 * Stop walker
 */
function stopWalker() {
	clearTimeout(walkerTimer);
	animator.stop();
}

/**
 * Start walker
 */
function startWalker() {
	stopWalker();
	animator.start(() => walker.move());
}

/**
 * Setup canvas
 */
function setupCanvas() {
	context.lineWidth = 1;
	context.lineJoin = context.lineCap = 'round';

	resizeCanvas();
	initCanvas();
	startWalker();
}

/**
 * Clear canvas
 */
function clearCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Init canvas
 */
function initCanvas() {
	if (canvas) {

		canvas.element.addEventListener('mousemove', function(event) {
			restartWalker();
			draw(event.clientX, event.clientY);
		}, { passive: true });

		canvas.element.addEventListener('touchmove', function(event) {
			restartWalker();
			var touch = event.touches && event.touches[0],
				x = touch ? touch.clientX : event.clientX,
				y = touch ? touch.clientY : event.clientY;
			draw(x, y);
		}, { passive: true });

	}
}

setupCanvas();



/**
 * Move listener
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 */
function draw(x, y) {
	// Push new point
	var latestPoint = {
		x: x,
		y: y
	};
	points.push(latestPoint);

	// Remove "old" points
	if (points.length > POINTS_MAX) {
		points.shift();
	}

	// Clear canvas
	clearCanvas();
	let actions = 0;

	// Draw points
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

			actions++;
		// Draw line between points
		if (previousPoint) {
			context.beginPath();
			context.strokeStyle = 'rgba(' + color + ', ' + decay + ')';
			context.moveTo(previousPoint.x, previousPoint.y);
			context.lineTo(point.x, point.y);
			context.stroke();

			// Calculate distance to n = CONNECTOR_POINTS points before this point
			for (var t = i < CONNECTOR_POINTS ? 0 : i - CONNECTOR_POINTS; t < i; t++) {
				previousPoint = points[t];

				var dx = point.x - previousPoint.x,
					dy = point.y - previousPoint.y,
					d = dx * dx + dy * dy;
					actions++;

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
	console.log(actions);
}
