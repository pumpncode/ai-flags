import { format, bignumber } from "npm:mathjs";
import SvgPath from "npm:svgpath";

import { traverseSvg, dimensionlessPathCommandParameterIndexes } from "@ai-flags/utilities";

const replaceSvgNumberStrings = (svg, replaceMap) => {
	return traverseSvg(
		svg,
		(element) => {
			let { attributes, tagName } = element;

			const tagNamesWithStrokeWidth = new Set([
				"altGlyph",
				"circle",
				"ellipse",
				"g",
				"line",
				"path",
				"polygon",
				"polyline",
				"rect",
				"text",
				"textPath",
				"tref",
				"tspan",
				"use"
			]);

			if (!element.hasAttribute("stroke-width") && tagNamesWithStrokeWidth.has(tagName)) {
				element.setAttribute("stroke-width", 1);

				({ attributes } = element);
			}

			for (const { name, value } of Array.from(attributes)) {
				switch (name) {
					case "d": {
						const svgPath = new SvgPath(value);
						const { segments } = svgPath;

						const newSegments = [];

						for (const [letter, ...numbers] of segments) {
							newSegments.push([
								letter,
								...numbers.map(
									(number, index) => dimensionlessPathCommandParameterIndexes.has(letter) && dimensionlessPathCommandParameterIndexes.get(letter).has(index)
										? number
										: replaceMap.get(format(bignumber(number), { notation: "fixed" })) || number
								)
							]);
						}

						svgPath.segments = newSegments;

						element.setAttribute(name, svgPath.toString());

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

						const scaledTransformFunctions = new Map(
							Array.from(transformFunctions)
								.map(([transformFunctionName, parameters]) => {
									return [
										transformFunctionName,
										parameters.map(
											(parameter, index) => {
												if (
													(transformFunctionName === "matrix" && index > 3) ||
													(transformFunctionName === "translate") ||
													(transformFunctionName === "rotate" && index > 0)
												) {
													return replaceMap.get(format(bignumber(parameter), { notation: "fixed" })) || parameter
												}
												else {
													return parameter;
												}
											}
										)
									]
								})
						);

						const newTransformString = Array.from(scaledTransformFunctions)
							.map(([transformFunctionName, parameters]) => `${transformFunctionName}(${parameters.join(", ")})`)
							.join(" ");

						element.setAttribute(name, newTransformString);

						break;
					}
					default: {
						const newAttributeValue = value.replace(
							/(?:(?<=(?:^| |\(|,))(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))-(?:(?:\d+(?:\.\d+)?)|(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))|(?:(?<=(?:^| |\(|\d|,))(?:(?:\d+)?\.\d+)(?=(?:$| |\)|-|\.\d|,)))/g,
							(match) => {
								return replaceMap.get(format(bignumber(match), { notation: "fixed" })) || match;
							}
						);

						element.setAttribute(name, newAttributeValue);

						break;
					}
				}
			}
		}
	);
};

export default replaceSvgNumberStrings;