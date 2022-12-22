import { bignumber } from "npm:mathjs";

const getIntegerPart = (number) => bignumber(
	number.toFixed(0, bignumber.ROUND_DOWN)
);

export default getIntegerPart;