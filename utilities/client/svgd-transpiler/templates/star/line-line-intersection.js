import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param line1
 * @param line1.0
 * @param line1.1
 * @param line2
 * @param line2.0
 * @param line2.1
 */
const lineLineIntersection = ([[x1, y1], [x2, y2]], [[x3, y3], [x4, y4]]) => {
	const precision = 3;

	const line1DeltaX = x1 - x2;
	const line1DeltaY = y1 - y2;

	const line2DeltaX = x3 - x4;
	const line2DeltaY = y3 - y4;

	const denominator = (line1DeltaX * line2DeltaY) - (line1DeltaY * line2DeltaX);

	if (roundToDecimalPlaces(denominator, precision) === 0) {
		return null;
	}

	const line1Quotient = (x1 * y2) - (y1 * x2);
	const line2Quotient = (x3 * y4) - (y3 * x4);

	const x = (line1Quotient * line2DeltaX) - (line1DeltaX * line2Quotient);
	const y = (line1Quotient * line2DeltaY) - (line1DeltaY * line2Quotient);

	return [x / denominator, y / denominator];
};

export default lineLineIntersection;
