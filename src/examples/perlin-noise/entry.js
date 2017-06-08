import Canvas from '../../utils/canvas';
import PerlinNoise from '../../utils/perlin-noise';

import '../base.scss';


/**
 * Basic setup
 */
const canvas = new Canvas(),
	context = canvas.getContext();



/**
 * Draw perlin noise
 */
let xOff, yOff,
	width = canvas.width > 800 ? 800 : canvas.width,
	height = canvas.height > 600 ? 600 : canvas.height,
	offsetX = canvas.width/2 - width/2,
	offsetY = canvas.height/2 - height/2,
	increment = 0.02,
	perlin = new PerlinNoise();

xOff = 0;
for (let x = 0; x < width; x++) {
	xOff += increment;
	yOff = 0;
	for (let y = 0; y < height; y++) {
		yOff += increment;

		let brightness = perlin.noise(xOff, yOff);
		context.fillStyle = 'rgba(255, 255, 255, ' + brightness + ')';
		context.beginPath();
		context.rect(offsetX + x, offsetY + y, 1, 1);
		context.closePath();
		context.fill();
	}
}
