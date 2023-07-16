/**
 *
 * @param points
 */
const translateToPositive = (points) => {
	const minX = Math.min(...points.map(([x]) => x));
	const minY = Math.min(...points.map(([x, y]) => y));

	return points.map(([x, y]) => [x - minX, y - minY]);
};

export default translateToPositive;
