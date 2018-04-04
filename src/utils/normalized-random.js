/**
 * Normalized random
 * @source https://codepen.io/bionicoz/pen/xCIDH
 */
const normalizedRandom = (mean, stdDev) =>
	Math.abs(
		Math.round(
			(Math.random() * 2 - 1)
			+
			(Math.random() * 2 - 1)
			+
			(Math.random() * 2 - 1)
		)
		* stdDev
	)
	+ mean;

export default normalizedRandom;
