import getRadiusOfRegularPolygonWithHeight from "./get-radius-of-regular-polygon-with-height.js";
import rotatePoint from "./rotate-point.js";
import translateToPositive from "./translate-to-positive.js";

import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param sides
 * @param height
 */
const getRegularPolygonCoordinates = (sides, height) => {
	const parity = sides % 2;

	const theta = (2 * Math.PI) / sides;

	const rotateAngle = Math.PI / 2;

	const radius = getRadiusOfRegularPolygonWithHeight(sides, height);

	return translateToPositive(
		Array(sides)
			.fill()
			.map((empty, index) => {
				const x = radius * Math.cos(theta * index);
				const y = radius * Math.sin(theta * index);

				return rotatePoint(
					[x, y],
					rotateAngle
				);
			})
	)
		.map((point) => point.map((value) => roundToDecimalPlaces(value, 3)));
};

export default getRegularPolygonCoordinates;
