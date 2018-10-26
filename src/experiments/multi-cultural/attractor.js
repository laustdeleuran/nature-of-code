
import convertRange from 'utils/convert-range';
import PerlinNoise from 'utils/perlin-noise';

/**
 * Perlin noise walker
 */
export default class Attractor {
	constructor(increment) {
		increment = increment || 0.0125;

		this.increment = increment;
		this.perlin = new PerlinNoise(2);
		this.xOff = Math.round(1000 * Math.random());
		this.yOff = Math.round(1000 * Math.random());
	}

	move(canvas) {
		this.x = convertRange(this.perlin.noise(this.xOff), 0, 1, 0, canvas.width);
		this.y = convertRange(this.perlin.noise(this.yOff), 0, 1, 0, canvas.height);

		this.xOff += this.increment;
		this.yOff += this.increment;
	}

	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, 50, 0, Math.PI * 2);
		context.fill();
	}

	update(canvas, context) {
		this.move(canvas);
		if (context) this.draw(context);
	}
}
