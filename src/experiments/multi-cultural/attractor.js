
import convertRange from 'utils/convert-range';
import SimplexNoise from 'simplex-noise';

/**
 * Noise walker
 */
export default class Attractor {
	static simplex = new SimplexNoise();

	constructor(increment) {
		increment = increment || 0.0025;

		this.increment = increment;
		this.xOff = Math.round(1000 * Math.random());
		this.yOff = Math.round(1000 * Math.random());
	}

	move(canvas) {
		this.x = convertRange(Attractor.simplex.noise2D(this.xOff, this.xOff), -1, 1, 0, canvas.width);
		this.y = convertRange(Attractor.simplex.noise2D(this.yOff, this.yOff), -1, 1, 0, canvas.height);

		this.xOff += this.increment;
		this.yOff += this.increment;
	}

	draw(context) {
		context.globalCompositeOperation = 'source-over';
		context.fillStyle = '#ff00ff';
		context.beginPath();
		context.arc(this.x, this.y, 20, 0, Math.PI * 2);
		context.fill();
	}

	update(canvas, context) {
		this.move(canvas);
		if (context) this.draw(context);
	}
}
