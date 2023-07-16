import getRadiusOfRegularPolygonWithHeight from "./get-radius-of-regular-polygon-with-height.js";
import getRegularPolygonCoordinates from "./get-regular-polygon-coordinates.js";
import lineLineIntersection from "./line-line-intersection.js";

import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param points
 * @param height
 */
const getRegularStarPolygonCoordinates = (points, height) => {
	const regularPolygonCoordinates = getRegularPolygonCoordinates(points, height);

	const parity = points % 2;

	const radius = getRadiusOfRegularPolygonWithHeight(points, height);

	const theta = (2 * Math.PI) / points;

	const sideLength = 2 * radius * Math.sin(theta / 2);

	if (parity === 0) {
		const starPoints1 = regularPolygonCoordinates
			.filter((point, index) => index % 2 === 0);

		const starPoints2 = regularPolygonCoordinates
			.filter((point, index) => index % 2 === 1);

		return starPoints1
			.map((point, index) => {
				const firstLine = [point, starPoints1.at((index + 1) % starPoints1.length)];
				const secondLine = [starPoints2.at((index - 1) % starPoints2.length), starPoints2.at(index % starPoints2.length)];
				const thirdLine = [starPoints2.at(index % starPoints2.length), starPoints2.at((index + 1) % starPoints2.length)];

				const firstIntersection = lineLineIntersection(firstLine, secondLine);
				const secondIntersection = lineLineIntersection(firstLine, thirdLine);

				return [
					point,
					firstIntersection,
					starPoints2.at((index % starPoints2.length)),
					secondIntersection
				];
			})
			.flat()
			.map((point) => point.map((value) => roundToDecimalPlaces(value, 3)));
	}

	return [
		...regularPolygonCoordinates
			.filter((point, index) => index % 2 === 0),
		...regularPolygonCoordinates
			.filter((point, index) => index % 2 === 1)
	];
};

export default getRegularStarPolygonCoordinates;
