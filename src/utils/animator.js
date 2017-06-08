'use strict';

/**
 * @name Animator
 */
import raf from 'raf';



/**
 * @class
 * @classdesc
 * Animation handler running at approximately given fps
 */
export default class Animator {

	/**
	 * @constructor
	 */
	constructor() {
		this._props = {};
	}

	/**
	 * @method
	 * @desc
	 * Starts animation
	 *
	 * @param {function} tick - animation function to run each cycle
	 */
	start(tick) {
		this.stop();

		this.isAnimating = true;
		this._props.frame = 0;
		this._props.lastTime = undefined;

		if (typeof tick === 'function') {
			this._props.tick = tick;
		}

		this._tick();
	}

	/**
	 * @method
	 * @desc
	 * Run animation
	 */
	_tick() {
		const { lastTime, tick, frame } = this._props;

		// Request next frame (needs to be top of function, so any subsequent calls to `.stop() will work)
		this._props.request = raf(() => this._tick());

		// Update time
		let timeDelta = 0,
			currentTime = Date.now();
		if (lastTime) {
			timeDelta = currentTime - lastTime;
		}
		this._props.lastTime = currentTime;

		// Run provided function
		if (tick) {
			tick(frame, timeDelta);
		}
		this._props.frame++;
	}

	/**
	 * @method
	 * @desc
	 * Stop animation
	 */
	stop() {
		this.isAnimating = false;

		raf.cancel(this._props.request);
	}
}
