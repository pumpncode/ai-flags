import { sum } from "npm:lodash-es";

/**
 *
 * @param array
 */
const average = (array) => sum(array) / array.length;

export default average;
