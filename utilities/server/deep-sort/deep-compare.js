import compare from "./deep-compare/compare.js";

/**
 *
 * @param objectA
 * @param objectB
 * @param by
 * @param options
 * @param options.type
 * @param options.direction
 */
const deepCompare = (objectA, objectB, by, { type, direction }) => {
	const comparisonResult = compare(
		objectA[by],
		objectB[by],
		{
			type,
			direction
		}
	);

	const firstApplicableChildEntry = Object.entries(objectA)
		.find(([key, value]) => (
			typeof value === "object" &&
			value !== null &&
			!Array.isArray(value)
		));

	if (comparisonResult === 0 && typeof firstApplicableChildEntry !== "undefined") {
		const [newKey] = firstApplicableChildEntry;

		return deepCompare(objectA[newKey], objectB[newKey], by, {
			type,
			direction
		});
	}

	return comparisonResult;
};

export default deepCompare;
