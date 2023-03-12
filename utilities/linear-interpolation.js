const linearInterpolation = ({ x: xA, y: yA }, { x: xB, y: yB }, factor) => {
	const x = xA + (xB - xA) * factor;
	const y = yA + (yB - yA) * factor;
	return { x, y };
};

export default linearInterpolation;