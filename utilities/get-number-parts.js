import getIntegerPart from "./get-integer-part.js";
import getDecimalPart from "./get-decimal-part.js";

const getNumberParts = (number) => {
	const integerPart = getIntegerPart(number);
	const decimalPart = getDecimalPart(number);

	return [integerPart, decimalPart];
};

export default getNumberParts;