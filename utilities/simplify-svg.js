import { bignumber, gcd, multiply, pow, divide, fraction, format, compare } from "npm:mathjs";

import { getDecimalPart, getSvgNumberStrings, replaceSvgNumberStrings } from "@ai-flags/utilities";

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

	console.log(replaceMap);

	// in chrome at least (what does this number mean?)
	const upperSvgLimit = bignumber("340282332385245561561233491457113721595");

	if (Array.from(replaceMap.values()).some((newNumber) => Number(compare(bignumber(newNumber), upperSvgLimit)) === 1)) {
		return svg;
	}

	return replaceSvgNumberStrings(svg, replaceMap);
};

export default simplifySvg;