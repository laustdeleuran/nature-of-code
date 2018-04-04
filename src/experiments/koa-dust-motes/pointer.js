import roundTo from '../../utils/round-to';



/**
 * Pointer tracking
 */
export default class Pointer {

	/**
	 * @constructor
	 */
	constructor({ acceleration = 0.0125, friction = 0.15, decimals = 2, position } = {}) {
		this._settings = { acceleration, friction, decimals };

		this._position = position;

		this._velocity = { x: 0, y: 0 };

		document.addEventListener('touchmove', this.onMove);
		document.addEventListener('mousemove', this.onMove);
	}

	/**
	 * Update
	 */
	update() {
		if (!this._target) return;
		if (!this._position) {
			this._position = this._target;
		}

		const { acceleration, friction, decimals } = this._settings;

		const { x: targetX, y: targetY } = this._target;
		let { x: currentX, y: currentY } = this._position;
		let { x: velocityX, y: velocityY } = this._velocity;

		// Do math to animate
		let distanceX = targetX - currentX;
		velocityX *= friction;
		velocityX += distanceX * acceleration;
		currentX += velocityX;
		velocityX = roundTo(velocityX, decimals);
		currentX = roundTo(currentX, decimals);

		let distanceY = targetY - currentY;
		velocityY *= friction;
		velocityY += distanceY * acceleration;
		currentY += velocityY;
		velocityY = roundTo(velocityY, decimals);
		currentY = roundTo(currentY, decimals);

		this._position = {
			x: currentX,
			y: currentY
		};

		this._velocity = {
			x: velocityX,
			y: velocityY
		};
	}

	/**
	 * Event listener
	 */
	onMove = event => this._target =
		event.touches && event.touches[0] ?
			{
				x: event.touches[0].clientX,
				y: event.touches[0].clientY
			} :
			{
				x: event.clientX,
				y: event.clientY
			};

	/**
	 * Get x position
	 */
	get x() {
		return this._position.x;
	}

	/**
	 * Get y position
	 */
	get y() {
		return this._position.y;
	}

	/**
	 * Get position
	 */
	get position() {
		return this._position;
	}

	/**
	 * Destroy
	 */
	destroy() {
		document.removeEventListener('touchmove', this.onMove);
		document.removeEventListener('mousemove', this.onMove);
	}
}
