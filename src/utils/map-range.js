/**
 * Map number in range to new range
 * @param {number} n - number to convert
 * @param {number} start1 - Start of range 1
 * @param {number} stop1 - End of range 1
 * @param {number} start2 - Start of range 2
 * @param {number} stop2 - End of range 2
 */
export default function mapRange(n, start1, stop1, start2, stop2) {
	return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}
