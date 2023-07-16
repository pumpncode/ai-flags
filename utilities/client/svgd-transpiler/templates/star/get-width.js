/**
 *
 * @param points
 */
const getWidth = (points) => {
	const minX = Math.min(...points.map(([x]) => x));
	const maxX = Math.max(...points.map(([x]) => x));

	return maxX - minX;
};

export default getWidth;
