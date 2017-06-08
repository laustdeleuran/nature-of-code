/**
 * @method
 * @desc
 * Takes N number of arguments and selects one randomly. Arguments can be weighted by probability if provided as an `Object` with a `value` and `prob` property, where `prob` is a number between 0 and 1 (`{ value: ..., prob: 0.2 }`). All unweighted arguments will be given an equal share of the remaining probability.
 * @return value - Randomly selected value
 */
export default function random() {
	const args = Array.prototype.slice.call(arguments);
	var values = [],
		probability = 1,
		probCount = 0;

	// Create uniform values array
	args.forEach(function(value) {
		if (typeof value === 'object' && value.value !== undefined) {
			if (value.prob) {
				probability -= value.prob;
				probCount += 1;
			}
		} else {
			value = {
				value
			};
		}
		values.push(value);
	});

	// Calc average probability
	if (probability < 0) {
		throw new Error('utils.random() - Sum of all probabilities is larger than 1.');
	}
	const avgProbability = probability / (values.length - probCount);

	// Select random value
	const selector = Math.random();
	var threshold = 0,
		selected;

	for (let i = 0; i < values.length; i++) {
		let value = values[i];

		// Set average probability for unset items
		if (value.prob === undefined) {
			value.prob = avgProbability;
		}

		if (selector < value.prob + threshold) {
			selected = value;
			break;
		}

		threshold += value.prob;
	}

	return selected && selected.value;
}
