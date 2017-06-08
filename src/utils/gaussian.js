/**
 * @class
 * @source http://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 * @source https://en.wikipedia.org/wiki/Marsaglia_polar_method
 */
export default class Gaussian {
	constructor(mean = 0, sd = 1) {
		this.mean = mean;
		this.sd = sd;
	}
	generate() {
		var y1, x1, x2, w;
		if (this._previous) {
			y1 = this._y2;
			this._previous = false;
		} else {
			do {
				x1 = Math.random() * 2 - 1;
				x2 = Math.random() * 2 - 1;
				w = x1 * x1 + x2 * x2;
			} while (w >= 1);
			w = Math.sqrt((-2 * Math.log(w)) / w);
			y1 = x1 * w;
			this._y2 = x2 * w;
			this._previous = true;
		}
		return y1 * this.sd + this.mean;
	}
}
