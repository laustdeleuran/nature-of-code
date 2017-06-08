/**
 * @class
 * @source https://github.com/processing/p5.js/blob/master/src/math/noise.js#L41
 */
export default class PerlinNoise {

	/**
	 * @constructor
	 * @param {number} octaves
	 * @param {number} ampFallOff
	 * @param {number} size
	 */
	constructor(octaves = 4, ampFalloff = 0.5, size = 4095) {
		this._yWrapB = 4;
		this._yWrap = 1 << this._yWrapB;
		this._zWrapB = 8;
		this._zWrap = 1 << this._zWrapB;

		this._size = size;
		this._octaves = octaves;
		this._ampFalloff = ampFalloff;

		this._perlin = new Array(this._size + 1);
		for (var i = 0; i < this._size + 1; i++) {
			this._perlin[i] = Math.random();
		}
	}

	/**
	 * @private
	 * @param {i} number
	 */
	_scaledCosine(i) {
		return 0.5 * (1.0 - Math.cos(i * Math.PI));
	}

	/**
	 * Generate noise
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	noise(x = 0, y = 0, z = 0) {
		x = Math.abs(x);
		y = Math.abs(y);
		z = Math.abs(z);

		var xi = Math.floor(x),
			yi = Math.floor(y),
			zi = Math.floor(z);
		var xf = x - xi;
		var yf = y - yi;
		var zf = z - zi;

		var rxf, ryf;
		var r = 0;
		var ampl = 0.5;

		var n1, n2, n3;

		for (var o = 0; o < this._octaves; o++) {
			var of = xi + (yi << this._yWrapB) + (zi << this._zWrapB);

			rxf = this._scaledCosine(xf);
			ryf = this._scaledCosine(yf);

			n1 = this._perlin[of & this._size];
			n1 += rxf * (this._perlin[(of + 1) & this._size] - n1);
			n2 = this._perlin[(of + this._yWrap) & this._size];
			n2 += rxf * (this._perlin[(of + this._yWrap + 1) & this._size] - n2);
			n1 += ryf * (n2 - n1);

			of += this._zWrap;
			n2 = this._perlin[of & this._size];
			n2 += rxf * (this._perlin[(of + 1) & this._size] - n2);
			n3 = this._perlin[(of + this._yWrap) & this._size];
			n3 += rxf * (this._perlin[(of + this._yWrao + 1) & this._size] - n3);
			n2 += ryf * (n3 - n2);

			n1 += this._scaledCosine(zf) * (n2 - n1);

			r += n1 * ampl;
			ampl *= this._ampFalloff;
			xi <<= 1;
			xf *= 2;
			yi <<= 1;
			yf *= 2;
			zi <<= 1;
			zf *= 2;

			if (xf >= 1.0) {
				xi++; xf--;
			}
			if (yf >= 1.0) {
				yi++; yf--;
			}
			if (zf >= 1.0) {
				zi++; zf--;
			}
		}

		return r;
	}
}
