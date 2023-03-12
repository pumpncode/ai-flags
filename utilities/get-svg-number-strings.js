import { format } from "npm:mathjs";
import SvgPath from "npm:svgpath";

import { traverseSvg, dimensionlessPathCommandParameterIndexes } from "@ai-flags/utilities";

const getSvgNumberStrings = (svg) => {
	const numberStrings = new Set([1]);

	traverseSvg(
		svg,
		(element) => {
			const { attributes } = element;

			for (const { name, value } of Array.from(attributes)) {
				switch (name) {
					case "d": {
						const { segments } = new SvgPath(value);

						for (const [letter, ...numbers] of segments) {
							for (const [indexString, number] of Object.entries(numbers)) {
								if (
									number !== 0 &&
									(
										(
											dimensionlessPathCommandParameterIndexes.has(letter) &&
											!dimensionlessPathCommandParameterIndexes.get(letter).has(Number(indexString) + 1)
										) ||
										!dimensionlessPathCommandParameterIndexes.has(letter)
									)
								) {
									numberStrings.add(format(number, { notation: "fixed" }));
								}
							}
						}
						break;
					}
					case "transform": {
						const transformFunctions = new Map(
							value.split(/(?<=\))\s/g)
								.map((transformFunctionString) => {
									const [transformFunctionName, ...parameters] = transformFunctionString
										.trim()
										.split(/\(|\)/g)
										.slice(0, -1)
										.map((parametersString, index) => index === 0 ? parametersString : parametersString.trim().split(/\s|,/g).map(Number))
										.flat();

									return [transformFunctionName, parameters];
								})
						);

						const scalableParameters = [];

						for (const [transformFunctionName, parameters] of transformFunctions) {
							switch (transformFunctionName) {
								case "matrix":
									scalableParameters.push(...parameters.slice(4));
									break;
								case "translate":
									scalableParameters.push(...parameters);
									break;
								case "rotate":
									scalableParameters.push(...parameters.slice(1));
									break;
								default:
									break;
							}
						}

						for (const number of scalableParameters.filter((parameter) => parameter !== "0")) {
							numberStrings.add(format(number, { notation: "fixed" }));
						}

						break;
					}
					default: {
						const numbersInValue = [...value.matchAll(/(?:(?<=(?:^| |\(|,))(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))-(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))(?:(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))/g)]
							.map((match) => match[0])
							.filter((match) => match !== "0")

						for (const number of numbersInValue) {
							numberStrings.add(number);
						}
						break;
					}
				}
			}
		}
	);

	return new Set([...numberStrings].sort((a, b) => b.length - a.length));
};

export default getSvgNumberStrings;