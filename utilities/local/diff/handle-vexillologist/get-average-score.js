import average from "./get-average-score/average.js";

import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param array
 */
const getAverageScore = (array) => roundToDecimalPlaces(
	average(array.map(({ score }) => score)),
	3
);

export default getAverageScore;
