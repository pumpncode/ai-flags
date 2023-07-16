import { bignumber, subtract } from "mathjs";

import getIntegerPart from "./get-decimal-part/get-integer-part.js";

/**
 *
 * @param number
 */
const getDecimalPart = (number) => bignumber(
	String(
		(subtract(number, (getIntegerPart(number))))
	)
		.split(".")[1] ?? 0
);

export default getDecimalPart;
