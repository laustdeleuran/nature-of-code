import raf from 'raf';



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
	 */
	constructor(settings, state) {
		this._init(settings, state);
	}

	/**
	 * Init
	 * Set base settings for spring.
	 * @param {object} settings
	 * @property {function} callback - Callback to call each step
	 * @property {number} acceleration - Stiffness / acceleration
	 * @property {number} damper - Dampens velocity. should be between 0 and 1.
	 * @property {number} margin - Determines target accuracy
	 * @param {object} state
	 * @property {number} current - Current position
	 * @property {number} target - Target position
	 * @property {number} velocity - Velocity
	 */
	_init({ callback, acceleration = 0.2, damper = 0.85, id, margin = 0.0001 } = {}, state = {}) {
		this._settings = {
			acceleration,
			callback,
			damper,
			id,
			margin
		};

		this._state = Object.assign({}, DEFAULT_STATE, state);
	}

	/**
	 * Update state and let callbacks know
	 * @private
	 */
	_step() {
		const { acceleration, callback, damper, margin } = this._settings;
		let { current, target, velocity } = this._state;

		// If we've already reached the target, return without doing anything
		if (Math.abs(target - current) < margin) {
			this.stop();
			return;
		}

		// Do math to animate
		let distance = target - current;
		velocity *= 1 - damper;
		velocity += distance * acceleration;
		current += velocity;

		// Update internal state
		this._state = {
			current,
			target,
			velocity
		};

		// Call callback if available
		if (callback) {
			callback({ ...this._state });
		}

		// Animation loop / iteration
		this._raf();
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
	reset(settings, state) {
		this.stop();

		this._init({
			...this._settings,
			...settings
		}, state);

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
		this._state = Object.assign({}, DEFAULT_STATE, this._state, state);

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

		this.start();

		return this;
	}

	/**
	 * Start spring
	 * @public
	 */
	start() {
		if (!this._isAnimating) {
			this._raf();
		}

		return this;
	}
}
