import slope from "./are-colinear/slope.js";

/**
 *
 * @param {...any} points
 */
const areColinear = (...points) => {
	const firstSlope = slope(points[0], points[1]);

	return points
		.every((point, index, array) => {
			const currentSlope = slope(point, index === array.length - 1 ? array[0] : array[index + 1]);

			return currentSlope === firstSlope || !Number.isFinite(currentSlope);
		});
};

export default areColinear;
