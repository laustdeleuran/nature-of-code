/**
 * @const animator
 * @desc
 * Singleton handling animating a given function and optionally clearing the canvas
 */
const animator = {

	/**
	 * Frames per second
	 */
	fps: 1000 / 60,

	/**
	 * Animator step
	 */
	step() {
		if (this.draw) {
			this.draw();
		}
	},

	/**
	 * Start animator
	 */
	animate(draw) {
		var now = Date.now();

		if (typeof draw === 'function') {
			this.draw = draw;
		}

		if (this.lastFrameDate === undefined || (now - this.lastFrameDate > this.fps)) {
			this.lastFrameDate = now;
			this.step();
		}

		this.animationFrame = window.requestAnimationFrame(() => this.animate());
	},

	/**
	 * Stop animator
	 */
	stop() {
		window.cancelAnimationFrame(this.animationFrame);
	}
};

export default animator;
