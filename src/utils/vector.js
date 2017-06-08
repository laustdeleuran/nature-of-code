
/**
 * Basic vector operations class
 */
export default class Vector {

	/**
	 * @constructor
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw Error('Could not create vector object with invalid x or y values', x, y);
		}
		this.x = x;
		this.y = y;
	}

	/**
	 * Copy vector
	 */
	copy() {
		return new Vector(this.x, this.y);
	}

	/**
	 * Add given vector to this vector
	 * @param {Vector} vector
	 */
	add(vector) {
		if (!(vector instanceof Vector)) {
			throw Error('Trying to add invalid type to vector', this, vector);
		}

		this.x += vector.x;
		this.y += vector.y;

		return this;
	}

	/**
	 * Subtract given vector from this vector
	 * @param {Vector} vector
	 */
	subtract(vector) {
		if (!(vector instanceof Vector)) {
			throw Error('Trying to subtract invalid type from vector', this, vector);
		}

		this.x -= vector.x;
		this.y -= vector.y;

		return this;
	}

	/**
	 * Multiply given vector with this vector
	 * @param {Vector} vector
	 */
	multiply(scale) {
		if (typeof scale !== 'number') {
			throw Error('Trying to multiply invalid type with vector', this, scale);
		}

		this.x *= scale;
		this.y *= scale;

		return this;
	}

	/**
	 * Divide given vector with this vector
	 * @param {Vector} vector
	 */
	divide(scale) {
		if (typeof scale !== 'number') {
			throw Error('Trying to divide invalid type with vector', this, scale);
		}

		this.x /= scale;
		this.y /= scale;

		return this;
	}

	/**
	 * Get magnitude
	 */
	get magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * Normalize vector
	 */
	normalize() {
		var m = this.magnitude;
		if (m === 0) {
			//console.warn('Trying to normalize vector with magnitude of 0', this);
			return this;
		}
		return this.divide(m);
	}
}
