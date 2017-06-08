/**
 * Map number in range to new range
 * Convert number from old range to new range
 * @source http://stackoverflow.com/questions/929103/convert-a-number-range-to-another-range-maintaining-ratio
 * @param {number} value - number to convert
 * @param {number} oldMin - Start of range 1
 * @param {number} oldMax - End of range 1
 * @param {number} newMin - Start of range 2
 * @param {number} newMax - End of range 2
 * @return {number}
 */
const convertRange = (value, oldMin, oldMax, newMin, newMax) => (((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
export default convertRange;
