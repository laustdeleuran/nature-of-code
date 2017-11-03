import raf from 'raf';

import roundTo from './round-to';



/**
 * Default state
 */
const DEFAULT_STATE = {
	current: 0,
	target: 0,
	velocity: 0
};

/**
 * Abstract spring animation
 */
export default class Spring {
	/**
	 * @constructor
	 * Set base settings for spring.
	 * @param {object} settings
	 * @property {function} callback - callback to call each step
	 * @property {number} acceleration - stiffness / acceleration
	 * @property {number} friction
	 * @property {number} decimals - Number of decimals
	 * @param {object} state
	 * @property {number} current - current position
	 * @property {number} target - target position
	 * @property {number} velocity - velocity
	 */
	constructor({ callback, acceleration = 0.2, friction = 0.15, decimals = 2 }, state = {}) {
		this._settings = {
			acceleration,
			callback,
			friction,
			decimals
		};

		this._state = Object.assign({}, DEFAULT_STATE, state);
	}

	/**
	 * Update state and let callbacks know
	 * @private
	 */
	_step() {
		const { acceleration, callback, friction, decimals } = this._settings;
		let { current, target, velocity } = this._state;

		// Do math to animate
		let distance = target - current;
		velocity *= friction;
		velocity += distance * acceleration;
		current += velocity;

		// Round numbers
		current = roundTo(current, decimals);
		velocity = roundTo(velocity, decimals);
		target = roundTo(target, decimals);

		// If our velocity is dead, we've reached our target
		current = velocity === 0 ? target : current;

		// Update internal state
		this._state = {
			current,
			target,
			velocity
		};

		// Animation loop / iteration
		if (target !== current) {
			this._raf();
		} else {
			this.stop();
		}

		// Call callback if available
		if (callback) {
			callback({ ...this._state });
		}

	}

	/**
	 * Request animation frame
	 * @private
	 */
	_raf() {
		this._isAnimating = true;
		this._animationFrame = raf(() => this._step());
	}

	/**
	 * Stop animation
	 * @public
	 */
	stop() {
		if (this._isAnimating) {
			clearTimeout(this._timeoutHandle);
			raf.cancel(this._animationFrame);
			this._isAnimating = false;
		}
	}

	/**
	 * Reset Spring
	 * @public
	 */
	reset() {
		this.stop();
		this._state = { ...DEFAULT_STATE };

		return this;
	}

	/**
	 * Stop all animation and hard update internal state
	 * @public
	 * @param {object} state
	 * @property {number} current - current position
	 * @property {number} target - target position
	 * @property {number} velocity - velocity
	 */
	forceState(state) {
		this.stop();
		this._state = Object.assign({}, DEFAULT_STATE, state);

		return this;
	}

	/**
	 * Set new target and start animation
	 * @public
	 * @param {number} target
	 */
	setTarget(target = 0) {
		if (target === this._state.target) {
			return this;
		}

		this._state = {
			...this._state,
			target
		};

		if (!this._isAnimating) {
			this._raf();
		}

		return this;
	}
}
