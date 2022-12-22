import { bignumber, subtract } from "npm:mathjs";

import getIntegerPart from "./get-integer-part.js";

const getDecimalPart = (number) => bignumber(
	String(
		(subtract(number, (getIntegerPart(number))))
	)
		.split(".")[1] ?? 0
);

export default getDecimalPart;