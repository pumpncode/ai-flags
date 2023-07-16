/**
 *
 * @param number
 * @param decimalPlaces
 */
const roundToDecimalPlaces = (number, decimalPlaces) => {
	const factorOfTen = 10 ** decimalPlaces;

	return Math.round(number * factorOfTen) / factorOfTen;
};

export default roundToDecimalPlaces;
