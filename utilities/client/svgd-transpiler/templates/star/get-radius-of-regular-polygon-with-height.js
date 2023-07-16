/**
 *
 * @param sides
 * @param height
 */
const getRadiusOfRegularPolygonWithHeight = (sides, height) => {
	const parity = sides % 2;
	const theta = (2 * Math.PI) / sides;

	return (
		height /
		(
			2 -
			parity +
			(parity * Math.cos(theta / 2))
		)
	);
};

export default getRadiusOfRegularPolygonWithHeight;
