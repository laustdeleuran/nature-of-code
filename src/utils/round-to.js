/**
 * @function
 * @desc
 * Round numbers to given decimal point. Some browsers gets really tired if your pixel points have too many decimals. I'm looking at you, iOS.
 * @param {number} number
 * @param {number} decimals
 * @return {number}
 */
export default function roundTo(number, decimals = 1) {
	let multiplier = Math.pow(10, decimals);
	multiplier = Math.ceil(multiplier <= 0 ? 1 : multiplier);

	number = Math.round(number * multiplier) / multiplier;
	number = parseFloat(Number(number).toFixed(decimals));

	return number;
}
