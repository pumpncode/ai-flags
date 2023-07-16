import deepCompare from "./deep-sort/deep-compare.js";

/**
 *
 * @param array
 * @param by
 * @param options
 * @param options.type
 * @param options.direction
 */
const deepSort = (
	array,
	by,
	{
		type = "string",
		direction = type === "string" ? "ascending" : "descending"
	} = {
		type: "string",
		direction: "ascending"
	}
) => array
	.map((object) => Object.fromEntries(
		Object.entries(object)
			.map(([key, value]) => (
				[
					key,
					Array.isArray(value)
						? deepSort(value, by, {
							type,
							direction
						})
						: value
				]
			))
	))
	.toSorted((objectA, objectB) => deepCompare(
		objectA,
		objectB,
		by,
		{
			type,
			direction
		}
	));

export default deepSort;
