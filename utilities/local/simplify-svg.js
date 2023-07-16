import {
	bignumber,
	compare,
	divide,
	format,
	fraction,
	gcd,
	multiply,
	pow
} from "mathjs";

import getSvgNumberStrings from "./simplify-svg/get-svg-number-strings.js";
import replaceSvgNumberStrings from "./simplify-svg/replace-svg-number-strings.js";
import getDecimalPart from "./simplify-svg/get-decimal-part.js";

/**
 *
 * @param svg
 */
const simplifySvg = (svg) => {
	const numberStrings = getSvgNumberStrings(svg);

	const numberStringsAsBigNumbers = [...numberStrings].map((number) => bignumber(number));

	const newNumbers = [...numberStringsAsBigNumbers]
		.reduce(
			(accumulator, number) => {
				const originalNumerator = getDecimalPart(number);
				const originalDenominator = multiply(
					bignumber(1),
					pow(bignumber(10), number.decimalPlaces())
				);

				const { n: numerator, d: denominator } = fraction(divide(originalNumerator, originalDenominator));

				const factor = divide(bignumber(denominator), gcd(bignumber(denominator), bignumber(numerator)));

				return accumulator.map((innerNumber) => multiply(
					innerNumber,
					factor
				));
			},
			[...numberStringsAsBigNumbers]
		);

	const scaleDivisor = bignumber(gcd(...newNumbers));

	const replaceMap = new Map(newNumbers.map((number, index) => [numberStringsAsBigNumbers[index], divide(number, scaleDivisor)].map((number) => format(number, { notation: "fixed" }))));

	// in chrome at least (what does this number mean?)
	const upperSvgLimit = bignumber("340282332385245561561233491457113721595");

	if (Array.from(replaceMap.values()).some((newNumber) => Number(compare(bignumber(newNumber), upperSvgLimit)) === 1)) {
		return svg;
	}

	return replaceSvgNumberStrings(svg, replaceMap);
};

export default simplifySvg;
