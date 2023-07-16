/**
 *
 * @param points
 */
const getHeight = (points) => {
	const minY = Math.min(...points.map(([x, y]) => y));
	const maxY = Math.max(...points.map(([x, y]) => y));

	return maxY - minY;
};

export default getHeight;
