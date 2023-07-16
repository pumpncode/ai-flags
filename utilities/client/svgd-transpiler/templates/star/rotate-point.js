import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param point
 * @param angle
 * @param origin
 */
const rotatePoint = (point, angle, origin = [0, 0]) => {
	const [x, y] = point;
	const [originX = 0, originY = 0] = origin;

	const translatedX = x - originX;
	const translatedY = y - originY;

	const rotatedX = roundToDecimalPlaces(
		(translatedX * Math.cos(angle)) - (translatedY * Math.sin(angle)) + originX,
		3
	);
	const rotatedY = roundToDecimalPlaces(
		(translatedX * Math.sin(angle)) + (translatedY * Math.cos(angle)) + originY,
		3
	);

	return [rotatedX, rotatedY];
};

export default rotatePoint;
