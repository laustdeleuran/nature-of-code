import roundTo from 'utils/round-to';

/**
 * Gamepad
 */
const bindGamepad = listener => {
	let gamepad, frame;

	const continuousDetection = () => {
		if (!gamepad) stopContinuousDetection();

		const state = {
			axis: {
				x: roundTo(gamepad.axes[0]),
				y: roundTo(gamepad.axes[1]),
			},
			buttons: {
				a: gamepad.buttons[1].pressed,
				b: gamepad.buttons[2].pressed,
				l: gamepad.buttons[4].pressed,
				r: gamepad.buttons[5].pressed,
				x: gamepad.buttons[0].pressed,
				y: gamepad.buttons[3].pressed,
			},
		};
		listener(state);

		frame = window.requestAnimationFrame(continuousDetection);
	};

	const stopContinuousDetection = () => window.cancelAnimationFrame(frame);

	const detectGamepads = () => {
		let possibleGamepad = navigator.getGamepads()[0];
		if (possibleGamepad && gamepad !== possibleGamepad) {
			gamepad = possibleGamepad;
			continuousDetection();
		} else if (!possibleGamepad) {
			stopContinuousDetection();
		}
	};
	setInterval(detectGamepads);
};

export default bindGamepad;
