import { s } from "hastscript";

import getRegularStarPolygonCoordinates from "./star/get-regular-star-polygon-coordinates.js";
import getWidth from "./star/get-width.js";
import rotatePoint from "./star/rotate-point.js";

/**
 *
 * @param points
 */
const star = (points) => {
	const height = 100;

	const coordinates = getRegularStarPolygonCoordinates(points, height);

	const width = getWidth(coordinates);

	const rotatedCoordinates = coordinates
		.map((point) => rotatePoint(point, Math.PI, [width / 2, height / 2]));

	return s(
		"symbol",
		{
			id: `star${points}`,
			viewBox: `0 0 ${width} ${height}`,
			overflow: "visible",
			width,
			height
		},
		s(
			"polygon",
			{
				points: rotatedCoordinates.map((coordinate) => coordinate.join(",")).join(" "),
				fillRule: "nonzero",
				transform: `translate(${-(width / 2)} ${-(height / 2)})`
			}
		)
	);
};

export default star;
